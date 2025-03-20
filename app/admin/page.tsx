'use client';

import AdminNavbar from "@/components/AdminNavbar";
import AdminSkillSection from "@/components/AdminSkillSection";


const Admin = () => {
    return (
        <>
            <AdminNavbar />
            <div className='flex flex-col mt-12 responsive-container'>
                <AdminSkillSection isMainSkill={true} />
                <AdminSkillSection isMainSkill={false} />
            </div>
        </>
    )
}

export default Admin;

