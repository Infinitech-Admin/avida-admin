"use client";

import NavbarAvatar from "@/app/components/navbar-avatar";
import React from "react";
import { LuBell, LuLogOut, LuUser } from "react-icons/lu";

const Navbar = () => {
    return (
        <header className="flex items-center justify-end w-full p-4 sm:p-6 bg-white lg:shadow-md">
            <nav className="flex items-center gap-5">
                {/* Profile Dropdown */}
                <div className="relative inline-flex">
                    <button
                        id="profile-dropdown"
                        type="button"
                        className="focus:outline-none"
                        aria-haspopup="menu"
                        aria-expanded="false"
                        aria-label="Dropdown"
                    >
                        <NavbarAvatar />
                    </button>
                    {/* Dropdown Menu */}
                    <div
                        className="hs-dropdown-menu transition-opacity duration-150 opacity-0 hidden min-w-[240px] bg-white shadow-md rounded-lg mt-2 divide-y divide-gray-200"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="profile-dropdown"
                    >
                        <div className="p-1 space-y-0.5">
                            <span className="block pt-2 pb-1 px-3 text-xs font-medium uppercase text-gray-400">
                                Settings
                            </span>
                            <a
                                className="flex items-center gap-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
                                href="#"
                            >
                                <LuUser className="h-4 w-4" />
                                Edit Profile
                            </a>
                            <a
                                className="flex items-center gap-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
                                href="#"
                            >
                                <LuBell className="h-4 w-4" />
                                Notification
                            </a>
                        </div>
                        <div className="p-1 space-y-0.5">
                            <a
                                className="flex items-center gap-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
                                href="#"
                            >
                                <LuLogOut className="h-4 w-4" />
                                Log Out
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;