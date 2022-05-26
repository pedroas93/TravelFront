import {
  StyleSheet,
} from 'react-native';

export default exports = StyleSheet.create({
    inputWrapper: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 7,
        marginBottom: 15,
        paddingTop: 6,
        paddingBottom: 2,
        position: "relative"
    },
    textResult: {
        paddingTop: 23,
        height: 50,
    },
    inputLabel: {
        fontSize: 12,
        position: "absolute",
        left: 10,
        top: 7,
    },
    input: {
        paddingTop: 12,
        height: 51,
        fontSize: 14,
    },
    primaryButton: {
        marginTop: 10,
        backgroundColor: "#2a2a33",
        borderRadius: 30,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputIOSPickerSelect: {
        marginTop: 5,
        height: 45,
        fontSize: 14,
        position: "relative",
        paddingTop: 6,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroidPickerSelect: {
        fontSize: 14,
        marginTop: 5,
        paddingTop: 6,
        height: 45,
        position: "relative",
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    }
});

