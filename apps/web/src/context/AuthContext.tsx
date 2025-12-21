import { createContext, useState, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
    email: string;
    sub: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Initialize token from localStorage lazily to avoid hydration mismatch if SSR (though this is Vite SPA)
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

    const user = useMemo<User | null>(() => {
        if (!token) return null;
        try {
            return jwtDecode<User>(token);
        } catch {
            return null;
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // If token is invalid (user is null but token is set), we might want to logout?
            // But simpler to just let it be for now, or check:
            if (!user) {
                // optionally setToken(null) here if we want auto-logout on invalid token
                // setToken(null); 
                // Removing this to avoid re-triggering state update in effect if not strictly needed
            }
        } else {
            localStorage.removeItem('token');
        }
    }, [token, user]);

    const login = (newToken: string) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
