'use client';

import AdminNavbar from "@/components/AdminNavbar";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
    // Use Next.js router to get the current pathname
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
            <div className='flex flex-col mt-4 responsive-container'>
                <Menubar className="w-fit">
                    <MenubarMenu>
                        <MenubarTrigger className={`cursor-pointer ${isActive(skillPaths)}`}>Skills</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="cursor-pointer">
                                <Link href="/admin/main-skills" className="cursor-pointer">Main Skills</Link>
                            </MenubarItem>
                            <MenubarItem className="cursor-pointer">
                                <Link href="/admin/other-skills" className="cursor-pointer">Other Skills</Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger className={`cursor-pointer ${isActive(projectPaths)}`}>Projects</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="cursor-pointer">
                                <Link href="/admin/project-cards" className="cursor-pointer">Project Cards</Link>
                            </MenubarItem>
                            <MenubarItem className="cursor-pointer">
                                <Link href="/admin/tech-badges" className="cursor-pointer">Tech Badges</Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger className={`cursor-pointer ${isActive(resumePaths)}`}>Resume</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="cursor-pointer">
                                <Link href="/admin/education" className="cursor-pointer">Education</Link>
                            </MenubarItem>
                            <MenubarItem className="cursor-pointer">
                                <Link href="/admin/work-experience" className="cursor-pointer">Work Experience</Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                <div className="w-full h-[calc(100dvh-32px-36px-16px-72px-16px)] bg-my-background-200 border border-border rounded-md mt-2 p-6">
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout;

