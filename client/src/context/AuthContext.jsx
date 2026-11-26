import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEMO_USERS = {
  admin: {
    id: 'usr_admin_01',
    name: 'Dr. Evelyn Vance',
    email: 'admin@pharmaprint.org',
    role: 'Admin',
    organization: 'Global Medicine Regulatory Agency (GMRA)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    token: 'jwt_mock_admin_token_2026'
  },
  pharmacist: {
    id: 'usr_pharm_02',
    name: 'Marcus Chen, PharmD',
    email: 'marcus@apothecarycare.com',
    role: 'Pharmacist',
    organization: 'Metro Central Pharmacy & Health',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    token: 'jwt_mock_pharm_token_2026'
  },
  manufacturer: {
    id: 'usr_mfg_03',
    name: 'Elena Rostova',
    email: 'elena@novapharma.com',
    role: 'Manufacturer',
    organization: 'NovaCare Global Pharmaceuticals Ltd',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    token: 'jwt_mock_mfg_token_2026'
  },
  distributor: {
    id: 'usr_dist_04',
    name: 'Tariq Al-Mansoor',
    email: 'tariq@coldchainlogistics.net',
    role: 'Distributor',
    organization: 'Apex Life Sciences Cold-Chain Freight',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    token: 'jwt_mock_dist_token_2026'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pharmaprint_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS.admin;
      }
    }
    return DEMO_USERS.admin; // default to admin for seamless showcase
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pharmaprint_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pharmaprint_user');
    }
  }, [user]);

  const login = async (email, password, roleHint) => {
    setLoading(true);
    try {
      // Check if matches a demo user or role
      const matched = Object.values(DEMO_USERS).find(
        u => u.email.toLowerCase() === email.toLowerCase() || (roleHint && u.role.toLowerCase() === roleHint.toLowerCase())
      ) || {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: roleHint || 'Pharmacist',
        organization: 'Verified Pharma Node',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        token: `jwt_token_${Date.now()}`
      };
      
      setUser(matched);
      return { success: true, user: matched };
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      setUser(DEMO_USERS[roleKey]);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
