import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import MiniCartDropdown from "@/Components/App/MiniCartDropdown";
import {UserCircleIcon} from "@heroicons/react/24/solid";
import {FaSignInAlt, FaSignOutAlt, FaStore, FaUser, FaUserPlus} from "react-icons/fa";

function Navbar() {
    const { auth }: any = usePage().props;
    const { user } = auth;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Refs for detecting outside clicks
    const mobileMenuRef = useRef<HTMLDivElement | null>(null);
    const searchRef = useRef<HTMLDivElement | null>(null);

    // Close menu/search when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="navbar bg-base-100 shadow-md md:shadow-lg sticky top-0 z-50">
            {/* Left section - Logo */}
            <div className="flex-1">
                <a href="/" className="btn btn-ghost px-2 text-xl md:text-2xl font-bold text-primary">
                    LOOKALE
                </a>
            </div>

            {/* Mobile menu toggle */}
            <div className="flex-none md:hidden">
                <div className="flex items-center gap-1">
                    {/* Mobile search toggle */}
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    {/* Hamburger menu */}
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="btn btn-ghost btn-circle">
                            <UserCircleIcon  className="h-10 w-10 -mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"/>
                    </button>
                </div>
            </div>

            {/* Desktop middle section - Search bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                <div className="form-control w-full">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="input input-bordered w-full bg-base-200 focus:bg-white focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Desktop right section - Navigation items */}
            <div className="hidden md:flex flex-none gap-4 items-center">
                {user ? (
                    <div className="dropdown dropdown-end">
                        {/* Profile Avatar Button */}
                        <div tabIndex={0} role="button" className="avatar placeholder flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-200 transition">
                            <UserCircleIcon className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"/>
                        </div>

                        {/* Dropdown Menu */}
                        <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-lg w-56 mt-4 border border-base-200"
                        >
                            <li>
                                <Link href={route('profile.edit')} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-base-200 transition">
                                    <FaUser className="text-primary" />
                                    <span>Profile</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`${route('profile.edit')}#vendor-request`}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                >
                                    <FaStore className="text-white" />
                                    <span>Become a Vendor</span>
                                </Link>
                            </li>
                            <li>
                                <Link href={route('logout')} method="post" className="flex items-center gap-2 px-4 py-2 rounded-lg text-error hover:bg-red-100 transition">
                                    <FaSignOutAlt className="text-error" />
                                    <span>Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link href={route('login')} className="btn btn-outline px-6 hover:bg-base-200 transition">Login</Link>
                        <Link href={route('register')} className="btn btn-primary px-6 text-white hover:bg-indigo-700 transition">Sign Up</Link>
                    </div>
                )}
            </div>


            {/* Mobile search input */}
            {isSearchOpen && (
                <div ref={searchRef} className="absolute top-full left-0 right-0  p-4 shadow-lg md:hidden">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="input input-bordered w-full bg-base-200"
                    />
                </div>
            )}

            {/* Mobile menu content */}
            {isMobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="absolute top-full left-0 right-0 bg-base-100 shadow-lg md:hidden flex flex-col p-4 gap-2 rounded-b-lg transition-all duration-300"
                >
                    {user ? (
                        <>
                            <Link href={route('profile.edit')} className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-base-200 transition">
                                <FaUser className="text-primary" />
                                <span className="font-medium text-sm">Profile</span>
                            </Link>
                            <Link
                                href={`${route('profile.edit')}#vendor-request`}
                                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                            >
                                <FaStore className="text-white" />
                                <span className="font-medium text-sm">Become a Vendor</span>
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                className="flex items-center gap-2 px-4 py-3 rounded-lg text-error hover:bg-red-100 transition"
                            >
                                <FaSignOutAlt className="text-error" />
                                <span className="font-medium text-sm">Logout</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href={route('login')} className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-base-200 transition">
                                <FaSignInAlt className="text-primary" />
                                <span className="font-medium text-sm">Login</span>
                            </Link>
                            <Link href={route('register')} className="flex items-center gap-2 px-4 py-3 rounded-lg text-primary hover:bg-base-200 transition">
                                <FaUserPlus className="text-primary" />
                                <span className="font-medium text-sm">Sign Up</span>
                            </Link>
                        </>
                    )}
                </div>
            )}

            <MiniCartDropdown/>
        </div>

    );
}

export default Navbar;

