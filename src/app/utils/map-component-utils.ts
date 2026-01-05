import { Type } from "@angular/core"
import { ProcessTemplateBill } from "../process-template-bill/process-template-bill";
import { BillPresentation } from "../bill-presentation/bill-presentation";
import { BillData } from "../bill-data/bill-data";
import { BillUploadDocument } from "../bill-upload-document/bill-upload-document";
import { BillVisualizer } from "../bill-visualizer/bill-visualizer";
import { BillTemplate } from "../bill-template/bill-template";
import { BillEditor } from "../bill-editor/bill-editor";
import { BillDeletePrompt } from "../bill-delete-prompt/bill-delete-prompt";
import { BillEditorDefect } from "../bill-editor-defect/bill-editor-defect";
import { BillConstructor } from "../bill-constructor/bill-constructor";

export function getMapComponentToDisplay(): { [key: string]: Type<any> } {
    return {
    'show-template': ProcessTemplateBill,
    'show-presentation': BillPresentation,
    'generate-data': BillData,
    'upload-document': BillUploadDocument,
    'bill-visualizer': BillVisualizer,
    'bill-template': BillTemplate,
    'bill-editor': BillEditor,
    'bill-delete-prompt': BillDeletePrompt,
    'bill-editor-defect': BillEditorDefect,
    'bill-constructor': BillConstructor
  };
}