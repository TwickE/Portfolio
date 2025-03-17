import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='flex flex-col items-center gap-3'>
        Footer
        <div className='flex gap-3'>
            <Link href='/admin' className="p-3 bg-primary">Admin</Link>
            <Link href='/login' className="p-3 bg-primary">Login</Link>
        </div>
    </footer>
  )
}

export default Footer