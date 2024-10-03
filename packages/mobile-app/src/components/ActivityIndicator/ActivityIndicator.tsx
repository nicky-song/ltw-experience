import {
  ActivityIndicator as ActivityIndicatorRN,
  ActivityIndicatorProps,
} from 'react-native';
export function ActivityIndicator(
  props: Omit<ActivityIndicatorProps, 'color'>,
) {
  return (
    <ActivityIndicatorRN
      size='large'
      {...props}
      color='#6FC07A'
      testID={'activity-indicator'}
    />
  );
}
