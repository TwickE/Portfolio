const useOpenLink = () => {
    // Open links in a new tab
    const openLink = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return openLink;
}

export default useOpenLink