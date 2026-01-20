import {
  getHeaderDialogToSystem,
  getHeaderDialogToData,
  getHeaderDialogToBillData,
  getExportFormatToBillData,
  getSaveFormartPromptToBillData,
  getHeaderDialogToBillEditor,
  getSaveFormartPromptForOther,
  getSaveFormartPromptForSystem,
  getSaveFormartPromptForData,
  getExportFormatToBillEditor,
  getHeaderDialogToBasicTemplate,
  getSaveFormartBasicTemplate,
  getSavePromptGlobalDefect,
  getHeaderDialogGlobalDefect,
} from './dialog-parameters-utils';
import { TypePromptEnum } from '../enums/type-prompt-enum';

describe('dialog-parameters-utils', () => {
  it('returns correct headers for system and data', () => {
    expect(getHeaderDialogToSystem()[0].format).toBe(TypePromptEnum.SYSTEM_PROMPT);
    expect(getHeaderDialogToData()[0].format).toBe(TypePromptEnum.DATA_PROMPT);
  });

  it('bill data: headers, export formats and save formats', () => {
    const headers = getHeaderDialogToBillData();
    expect(headers.map(h => h.format)).toEqual([
      TypePromptEnum.IMAGE_PROMPT,
      TypePromptEnum.DATA_PROMPT,
      TypePromptEnum.SYNTHETIC_DATA,
    ]);
    expect(getExportFormatToBillData().map(f => f.format)).toEqual(['.md', '.json', '.txt']);
    expect(getSaveFormartPromptToBillData().map(f => f.format)).toEqual([
      TypePromptEnum.IMAGE_PROMPT,
      TypePromptEnum.DATA_PROMPT,
      TypePromptEnum.SYNTHETIC_DATA,
    ]);
  });

  it('bill editor headers and save formats for other/system/data', () => {
    const headers = getHeaderDialogToBillEditor();
    expect(headers.map(h => h.format)).toEqual([
      TypePromptEnum.IMAGE_PROMPT,
      TypePromptEnum.DATA_PROMPT,
      TypePromptEnum.BILL_PROMPT,
      TypePromptEnum.SYNTHETIC_DATA,
      TypePromptEnum.PUBLICITY_DATA,
    ]);
    expect(getSaveFormartPromptForOther().length).toBe(5);
    expect(getSaveFormartPromptForSystem()[0].format).toBe(TypePromptEnum.SYSTEM_PROMPT);
    expect(getSaveFormartPromptForData()[0].format).toBe(TypePromptEnum.DATA_PROMPT);
    expect(getExportFormatToBillEditor()[0].format).toBe('.txt');
  });

  it('basic template and global defect headers/save formats', () => {
    expect(getHeaderDialogToBasicTemplate()[0].format).toBe(TypePromptEnum.BASIC_TEMPLATE);
    expect(getSaveFormartBasicTemplate()[0].format).toBe(TypePromptEnum.BASIC_TEMPLATE);
    expect(getSavePromptGlobalDefect()[0].format).toBe(TypePromptEnum.GLOBAL_DEFECT_PROMPT);
    expect(getHeaderDialogGlobalDefect()[0].format).toBe(TypePromptEnum.GLOBAL_DEFECT_PROMPT);
  });
});
