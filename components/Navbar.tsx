import Link from 'next/link'

const Navbar = () => {
  return (
    <header className='flex items-center gap-5 text-xl underline font-bold p-5 m-auto w-fit h-25 text-white'>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/contact">Contact</Link>
    </header>
  )
}

export default Navbar