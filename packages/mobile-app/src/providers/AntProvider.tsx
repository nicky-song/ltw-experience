import { Provider } from '@ant-design/react-native';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import AppLoading from 'expo-app-loading';
import { Text } from 'react-native';
import { theme } from './antDesignTheme';

export function AntProvider({ children }: { children: React.ReactNode }) {
  // // TODO: Fetch Fonts if needed
  // const { isSuccess } = useQuery(["theme"], async () => {
  //   await Font.loadAsync(
  //     "antoutline",
  //     // eslint-disable-next-line
  //     require("@ant-design/icons-react-native/fonts/antoutline.ttf"),
  //   );
  //
  //   await Font.loadAsync(
  //     "antfill",
  //     // eslint-disable-next-line
  //     require("@ant-design/icons-react-native/fonts/antfill.ttf"),
  //   );
  // });

  return <Provider theme={theme}>{children}</Provider>;
}
