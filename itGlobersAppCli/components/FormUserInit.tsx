import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    View,
} from 'react-native';
import React from 'react';

export  default function FormUserInit( props: any ) {
    return (
        <View>
            <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={props.emailError ? styles.inputLabelError : styles.inputLabel}>EMAIL</Text>

                    <TextInput
                        returnKeyType="next"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                        onChangeText={email => props.setEmail(email)}
                        value={props.email}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={props.passwordError ? styles.inputLabelError : styles.inputLabel}>CONTRASEÑA</Text>
                    <TextInput
                        style={[styles.input, { paddingRight: 40 }]}
                        autoCapitalize="none"
                        returnKeyType="go"
                        secureTextEntry={true}
                        onChangeText={password => props.setPassword(password)}
                        value={props.password}
                        textContentType="none"
                    />
                </View>

                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={props.handleLogin}
                >
                    <Text style={styles.buttonText}>{props.textButton}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topHeaderContainer: {
        marginTop: 60,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    },
    topHeaderTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#ffff"
    },
    topHeaderText: {
        marginTop: 25,
        fontSize: 18,
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 10,
        textAlign: "center",
        color: "#ffff"
    },
    formContainer: {
        padding: 25,
        paddingBottom: 30,
        paddingTop: 40,
        backgroundColor: "#0049a6",
        margin: 20,
        borderRadius: 8,
    },
    container: {
        flex: 1,
        backgroundColor: "#65a1ff"
    },
    buttonContainer: {
        marginTop: 10,
        backgroundColor: "#1a73d8",
        borderRadius: 30,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
    },
    signupText: {
        marginTop: 50,
        marginBottom: 20
    },
    buttonSignup: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    signupTextRegular: {
        color: "#ffffff",
    },
    signupTextLink: {
        marginLeft: 5,
        color: "#ffffff",
        textDecorationLine: "underline"
    },
    inputWrapper: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 7,
        marginBottom: 15,
        paddingTop: 6,
        paddingBottom: 2,
        position: "relative"
    },
    inputLabelError: {
        fontSize: 12,
        position: "absolute",
        left: 10,
        top: 7,
        color: 'red',
    },
    inputLabel: {
        fontSize: 12,
        position: "absolute",
        left: 10,
        top: 7,
        color: 'black'
    },
    input: {
        paddingTop: 12,
        height: 51,
        fontSize: 14,
    },
});
