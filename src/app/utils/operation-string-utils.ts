
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
    const tempDiv = document.createElement('div');
    let processedHtml = htmlString
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<\/h[1-6]>/gi, '\n\n');
    tempDiv.innerHTML = processedHtml;
    let cleanText = tempDiv.textContent || tempDiv.innerText || '';
    cleanText = cleanText.replace(/\n\s*\n/g, '\n\n').trim();
    return cleanText;
}