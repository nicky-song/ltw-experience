
import {
    Card,
    MultipleChoiceBlockType,
    TrueFalseBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import PieChart from 'react-native-pie-chart';
import { View, StyleSheet } from 'react-native';
import { Text } from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/AntDesign';

interface ScoreChartProps {
    card: Card;
    contentBlock: MultipleChoiceBlockType | TrueFalseBlockType;
}

export function ScoreChart({
    card,
    contentBlock
}: ScoreChartProps) {
    const widthAndHeight = 230;
    //[correct, graded, incorrect];
    const series = [60, 20, 20];
    const sliceColor = ['#B7EB8F', '#FFE58F', '#FFA39E'];

    return (
        <View style={styles.center}>
            <PieChart
                widthAndHeight={widthAndHeight}
                series={series}
                sliceColor={sliceColor}
                coverRadius={0.86}
                coverFill={'#FFF'}
            />
            <View style={styles.circleCenter}>
                <Text style={styles.statusTitle}>Done</Text>
                <View style={styles.row}>
                    <Text style={styles.status}>Score Pending</Text>
                    <Icon
                        name={'infocirlceo'}
                        size={20}
                        color={'#00000073'}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    center: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32
    },
    circleCenter: {
        alignItems: 'center',
        marginTop: -145
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6
    },
    statusTitle: {
        fontSize: 24,
        fontWeight: '600'
    },
    status: {
        fontSize: 14,
        lineHeight: 22,
        marginRight: 3
    }
})