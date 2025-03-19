"use client";

const usePickImage = () => {
    const pickImage = async () => {
        try {
            const options = {
                types: [
                    {
                        description: 'Images',
                        accept: {
                            'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp', '.svg'],
                        },
                    },
                ],
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [fileHandle] = await (window as any).showOpenFilePicker(options);
            const file = await fileHandle.getFile();
            const fileURL = URL.createObjectURL(file);
            return {file, fileURL};
        } catch {
            return undefined;
        }
    }

    return pickImage;
}

export default usePickImage