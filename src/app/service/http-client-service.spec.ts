import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HttpClientService } from './http-client-service';

describe('HttpClientService', () => {
  let service: HttpClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(HttpClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updatePromptForGenerationData POSTs to generation/prompt', () => {
    service.updatePromptForGenerationData({} as any).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/generation/prompt');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('getPromptGenerationSystem GETs from mongo/all-system-prompt', () => {
    service.getPromptGenerationSystem().subscribe();
    const req = httpMock.expectOne('http://localhost:8083/mongo/all-system-prompt');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('deletePromptBillById DELETEs with body', () => {
    const body = { id: 1 } as any;
    service.deletePromptBillById(body).subscribe();
    const req = httpMock.expectOne('http://localhost:8083/mongo/delete-bill-prompt');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it('getTemplates GETs from assets path', () => {
    service.getTemplates().subscribe();
    const req = httpMock.expectOne('assets/configMenu/templates.json');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getMenuConfigFromRepository GETs remote menu.json', () => {
    service.getMenuConfigFromRepository().subscribe();
    const req = httpMock.expectOne('https://raw.githubusercontent.com/caupolicanquerales/billFactoryConfig/main/configMenu/menu.json');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getBasicTemplateByIdInMongo POSTs with payload', () => {
    const payload = { id: 'abc' } as any;
    service.getBasicTemplateByIdInMongo(payload).subscribe();
    const req = httpMock.expectOne('http://localhost:8083/mongo/get-basic-template');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('updatePromptForGenerationImage POSTs to image/prompt', () => {
    service.updatePromptForGenerationImage({} as any).subscribe();
    const req = httpMock.expectOne('http://localhost:8081/image/prompt');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('setPromptForGenerationImage POSTs to image/set-prompt', () => {
    service.setPromptForGenerationImage({} as any).subscribe();
    const req = httpMock.expectOne('http://localhost:8081/image/set-prompt');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('sendingFileForGenerationData POSTs to generation/sending-files', () => {
    service.sendingFileForGenerationData(new FormData()).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/generation/sending-files');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('getPromptGenerationImage GETs all-image-prompt', () => {
    service.getPromptGenerationImage().subscribe();
    const req = httpMock.expectOne('http://localhost:8083/mongo/all-image-prompt');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('savePromptGenerationImage POSTs to save-image-prompt', () => {
    service.savePromptGenerationImage({} as any).subscribe();
    const req = httpMock.expectOne('http://localhost:8083/mongo/save-image-prompt');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('deletePromptImageById DELETEs with body', () => {
    const body = { id: 2 } as any;
    service.deletePromptImageById(body).subscribe();
    const req = httpMock.expectOne('http://localhost:8083/mongo/delete-image-prompt');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it('repository endpoints GET as expected', () => {
    service.getPromptExtractionFromRepository().subscribe();
    const r1 = httpMock.expectOne('https://raw.githubusercontent.com/caupolicanquerales/bill-factory-prompts/main/prompts/prompt-extract-info.json');
    expect(r1.request.method).toBe('GET');
    r1.flush({});

    service.getPromptsFromRepository().subscribe();
    const r2 = httpMock.expectOne('https://raw.githubusercontent.com/caupolicanquerales/bill-factory-prompts/main/prompts/prompts.json');
    expect(r2.request.method).toBe('GET');
    r2.flush({});

    service.getPromptsImagesFromRepository().subscribe();
    const r3 = httpMock.expectOne('https://raw.githubusercontent.com/caupolicanquerales/bill-factory-prompts/main/prompts/prompts-imagenes.json');
    expect(r3.request.method).toBe('GET');
    r3.flush({});
  });

  it('covers remaining POST/GET endpoints and deletes', () => {
    // POST basic-template prompt
    service.updatePromptForBasicTemplate({} as any).subscribe();
    let req = httpMock.expectOne('http://localhost:8081/basic-template/prompt');
    expect(req.request.method).toBe('POST');
    req.flush({});

    // POST basic-template files
    service.sendingFileForBasicTemplate(new FormData()).subscribe();
    req = httpMock.expectOne('http://localhost:8081/basic-template/sending-files');
    expect(req.request.method).toBe('POST');
    req.flush({});

    // POST qdrant save-file
    service.saveFileForGenerationData(new FormData()).subscribe();
    req = httpMock.expectOne('http://localhost:8080/qdrant/save-file');
    expect(req.request.method).toBe('POST');
    req.flush({});

    // Redis image save/get
    service.saveImageInRedis(new FormData()).subscribe();
    req = httpMock.expectOne('http://localhost:8082/redis/save-image');
    expect(req.request.method).toBe('POST');
    req.flush({});

    service.getImageInRedis({} as any).subscribe();
    req = httpMock.expectOne('http://localhost:8082/redis/get-image');
    expect(req.request.method).toBe('POST');
    req.flush({});

    // GET mongo collections
    service.getPromptGenerationBill().subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/all-bill-prompt');
    expect(req.request.method).toBe('GET');
    req.flush({});

    service.getPromptGenerationData().subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/all-data-prompt');
    expect(req.request.method).toBe('GET');
    req.flush({});

    service.getSyntheticDataGeneration().subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/all-synthetic-data');
    expect(req.request.method).toBe('GET');
    req.flush({});

    service.getPublicitycDataGeneration().subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/all-publicity-data');
    expect(req.request.method).toBe('GET');
    req.flush({});

    service.getGlobalDefects().subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/all-global-defect');
    expect(req.request.method).toBe('GET');
    req.flush({});

    service.getBasicTemplateGeneration().subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/all-basic-template');
    expect(req.request.method).toBe('GET');
    req.flush({});

    // POST mongo saves
    service.savePromptGenerationBill({} as any).subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/save-bill-prompt');
    expect(req.request.method).toBe('POST');
    req.flush({});

    service.savePromptGenerationData({} as any).subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/save-data-prompt');
    expect(req.request.method).toBe('POST');
    req.flush({});

    service.savePromptGenerationSystem({} as any).subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/save-system-prompt');
    expect(req.request.method).toBe('POST');
    req.flush({});

    service.saveSynteticDataGeneration({} as any).subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/save-synthetic-data');
    expect(req.request.method).toBe('POST');
    req.flush({});

    service.savePublicityDataGeneration({} as any).subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/save-publicity-data');
    expect(req.request.method).toBe('POST');
    req.flush({});

    service.saveBasicTemplate({} as any).subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/save-basic-template');
    expect(req.request.method).toBe('POST');
    req.flush({});

    service.savePromptGlobalDefect({} as any).subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/save-global-defect-prompt');
    expect(req.request.method).toBe('POST');
    req.flush({});

    service.getPromptGlobalDefect().subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/all-global-defect-prompt');
    expect(req.request.method).toBe('GET');
    req.flush({});

    // DELETEs with body
    const d1 = { id: 'd1' } as any;
    service.deletePromptDataById(d1).subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/delete-data-prompt');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(d1);
    req.flush({});

    const d2 = { id: 'd2' } as any;
    service.deleteSyntheticDataById(d2).subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/delete-synthetic-data');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(d2);
    req.flush({});

    const d3 = { id: 'd3' } as any;
    service.deletePublicityDataById(d3).subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/delete-publicity-data');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(d3);
    req.flush({});

    const d4 = { id: 'd4' } as any;
    service.deleteBasicTemplateById(d4).subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/delete-basic-template');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(d4);
    req.flush({});

    const d5 = { id: 'd5' } as any;
    service.deletePromptSystemById(d5).subscribe();
    req = httpMock.expectOne('http://localhost:8083/mongo/delete-system-prompt');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(d5);
    req.flush({});
  });

  afterEach(() => {
    httpMock.verify();
  });
});
