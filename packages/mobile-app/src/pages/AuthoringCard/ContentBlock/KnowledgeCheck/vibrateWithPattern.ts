import * as Haptics from 'expo-haptics';

function sleep(timeout = 200) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

export async function vibrateWithPattern(pattern: string) {
  for (let i = 0; i < pattern.length; i++) {
    switch (pattern[i]) {
      case 'x':
        await Promise.all([
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
          sleep(50),
        ]);
        break;
      case 'X':
        await Promise.all([
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
          sleep(50),
        ]);
        break;
      case '-':
        await sleep();
        break;
      case '.':
        await sleep(50);
        break;
    }
  }
}
