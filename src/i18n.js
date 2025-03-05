import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation JSON files
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import mr from "./locales/mr.json";
import bn from "./locales/bn.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        hi: { translation: hi },
        mr: { translation: mr },
        bn: { translation: bn },
    },
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: { escapeValue: false },
});

export default i18n;
