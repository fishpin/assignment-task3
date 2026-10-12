import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import BigButton from '../components/BigButton';
import FormField from '../components/FormField';
import * as Colors from '../constants/Colors';
import { castToNumber, formatAMPM } from '../utils';

export default function EventForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [volunteersNeeded, setVolunteersNeeded] = useState('');
    const [dateTime, setDateTime] = useState<Date>();
    const [datePickerIsVisible, setDatePickerIsVisible] = useState(false);

    const formIsValid = !!name.trim() && !!description.trim() && castToNumber(volunteersNeeded) > 0 && !!dateTime;

    const handleConfirmDateTime = (date: Date) => {
        setDateTime(date);
        setDatePickerIsVisible(false);
    };

    const handleAddPicture = () => {};

    const handleSave = () => {};

    return (
        <KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.content}>
            <FormField label="Event Name">
                <TextInput style={[styles.input, styles.inputText]} value={name} onChangeText={setName} />
            </FormField>

            <FormField label="About" hint="300 characters max.">
                <TextInput
                    style={[styles.input, styles.inputText, styles.multilineInput]}
                    multiline
                    maxLength={300}
                    value={description}
                    onChangeText={setDescription}
                />
            </FormField>

            <FormField label="Volunteers Needed">
                <TextInput
                    style={[styles.input, styles.inputText]}
                    keyboardType="number-pad"
                    value={volunteersNeeded}
                    onChangeText={setVolunteersNeeded}
                />
            </FormField>

            <FormField label="Date and Time">
                <RectButton style={styles.inputButton} onPress={() => setDatePickerIsVisible(true)}>
                    <View style={styles.input}>
                        <Text style={styles.inputText}>
                            {dateTime &&
                                `${dateTime.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })} ${formatAMPM(dateTime).toUpperCase()}`}
                        </Text>
                    </View>
                </RectButton>
            </FormField>

            <FormField label="Picture">
                <RectButton style={styles.inputButton} onPress={handleAddPicture}>
                    <View style={styles.pictureInput}>
                        <Feather name="plus" size={27} color={Colors.BLUE} />
                    </View>
                </RectButton>
            </FormField>

            <BigButton label="Save" color={Colors.BLUE} disabled={!formIsValid} onPress={handleSave} />

            <DateTimePickerModal
                isVisible={datePickerIsVisible}
                mode="datetime"
                minimumDate={new Date()}
                onConfirm={handleConfirmDateTime}
                onCancel={() => setDatePickerIsVisible(false)}
            />
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.BACKGROUND,
    },

    content: {
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    inputButton: {
        borderRadius: 8,
    },

    input: {
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderColor: Colors.GREY_LIGHT,
        borderRadius: 8,
        height: 56,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },

    multilineInput: {
        height: 111,
        paddingTop: 8,
        textAlignVertical: 'top',
    },

    inputText: {
        color: Colors.SLATE_LIGHT,
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
    },

    pictureInput: {
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: Colors.BLUE,
        borderRadius: 8,
        height: 76,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5,
    },
});
