import { useState } from 'react';
import {
  StyleSheet,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
} from 'react-native';

const MoreLessComponent = ({
  truncatedText,
  fullText,
  textStyle,
  moreStyle,
}) => {
  const [more, setMore] = useState(false);
  return (
    <TouchableOpacity onPress={() => setMore(!more)}>
      <Text style={textStyle}>
        {!more ? `${truncatedText}... ` : fullText + ' '}
        <Text style={moreStyle}>{more ? 'less' : 'more'}</Text>
      </Text>
    </TouchableOpacity>
  );
};
const MoreInfo = ({
  text,
  linesToTruncate,
  textStyle,
  moreStyle,
}: {
  text: string;
  linesToTruncate: number;
  textStyle?: StyleProp<TextStyle>;
  moreStyle?: StyleProp<TextStyle>;
}) => {
  const [clippedText, setClippedText] = useState('');
  const onTextLayout = (event) => {
    //get all lines
    const { lines } = event.nativeEvent;
    //get lines after it truncate
    const text = lines
      .splice(0, linesToTruncate - 1)
      .map((line) => line.text)
      .join('');
    setClippedText(text.substring(0, text.length - 16));
  };
  return clippedText ? (
    <MoreLessComponent
      truncatedText={clippedText}
      fullText={text}
      textStyle={textStyle}
      moreStyle={[styles.moreStyle, moreStyle]}
    />
  ) : (
    <Text
      numberOfLines={linesToTruncate}
      ellipsizeMode={'tail'}
      style={textStyle}
      onTextLayout={onTextLayout}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  moreStyle: {
    color: '#0958D9',
    textDecorationLine: 'underline',
  },
});

export default MoreInfo;
