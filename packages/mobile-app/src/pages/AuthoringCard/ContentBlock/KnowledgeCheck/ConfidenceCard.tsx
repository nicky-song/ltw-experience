import { Button, Text } from '@ant-design/react-native';
import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { LessonBackButton } from '../../LessonNavigation';
import { ConfidenceScaleConfig } from '@learn-to-win/common/config/confidenceScaleConfig';

interface ConfidenceCardProps {
    onCheck: (confident: number) => void;
    onClose: () => void;
    confidence: number | null;
}

const ConfidenceCard = ({ onClose, onCheck, confidence = null }: ConfidenceCardProps) => {
    const [selectedConfidence, setSelectedConfidence] = useState(confidence);
    const checkButtonDisabled = selectedConfidence === null;
    return (
        <View style={styles.confidenceCard}>
            <Text style={styles.confidenceCardHeader}>
                Select how confident you are with this answer:
            </Text>
            <View style={styles.confidenceCardScale}>
                {ConfidenceScaleConfig.map((scale) => (
                    <View key={scale.value} style={styles.confidenceCardScaleItem}>
                        <View style={styles.confidenceCardScaleItemIcon}>
                            <Button
                                size='large'
                                style={[styles.confidenceCardScaleItemIconButton, selectedConfidence === scale.value && styles.selectedConfidenceItem]}
                                onPress={() => setSelectedConfidence(scale.value)}
                                testID={`confidence-level-${scale.value}`}>
                                {scale.icon}
                            </Button>
                        </View>
                        <View style={styles.confidenceCardScaleItemLabel}>
                            {scale.showLabel && (
                                <Text style={styles.confidenceCardScaleItemLabelText}>
                                    {scale.label}
                                </Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>
            <View style={styles.footer}>
                <LessonBackButton onPress={onClose} />
                <Button disabled={checkButtonDisabled} style={checkButtonDisabled ? styles.confidenceCardButtonDisabled : styles.confidenceCardButton} onPress={() => onCheck(selectedConfidence)}>
                    <Text style={checkButtonDisabled ? styles.confidenceCardButtonTxtDisabled : styles.confidenceCardButtonTxt}>Check</Text>
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    confidenceCard: {
        paddingHorizontal: 20,
        paddingVertical: 32,
        backgroundColor: '#F9F0FF',
        borderRadius: 8
    },
    confidenceCardHeader: {
        fontSize: 16,
        fontWeight: '600'
    },
    confidenceCardScale: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8
    },
    confidenceCardScaleItem: {
        width: 64,
        height: 'auto',
        flexDirection: 'column',
        alignItems: 'center'
    },
    confidenceCardScaleItemIcon: {
        height: 40,
        marginBottom: 8
    },
    confidenceCardScaleItemIconButton: {
        borderWidth: 1,
        borderColor: '#d9d9d9'
    },
    selectedConfidenceItem: {
        borderColor: '#6FC07A',
        backgroundColor: '#F6FFED'
    },
    confidenceCardScaleItemLabel: {
        height: 42,
        flexDirection: 'row',
        alignItems: 'center'
    },
    confidenceCardScaleItemLabelText: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
    },
    confidenceCardButton: {
        backgroundColor: '#6FC07A',
        minWidth: 180
    },
    confidenceCardButtonDisabled: {
        backgroundColor: 'rgba(0,0,0,0.04)',
        minWidth: 180
    },
    confidenceCardButtonTxt: {
        color: '#fff',
        fontSize: 16,
    },
    confidenceCardButtonTxtDisabled: {
        color: 'rgba(0, 0, 0, 0.25)',
        fontSize: 16,
    },
    footer: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
export default ConfidenceCard;
