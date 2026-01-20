import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ExecutingRestFulService } from './executing-rest-ful-service';
import { HttpClientService } from './http-client-service';
import { ServiceGeneral } from './service-general';
import { RefreshFlagObservableEnum } from '../enums/refresh-flag-observable';
import { TypePromptEnum } from '../enums/type-prompt-enum';

describe('ExecutingRestFulService', () => {
  let service: ExecutingRestFulService;

  class HttpMock {
    savePromptGenerationBill = jasmine.createSpy().and.returnValue(of({}));
    savePromptGenerationData = jasmine.createSpy().and.returnValue(throwError(() => new Error('e')));
    savePromptGenerationImage = jasmine.createSpy().and.returnValue(of({}));
    savePromptGenerationSystem = jasmine.createSpy().and.returnValue(of({}));
    saveSynteticDataGeneration = jasmine.createSpy().and.returnValue(of({}));
    savePublicityDataGeneration = jasmine.createSpy().and.returnValue(of({}));
    savePromptGlobalDefect = jasmine.createSpy().and.returnValue(of({}));
    saveBasicTemplate = jasmine.createSpy().and.returnValue(of({}));
    deleteBasicTemplateById = jasmine.createSpy().and.returnValue(of({}));
    deletePromptDataById = jasmine.createSpy().and.returnValue(of({}));
    deletePromptBillById = jasmine.createSpy().and.returnValue(of({}));
    deletePromptImageById = jasmine.createSpy().and.returnValue(of({}));
    deleteSyntheticDataById = jasmine.createSpy().and.returnValue(of({}));
    deletePublicityDataById = jasmine.createSpy().and.returnValue(of({}));
    getPromptGenerationBill = jasmine.createSpy().and.returnValue(of({ prompts: [1, 2] }));
    getPromptGenerationSystem = jasmine.createSpy().and.returnValue(of({ prompts: null }));
    getPromptGenerationImage = jasmine.createSpy().and.returnValue(of({ prompts: ['a'] }));
    getSyntheticDataGeneration = jasmine.createSpy().and.returnValue(of({ synthetics: [3] }));
    getBasicTemplateGeneration = jasmine.createSpy().and.returnValue(of({ basicTemplates: ['bt'] }));
    getPromptGlobalDefect = jasmine.createSpy().and.returnValue(of({ prompts: ['gd'] }));
    getGlobalDefects = jasmine.createSpy().and.returnValue(of({ defects: ['g1'] }));
    getPublicitycDataGeneration = jasmine.createSpy().and.returnValue(of({ synthetics: ['p1'] }));
    getBasicTemplateByIdInMongo = jasmine.createSpy().and.returnValue(of({ id: 'x' }));
  }

  class GenMock {
    setToastMessage = jasmine.createSpy('setToastMessage');
    setRefreshPromptBills = jasmine.createSpy('setRefreshPromptBills');
    setRefreshPromptData = jasmine.createSpy('setRefreshPromptData');
    setRefreshPromptImages = jasmine.createSpy('setRefreshPromptImages');
    setRefreshBasicTemplate = jasmine.createSpy('setRefreshBasicTemplate');
    setRefreshPromptSystem = jasmine.createSpy('setRefreshPromptSystem');
    setRefreshSyntheticData = jasmine.createSpy('setRefreshSyntheticData');
    setRefreshPromptGlobalDefect = jasmine.createSpy('setRefreshPromptGlobalDefect');
    setRefreshPublicityData = jasmine.createSpy('setRefreshPublicityData');
    setPromptBills = jasmine.createSpy('setPromptBills');
    setPromptSystem = jasmine.createSpy('setPromptSystem');
    setPromptImages = jasmine.createSpy('setPromptImages');
    setBasicTemplate = jasmine.createSpy('setBasicTemplate');
    setBasicTemplateData = jasmine.createSpy('setBasicTemplateData');
    setIsUploadingAnimation = jasmine.createSpy('setIsUploadingAnimation');
    setSyntheticData = jasmine.createSpy('setSyntheticData');
    setPromptGlobalDefect = jasmine.createSpy('setPromptGlobalDefect');
    setGlobalDefect = jasmine.createSpy('setGlobalDefect');
    setPublicityData = jasmine.createSpy('setPublicityData');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExecutingRestFulService,
        { provide: HttpClientService, useClass: HttpMock },
        { provide: ServiceGeneral, useClass: GenMock }
      ]
    });
    service = TestBed.inject(ExecutingRestFulService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('savePromptBill success sets toast and refreshes bills', () => {
    const http = TestBed.inject(HttpClientService) as unknown as HttpMock;
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;
    service.savePromptBill({} as any);
    expect(http.savePromptGenerationBill).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshPromptBills).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_PB);
  });

  it('savePromptData error sets error toast', () => {
    const http = TestBed.inject(HttpClientService) as unknown as HttpMock;
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;
    service.savePromptData({} as any);
    expect(http.savePromptGenerationData).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
  });

  it('getAllPromptBill sets list; getAllPromptSystem sets empty when nullish', () => {
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;
    service.getAllPromptBill();
    expect(gen.setPromptBills).toHaveBeenCalledWith([1, 2] as any);
    service.getAllPromptSystem();
    expect(gen.setPromptSystem).toHaveBeenCalledWith([] as any);
  });

  it('getBasicTemplateById sets template and turns off animation in both success and error', () => {
    const http = TestBed.inject(HttpClientService) as unknown as HttpMock;
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;
    service.getBasicTemplateById({ id: 'x' } as any);
    expect(http.getBasicTemplateByIdInMongo).toHaveBeenCalled();
    expect(gen.setBasicTemplate).toHaveBeenCalled();
    expect(gen.setIsUploadingAnimation).toHaveBeenCalledWith(false);
  });

  it('deletePromptSystemById error path sets error toast', () => {
    const http = TestBed.inject(HttpClientService) as any;
    http.deletePromptSystemById = jasmine.createSpy().and.returnValue(throwError(() => new Error('e')));
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;
    service.deletePromptSystemById({} as any);
    expect(http.deletePromptSystemById).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
  });

  it('savePromptSystem/saveSynthetic/savePublicity/saveGlobalDefect success paths set toast and refresh', () => {
    const http = TestBed.inject(HttpClientService) as unknown as HttpMock;
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;

    service.savePromptSystem({} as any);
    expect(http.savePromptGenerationSystem).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshPromptSystem).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_PS);

    service.saveSyntheticData({} as any);
    expect(http.saveSynteticDataGeneration).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshSyntheticData).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_SD as any);

    service.savePublicityData({} as any);
    expect(http.savePublicityDataGeneration).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshPublicityData).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_PUD as any);

    service.savePromptGlobalDefect({} as any);
    expect(http.savePromptGlobalDefect).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshPromptGlobalDefect).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_PGD as any);
  });

  it('delete success paths for image/bill/synthetic/publicity call refreshers', () => {
    const http = TestBed.inject(HttpClientService) as unknown as HttpMock;
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;

    service.deletePromptImageById({} as any);
    expect(http.deletePromptImageById).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshPromptImages).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_PI);

    service.deletePromptBillById({} as any);
    expect(http.deletePromptBillById).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshPromptBills).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_PB);

    service.deleteSyntheticDataById({} as any);
    expect(http.deleteSyntheticDataById).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshSyntheticData).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_SD as any);

    service.deletePublicityDataById({} as any);
    expect(http.deletePublicityDataById).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshPublicityData).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_PUD as any);
  });

  it('getBasicTemplateById error path logs and disables animation', () => {
    const http = TestBed.inject(HttpClientService) as unknown as HttpMock;
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;
    http.getBasicTemplateByIdInMongo.and.returnValue(throwError(() => new Error('fail')) as any);
    const errSpy = spyOn(console, 'error');
    service.getBasicTemplateById({ id: 'x' } as any);
    expect(errSpy).toHaveBeenCalled();
    expect(gen.setIsUploadingAnimation).toHaveBeenCalledWith(false);
  });

  it('setRefreshObservable ignores unknown keys without side-effects', () => {
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;
    Object.values(gen).forEach((spy: any) => spy && spy.calls && spy.calls.reset && spy.calls.reset());
    (service as any).setRefreshObservable('UNKNOWN');
    expect(gen.setRefreshPromptBills).not.toHaveBeenCalled();
    expect(gen.setRefreshPromptData).not.toHaveBeenCalled();
  });

  it('saveBasicTemplate success sets toast and refreshes basic template', () => {
    const http = TestBed.inject(HttpClientService) as unknown as HttpMock;
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;
    service.saveBasicTemplate({} as any);
    expect(http.saveBasicTemplate).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshBasicTemplate).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_BT);
  });

  it('deleteBasicTemplateById success sets delete toast and refresh', () => {
    const http = TestBed.inject(HttpClientService) as unknown as HttpMock;
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;
    service.deleteBasicTemplateById({} as any);
    expect(http.deleteBasicTemplateById).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshBasicTemplate).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_BT);
  });

  it('savePromptImage success refreshes images and sets toast', () => {
    const http = TestBed.inject(HttpClientService) as unknown as HttpMock;
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;
    service.savePromptImage({} as any);
    expect(http.savePromptGenerationImage).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshPromptImages).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_PI);
  });

  it('deletePromptDataById success refreshes data and sets toast', () => {
    const http = TestBed.inject(HttpClientService) as unknown as HttpMock;
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;
    service.deletePromptDataById({} as any);
    expect(http.deletePromptDataById).toHaveBeenCalled();
    expect(gen.setToastMessage).toHaveBeenCalled();
    expect(gen.setRefreshPromptData).toHaveBeenCalledWith(RefreshFlagObservableEnum.REFRESH_PD);
  });

  it('getAll* list fetchers map and set lists correctly', () => {
    const gen = TestBed.inject(ServiceGeneral) as unknown as GenMock;
    service.getAllPromptImages();
    expect(gen.setPromptImages).toHaveBeenCalledWith(['a'] as any);

    service.getAllSyntheticData();
    expect(gen.setSyntheticData).toHaveBeenCalledWith([3] as any);

    service.getAllBasicTemplate();
    expect(gen.setBasicTemplateData).toHaveBeenCalledWith(['bt'] as any);

    service.getAllPromptGlobalDefect();
    expect(gen.setPromptGlobalDefect).toHaveBeenCalledWith(['gd'] as any);

    service.getAllGlobalDefects();
    expect(gen.setGlobalDefect).toHaveBeenCalledWith(['g1'] as any);

    service.getAllPublicityData();
    expect(gen.setPublicityData).toHaveBeenCalledWith(['p1'] as any);
  });
});
