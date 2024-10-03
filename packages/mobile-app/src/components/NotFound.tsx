// TODO: move this to it's own component
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

export const NotFound = () => (
  <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    }}>
    <Icon name={'frowno'} size={100} color={'#c0c0c0'} />
    <Text
      style={{
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#c0c0c0',
      }}>
      Page not found
    </Text>
  </View>
);
