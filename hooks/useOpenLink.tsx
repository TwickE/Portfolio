const useOpenLink = (url:string) => {
    // Open links in a new tab
    const openLink = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return openLink
}

export default useOpenLink