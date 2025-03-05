"use client";
import React, { createContext, useContext, useState } from "react";

// Create the context
const LanguageContext = createContext();

// Custom hook to access language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");  // default to English

    const changeLanguage = (newLang) => {
        setLanguage(newLang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
