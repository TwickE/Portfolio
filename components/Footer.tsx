import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='w-full flex flex-col items-center gap-9 py-12 text-white bg-my-primary dark:bg-my-secondary'>
            <Link href='/'>
                <Image
                    src="/icons/logoDark.svg"
                    width={60}
                    height={60}
                    alt="Logo"
                />
            </Link>
            <div className='flex items-center gap-9 font-bold max-lg:flex-col max-lg:gap-4'>
                <Link href='/'>Home</Link>
                <Link href='/about'>About</Link>
                <Link href='/projects'>Projects</Link>
                <Link href='/contact'>Contact</Link>
                <Link href='/admin'>Admin</Link>
            </div>
            <div className='flex flex-col items-center gap-3 text-base text-center mt-4'>
                <Image
                    src="/nextjs.svg"
                    width={30}
                    height={30}
                    alt='Next.js Logo'
                />
                <p>Made with Next.js</p>
                <p>{`© ${currentYear} All rights reserved by Frederico Silva`}</p>
            </div>

        </footer>
    )
}

export default Footer