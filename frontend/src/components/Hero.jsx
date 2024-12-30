import React from "react";

export default function Hero() {

return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 flex flex-col lg: row items-center">
            <div className="lg:w-1/2 lg:pr-12">
                <p className="text-sm font-medium mb-4">Nutrition Tracking App</p>
                <h1 className="text-5xl font-bold mb-6">
                    Reach your health goals
                    <span className="block text-4xl mt-2">with Nutriva</span>
                </h1>
                <p className="text-xl mb-8">Your personal nutrition tracking app powered by AI</p>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold">
                    Get Started
                </button>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0">
                <img src="{PhoneImage}" alt="Nutriva App" className="w-full max-w-md mx-auto" />
            </div>
        </div>
    </div>







)



























}