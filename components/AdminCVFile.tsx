"use client";

import { Button } from "@/components/ui/button";
import { FaCloud, FaEye } from "react-icons/fa";
import { getCVFile, updateCVFile } from "@/lib/actions/cvFile.actions";
import { useDropzone } from 'react-dropzone';
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AdminCVFile = () => {
    // Mutation for viewing the CV file
    const viewCVMutation = useMutation({
        mutationFn: getCVFile,
        onSuccess: (file) => {
            if (file?.fileURL) {
                window.open(file.fileURL, '_blank');
            } else {
                toast.error("No file found");
            }
        },
        onError: () => {
            toast.error("Failed to get CV file");
        }
    });

    // Mutation for uploading a new CV file
    const uploadCVMutation = useMutation({
        mutationFn: async (file: File) => {
            await updateCVFile(file);
        },
        onSuccess: () => {
            toast.success("CV updated successfully");
        },
        onError: () => {
            toast.error("Failed to update CV file");
        }
    });

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                uploadCVMutation.mutate(acceptedFiles[0]);
            }
        },
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
                <Button variant="primary" onClick={() => viewCVMutation.mutate()} disabled={viewCVMutation.isPending}>
                    {viewCVMutation.isPending ? (
                        <AiOutlineLoading3Quarters className="animate-spin" />
                    ) : (
                        <FaEye />
                    )}
                    See CV File
                </Button>
            </div>
            <div className='w-full h-[calc(100%-32px-24px)] grid place-items-center'>
                <div {...getRootProps()} className="flex flex-col items-center justify-center w-full h-full bg-my-primary/10 border-dashed border-2 border-my-primary rounded-md">
                    <input {...getInputProps()} />
                    <Button variant="primary" disabled={uploadCVMutation.isPending}>
                        {uploadCVMutation.isPending ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            <FaCloud />
                        )}
                        Upload CV
                    </Button>
                    <p className="text-base text-center max-w-80 mt-4 px-4">
                        Drag and drop the CV file here, or click the button to upload a file
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AdminCVFile;