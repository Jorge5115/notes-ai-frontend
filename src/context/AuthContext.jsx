import { createContext, useContext, useState } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (email, password) => {
        const { data } = await axiosInstance.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ email: data.email, name: data.name }));
        setUser({ email: data.email, name: data.name });
    };

    const register = async (email, password, name) => {
        const { data } = await axiosInstance.post('/auth/register', { email, password, name });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ email: data.email, name: data.name }));
        setUser({ email: data.email, name: data.name });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
