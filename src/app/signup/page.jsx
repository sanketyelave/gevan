"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { appwriteService } from "../../lib/appwrite";
import { AlertCircle, Loader2, ArrowRight, ArrowLeft, User, Calendar, Phone, Check } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { PublicRoute } from '../../components/PublicRout';

const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Address" },
    { number: 3, title: "Occupation" },
    { number: 4, title: "Contact" },
    { number: 5, title: "Verify" }
];

const COLORS = {
    white: '#FFFFFF',
    black: '#1F1E17',
    primary: '#4BAF47',
    secondary: '#EEC044',
    accent: '#C5CE38',
    gray: {
        light: '#F8F7F0',
        medium: '#E4E2D7',
        dark: '#878680',
        darker: '#A5A49A',
    }
};

const cropOptions = [
    "Rice",
    "Wheat",
    "Corn",
    "Soybeans",
    "Cotton",
    "Sugarcane",
    "Vegetables",
    "Fruits",
    "Pulses",
    "Others"
];

export default function SignupForm() {
    const { signupUser } = useAuth();
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [pincodeDetails, setPincodeDetails] = useState(null);
    const [pincodeError, setPincodeError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        phone: "",
        address: "",
        pincode: "",
        district: "",
        state: "",
        area: "",
        occupation: "",
        crops: [],
        otp: ""
    });

    const [validation, setValidation] = useState({
        name: false,
        dob: false,
        phone: false,
        address: false,
        pincode: false,
        occupation: false,
        crops: false,
        otp: false
    });

    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const validatePincode = async (pincode) => {
        if (pincode.length !== 6) {
            setPincodeError("PIN code must be 6 digits");
            setPincodeDetails(null);
            return false;
        }

        setPincodeLoading(true);
        setPincodeError("");

        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data[0].Status === "Success") {
                const details = data[0].PostOffice[0];
                setPincodeDetails({
                    district: details.District,
                    state: details.State,
                    area: details.Name
                });
                setFormData(prev => ({
                    ...prev,
                    district: details.District,
                    state: details.State,
                    area: details.Name
                }));
                setPincodeError("");
                return true;
            } else {
                setPincodeError("Invalid PIN code");
                setPincodeDetails(null);
                return false;
            }
        } catch (error) {
            setPincodeError("Error validating PIN code");
            setPincodeDetails(null);
            return false;
        } finally {
            setPincodeLoading(false);
        }
    };

    const validateStep = () => {
        switch (activeStep) {
            case 1:
                return formData.name.length >= 2 && formData.dob;
            case 2:
                return formData.address.length >= 5 && formData.pincode.length === 6 && pincodeDetails;
            case 3:
                return formData.occupation && (formData.occupation !== 'farmer' || formData.crops.length > 0);
            case 4:
                return formData.phone;
            case 5:
                return otpSent && formData.otp.length === 6;
            default:
                return true;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'pincode') {
            const pincodeValue = value.replace(/\D/g, '');
            if (pincodeValue.length <= 6) {
                setFormData(prev => ({ ...prev, [name]: pincodeValue }));
                if (pincodeValue.length === 6) {
                    validatePincode(pincodeValue);
                } else {
                    setPincodeDetails(null);
                    setPincodeError("");
                }
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setValidation(prev => ({ ...prev, [name]: value.length > 0 }));
        setError("");
    };

    const sendOtp = async () => {
        setLoading(true);
        try {
            const userExists = await appwriteService.checkIfUserExists(formData.phone);

            if (userExists) {
                setError("User with this phone number already exists. Please log in or use a different number.");
            } else {
                await appwriteService.sendOtp(formData.phone);
                setOtpSent(true);
                setResendTimer(30);
                setError("");
            }
        } catch (err) {
            setError("Failed to send OTP. Please try again.");
        }
        setLoading(false);
    };

    const verifyOtp = async () => {
        setVerifying(true);
        try {
            await signupUser(formData.otp, formData);
            // if (isValid) {
            //     setValidation(prev => ({ ...prev, otp: true }));
            //     router.push("/dashboard");
            // } else {
            //     setError("Invalid OTP. Please try again.");
            //     setValidation(prev => ({ ...prev, otp: false }));
            // }
        } catch (err) {
            setError(err.message || "Failed to verify OTP");
            setValidation(prev => ({ ...prev, otp: false }));
        }
        setVerifying(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (activeStep === 5 && otpSent) {
            await verifyOtp();
        }
    };

    const handleStepChange = (direction) => {
        if (direction === 'next' && validateStep()) {
            setActiveStep(prev => Math.min(prev + 1, 5));
        } else if (direction === 'back') {
            setActiveStep(prev => Math.max(prev - 1, 1));
        }
    };

    return (
        <PublicRoute><div className="min-h-screen poppins w-full flex items-center justify-center bg-[#F8F7F0] p-4">
            <div className="w-full max-w-md">
                <div
                    className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300"
                    style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                >
                    {/* Progress Stepper */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-4">
                            {steps.map((step) => (
                                <div key={step.number} className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                    ${activeStep >= step.number
                                                ? 'bg-[#4BAF47] text-white'
                                                : 'bg-[#E4E2D7] text-[#878680]'}`}
                                    >
                                        {activeStep > step.number ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            step.number
                                        )}
                                    </div>
                                    <span className="text-xs mt-2 hidden md:block">{step.title}</span>
                                </div>
                            ))}
                        </div>
                        <div className="h-2 bg-[#E4E2D7] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#4BAF47] transition-all duration-500 ease-out"
                                style={{ width: `${((activeStep - 1) / 4) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
                            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Step 1: Personal Info */}
                        <div className={`transition-all duration-300 ${activeStep === 1 ? 'block' : 'hidden'}`}>
                            <h2 className="text-2xl font-bold mb-6 text-[#1F1E17]">Personal Information</h2>
                            <div className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-[#878680]" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-[#E4E2D7] rounded-lg focus:outline-none focus:border-[#4BAF47] transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-[#878680]" />
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-[#E4E2D7] rounded-lg focus:outline-none focus:border-[#4BAF47] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Address */}
                        <div className={`transition-all duration-300 ${activeStep === 2 ? 'block' : 'hidden'}`}>
                            <h2 className="text-2xl font-bold mb-6 text-[#1F1E17]">Address Details</h2>
                            <div className="space-y-4">
                                <div className="relative">
                                    <textarea
                                        name="address"
                                        placeholder="Full Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-[#E4E2D7] rounded-lg focus:outline-none focus:border-[#4BAF47] transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="pincode"
                                        placeholder="PIN Code"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        maxLength={6}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors 
                                        ${pincodeError ? 'border-red-500' : pincodeDetails ? 'border-[#4BAF47]' : 'border-[#E4E2D7]'}`}
                                    />
                                    {pincodeLoading && (
                                        <div className="absolute right-3 top-3">
                                            <Loader2 className="animate-spin w-5 h-5 text-[#878680]" />
                                        </div>
                                    )}
                                </div>

                                {pincodeError && (
                                    <div className="text-red-500 text-sm flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {pincodeError}
                                    </div>
                                )}

                                {pincodeDetails && (
                                    <div className="p-4 bg-[#F8F7F0] rounded-lg space-y-2">
                                        <div className="text-sm text-[#878680]">Location Details:</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-xs text-[#878680]">Area</div>
                                                <div className="font-medium">{pincodeDetails.area}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-[#878680]">District</div>
                                                <div className="font-medium">{pincodeDetails.district}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-[#878680]">State</div>
                                                <div className="font-medium">{pincodeDetails.state}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Step 3: Occupation */}
                        <div className={`transition-all duration-300 ${activeStep === 3 ? 'block' : 'hidden'}`}>
                            <h2 className="text-2xl font-bold mb-6 text-[#1F1E17]">Occupation Details</h2>
                            <div className="space-y-4">
                                <div className="relative">
                                    <select
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                occupation: e.target.value,
                                                crops: e.target.value === 'farmer' ? prev.crops : []
                                            }));
                                        }}
                                        className="w-full px-4 py-3 border border-[#E4E2D7] rounded-lg focus:outline-none focus:border-[#4BAF47] transition-colors"
                                    >
                                        <option value="">Select Occupation</option>
                                        <option value="farmer">Farmer</option>
                                        <option value="other">Not a Farmer</option>
                                    </select>
                                </div>

                                {formData.occupation === 'farmer' && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Select Crops (Multiple)</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {cropOptions.map((crop) => (
                                                <label key={crop} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.crops.includes(crop)}
                                                        onChange={(e) => {
                                                            const updatedCrops = e.target.checked
                                                                ? [...formData.crops, crop]
                                                                : formData.crops.filter(c => c !== crop);
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                crops: updatedCrops
                                                            }));
                                                        }}
                                                        className="rounded text-[#4BAF47] focus:ring-[#4BAF47]"
                                                    />
                                                    <span>{crop}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Step 4: Contact */}
                        <div className={`transition-all duration-300 ${activeStep === 4 ? 'block' : 'hidden'}`}>
                            <h2 className="text-2xl font-bold mb-6 text-[#1F1E17]">Contact Details</h2>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-[#878680]" />
                                    <PhoneInput
                                        international
                                        defaultCountry="IN"
                                        value={formData.phone}
                                        onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                                        className="w-full pl-10 pr-4 py-3 border border-[#E4E2D7] rounded-lg focus:outline-none focus:border-[#4BAF47] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 5: Verification */}
                        <div className={`transition-all duration-300 ${activeStep === 5 ? 'block' : 'hidden'}`}>
                            <h2 className="text-2xl font-bold mb-6 text-[#1F1E17]">Verify Your Phone</h2>
                            {otpSent ? (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="otp"
                                            placeholder="Enter 6-digit OTP"
                                            value={formData.otp}
                                            onChange={handleChange}
                                            maxLength={6}
                                            className="w-full px-4 py-3 border border-[#E4E2D7] rounded-lg focus:outline-none focus:border-[#4BAF47] transition-colors"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <button
                                            type="button"
                                            onClick={sendOtp}
                                            disabled={resendTimer > 0}
                                            className="text-sm text-[#4BAF47] hover:underline disabled:opacity-50"
                                        >
                                            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!validateStep() || verifying}
                                            className="px-6 py-2 text-white bg-[#4BAF47] rounded-lg focus:outline-none hover:bg-[#3a9e3e] transition-colors disabled:opacity-50"
                                        >
                                            {verifying ? <Loader2 className="animate-spin w-5 h-5" /> : 'Verify & Submit'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={sendOtp}
                                    disabled={loading}
                                    className="w-full py-3 text-white bg-[#4BAF47] rounded-lg focus:outline-none hover:bg-[#3a9e3e] transition-colors disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Send OTP'}
                                </button>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            {activeStep > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleStepChange('back')}
                                    className="flex items-center text-[#878680] hover:text-[#4BAF47] transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </button>
                            )}
                            {activeStep < 5 && (
                                <button
                                    type="button"
                                    onClick={() => handleStepChange('next')}
                                    disabled={!validateStep()}
                                    className="flex items-center ml-auto text-[#4BAF47] hover:opacity-80 transition-opacity disabled:opacity-50"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </PublicRoute>
    );
}