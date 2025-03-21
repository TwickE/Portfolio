'use client';

import AdminNavbar from "@/components/AdminNavbar";
import AdminSkillSection from "@/components/AdminSkillSection";
import AdminTechBadges from "@/components/AdminTechBadges";


const Admin = () => {
    return (
        <>
            <AdminNavbar />
            <div className='flex flex-col mt-12 responsive-container'>
                <AdminSkillSection isMainSkill={true} />
                <AdminSkillSection isMainSkill={false} />
                <AdminTechBadges />
            </div>
        </>
    )
}

export default Admin;

