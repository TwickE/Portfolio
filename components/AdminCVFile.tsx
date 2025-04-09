"use client";

import { Button } from "@/components/ui/button";
import { FaCloud, FaEye } from "react-icons/fa";
import { getCVFile } from "@/lib/actions/file.actions";
import { useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

const AdminCVFile = () => {
    const [file, setFile] = useState<File[]>([]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setFile(acceptedFiles);

        const uploadPromises = acceptedFiles.map(async (file) => {
            setFile((prevFiles) => {
                return prevFiles.filter((f) => f.name !== file.name);
            });
            /* return uploadFile({ file, ownerId, accountId, path }).then((uploadedFile) => {
                if (uploadedFile) {
                    setFiles((prevFiles) => {
                        return prevFiles.filter((f) => f.name !== file.name);
                    });
                }
            }); */
        });
        await Promise.all(uploadPromises);
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const fetchCVFile = useCallback(async () => {
        try {
            const file = await getCVFile();
            if (file) {
                // Open the file in a new window/tab
                window.open(file.fileURL, '_blank');
            }
        } catch (error) {
            console.error("Failed to fetch file:", error);
            //toast.error("Failed to fetch skills");
        }
    }, []);

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
                    <p className="text-base text-center max-w-80 mt-4">Drag and drop the CV file here, or click the button to upload a file</p>
                </div>
            </div>
        </section>
    )
}

export default AdminCVFile