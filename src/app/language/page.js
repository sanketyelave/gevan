// "use client";
// import { useState } from "react";
// import { useLanguage } from "../../context/languageContext";
// import { translateText } from "../../utils/translate";
// import { Client, Databases, ID } from "appwrite";

// const client = new Client();
// client.setEndpoint("https://cloud.appwrite.io/v1").setProject("679e4ef1002c91e8b897");
// const databases = new Databases(client, "679e5e0c001780bf0b57");

// export default function UserForm() {
//     const { language, changeLanguage } = useLanguage();
//     const [address, setAddress] = useState("");
//     const [translatedAddress, setTranslatedAddress] = useState("");

//     const handleTranslate = async () => {
//         changeLanguage(language);
//         const targetLangCode = language === "Hindi" ? "hi" :
//             language === "Marathi" ? "mr" :
//                 language === "Bengali" ? "bn" : "en";

//         const translated = await translateText(address, targetLangCode);
//         setTranslatedAddress(translated);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {

//             await databases.createDocument(
//                 "679e5e0c001780bf0b57",
//                 "67a339d8001736df7537",
//                 ID.unique(), // or a custom ID
//                 {
//                     language,
//                     address: address,
//                 }
//             );;
//             alert("Details saved successfully!");
//         } catch (error) {
//             console.error("Error saving details:", error);
//         }
//     };

//     return (
//         <div className="p-4 max-w-md mx-auto">
//             <h2 className="text-xl font-semibold mb-2">Enter Your Details</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label className="block font-medium">Preferred Language:</label>
//                     <select
//                         className="w-full p-2 border rounded"
//                         value={language}
//                         onChange={(e) => changeLanguage(e.target.value)}
//                         required
//                     >
//                         <option value="English">English</option>
//                         <option value="Hindi">Hindi</option>
//                         <option value="Marathi">Marathi</option>
//                         <option value="Bengali">Bengali</option>
//                     </select>
//                 </div>

//                 <div>
//                     <label className="block font-medium">Address:</label>
//                     <input
//                         type="text"
//                         className="w-full p-2 border rounded"
//                         placeholder="Enter your address"
//                         value={address}
//                         onChange={(e) => setAddress(e.target.value)}
//                         required
//                     />
//                 </div>

//                 <button type="button" onClick={handleTranslate} className="bg-blue-500 text-white p-2 rounded w-full">
//                     Translate Address
//                 </button>

//                 {translatedAddress && (
//                     <div className="p-2 mt-2 border rounded bg-gray-100">
//                         <strong>Translated Address:</strong> {translatedAddress}
//                     </div>
//                 )}

//                 <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
//                     Save Details
//                 </button>
//             </form>
//         </div>
//     );
// }
import React from 'react';

function page() {
    return (
        <div>
            Hii
        </div>
    );
}

export default page;
