"use client"; // ✅ Required for Next.js client-side event handling
import { useRouter } from "next/navigation";
import { Account } from "appwrite";
import { useEffect, useState } from "react";

const LogoutButton = () => {
    const router = useRouter();
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const initAccount = async () => {
            const appwriteAccount = new Account(
                new (await import("appwrite")).Client()
                    .setEndpoint("https://cloud.appwrite.io/v1") // Change if using self-hosted
                    .setProject("679e4ef1002c91e8b897")
            );
            setAccount(appwriteAccount);
        };
        initAccount();
    }, []);

    const handleLogout = async () => {
        if (!account) return;
        try {
            await account.deleteSession("current"); // 🔹 Log out the current session
            sessionStorage.removeItem("userId");
            sessionStorage.removeItem("otpExpiry"); // 🔹 Clear stored session data
            router.push("/login"); // 🔹 Redirect to login page
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
