import { Button } from "@/components/ui/button";
import { FaCloudUploadAlt, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getTechBadges } from "@/lib/actions/file.actions";
import { TechBadgeType } from "@/types/interfaces";
import Image from "next/image";
import { AdminInput } from "@/components/AdminSmallComponents";

const AdminTechBadges = () => {
    const [techBadgesData, setTechBadgesData] = useState<Record<string, TechBadgeType>>({});

    useEffect(() => {
        const fetchTechBadges = async () => {
            try {
                const techBadges = await getTechBadges();

                if (techBadges) {
                    setTechBadgesData(
                        techBadges.reduce((acc, techBadge) => {
                            acc[techBadge.$id] = techBadge;
                            return acc;
                        }, {} as Record<string, TechBadgeType>)
                    );
                }
            } catch (error) {
                console.error("Failed to fetch tech badges:", error);
            }
        };
        fetchTechBadges();
    }, []);

    const handleAddNewTechBadge = () => {

    }

    return (
        <section className="mt-12">
            <div className="flex items-start justify-between">
                <h2 className="text-3xl font-bold text-gradient w-fit mb-4">Tech Badges</h2>
                <Button onClick={handleAddNewTechBadge}>
                    <FaPlus />
                    Add Tech Badge
                </Button>
            </div>
            <div className="max-h-[500px] overflow-y-auto p-3 pb-1 rounded-md bg-light-mode-200 dark:bg-dark-mode-200">
                {Object.values(techBadgesData).map((techBadge, index) => (
                    <div key={index} className="p-3 flex items-center gap-4 rounded-md mb-2 bg-tertiary-light dark:bg-tertiary-dark">
                        <div className="grid place-content-center rounded-xl bg-light-mode-100 dark:bg-dark-mode-100 w-[76px] h-[76px]">
                            <Image
                                src={techBadge.icon || "/images/noImage.webp"}
                                width={60}
                                height={60}
                                alt="Skill Icon"
                                className="object-contain object-center max-w-[60px] max-h-[60px]"
                            />
                        </div>
                        <Button onClick={() => console.log('Upload Icon')}>
                            <FaCloudUploadAlt size={16} />
                            Upload Icon
                        </Button>
                        <AdminInput
                            icon="text"
                            inputValue={techBadge.techBadgeName}
                        /* onChange={(value) => handleSkillInputChange(skill.$id, 'skillName', value)} */
                        />
                        <div className="flex items-center gap-4 ml-auto">
                            <Button variant="save" /* onClick={} disabled={} */>
                                {/* {isSaving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />} */}
                                <FaSave />
                                Save Changes
                            </Button>
                            <Button
                                variant="destructive"
                                className="ml-auto max-4xl:mx-auto"
                            /* onClick={() => handleDeleteSkill(skill.$id, skill.bucketFileId, skill.newSkill)} */
                            >
                                <FaTrash />
                                Delete Tech Badge
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default AdminTechBadges