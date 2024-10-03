import { SlateJSON } from '@learn-to-win/common/features/Cards/cardTypes';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import { CustomElement } from 'web-app/src/components/AuthoringCard/RichText/RichTextTypes';
import { ReactNode } from 'react';

export function RichTextViewer({
  json,
  renderLastMargin = true,
}: {
  json?: SlateJSON;
  renderLastMargin?: boolean;
}) {
  return (
    <View>
      {json?.map((data, i) => {
        return (
          <Element
            key={i}
            type={data.type}
            align={data.align}
            bold={data.type !== 'paragraph'}
            color={data.color}
            backgroundColor={data.backgroundColor}
            style={renderLastMargin ? undefined : { marginBottom: 0 }}>
            {data?.children.map((data1: any, index: number) => {
              return (
                <Leaf leaf={data1} key={index}>
                  {data1?.text}
                </Leaf>
              );
            })}
          </Element>
        );
      })}
    </View>
  );
}

const Element = (
  props: CustomElement & {
    bold: boolean;
    style: StyleProp<TextStyle>;
    children: ReactNode;
  },
) => {
  return (
    <Text
      style={[
        {
          fontWeight: props.bold ? 'bold' : 'normal',
          textAlign: props.align,
          marginBottom: props.type === 'subtitle' ? 9 : 16,
          fontSize:
            props.type === 'title' ? 32 : props.type === 'subtitle' ? 18.7 : 16,
        },
        props.style,
      ]}>
      {props.children}
    </Text>
  );
};
const Leaf = (props: any) => {
  //underline takes precedence
  let textDecoration: 'underline' | 'line-through' | 'none';
  if (props.leaf.underline) {
    textDecoration = 'underline';
  } else if (props.leaf.strikethrough) {
    textDecoration = 'line-through';
  } else {
    textDecoration = 'none';
  }
  return (
    <Text
      style={{
        fontWeight: props.leaf.bold ? 'bold' : undefined,
        fontStyle: props.leaf.italic ? 'italic' : 'normal',
        textDecorationLine: textDecoration,
        color: props.leaf.color,
        backgroundColor: props.leaf.backgroundColor,
      }}>
      {props.children}
    </Text>
  );
};
