'use client';

import AdminNavbar from "@/components/AdminNavbar";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { useRouter, usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
    // Get the current router and pathname
    const router = useRouter();
    const pathname = usePathname();
    
    // Define path groups to determine which MenubarTrigger should be active
    const skillPaths = ['/admin/main-skills', '/admin/other-skills'];
    const projectPaths = ['/admin/project-cards', '/admin/tech-badges'];
    const resumePaths = ['/admin/education', '/admin/work-experience'];
    
    // Helper function to determine if a MenubarTrigger should be active
    const isActive = (paths: string[]) => {
        return paths.includes(pathname) ? "active-menu-trigger" : "";
    };

    return (
        <>
            <AdminNavbar />
            <div className='flex flex-col mt-12 responsive-container'>
                <Menubar className="w-fit">
                    <MenubarMenu>
                        <MenubarTrigger className={`cursor-pointer ${isActive(skillPaths)}`}>Skills</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="cursor-pointer" onClick={() => router.push('/admin/main-skills')}>Main Skills</MenubarItem>
                            <MenubarItem className="cursor-pointer" onClick={() => router.push('/admin/other-skills')}>Other Skills</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger className={`cursor-pointer ${isActive(projectPaths)}`}>Projects</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="cursor-pointer" onClick={() => router.push('/admin/project-cards')}>Project Cards</MenubarItem>
                            <MenubarItem className="cursor-pointer" onClick={() => router.push('/admin/tech-badges')}>Tech Badges</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger className={`cursor-pointer ${isActive(resumePaths)}`}>Resume</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="cursor-pointer">Education</MenubarItem>
                            <MenubarItem className="cursor-pointer">Work Experience</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                <div className="w-full h-[calc(100dvh-32px-36px-48px-100px-48px)] bg-my-background-200 border border-border rounded-md mt-8 p-6">
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout;

