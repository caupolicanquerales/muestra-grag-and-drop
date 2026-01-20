import { getMapComponentToDisplay } from './map-component-utils';
import { ProcessTemplateBill } from '../process-template-bill/process-template-bill';
import { BillPresentation } from '../bill-presentation/bill-presentation';
import { BillData } from '../bill-data/bill-data';
import { BillUploadDocument } from '../bill-upload-document/bill-upload-document';
import { BillVisualizer } from '../bill-visualizer/bill-visualizer';
import { BillTemplate } from '../bill-template/bill-template';
import { BillEditor } from '../bill-editor/bill-editor';
import { BillDeletePrompt } from '../bill-delete-prompt/bill-delete-prompt';
import { BillEditorDefect } from '../bill-editor-defect/bill-editor-defect';
import { BillConstructor } from '../bill-constructor/bill-constructor';

describe('map-component-utils', () => {
  it('returns stable mapping of route keys to component types', () => {
    const map = getMapComponentToDisplay();
    expect(map['show-template']).toBe(ProcessTemplateBill);
    expect(map['show-presentation']).toBe(BillPresentation);
    expect(map['generate-data']).toBe(BillData);
    expect(map['upload-document']).toBe(BillUploadDocument);
    expect(map['bill-visualizer']).toBe(BillVisualizer);
    expect(map['bill-template']).toBe(BillTemplate);
    expect(map['bill-editor']).toBe(BillEditor);
    expect(map['bill-delete-prompt']).toBe(BillDeletePrompt);
    expect(map['bill-editor-defect']).toBe(BillEditorDefect);
    expect(map['bill-constructor']).toBe(BillConstructor);
  });
});
