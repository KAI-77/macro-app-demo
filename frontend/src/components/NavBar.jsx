import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto sm:px-6 lg: px-8">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-blue-600 text-2xl font-bold">
                            AI Powered- Nutriva
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <button className="bg-blue-500 text-white px-6 py-2 rounded-full">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )

























}