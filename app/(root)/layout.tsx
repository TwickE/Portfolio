import Footer from "@/components/Footer";
import GoUpButton from "@/components/GoUpButton";
import Navbar from "@/components/Navbar";


const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            {children}
            <GoUpButton />
            <Footer />
        </>
    )
};

export default Layout;