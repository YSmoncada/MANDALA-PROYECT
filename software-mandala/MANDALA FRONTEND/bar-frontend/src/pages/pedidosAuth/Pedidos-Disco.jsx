import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import CodeInputDisco from "./CodeInput-Disco";
import SystemLoginForm from "./components/SystemLoginForm";
import { usePedidosContext } from "../../context/PedidosContext";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function PedidosDisco() {
    const { auth } = usePedidosContext();

    const {
        userName,
        codigoConfirmado,
        userRole,
        isInitialized,
        handleCodigoSubmit,
        loginSystem,
        handleLogout,
    } = auth;

    const [sysUsername, setSysUsername] = useState("");
    const [sysPassword, setSysPassword] = useState("");

    const navigate = useNavigate();

    // Force clear session whenever the login page is accessed for maximum security
    useEffect(() => {
        handleLogout();
    }, []); // Only on mount

    const handleSystemLoginSubmit = async (e) => {
        e.preventDefault();
        const result = await loginSystem(sysUsername, sysPassword);
        if (!result.success) {
            toast.error(result.message);
        }
    };

    const handleBackFromPin = () => {
        handleLogout();
        setSysPassword("");
    };

    // Main Security Login Layout (Standard)
    if (!userName && !codigoConfirmado) {
        return (
            <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-6 animate-fadeIn overflow-y-auto">
                <div className="w-full max-w-md py-12">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-black text-white tracking-[0.2em] uppercase">Nox<span className="text-zinc-500">OS</span></h1>
                    </div>

                    {/* Login Form Box */}
                    <SystemLoginForm 
                        username={sysUsername}
                        password={sysPassword}
                        onUsernameChange={setSysUsername}
                        onPasswordChange={setSysPassword}
                        onSubmit={handleSystemLoginSubmit}
                    />
                </div>
            </div>
        );
    }

    // PIN Pad Login (Safe Mode)
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 animate-fadeIn">
            <div className="w-full max-w-md">
                <CodeInputDisco
                    nombre={userName}
                    onBack={handleBackFromPin}
                    onSubmit={async (code) => {
                        const success = await handleCodigoSubmit(code);
                        if (!success) {
                            toast.error("Error: Acceso denegado");
                        }
                    }}
                />
            </div>
        </div>
    );
}
