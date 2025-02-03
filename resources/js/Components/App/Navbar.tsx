import React from 'react';
import {Link, usePage} from "@inertiajs/react";
import MiniCartDropdown from "@/Components/App/MiniCartDropdown";

function Navbar() {
    const {auth, totalPrice, totalQuantity}: any = usePage().props;
    const {user} = auth;

    return (
        <div className="navbar bg-base-100 shadow-md md:shadow-lg z-10 relative">

        <div className="flex-1">
                <a href="/" className="btn btn-ghost text-xl">LOOKALE</a>
            </div>
            <div className="form-control flex justify-center items-center w-full">
                <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered w-full max-w-2xl" // Adjust the max-w-2xl for a longer search bar
                />
            </div>
            <div className="flex-none gap-3">

                {user && <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li>
                            <Link href={route('profile.edit')} className="justify-between">
                                Profile
                            </Link>

                        </li>
                        <li>
                            <Link href={route('logout')} method={"post"} as="button">
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div> }
                {!user && <>
                    <Link href={route('login')} className={"login ml-2 inline-flex items-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-800 transition duration-150 ease-in-out hover:bg-gray-300 focus:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-400"}>Login</Link>
                    <Link href={route('register')} className={"register inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-800 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-white dark:focus:bg-white dark:focus:ring-offset-gray-800 dark:active:bg-gray-300 "}>Sign UP</Link>

                </>}
            </div>
            <MiniCartDropdown/>
        </div>

    );
}

export default Navbar;
