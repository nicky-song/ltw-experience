import * as Haptics from 'expo-haptics';
import { vibrateWithPattern } from './vibrateWithPattern';

describe('vibrateWithPattern', () => {
  it('should call haptics properly', async () => {
    const hapticsSpy = jest.spyOn(Haptics, 'impactAsync');
    const timeoutSpy = jest.spyOn(global, 'setTimeout');
    await vibrateWithPattern('x.X-');

    expect(hapticsSpy).toHaveBeenNthCalledWith(1, Haptics.ImpactFeedbackStyle.Light);
    expect(timeoutSpy).toHaveBeenNthCalledWith(1, expect.any(Function), 50);
    expect(timeoutSpy).toHaveBeenNthCalledWith(2, expect.any(Function), 50);
    expect(hapticsSpy).toHaveBeenNthCalledWith(2, Haptics.ImpactFeedbackStyle.Heavy);
    expect(timeoutSpy).toHaveBeenNthCalledWith(3, expect.any(Function), 50);
    expect(timeoutSpy).toHaveBeenNthCalledWith(4, expect.any(Function), 200);
  });
});
