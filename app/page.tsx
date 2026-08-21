"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                headers: {
                    Authorization: token,
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if(data.success){
                        router.replace("/dashboard");
                    }
                    else{
                        alert("Session expired. Please log in again.");
                        router.replace("/login");
                        localStorage.removeItem('token')
                    }
                })
                .catch(err => {
                    router.replace("/login");
                    localStorage.removeItem('token')
                })


        } else {
            // User is not authenticated, redirect to login
            router.replace("/login");
            localStorage.removeItem('token')

        }
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
}
