import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../auth/AuthService';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = AuthService.getToken();
    return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
