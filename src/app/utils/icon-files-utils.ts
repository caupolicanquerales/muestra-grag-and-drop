export function getMapForIconFiles(): Map<string,string> {
    let iconsMap: Map<string,string>= new Map<string,string>();
    iconsMap.set('.pdf','pi pi-file-pdf');
    iconsMap.set('.doc','pi pi-file-word');
    iconsMap.set('.docx','pi pi-file-word');
    iconsMap.set('.xls','pi pi-file-excel');
    iconsMap.set('.xlsx','pi pi-file-excel');
    iconsMap.set('.ppt','pi pi-file-powerpoint');
    iconsMap.set('.pptx','pi pi-file-powerpoint');
    iconsMap.set('.jpg','pi pi-image');
    iconsMap.set('.jpeg','pi pi-image');
    iconsMap.set('.png','pi pi-image');
    iconsMap.set('.gif','pi pi-image');
    iconsMap.set('.txt','pi pi-file');
    iconsMap.set('.html','pi pi-file');
    iconsMap.set('.css','pi pi-file');
    iconsMap.set('.scss','pi pi-file');
    iconsMap.set('','pi pi-file'); 
    return iconsMap;
}