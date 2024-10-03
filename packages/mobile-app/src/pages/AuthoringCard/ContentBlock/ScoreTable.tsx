import { View, StyleSheet } from 'react-native';
import { Text } from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const ScoreColors = {
    correct: '#B7EB8F', 
    graded: '#FFE58F',
    incorrect: '#FFA39E'
}

export function ScoreTable() {
    return (
        <View>
            <View style={[styles.row, { backgroundColor: ScoreColors['correct']}]}>
                <Text style={styles.score}>Correct</Text>
                <Text style={styles.score}>60%</Text>
            </View>
            <View style={[styles.row, { backgroundColor: ScoreColors['graded']}]}>
                <Text style={styles.score}>To Be Graded</Text>
                <Text style={styles.score}>20%</Text>
            </View>
            <View style={[styles.row, { backgroundColor: ScoreColors['incorrect']}]}>
                <Text style={styles.score}>Incorrect</Text>
                <Text style={styles.score}>20%</Text>
            </View>
            <View style={[styles.row, { backgroundColor: '#F6FFED'}]}>
                <View style={styles.reviewLine}>
                    <Icon
                        name={'arrowright'}
                        size={16}
                        color={'#000000E0'}
                    />
                    <Text style={styles.review}>Review Answers</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -8
    },
    score: {
        color: '#000',
        fontSize: 20,
        fontWeight:'600',
        lineHeight: 28
    },
    review: {
        fontSize: 18,
        lineHeight: 24,
        marginLeft: 8
    },
    reviewLine: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    }
})