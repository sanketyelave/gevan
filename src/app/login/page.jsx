"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { appwriteService } from "../../lib/appwrite";
import { AlertCircle, Loader2, Phone, Lock } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { PublicRoute } from '../../components/PublicRout';


const COLORS = {
    white: '#FFFFFF',
    black: '#1F1E17',
    primary: '#4BAF47',
    secondary: '#EEC044',
    gray: {
        light: '#F8F7F0',
        medium: '#E4E2D7',
        dark: '#878680',
    }
};

export default function LoginForm() {
    const { user, loginWithOtp } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({
        phone: "",
        otp: "",
    });
    useEffect(() => {
        if (user && !loading) {
            console.log("User is logged in, redirecting to dashboard");
            router.push('/dashboard');
        }
    }, [user, loading, router]);
    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const userExists = await appwriteService.checkIfUserExists(formData.phone);
            setUserId(userExists.userId);
            console.log(userExists.userId)
            if (!userExists.exists) {
                setError("Account not found. Please sign up first.");
                setTimeout(() => router.push("/signup"), 2000);
                return;
            }

            await appwriteService.sendOtp(formData.phone);
            setOtpSent(true);
            setResendTimer(30);
            setError("");
        } catch (err) {
            setError("Failed to send OTP. Please try again.");
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setVerifying(true);
        try {
            await loginWithOtp(userId, formData.otp);
            // if (isVerified) {
            //     router.push("/dashboard");
            // } else {
            //     setError("Invalid OTP. Please try again.");
            // }
        } catch (err) {
            setError("Failed to verify OTP. Please try again.");
        }
        setVerifying(false);
    };

    return (
        <PublicRoute><div className="min-h-screen poppins w-full flex items-center justify-center bg-[#F8F7F0] p-4">
            <div className="w-full max-w-md">
                <div
                    className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300"
                    style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-[#1F1E17]">Welcome Back</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
                            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Phone className="absolute left-3 top-3 text-[#878680]" />
                                <PhoneInput
                                    international
                                    defaultCountry="IN"
                                    value={formData.phone}
                                    onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                                    disabled={otpSent}
                                    style={{ outline: "none", boxShadow: "none" }}
                                    className="w-full pl-10 pr-4 py-3 border border-[#E4E2D7] rounded-lg focus:border-[#4BAF47]"
                                />


                            </div>




                            {otpSent && (
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-[#878680]" />
                                    <input
                                        type="text"
                                        name="otp"
                                        placeholder="Enter 6-digit OTP"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        maxLength={6}
                                        className="w-full pl-10 pr-4 py-3 border border-[#E4E2D7] rounded-lg focus:outline-none focus:border-[#4BAF47] transition-colors"
                                    />
                                </div>
                            )}
                        </div>

                        {otpSent ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={resendTimer > 0}
                                        className="text-sm text-[#4BAF47] hover:underline disabled:opacity-50"
                                    >
                                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={verifying || !formData.otp}
                                        className="px-6 py-2 text-white bg-[#4BAF47] rounded-lg focus:outline-none hover:bg-[#3a9e3e] transition-colors disabled:opacity-50"
                                    >
                                        {verifying ? (
                                            <Loader2 className="animate-spin w-5 h-5" />
                                        ) : (
                                            'Verify & Login'
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading || !formData.phone}
                                className="w-full py-3 text-white bg-[#4BAF47] rounded-lg focus:outline-none hover:bg-[#3a9e3e] transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        )}

                        <div className="mt-8 text-center text-[#878680]">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => router.push("/signup")}
                                className="text-[#4BAF47] hover:underline focus:outline-none"
                            >
                                Sign up here
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div></PublicRoute>
    );
}