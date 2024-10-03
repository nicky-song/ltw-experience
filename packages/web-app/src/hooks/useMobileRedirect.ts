import { useEffect } from 'react';
import parser from 'ua-parser-js';

// Paths that can be redirected to on mobile.
export enum MobilePaths {
  Default = '',
  ResetPassword = 'reset-password',
}

// Test if useragent is iOS or Android, so we don't redirect on desktop.
const parsed = parser(window.navigator.userAgent);
const isAppPossiblyAvailable = /ios|android/i.test(parsed.os.name ?? '');
const isIOS = /ios/i.test(parsed.os.name ?? '');

export const useMobileRedirect = (path = MobilePaths.Default) => {
  useEffect(() => {
    const storageKey = `hasRedirected-${path}`;
    // required for preventing infinite refreshes
    const hasRedirectedInSession = sessionStorage.getItem(storageKey);
    if (isAppPossiblyAvailable && !hasRedirectedInSession) {
      // this is required for automatically disabling a dumb warning on ios when the app is not installed
      if (isIOS) {
        sessionStorage.setItem(storageKey, 'true');
        setTimeout(function () {
          window.location.reload();
        }, 25);
      }

      window.location.href = `learntowin://${path}${window.location.search}`;
    }
  }, [path]);
};
