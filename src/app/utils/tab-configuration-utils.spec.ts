import { getConfigurationTabDeletePrompt, getConfigurationTabGlobalDefect, getDeletePromptTabName, getHeaderDialogTitle, TabDeletePromptCategory, TabGlobalDfectCategory } from './tab-configuration-utils';

describe('tab-configuration-utils', () => {
  it('getConfigurationTabGlobalDefect returns categories with titles', () => {
    const tabs = getConfigurationTabGlobalDefect();
    expect(tabs.map(t => t.category)).toEqual([
      TabGlobalDfectCategory.PRIMARY_TEXTURE,
      TabGlobalDfectCategory.LIQUID_STAIN,
      TabGlobalDfectCategory.COLOR_AGING,
      TabGlobalDfectCategory.ANNOTATIONS_FILING,
    ]);
    expect(tabs.every(t => !!t.title)).toBeTrue();
  });

  it('getConfigurationTabDeletePrompt returns expected categories', () => {
    const cats = getConfigurationTabDeletePrompt();
    expect(cats).toEqual([
      TabDeletePromptCategory.IMAGE,
      TabDeletePromptCategory.DATA,
      TabDeletePromptCategory.BILL,
      TabDeletePromptCategory.SYSTEM,
      TabDeletePromptCategory.SYNTHETIC,
      TabDeletePromptCategory.PUBLICITY,
    ]);
  });

  it('maps names and dialog titles by category', () => {
    const names = getDeletePromptTabName();
    const titles = getHeaderDialogTitle();
    expect(names[TabDeletePromptCategory.IMAGE]).toContain('Prompt');
    expect(titles[TabDeletePromptCategory.DATA]).toContain('eliminar');
  });
});
