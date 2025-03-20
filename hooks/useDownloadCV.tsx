"use client";

import { useCallback, useEffect, useState } from 'react';

const useDownloadCV = () => {
    // Add state to track feature support
    const [supportsFileSystem, setSupportsFileSystem] = useState(false);

    // Check for API support when component mounts
    useEffect(() => {
        setSupportsFileSystem('showSaveFilePicker' in window);
    }, []);

    const downloadCV = useCallback(async () => {
        try {
            if (supportsFileSystem) {
                const options = {
                    suggestedName: 'CV_Frederico_Silva.pdf',
                    types: [
                        {
                            description: 'PDF Files',
                            accept: {
                                'application/pdf': ['.pdf'],
                            },
                        },
                    ],
                };

                // Use type assertion
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const handle = await (window as any).showSaveFilePicker(options);
                const writable = await handle.createWritable();
                const CV = '/CV.pdf';
                const response = await fetch(CV);
                const blob = await response.blob();
                await writable.write(blob);
                await writable.close();
            } else {
                // Fallback for browsers that don't support the API
                const link = document.createElement('a');
                link.href = '/CV.pdf';
                link.download = 'CV_Frederico_Silva.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error saving file:', error);
        }
    }, [supportsFileSystem]);

    return downloadCV;
}

export default useDownloadCV