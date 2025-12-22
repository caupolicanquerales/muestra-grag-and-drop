export function triggerDownloadTheFile(textToCopy:string, typeExt: string | undefined, extension: string): void {
    const blob = new Blob([textToCopy], { type: `${typeExt};charset=utf-8` });
    const filename = setFileName(extension);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; 
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

function setFileName(extension:string): string{
    const timestamp = new Date().toISOString().slice(0, 10);
    return `ai_response_${timestamp}${extension}`;
}

export function getMapTypeFormatDownloadFile(): Map<string,string> {
    let formarMap: Map<string,string>= new Map<string,string>();
    formarMap.set('.md','text/markdown');
    formarMap.set('.json','application/json');
    formarMap.set('.txt','text/plain');
    return formarMap;
}