import { getToastMessageOption } from './toast-message-option-utils';

describe('toast-message-option-utils', () => {
  it('builds ToastMessageOptions with fixed life', () => {
    const msg = getToastMessageOption('success', 'Done');
    expect(msg.severity).toBe('success');
    expect(msg.detail).toBe('Done');
    expect(msg.life).toBe(5000);
  });
});
