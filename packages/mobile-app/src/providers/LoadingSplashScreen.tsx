import * as SplashScreen from 'expo-splash-screen';
import { useAppSelector } from '../hooks/reduxHooks';
import { View } from 'react-native';
import { Fragment, useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export function LoadingSplashScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoading = useAppSelector((state) => state.auth.isInitialAuthLoading);

  useEffect(() => {
    if (!isLoading) {
      // Might need to wait for react to render there could be a brief flash of white screen
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
