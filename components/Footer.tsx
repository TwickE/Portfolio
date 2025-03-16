import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='flex flex-col items-center gap-3'>
        Footer
        <Link href='/admin' className="p-3 bg-primary">Admin</Link>
    </footer>
  )
}

export default Footer