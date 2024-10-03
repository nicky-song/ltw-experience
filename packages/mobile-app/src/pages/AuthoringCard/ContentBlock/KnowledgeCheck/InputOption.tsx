import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import * as AntdIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface InputOptionProps {
  value: boolean;
  feedBackType?: 'success' | 'failure' | 'unmarked-correct' | null;
  label: string[];
  type: 'radio' | 'checkbox';
  onChange: (event: GestureResponderEvent) => void;
}
const ICON_SIZE = 24;
export function InputOption({
  value,
  label,
  onChange,
  feedBackType,
  type,
}: InputOptionProps) {
  return (
    <TouchableOpacity onPress={onChange}>
      <View
        style={[
          styles.optionContainer,
          feedBackType === 'success' && styles.optionSelectSuccess,
          feedBackType === 'failure' && styles.optionSelectFailure,
          !feedBackType && value && styles.optionSelectBlackBorder
        ]}>
        <View style={styles.iconContainer}>
          {(feedBackType === 'success' ||
            feedBackType === 'unmarked-correct') &&
            type === 'radio' && (
              <AntdIcon.default
                style={[styles.inputSuccess]}
                name={'checkcircle'}
                size={ICON_SIZE}
              />
            )}
          {(feedBackType === 'success' ||
            feedBackType === 'unmarked-correct') &&
            type === 'checkbox' && (
              <AntdIcon.default
                style={[styles.inputSuccess]}
                name={'checksquare'}
                size={ICON_SIZE}
              />
            )}
          {feedBackType === 'failure' &&
            ['checkbox', 'radio'].includes(type) && (
              <AntdIcon.default
                style={[styles.inputFailure]}
                name={'closecircle'}
                size={ICON_SIZE}
              />
            )}
          {!feedBackType && value && type === 'checkbox' && (
            <AntdIcon.default name={'checksquare'} size={ICON_SIZE} />
          )}
          {!feedBackType && !value && type === 'checkbox' && (
            <Icon name={'checkbox-blank-outline'} size={ICON_SIZE} />
          )}
          {!feedBackType && type === 'radio' && (
            <Icon
              name={value ? 'radiobox-marked' : 'radiobox-blank'}
              size={ICON_SIZE}
            />
          )}
        </View>
        <View>
          <Text>{label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: '#FBF9F7',
  },
  iconContainer: {
    width: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  optionSelectSuccess: {
    backgroundColor: '#f6ffed',
  },
  optionSelectFailure: {
    backgroundColor: '#fff1f0',
  },
  optionSelectBlackBorder: {
    borderWidth: 1,
    borderColor: '#000'
  },
  inputPending: {
    color: '#000'
  },
  inputSuccess: {
    color: '#6fc07a',
  },
  inputFailure: {
    color: '#ff7875',
  },
  input: {
    marginRight: 16,
  },
  inputHide: {
    opacity: 0,
  },
});
