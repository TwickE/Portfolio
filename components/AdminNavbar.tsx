"use client";

import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaGlobe } from "react-icons/fa";
import { logOutAdmin } from "@/lib/actions/login.actions";
import { Button } from './ui/button';

const AdminNavbar = () => {
    return (
        <header className='flex items-center justify-between h-18 bg-my-secondary text-white sticky top-0 z-50'>
            <div className='flex items-center justify-between responsive-container'>
                <Link href='/admin' className='flex items-center gap-5 no-underline max-4xl:gap-2'>
                    <Image
                        src="/logoDark.svg"
                        width={60}
                        height={60}
                        alt="Logo Dark"
                    />
                    <p className='max-xl:hidden'>Admin Panel</p>
                </Link>
                <nav className='flex items-center gap-3'>
                    <Link href='/'>
                        <Button variant="primary">
                            <FaGlobe size={16} />
                            Go to Portfolio
                        </Button>
                    </Link>
                    <Button variant="primary" onClick={logOutAdmin}>
                        <FaArrowRightFromBracket size={16} />
                        Log Out
                    </Button>
                </nav>
            </div>
        </header>
    )
}

export default AdminNavbar