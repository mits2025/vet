import ApplicationLogo from '@/Components/App/ApplicationLogo';
import Dropdown from '@/Components/Core/Dropdown';
import NavLink from '@/Components/Core/NavLink';
import ResponsiveNavLink from '@/Components/Core/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import Navbar from "@/Components/App/Navbar";

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="main-container">
            <Navbar/>

            {header && (
                <header className="header">
                    <div className="header-content">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>

    );
}
