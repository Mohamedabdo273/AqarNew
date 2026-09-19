import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, UserUnitSubmission, UserInquiry } from '../types';

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  loginWithDemo: (role: UserRole) => void;
  logout: () => void;
  toggleSaveUnit: (unitId: string) => void;
  isUnitSaved: (unitId: string) => boolean;
  addMyUnit: (unit: Omit<UserUnitSubmission, 'id' | 'submissionDate' | 'status' | 'statusAr' | 'statusEn'>) => void;
  addInquiry: (inquiry: Omit<UserInquiry, 'id' | 'date' | 'status' | 'statusTextAr' | 'statusTextEn'>) => void;
}

const DEMO_USERS: Record<UserRole, User> = {
  seller: {
    id: 'usr-seller-1',
    name: 'المهندس طارق منصور',
    email: 'tarek.mansour@example.com',
    phone: '01012345678',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    savedUnits: ['unit-1', 'unit-3'],
    myUnits: [
      {
        id: 'sub-101',
        title: 'شقة 175م² في بالم هيلز نيو كايرو',
        compound: 'بالم هيلز نيو كايرو',
        developer: 'بالم هيلز',
        contractPrice: 4600000,
        paidAmount: 1850000,
        submissionDate: '2026-08-20',
        status: 'verified',
        statusAr: 'موثقة ومطروحة للتنازل بدون أوفر',
        statusEn: 'Verified & Listed at 0% Overprice'
      }
    ],
    inquiries: [
      {
        id: 'inq-1',
        unitId: 'unit-1',
        title: 'استفسار عن موعد توقيع ملحق التنازل الرسمي',
        type: 'seller_exit',
        date: '2026-09-02',
        status: 'in_progress',
        statusTextAr: 'جاري التنسيق مع إدارة المطور',
        statusTextEn: 'Coordinating with developer HQ'
      }
    ],
    joinedDate: '2026-03-15'
  },
  buyer: {
    id: 'usr-buyer-2',
    name: 'الدكتورة نورهان شريف',
    email: 'nourhan.sherif@example.com',
    phone: '01298765432',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    savedUnits: ['unit-2', 'unit-4'],
    myUnits: [],
    inquiries: [
      {
        id: 'inq-2',
        unitId: 'unit-2',
        title: 'حجز موعد فحص مستندات تاون هاوس فيفيان سوديك',
        type: 'buyer_inquiry',
        date: '2026-09-10',
        status: 'scheduled',
        statusTextAr: 'تم حجز موعد جلسة المعاينة',
        statusTextEn: 'Due diligence session scheduled'
      }
    ],
    joinedDate: '2026-05-10'
  },
  investor: {
    id: 'usr-investor-3',
    name: 'الأستاذ كريم الجوهري (مستثمر VIP)',
    email: 'karim.elgohary@investor-capital.com',
    phone: '01155443322',
    role: 'investor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    savedUnits: ['unit-1', 'unit-2', 'unit-3', 'unit-5'],
    myUnits: [],
    inquiries: [
      {
        id: 'inq-3',
        title: 'طلب انضمام لنادي المستثمرين (صفقات الاستحواذ المباشر)',
        type: 'investor_vip',
        date: '2026-09-12',
        status: 'received',
        statusTextAr: 'عضوية نشطة - تلقي الصفقات قبل الطرح بـ 48 ساعة',
        statusTextEn: 'Active VIP Member - 48h priority alerts'
      }
    ],
    joinedDate: '2026-01-20'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aqarexit_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to a logged-in demo user (seller) for instant convenience or null
    return DEMO_USERS.seller;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('aqarexit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aqarexit_user');
    }
  }, [user]);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    // Find matching demo user or create a user session
    const matchedRole = (Object.keys(DEMO_USERS) as UserRole[]).find(
      (role) => DEMO_USERS[role].email.toLowerCase() === email.toLowerCase()
    );

    if (matchedRole) {
      setUser(DEMO_USERS[matchedRole]);
      return true;
    }

    // Generic login for any entered email
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: formattedName,
      email,
      phone: '01000000000',
      role: 'seller',
      savedUnits: ['unit-1'],
      myUnits: [],
      inquiries: [],
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      savedUnits: [],
      myUnits: [],
      inquiries: [],
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
    return true;
  };

  const loginWithDemo = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleSaveUnit = (unitId: string) => {
    if (!user) return;
    const exists = user.savedUnits.includes(unitId);
    const updated = exists
      ? user.savedUnits.filter((id) => id !== unitId)
      : [...user.savedUnits, unitId];

    setUser({
      ...user,
      savedUnits: updated
    });
  };

  const isUnitSaved = (unitId: string): boolean => {
    if (!user) return false;
    return user.savedUnits.includes(unitId);
  };

  const addMyUnit = (unitData: Omit<UserUnitSubmission, 'id' | 'submissionDate' | 'status' | 'statusAr' | 'statusEn'>) => {
    if (!user) return;
    const newSubmission: UserUnitSubmission = {
      id: `sub-${Date.now()}`,
      ...unitData,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'under_review',
      statusAr: 'قيد التدقيق والفحص القانوني',
      statusEn: 'Under Legal Review & Audit'
    };
    setUser({
      ...user,
      myUnits: [newSubmission, ...user.myUnits]
    });
  };

  const addInquiry = (inquiryData: Omit<UserInquiry, 'id' | 'date' | 'status' | 'statusTextAr' | 'statusTextEn'>) => {
    if (!user) return;
    const newInquiry: UserInquiry = {
      id: `inq-${Date.now()}`,
      ...inquiryData,
      date: new Date().toISOString().split('T')[0],
      status: 'received',
      statusTextAr: 'تم استلام الطلب وتعيين مستشار',
      statusTextEn: 'Received - Advisor assigned'
    };
    setUser({
      ...user,
      inquiries: [newInquiry, ...user.inquiries]
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        loginWithDemo,
        logout,
        toggleSaveUnit,
        isUnitSaved,
        addMyUnit,
        addInquiry
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
