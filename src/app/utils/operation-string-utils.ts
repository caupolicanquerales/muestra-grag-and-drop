
export function removeColorContent(htmlString: string, color: string): string {
    let cleanedString = htmlString.replace(/style=".*?"/g, (match) => {
        if (match.includes('margin')) {
            const marginMatch = match.match(/margin:[^;]*;?/);
            return marginMatch ? `style="${marginMatch[0].trim()}"` : '';
        }
        return '';
    });
    const wrappedString = `<br><span style="color: ${color} !important; font-weight: bold;">${cleanedString}</span>`;
    return wrappedString;
}

export function removeTagHtmlToText(htmlString: string): string {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    let processedHtml = htmlString
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<\/h[1-6]>/gi, '\n');

    tempDiv.innerHTML = processedHtml;
    let cleanText = tempDiv.textContent || tempDiv.innerText || '';
    return cleanText.replace(/\n\s*\n/g, '\n').replace(/^\s+|\s+$/g, '');
}