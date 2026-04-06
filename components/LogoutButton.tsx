"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

export default function LogoutButton() {

    const router = useRouter();

    const handleLogout = async () => {

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
                {},
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            // Clear token from localStorage
            localStorage.removeItem("token");
            // Redirect to login
            router.replace("/login");
        }

    };

    return (

        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
        >
            Logout
        </button>

    );

}