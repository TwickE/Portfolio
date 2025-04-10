"use client";

import { Button } from "@/components/ui/button";
import { FaCloud, FaEye } from "react-icons/fa";
import { getCVFile, updateCVFile } from "@/lib/actions/cvFile.actions";
import { useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { toast } from "sonner";

const AdminCVFile = () => {
    const fetchCVFile = useCallback(async () => {
        try {
            const file = await getCVFile();
            if (file) {
                window.open(file.fileURL, '_blank');
            }
        } catch {
            toast.error("Failed to get CV file");
        }
    }, []);

    const onDrop = useCallback(async (acceptedFile: File[]) => {
        if (acceptedFile.length > 0) {
            try {
                await updateCVFile(acceptedFile[0]);
                toast.success("CV updated successfully");
            } catch {
                toast.error("Failed to update CV file");
            }
           
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1,
        multiple: false,
        onDropRejected: () => {
            toast.error("Only one file can be uploaded");
        }
    });

    return (
        <section className="h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl w-fit">CV File</h2>
                <Button variant="primary" onClick={fetchCVFile}>
                    <FaEye />
                    See CV File
                </Button>
            </div>
            <div className='w-full h-[calc(100%-32px-24px)] grid place-items-center'>

                <div {...getRootProps()} className="flex flex-col items-center justify-center w-full h-full bg-my-primary/10 border-dashed border-2 border-my-primary rounded-md">
                    <input {...getInputProps()} />
                    <Button variant="primary">
                        <FaCloud />
                        Upload CV          
                    </Button>
                    <p className="text-base text-center max-w-80 mt-4 px-4">Drag and drop the CV file here, or click the button to upload a file</p>
                </div>
            </div>
        </section>
    )
}

export default AdminCVFile