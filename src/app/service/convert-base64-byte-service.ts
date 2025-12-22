import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertBase64ByteService {
  
  base64ToBlob(rawBase64: string, mimeType: string): Blob {
    const byteCharacters = atob(rawBase64);
    const _sliceSize = 512;
    const byteArrays: Uint8Array[] = [];
    for (let offset = 0; offset < byteCharacters.length; offset += _sliceSize) {
        const slice = byteCharacters.slice(offset, offset + _sliceSize);
        const byteNumbers = Array.from(slice, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays as BlobPart[], { type: mimeType });
  }
}
