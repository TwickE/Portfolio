import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaGlobe } from "react-icons/fa";
import { logOutAdmin } from "@/lib/actions/admin.actions";

const AdminNavbar = () => {
    return (
        <header className='flex items-center justify-between p-5 bg-secondary sticky top-0 z-50'>
            <div className='flex items-center justify-between w-[1320px] m-auto'>
                <Link href='/admin' className='flex items-center gap-5 no-underline max-4xl:gap-2'>
                    <Image
                        src="/assets/icons/logoLight.svg"
                        width={60}
                        height={60}
                        alt="Logo Light"
                        className="block dark:hidden"
                    />
                    <Image
                        src="/assets/icons/logoDark.svg"
                        width={60}
                        height={60}
                        alt="Logo dark"
                        className="hidden dark:block"
                    />
                    <p className='max-xl:hidden'>Admin Panel</p>
                </Link>
                <nav className='flex gap-3'>
                    <Link href='/' className="flex items-center gap-2 p-3 bg-primary rounded-xl cursor-pointer">
                        <FaGlobe size={20} />
                        Go to Portfolio
                    </Link>
                    <form action={async () => {
                        "use server";

                        await logOutAdmin();
                    }}>
                        <button type='submit' className="flex items-center gap-2 p-3 bg-primary rounded-xl cursor-pointer">
                            <FaArrowRightFromBracket size={20} />
                            Log Out
                        </button>
                    </form>
                </nav>

            </div>
        </header>
    )
}

export default AdminNavbar