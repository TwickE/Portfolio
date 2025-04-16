'use client';

import AdminNavbar from "@/components/AdminNavbar";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger, } from "@/components/ui/menubar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome } from "react-icons/fa";

const Layout = ({ children }: { children: React.ReactNode }) => {
    // Use Next.js router to get the current pathname
    const pathname = usePathname();

    // Define path groups to determine which MenubarTrigger should be active
    const homePath = ['/admin'];
    const skillPaths = ['/admin/main-skills', '/admin/other-skills'];
    const projectPaths = ['/admin/project-cards', '/admin/tech-badges'];
    const resumePaths = ['/admin/education', '/admin/work-experience'];
    const cvFilePath = ['/admin/cv-file'];

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
                        <Link href="/admin" className="h-full cursor-pointer">
                            <MenubarTrigger className={`cursor-pointer h-full ${isActive(homePath)}`}><FaHome /></MenubarTrigger>
                        </Link>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger className={`cursor-pointer ${isActive(skillPaths)}`}>Skills</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <Link href="/admin/main-skills" className="w-full cursor-pointer">Main Skills</Link>
                            </MenubarItem>
                            <MenubarItem>
                                <Link href="/admin/other-skills" className="w-full cursor-pointer">Other Skills</Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger className={`cursor-pointer ${isActive(projectPaths)}`}>Projects</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <Link href="/admin/project-cards" className="w-full cursor-pointer">Project Cards</Link>
                            </MenubarItem>
                            <MenubarItem>
                                <Link href="/admin/tech-badges" className="w-full cursor-pointer">Tech Badges</Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger className={`cursor-pointer ${isActive(resumePaths)}`}>Resume</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <Link href="/admin/education" className="w-full cursor-pointer">Education</Link>
                            </MenubarItem>
                            <MenubarItem>
                                <Link href="/admin/work-experience" className="w-full cursor-pointer">Work Experience</Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <Link href="/admin/cv-file" className="w-full cursor-pointer">
                            <MenubarTrigger className={`cursor-pointer ${isActive(cvFilePath)}`}>CV File</MenubarTrigger>
                        </Link>
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

