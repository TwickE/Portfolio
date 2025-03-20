"use client";

import { toast } from "sonner";

const usePickImage = () => {
    const acceptedTypes = ['.png', '.gif', '.jpeg', '.jpg', '.webp', '.svg'];

    const pickImage = async () => {
        try {
            const options = {
                types: [
                    {
                        description: 'Images',
                        accept: {
                            'image/*': acceptedTypes,
                        },
                    },
                ],
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [fileHandle] = await (window as any).showOpenFilePicker(options);
            const file = await fileHandle.getFile();
            
            // Validate the file type after selection
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            if (!acceptedTypes.includes(fileExtension)) {
                throw new Error(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`);
            }
            
            const fileURL = URL.createObjectURL(file);
            return {file, fileURL};
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`);
            }
            return undefined;
        }
    }

    return pickImage;
}

export default usePickImage;