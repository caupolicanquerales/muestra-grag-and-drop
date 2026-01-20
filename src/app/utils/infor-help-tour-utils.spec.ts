import { informationDataGenerationHelp, informationImageGenerationHelp, templateHelp } from './infor-help-tour-utils';

describe('infor-help-tour-utils', () => {
  it('templateHelp returns title and text', () => {
    const h = templateHelp();
    expect(h.title).toBeTruthy();
    expect(h.text).toBeTruthy();
  });

  it('informationDataGenerationHelp returns title and text', () => {
    const h = informationDataGenerationHelp();
    expect(h.title).toBeTruthy();
    expect(h.text).toBeTruthy();
  });

  it('informationImageGenerationHelp returns title and text', () => {
    const h = informationImageGenerationHelp();
    expect(h.title).toBeTruthy();
    expect(h.text).toBeTruthy();
  });
});
