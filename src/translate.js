import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const API_KEY = "AIzaSyDjp5MG8hsEUaTM8nwiT0G1rb_60T_1FgI"; // Replace with your actual Google API key
const languages = ["hi", "mr", "bn"]; // Hindi, Marathi, Bengali

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to locales folder
const localesPath = path.join(__dirname, "../locales");

// Read English JSON file
const enTranslations = JSON.parse(await fs.readFile(path.join(localesPath, "en.json"), "utf-8"));

const translateText = async (text, targetLang) => {
    try {
        const response = await axios.post(
            `https://translation.googleapis.com/language/translate/v2`,
            null,
            {
                params: {
                    q: text,
                    target: targetLang,
                    source: "en",
                    key: API_KEY,
                },
            }
        );
        return response.data.data.translations[0].translatedText;
    } catch (error) {
        console.error(`Translation Error for "${text}" in ${targetLang}:`, error);
        return text;
    }
};

const generateTranslations = async () => {
    for (let lang of languages) {
        let translatedData = {};
        for (let key in enTranslations) {
            translatedData[key] = await translateText(enTranslations[key], lang);
        }

        // Write translated JSON files
        await fs.writeFile(
            path.join(localesPath, `${lang}.json`),
            JSON.stringify(translatedData, null, 2),
            "utf-8"
        );
        console.log(`✅ Translations saved for ${lang}`);
    }
};

generateTranslations();
