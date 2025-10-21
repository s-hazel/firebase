import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = () => {
    const { signedIn } = useContext(AuthContext);
    return signedIn ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute;