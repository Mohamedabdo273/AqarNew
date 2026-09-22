# خطة الباك إند — منصة تنازل (Aqar / Tanazul)

> **الهدف:** تحويل الفرونت الحالي (React + Vite + localStorage) لمنصة حقيقية بباك إند .NET و SQL Server.
> آخر تحديث: 2026-09-22

---

## 1. التقنيات المختارة

| الطبقة | الاختيار | ليه |
|---|---|---|
| Runtime | **.NET 9** (ASP.NET Core Web API) | أحدث LTS-track، أداء عالي |
| ORM | **EF Core 9** + Dapper للاستعلامات التقيلة | EF للـ CRUD، Dapper لصفحة الفرص |
| قاعدة البيانات | **SQL Server 2022** (أو Azure SQL) | علاقات قوية + Full-Text Search |
| المصادقة | **JWT** (Access + Refresh) + OTP واتساب | عندك سيرفر OTP جاهز في `C:\Node` |
| الملفات | **Azure Blob Storage** (Private) أو MinIO | العقود والإيصالات ما ينفعش تبقى Public |
| الكاش | **Redis** | صفحة الفرص + الإحصائيات |
| المهام الخلفية | **Hangfire** | التنبيهات، تحديث الأسعار، التقارير |
| التحقق من المدخلات | **FluentValidation** | |
| اللوجات | **Serilog** + Seq / App Insights | |
| التوثيق | **Swagger / Scalar** | |
| التيستات | **xUnit** + Testcontainers | |

---

## 2. هيكل الـ Solution

```
Aqar.sln
├── src/
│   ├── Aqar.Api/                 # Controllers, Middleware, Program.cs, DI
│   ├── Aqar.Application/         # Services, DTOs, Validators, Interfaces
│   ├── Aqar.Domain/              # Entities, Enums, Domain Rules
│   ├── Aqar.Infrastructure/      # EF DbContext, Repositories, Blob, Redis, WhatsApp
│   └── Aqar.Admin/               # (اختياري) Blazor/MVC للوحة التحكم
├── tests/
│   ├── Aqar.UnitTests/
│   └── Aqar.IntegrationTests/
└── db/
    ├── 01_schema.sql
    ├── 02_seed.sql
    └── 03_indexes.sql
```

**قاعدة مهمة:** `Domain` مايعرفش حاجة عن `Infrastructure`. الاعتماديات بتمشي للداخل بس.

---

## 3. تصميم قاعدة البيانات

### 3.1 المستخدمون والمصادقة

```sql
CREATE TABLE Users (
    Id                UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    FullName          NVARCHAR(150)  NOT NULL,
    PhoneNumber       VARCHAR(20)    NOT NULL UNIQUE,   -- التعريف الأساسي
    Email             NVARCHAR(200)  NULL,
    PasswordHash      VARCHAR(255)   NULL,              -- ممكن يدخل بالـ OTP بس
    Role              TINYINT        NOT NULL DEFAULT 1,-- 1=Buyer 2=Seller 3=Both 4=Ops 5=Admin
    IsPhoneVerified   BIT            NOT NULL DEFAULT 0,
    -- القدرة الشرائية (المشترين المسجلين يشوفوا الفرص الأول)
    BudgetCashMax     DECIMAL(18,2)  NULL,
    BudgetInstallment DECIMAL(18,2)  NULL,
    PreferredRegions  NVARCHAR(500)  NULL,              -- JSON array
    IsActive          BIT            NOT NULL DEFAULT 1,
    CreatedAt         DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    LastLoginAt       DATETIME2      NULL
);

CREATE TABLE OtpCodes (
    Id          BIGINT IDENTITY PRIMARY KEY,
    PhoneNumber VARCHAR(20)  NOT NULL,
    CodeHash    VARCHAR(255) NOT NULL,   -- خزّن الهاش مش الكود
    Purpose     TINYINT      NOT NULL,   -- 1=Login 2=Register 3=PhoneChange
    ExpiresAt   DATETIME2    NOT NULL,
    ConsumedAt  DATETIME2    NULL,
    AttemptCount TINYINT     NOT NULL DEFAULT 0,
    CreatedIp   VARCHAR(45)  NULL,
    CreatedAt   DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);
CREATE INDEX IX_Otp_Phone ON OtpCodes(PhoneNumber, ExpiresAt DESC);

CREATE TABLE RefreshTokens (
    Id         BIGINT IDENTITY PRIMARY KEY,
    UserId     UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    TokenHash  VARCHAR(255) NOT NULL,
    ExpiresAt  DATETIME2    NOT NULL,
    RevokedAt  DATETIME2    NULL,
    DeviceInfo NVARCHAR(300) NULL,
    CreatedAt  DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);
```

### 3.2 المراجع (Lookups)

```sql
CREATE TABLE Regions (
    Id      INT IDENTITY PRIMARY KEY,
    NameAr  NVARCHAR(100) NOT NULL,
    NameEn  NVARCHAR(100) NOT NULL,
    Slug    VARCHAR(100)  NOT NULL UNIQUE,
    SortOrder INT NOT NULL DEFAULT 0
);

CREATE TABLE Developers (
    Id        INT IDENTITY PRIMARY KEY,
    NameAr    NVARCHAR(200) NOT NULL,
    NameEn    NVARCHAR(200) NULL,
    LogoUrl   NVARCHAR(500) NULL,
    -- بيانات مهمة للحاسبة: كل مطوّر وسياسته
    CancellationPenaltyRate DECIMAL(5,4) NULL,  -- 0.1500 = 15%
    RefundDelayMonths       INT          NULL,  -- 36
    TransferFeeRate         DECIMAL(5,4) NULL,  -- رسوم التنازل
    TransferFeeFixed        DECIMAL(18,2) NULL,
    TransferPolicyNotes     NVARCHAR(MAX) NULL,
    IsActive  BIT NOT NULL DEFAULT 1
);

CREATE TABLE Compounds (
    Id          INT IDENTITY PRIMARY KEY,
    DeveloperId INT NOT NULL FOREIGN KEY REFERENCES Developers(Id),
    RegionId    INT NOT NULL FOREIGN KEY REFERENCES Regions(Id),
    NameAr      NVARCHAR(200) NOT NULL,
    NameEn      NVARCHAR(200) NULL,
    Slug        VARCHAR(200)  NOT NULL UNIQUE,
    Latitude    DECIMAL(9,6)  NULL,
    Longitude   DECIMAL(9,6)  NULL
);
```

> **ملاحظة:** الفرونت حاليًا بيخزن اسم المطوّر والكمبوند كنص حر. ده بيخرب الفلترة والإحصائيات. لازم يتحولوا لجداول مرجعية، مع السماح لـ "غير مدرج" يروح لطابور مراجعة.

### 3.3 الوحدات — الجدول الأساسي

```sql
CREATE TABLE Units (
    Id                  BIGINT IDENTITY PRIMARY KEY,
    PublicCode          VARCHAR(20)  NOT NULL UNIQUE,   -- U-17481
    SellerId            UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    DeveloperId         INT NOT NULL FOREIGN KEY REFERENCES Developers(Id),
    CompoundId          INT NOT NULL FOREIGN KEY REFERENCES Compounds(Id),
    RegionId            INT NOT NULL FOREIGN KEY REFERENCES Regions(Id),

    TitleAr             NVARCHAR(250) NOT NULL,
    TitleEn             NVARCHAR(250) NULL,
    DescriptionAr       NVARCHAR(MAX) NULL,
    DescriptionEn       NVARCHAR(MAX) NULL,

    PropertyType        TINYINT NOT NULL,   -- 1=شقة 2=فيلا 3=تاون 4=دوبلكس 5=تجاري 6=إداري 7=شاليه 8=أرض
    AreaM2              DECIMAL(10,2) NOT NULL,
    Bedrooms            TINYINT NULL,
    Bathrooms           TINYINT NULL,
    FloorInfo           NVARCHAR(50) NULL,
    Finishing           TINYINT NULL,

    -- الأرقام المالية (كلها DECIMAL مش FLOAT)
    OriginalContractPrice DECIMAL(18,2) NOT NULL,
    PaidCashAmount        DECIMAL(18,2) NOT NULL,   -- المطلوب كاش دلوقتي
    RemainingAmount       DECIMAL(18,2) NOT NULL,   -- المتبقي للمطوّر
    CurrentMarketPrice    DECIMAL(18,2) NULL,       -- من صاحب الوحدة ومسؤوليته
    CommissionRate        DECIMAL(5,4)  NOT NULL DEFAULT 0.0125,

    -- أعمدة محسوبة: مايتحسبوش في الفرونت أبدًا
    TotalCost AS (PaidCashAmount + RemainingAmount) PERSISTED,
    BuyerGain AS (
        CASE WHEN CurrentMarketPrice IS NULL THEN NULL
             ELSE CurrentMarketPrice
                  - (PaidCashAmount + RemainingAmount)
                  - ((PaidCashAmount + RemainingAmount) * CommissionRate)
        END
    ) PERSISTED,

    InstallmentValue      DECIMAL(18,2) NULL,
    InstallmentFrequency  TINYINT NULL,  -- 1=شهري 2=ربع 3=نصف 4=سنوي
    InstallmentYearsLeft  DECIMAL(4,1) NULL,
    NextInstallmentDate   DATE NULL,
    MaintenanceFee        DECIMAL(18,2) NULL,
    DeliveryYear          SMALLINT NULL,
    IsReadyToDeliver      BIT NOT NULL DEFAULT 0,
    TransferFeePolicy     TINYINT NULL,  -- 1=بائع 2=مشتري 3=مناصفة 4=معفي

    IsNegotiable        BIT NOT NULL DEFAULT 0,
    IsFeatured          BIT NOT NULL DEFAULT 0,
    FeaturedUntil       DATETIME2 NULL,

    -- دورة الحياة
    Status              TINYINT NOT NULL DEFAULT 1,
    -- 1=Draft 2=PendingReview 3=NeedsInfo 4=Verified/Published
    -- 5=Reserved 6=UnderTransfer 7=Completed 8=Rejected 9=Withdrawn 10=Expired
    RejectionReason     NVARCHAR(500) NULL,
    VerifiedAt          DATETIME2 NULL,
    VerifiedByUserId    UNIQUEIDENTIFIER NULL,
    PublishedAt         DATETIME2 NULL,
    ExpiresAt           DATETIME2 NULL,

    ViewsCount          INT NOT NULL DEFAULT 0,
    SavesCount          INT NOT NULL DEFAULT 0,
    InquiriesCount      INT NOT NULL DEFAULT 0,

    SearchText          NVARCHAR(600) NULL,  -- عنوان+كمبوند+مطوّر+منطقة للبحث
    RowVersion          ROWVERSION,
    CreatedAt           DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt           DATETIME2 NULL,
    IsDeleted           BIT NOT NULL DEFAULT 0
);
```

### 3.4 الصور والمستندات

```sql
CREATE TABLE UnitImages (
    Id        BIGINT IDENTITY PRIMARY KEY,
    UnitId    BIGINT NOT NULL FOREIGN KEY REFERENCES Units(Id) ON DELETE CASCADE,
    BlobPath  NVARCHAR(500) NOT NULL,
    ThumbPath NVARCHAR(500) NULL,
    SortOrder INT NOT NULL DEFAULT 0,
    IsCover   BIT NOT NULL DEFAULT 0
);

-- المستندات سرية: عمر ما ترجع لينك مباشر، ارجع SAS مؤقت للـ Ops بس
CREATE TABLE UnitDocuments (
    Id           BIGINT IDENTITY PRIMARY KEY,
    UnitId       BIGINT NOT NULL FOREIGN KEY REFERENCES Units(Id),
    DocType      TINYINT NOT NULL,  -- 1=عقد 2=إيصالات 3=بطاقة 4=خطاب مطوّر 5=كشف حساب
    BlobPath     NVARCHAR(500) NOT NULL,
    OriginalName NVARCHAR(300) NOT NULL,
    FileSizeBytes BIGINT NOT NULL,
    ContentType  VARCHAR(100) NOT NULL,
    ScanStatus   TINYINT NOT NULL DEFAULT 0,  -- 0=Pending 1=Clean 2=Infected
    UploadedAt   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UploadedBy   UNIQUEIDENTIFIER NOT NULL
);

-- سجل مراجعة التحقق: مين راجع إيه وإمتى (ده اللي بيبني ثقة المنصة)
CREATE TABLE UnitVerificationLogs (
    Id         BIGINT IDENTITY PRIMARY KEY,
    UnitId     BIGINT NOT NULL FOREIGN KEY REFERENCES Units(Id),
    ReviewerId UNIQUEIDENTIFIER NOT NULL,
    FromStatus TINYINT NOT NULL,
    ToStatus   TINYINT NOT NULL,
    Checklist  NVARCHAR(MAX) NULL,  -- JSON: العقد✓ الإيصالات✓ الرصيد✓ موافقة المطوّر✓
    Notes      NVARCHAR(MAX) NULL,
    CreatedAt  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
```

### 3.5 الطلبات والصفقات والعمولة

```sql
CREATE TABLE Inquiries (
    Id          BIGINT IDENTITY PRIMARY KEY,
    UnitId      BIGINT NULL FOREIGN KEY REFERENCES Units(Id),
    BuyerId     UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES Users(Id),
    GuestName   NVARCHAR(150) NULL,
    GuestPhone  VARCHAR(20)   NULL,
    InquiryType TINYINT NOT NULL,  -- 1=استفسار 2=معاينة 3=عرض سعر 4=طلب بيع 5=مستثمر
    Message     NVARCHAR(MAX) NULL,
    OfferAmount DECIMAL(18,2) NULL,
    Status      TINYINT NOT NULL DEFAULT 1, -- 1=جديد 2=تم التواصل 3=معاينة 4=مفاوضة 5=مقفول 6=مرفوض
    AssignedTo  UNIQUEIDENTIFIER NULL,
    Source      VARCHAR(50) NULL,  -- web/app/whatsapp
    CreatedAt   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE Deals (
    Id                BIGINT IDENTITY PRIMARY KEY,
    UnitId            BIGINT NOT NULL FOREIGN KEY REFERENCES Units(Id),
    SellerId          UNIQUEIDENTIFIER NOT NULL,
    BuyerId           UNIQUEIDENTIFIER NOT NULL,
    AgreedCashAmount  DECIMAL(18,2) NOT NULL,
    CommissionRate    DECIMAL(5,4)  NOT NULL,
    CommissionAmount  DECIMAL(18,2) NOT NULL,
    CommissionPayer   TINYINT NOT NULL,  -- 1=مشتري 2=بائع 3=مناصفة
    DepositAmount     DECIMAL(18,2) NULL,
    DepositPaidAt     DATETIME2 NULL,
    Stage             TINYINT NOT NULL DEFAULT 1,
    -- 1=حجز 2=مراجعة قانونية 3=موعد المطوّر 4=توقيع التنازل 5=مكتملة 6=ملغية
    DeveloperAppointmentDate DATE NULL,
    TransferCompletedAt DATETIME2 NULL,
    CancelReason      NVARCHAR(500) NULL,
    CreatedAt         DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE CommissionInvoices (
    Id        BIGINT IDENTITY PRIMARY KEY,
    DealId    BIGINT NOT NULL FOREIGN KEY REFERENCES Deals(Id),
    Amount    DECIMAL(18,2) NOT NULL,
    VatAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status    TINYINT NOT NULL DEFAULT 1, -- 1=مستحقة 2=مدفوعة جزئي 3=مدفوعة 4=معدومة
    PaidAt    DATETIME2 NULL,
    Notes     NVARCHAR(500) NULL
);
```

### 3.6 الحفظ والتنبيهات والتتبع

```sql
CREATE TABLE SavedUnits (
    UserId  UNIQUEIDENTIFIER NOT NULL,
    UnitId  BIGINT NOT NULL,
    SavedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    PRIMARY KEY (UserId, UnitId)
);

-- طلب المشتري: أول ما تنزل وحدة تطابقه يوصله واتساب
CREATE TABLE BuyerAlerts (
    Id            BIGINT IDENTITY PRIMARY KEY,
    UserId        UNIQUEIDENTIFIER NOT NULL,
    RegionIds     VARCHAR(200) NULL,   -- CSV
    DeveloperIds  VARCHAR(200) NULL,
    PropertyTypes VARCHAR(50)  NULL,
    MaxCash       DECIMAL(18,2) NULL,
    MaxInstallment DECIMAL(18,2) NULL,
    MinArea       DECIMAL(10,2) NULL,
    Channel       TINYINT NOT NULL DEFAULT 1, -- 1=واتساب 2=Push 3=إيميل
    IsActive      BIT NOT NULL DEFAULT 1,
    LastNotifiedAt DATETIME2 NULL
);

CREATE TABLE UnitViews (
    Id        BIGINT IDENTITY PRIMARY KEY,
    UnitId    BIGINT NOT NULL,
    UserId    UNIQUEIDENTIFIER NULL,
    IpHash    VARCHAR(64) NULL,     -- هاش مش IP خام
    ViewedAt  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE ContactReveals (   -- منع الاتفاق من ورا المنصة
    Id        BIGINT IDENTITY PRIMARY KEY,
    UnitId    BIGINT NOT NULL,
    BuyerId   UNIQUEIDENTIFIER NOT NULL,
    RevealedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE InvestorLeads (
    Id            BIGINT IDENTITY PRIMARY KEY,
    FullName      NVARCHAR(150) NOT NULL,
    Company       NVARCHAR(200) NULL,
    Country       NVARCHAR(100) NULL,
    Email         NVARCHAR(200) NOT NULL,
    Phone         VARCHAR(20) NULL,
    InvestorType  TINYINT NOT NULL,
    TicketSizeUsd DECIMAL(18,2) NULL,
    AnswersJson   NVARCHAR(MAX) NULL,
    NdaSignedAt   DATETIME2 NULL,
    Status        TINYINT NOT NULL DEFAULT 1,
    CreatedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE AuditLogs (
    Id         BIGINT IDENTITY PRIMARY KEY,
    UserId     UNIQUEIDENTIFIER NULL,
    Action     VARCHAR(100) NOT NULL,
    EntityName VARCHAR(100) NOT NULL,
    EntityId   VARCHAR(50)  NULL,
    OldValues  NVARCHAR(MAX) NULL,
    NewValues  NVARCHAR(MAX) NULL,
    IpHash     VARCHAR(64) NULL,
    CreatedAt  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
```

### 3.7 الفهارس (مهمة جدًا مع 10 آلاف وحدة)

```sql
-- فهرس مفلتر: بيشتغل على المنشور بس، حجمه صغير وسريع
CREATE INDEX IX_Units_Published
    ON Units(PublishedAt DESC)
    INCLUDE (PublicCode, TitleAr, RegionId, DeveloperId, CompoundId,
             PropertyType, AreaM2, PaidCashAmount, RemainingAmount,
             CurrentMarketPrice, BuyerGain, DeliveryYear, IsFeatured)
    WHERE Status = 4 AND IsDeleted = 0;

CREATE INDEX IX_Units_Filter_Cash   ON Units(Status, RegionId, PropertyType, PaidCashAmount)
    WHERE IsDeleted = 0;
CREATE INDEX IX_Units_Gain          ON Units(Status, BuyerGain DESC) WHERE IsDeleted = 0;
CREATE INDEX IX_Units_Seller        ON Units(SellerId, Status);
CREATE INDEX IX_Units_ReviewQueue   ON Units(Status, CreatedAt) WHERE Status IN (2,3);
CREATE INDEX IX_Inquiries_Unit      ON Inquiries(UnitId, CreatedAt DESC);
CREATE INDEX IX_Deals_Stage         ON Deals(Stage, CreatedAt DESC);

-- بحث نصي عربي
CREATE FULLTEXT CATALOG AqarCatalog AS DEFAULT;
CREATE FULLTEXT INDEX ON Units(SearchText LANGUAGE 1025)
    KEY INDEX PK__Units ON AqarCatalog;
```

---

## 4. استعلامات أساسية جاهزة

### 4.1 صفحة الفرص (فلترة + ترتيب + Pagination)

```sql
CREATE OR ALTER PROCEDURE sp_SearchUnits
    @RegionId       INT           = NULL,
    @DeveloperId    INT           = NULL,
    @PropertyType   TINYINT       = NULL,
    @MaxCash        DECIMAL(18,2) = NULL,
    @MaxInstallment DECIMAL(18,2) = NULL,
    @MinArea        DECIMAL(10,2) = NULL,
    @DeliveryYear   SMALLINT      = NULL,
    @Search         NVARCHAR(200) = NULL,
    @SortBy         VARCHAR(20)   = 'newest',  -- newest|gain|cashLow|installmentLow|delivery|popular
    @Page           INT = 1,
    @PageSize       INT = 24
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        u.Id, u.PublicCode, u.TitleAr, u.TitleEn,
        d.NameAr AS DeveloperAr, c.NameAr AS CompoundAr, r.NameAr AS RegionAr,
        u.PropertyType, u.AreaM2, u.Bedrooms, u.Bathrooms,
        u.PaidCashAmount, u.RemainingAmount, u.CurrentMarketPrice,
        u.TotalCost, u.BuyerGain, u.CommissionRate,
        u.InstallmentValue, u.InstallmentFrequency,
        u.DeliveryYear, u.IsNegotiable, u.IsFeatured,
        (SELECT TOP 1 BlobPath FROM UnitImages WHERE UnitId = u.Id ORDER BY IsCover DESC, SortOrder) AS CoverImage,
        COUNT(*) OVER() AS TotalCount
    FROM Units u
    JOIN Developers d ON d.Id = u.DeveloperId
    JOIN Compounds  c ON c.Id = u.CompoundId
    JOIN Regions    r ON r.Id = u.RegionId
    WHERE u.Status = 4 AND u.IsDeleted = 0
      AND (@RegionId     IS NULL OR u.RegionId     = @RegionId)
      AND (@DeveloperId  IS NULL OR u.DeveloperId  = @DeveloperId)
      AND (@PropertyType IS NULL OR u.PropertyType = @PropertyType)
      AND (@MaxCash      IS NULL OR u.PaidCashAmount <= @MaxCash)
      AND (@MinArea      IS NULL OR u.AreaM2 >= @MinArea)
      AND (@DeliveryYear IS NULL OR u.DeliveryYear <= @DeliveryYear)
      AND (@MaxInstallment IS NULL OR
           CASE u.InstallmentFrequency
                WHEN 1 THEN u.InstallmentValue
                WHEN 2 THEN u.InstallmentValue / 3.0
                WHEN 3 THEN u.InstallmentValue / 6.0
                ELSE u.InstallmentValue / 12.0
           END <= @MaxInstallment)
      AND (@Search IS NULL OR u.SearchText LIKE N'%' + @Search + N'%')
    ORDER BY
        u.IsFeatured DESC,
        CASE WHEN @SortBy = 'gain'           THEN u.BuyerGain END DESC,
        CASE WHEN @SortBy = 'cashLow'        THEN u.PaidCashAmount END ASC,
        CASE WHEN @SortBy = 'installmentLow' THEN u.InstallmentValue END ASC,
        CASE WHEN @SortBy = 'delivery'       THEN u.DeliveryYear END ASC,
        CASE WHEN @SortBy = 'popular'        THEN u.ViewsCount END DESC,
        u.PublishedAt DESC
    OFFSET (@Page - 1) * @PageSize ROWS FETCH NEXT @PageSize ROWS ONLY
    OPTION (RECOMPILE);   -- ضروري مع الفلاتر الاختيارية
END
```

> `OPTION (RECOMPILE)` بيمنع مشكلة **Parameter Sniffing** اللي بتخلي الاستعلام سريع مرة وبطيء عشر مرات.

### 4.2 إحصائيات الهيدر (تتكاش في Redis كل 10 دقايق)

```sql
SELECT
    COUNT(*)                                        AS TotalUnits,
    SUM(CASE WHEN Status = 4 THEN 1 ELSE 0 END)     AS AvailableUnits,
    SUM(CASE WHEN Status = 4 THEN CurrentMarketPrice ELSE 0 END) AS MarketValue,
    AVG(CASE WHEN Status = 4 THEN BuyerGain END)    AS AvgGain
FROM Units
WHERE IsDeleted = 0 AND Status IN (2,4,5);
```

### 4.3 طابور المراجعة للإدارة

```sql
SELECT u.Id, u.PublicCode, u.TitleAr, us.FullName AS SellerName, us.PhoneNumber,
       d.NameAr AS Developer, u.PaidCashAmount, u.RemainingAmount,
       (SELECT COUNT(*) FROM UnitDocuments WHERE UnitId = u.Id) AS DocsCount,
       DATEDIFF(HOUR, u.CreatedAt, SYSUTCDATETIME()) AS WaitingHours
FROM Units u
JOIN Users us ON us.Id = u.SellerId
JOIN Developers d ON d.Id = u.DeveloperId
WHERE u.Status IN (2, 3) AND u.IsDeleted = 0
ORDER BY u.CreatedAt ASC;
```

### 4.4 مطابقة التنبيهات (بتشتغل بعد نشر أي وحدة)

```sql
SELECT DISTINCT a.UserId, us.PhoneNumber
FROM BuyerAlerts a
JOIN Users us ON us.Id = a.UserId
CROSS APPLY (SELECT * FROM Units WHERE Id = @UnitId) u
WHERE a.IsActive = 1
  AND us.IsPhoneVerified = 1
  AND (a.MaxCash      IS NULL OR u.PaidCashAmount <= a.MaxCash)
  AND (a.MinArea      IS NULL OR u.AreaM2 >= a.MinArea)
  AND (a.RegionIds    IS NULL OR EXISTS (SELECT 1 FROM STRING_SPLIT(a.RegionIds, ',')    WHERE value = CAST(u.RegionId AS VARCHAR)))
  AND (a.DeveloperIds IS NULL OR EXISTS (SELECT 1 FROM STRING_SPLIT(a.DeveloperIds, ',') WHERE value = CAST(u.DeveloperId AS VARCHAR)))
  AND (a.LastNotifiedAt IS NULL OR a.LastNotifiedAt < DATEADD(HOUR, -6, SYSUTCDATETIME()));
```

---

## 5. الـ API Endpoints

### مفتوحة (Public)
```
GET    /api/units                      # بحث وفلترة (الرد بدون بيانات تواصل)
GET    /api/units/{publicCode}          # تفاصيل وحدة
GET    /api/units/stats                 # إحصائيات الهيدر
GET    /api/lookups/regions
GET    /api/lookups/developers
GET    /api/lookups/compounds?developerId=
POST   /api/calculator/exit             # حاسبة الخروج (بأرقام المطوّر الحقيقية)
POST   /api/contact                     # نموذج كلمنا
POST   /api/investors/interest          # نموذج المستثمرين
```

### المصادقة
```
POST   /api/auth/otp/request            # { phone } → يبعت واتساب
POST   /api/auth/otp/verify             # { phone, code } → JWT
POST   /api/auth/register
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/me/budget              # تسجيل القدرة الشرائية
```

### المشتري
```
GET    /api/me/saved
POST   /api/me/saved/{unitId}
DELETE /api/me/saved/{unitId}
POST   /api/units/{id}/inquiry          # استفسار / طلب معاينة
POST   /api/units/{id}/reveal-contact   # بعد شروط معيّنة بس
GET    /api/me/alerts
POST   /api/me/alerts
GET    /api/me/inquiries
```

### البائع
```
POST   /api/seller/units                # مسودة
PUT    /api/seller/units/{id}
POST   /api/seller/units/{id}/documents # رفع عقد/إيصالات
POST   /api/seller/units/{id}/submit    # يروح لطابور المراجعة
POST   /api/seller/units/{id}/withdraw
GET    /api/seller/units                # وحداتي وحالتها
GET    /api/seller/units/{id}/offers
```

### الإدارة (Ops / Admin)
```
GET    /api/admin/units/queue
GET    /api/admin/units/{id}/documents/{docId}/sas   # لينك مؤقت 5 دقايق
POST   /api/admin/units/{id}/verify      # { checklist, notes }
POST   /api/admin/units/{id}/reject      # { reason }
POST   /api/admin/units/{id}/request-info
POST   /api/admin/units/{id}/feature
GET    /api/admin/inquiries
PUT    /api/admin/inquiries/{id}/assign
POST   /api/admin/deals
PUT    /api/admin/deals/{id}/stage
GET    /api/admin/reports/pipeline
GET    /api/admin/reports/commissions
GET    /api/admin/developers  (CRUD)
```

---

## 6. المصادقة بـ OTP واتساب (ربط بالسيرفر اللي عندك)

عندك السيرفر شغال في `C:\Node`. اعمله Interface في الباك إند:

```csharp
public interface IWhatsAppService
{
    Task<bool> SendOtpAsync(string phone, string code, CancellationToken ct = default);
    Task<bool> SendNotificationAsync(string phone, string templateKey, object data, CancellationToken ct = default);
}

public sealed class WhatsAppOtpService : IWhatsAppService
{
    private readonly HttpClient _http;
    private readonly ILogger<WhatsAppOtpService> _log;

    public async Task<bool> SendOtpAsync(string phone, string code, CancellationToken ct = default)
    {
        var res = await _http.PostAsJsonAsync("/api/send-otp",
            new { phone, message = $"كود الدخول لمنصة تنازل: {code}\nصالح 5 دقايق. متشاركهوش مع حد." }, ct);
        if (!res.IsSuccessStatusCode)
            _log.LogWarning("WhatsApp OTP failed for {Phone}: {Status}", Mask(phone), res.StatusCode);
        return res.IsSuccessStatusCode;
    }
}
```

**قواعد أمان لازمة:**
- خزّن **هاش الكود** (BCrypt/HMAC) مش الكود نفسه.
- صلاحية **5 دقايق**، و**3 محاولات** بحد أقصى، وبعدها اقفل الرقم 15 دقيقة.
- **Rate limit**: 3 طلبات OTP للرقم الواحد في الساعة، و10 للـ IP.
- سجّل الرقم مقنّع في اللوجات (`0101****678`).

---

## 7. دورة حياة الوحدة

```
Draft ──submit──> PendingReview ──┬── verify ──> Published ──┐
                                   ├── needsInfo ──> NeedsInfo┘ (يرجع للبائع)
                                   └── reject ───> Rejected

Published ──reserve──> Reserved ──transfer──> UnderTransfer ──> Completed
     │                      │
     └──withdraw──> Withdrawn (البائع سحبها)
     └──expire────> Expired (عدت 90 يوم من غير تفاعل)
```

**قواعد لازم تتفرض في الباك إند مش في الفرونت:**
1. `PaidCashAmount + RemainingAmount` لازم يساوي `OriginalContractPrice` تقريبًا (± 5%)، وإلا تحذير للمراجع.
2. `PaidCashAmount` ماينفعش يكون أكبر من `OriginalContractPrice`.
3. مفيش نشر من غير **مستند عقد + إيصال واحد على الأقل** حالتهم `ScanStatus = Clean`.
4. البائع مايقدرش يعدّل الأرقام بعد النشر — التعديل بيرجّع الوحدة لـ `PendingReview`.
5. `CurrentMarketPrice` من البائع، ولازم يفضل مكتوب في الـ API response إنه **مش تقييم من المنصة** (حماية قانونية).

---

## 8. حماية العمولة من الالتفاف

ده أخطر خطر على الموديل كله. الحل في 3 طبقات:

1. **بيانات التواصل مخفية:** API الوحدات ما بيرجّعش اسم ولا تليفون البائع أبدًا. أي محاولة تجيبهم بتروح لـ `/reveal-contact` وبتتسجل في `ContactReveals`.
2. **الكشف مشروط:** المشتري لازم يكون **متحقق برقمه** ومسجّل قدرته الشرائية، والكشف بيتم عن طريق فريقك مش أوتوماتيك.
3. **إثبات التعريف:** كل View و Reveal و Inquiry متسجل بتوقيت. لو الصفقة تمت من ورا المنصة، عندك دليل إن المشتري ده جه منك — وده اللي بيخلي بند العمولة في العقد قابل للتنفيذ.

---

## 9. المهام الخلفية (Hangfire)

| المهمة | التوقيت | الوظيفة |
|---|---|---|
| `MatchAndNotifyAlerts` | عند نشر وحدة | واتساب للمشترين المطابقين |
| `ExpireStaleUnits` | يوميًا 3 ص | وحدات عدت 90 يوم → Expired |
| `RefreshStatsCache` | كل 10 دقايق | إحصائيات الهيدر |
| `ScanUploadedDocuments` | عند الرفع | فحص فيروسات → ScanStatus |
| `SendPendingReviewReminder` | كل 6 ساعات | تنبيه الفريق بالطابور المتأخر |
| `DailyOpsReport` | يوميًا 8 ص | تقرير للإدارة |
| `CleanupExpiredOtps` | كل ساعة | حذف الأكواد المنتهية |

---

## 10. خطة التنفيذ بالمراحل

| المرحلة | المدة | المخرجات |
|---|---|---|
| **0 — التأسيس** | 3 أيام | Solution، DbContext، Migrations، Docker Compose (SQL + Redis)، Swagger، CI |
| **1 — المصادقة** | أسبوع | JWT، OTP واتساب، الأدوار، Rate limiting، `/auth/me` |
| **2 — الكتالوج** | أسبوعان | Lookups، Units، بحث وفلترة، تفاصيل الوحدة، الإحصائيات، Redis |
| **3 — البائع** | أسبوع | إضافة وحدة، رفع مستندات على Blob، تقديم للمراجعة |
| **4 — لوحة الإدارة** | أسبوعان | طابور المراجعة، Checklist، اعتماد/رفض، SAS للمستندات، AuditLog |
| **5 — الطلبات والصفقات** | أسبوعان | Inquiries، Reveal، Deals، العمولة، تقارير الـ Pipeline |
| **6 — التنبيهات** | أسبوع | BuyerAlerts، Hangfire، قوالب واتساب |
| **7 — التجهيز للإطلاق** | أسبوعان | تيستات، أداء، أمان، نشر، مونيتورنج، نسخ احتياطي |

**الإجمالي: حوالي 10 أسابيع** لمطوّر واحد متفرّغ.

---

## 11. التعديلات المطلوبة في الفرونت

1. **شيل `localStorage`** من [UnitsContext.tsx](../src/context/UnitsContext.tsx) و[AuthContext.tsx](../src/context/AuthContext.tsx)، واستبدلها بـ API client (TanStack Query موصى بيه).
2. **امسح `DEMO_USERS`** و`mockData.ts` قبل أي نشر.
3. **ضيف React Router** بدل الـ hash، وخصوصًا `/unit/{publicCode}` عشان اللينكات تتشارك وتتأرشف في جوجل.
4. **الحاسبة**: شيل الأرقام الثابتة (15% و36 شهر) وهاتها من `/api/calculator/exit`.
5. **شيل `@google/genai`** و`BrandNameShowcase` من نسخة الإنتاج.
6. **غيّر اسم المشروع** من `react-example`، وشيل جملة "بديل عقار إكزيت" من `metadata.json`.
7. **Pagination حقيقي** في صفحة الفرص بدل تحميل كل الوحدات.
8. متحسبش أي رقم مالي في الفرونت — كله ييجي محسوب من الـ API.

---

## 12. قرارات محتاجة منك قبل ما نبدأ

1. **مين يدفع العمولة؟** المشتري ولا البائع ولا مناصفة؟ (بيأثر على `Deals` والـ UI)
2. **هتمسك فلوس (عربون/Escrow)؟** لو أيوه، ده محتاج مراجعة قانونية وترخيص، وممكن نأجله.
3. **الاستضافة:** Azure ولا سيرفر Contabo زي مشروع الواتساب؟
4. **تطبيق موبايل؟** لو أيوه، الـ API لازم يتعمل من الأول بمنطق mobile-first.
5. **عدد فريق المراجعة؟** بيحدد شكل لوحة التحكم وتوزيع المهام.
