import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SplitterModule } from 'primeng/splitter';
import { TabsModule } from 'primeng/tabs';
import { CheckboxModule } from 'primeng/checkbox';

import { BillEditorDefect } from './bill-editor-defect';
import { ServiceGeneral } from '../service/service-general';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';

// Stub ChatButtons to avoid reactive forms and PrimeNG dependencies
@Component({
  selector: 'chat-buttons',
  standalone: true,
  template: ''
})
class FakeChatButtons {
  @Input() itemsSavePrompt: any[] = [];
  @Input() headerDialog: any[] = [];
  @Input() eraseButton = false;
  @Input() exportButton = false;
  @Input() copyButton = false;
  @Input() arrayPromptAndData: any = {};
  @Output() submitSavePromptEmitter = new EventEmitter<any>();
}

class MockServiceGeneral {
  globalDefect$ = of([
    { category: 'Primary Texture', defect: 'scratch', prompt: 'fix scratches' },
    { category: 'Liquid & Stain', defect: 'stain', prompt: 'remove stains' }
  ]);
  setImageGenerated = jasmine.createSpy('setImageGenerated');
}

class MockExecutingRestFulService {
  savePromptGlobalDefect = jasmine.createSpy('savePromptGlobalDefect');
}

describe('BillEditorDefect (standalone)', () => {
  let component: BillEditorDefect;
  let fixture: ComponentFixture<BillEditorDefect>;
  let execMock: MockExecutingRestFulService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillEditorDefect],
      providers: [
        { provide: ServiceGeneral, useClass: MockServiceGeneral },
        { provide: ExecutingRestFulService, useClass: MockExecutingRestFulService }
      ]
    }).compileComponents();

    // Simplify: override the component template to avoid PrimeNG rendering in tests
    TestBed.overrideComponent(BillEditorDefect, {
      set: { template: '' }
    });

    fixture = TestBed.createComponent(BillEditorDefect);
    component = fixture.componentInstance;
    execMock = TestBed.inject(ExecutingRestFulService) as unknown as MockExecutingRestFulService;
    fixture.detectChanges();
  });

  it('should create and build tabs from global defects', () => {
    expect(component).toBeTruthy();
    expect(component.tabs.length).toBeGreaterThan(0);
    const categories = (component.tabs as any[]).map(t => t.type);
    expect(categories).toContain('Primary Texture');
    expect(categories).toContain('Liquid & Stain');
  });

  it('submit form: emits save with selected defects', () => {
    // Select two defects
    component.selectedStainDefects = [
      { category: 'Primary Texture', defect: 'scratch', prompt: 'fix scratches' } as any,
      { category: 'Liquid & Stain', defect: 'stain', prompt: 'remove stains' } as any
    ];

    component.emitSavePrompt({ name: 'combo' });

    expect(execMock.savePromptGlobalDefect).toHaveBeenCalled();
    const arg = (execMock.savePromptGlobalDefect as jasmine.Spy).calls.mostRecent().args[0];
    expect(arg).toEqual({ id: null, prompt: '1. fix scratches<br>2. remove stains', name: 'combo' });
  });

  it('error handling: no selected defects does not call service', () => {
    component.selectedStainDefects = [];
    expect(() => component.emitSavePrompt({ name: 'none' })).not.toThrow();
    expect(execMock.savePromptGlobalDefect).not.toHaveBeenCalled();
  });
});
 
