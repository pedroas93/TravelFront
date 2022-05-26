import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  View,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../types';
import { RootState } from '../store/store';
import FormUserInit from '../components/FormUserInit'
import Toast from 'react-native-rn-toast';
import { fetchUserSingup } from '../slices/userSlice';



export default function SingupScreen({ navigation }: RootStackParamList<'SingupScreen'>) {

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false)
  const screenState = useSelector((state: RootState) => state.userDataPersist);

  const handleLogin = (e: any) => {
    e.preventDefault();
    // dispatch(fetchUserSingup({ email: "eve.holt@reqres.in", password: "cityslicka" }));
    if (/^(([^<>()[\],;:\s@"]+([^<>()[\],;:\s@"]+)*)|(".+"))@(([^<>()[\],;:\s@"]+)+[^<>()[\],;:\s@"]{2,})$/i.test(email)) {
      dispatch(fetchUserSingup({ email: email, password: password }));
      setEmailError(false)
      setPasswordError(false)
    } else if (email.length <= 0) {
      Toast.show('Por favor rellene el campo Email ', 1000);
      setEmailError(true)
    } else if (password.length <= 0) {
      Toast.show('Por favor rellene el campo Password ', 1000);
      setPasswordError(true)
    } else {
      Toast.show('Por favor digite un Email valido', 1000);
      setEmailError(true)
    }
  }

  useEffect(() => {
    if (!screenState?.error && !screenState?.token) {
      setEmail('')
      setPassword('')
    }

    if (!screenState?.error && screenState?.email.length) {
      setEmailError(false)
      setPasswordError(false)
      navigation.navigate('ListUsers')
      // AsyncStorage.setItem('@emailUser', JSON.stringify(screenState.email));
      // AsyncStorage.setItem('@tokenUser', JSON.stringify(screenState.token));
    }
    if (screenState?.error) {
      setEmailError(true)
      setPasswordError(true)
      Toast.show('Email o Password invalido', 1000);
    }


  }, [screenState]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : 'height'} style={styles.container} enabled>
      <StatusBar barStyle="dark-content" />

      <ScrollView>
        <View style={styles.topHeaderContainer}>
          <Text style={styles.topHeaderTitle}>Crea tu cuenta</Text>
          <Text style={styles.topHeaderText}>para hacer parte de ItGlobers</Text>
        </View>
        <FormUserInit
          setEmail={setEmail}
          email={email}
          setPassword={setPassword}
          password={password}
          handleLogin={handleLogin}
          emailError={emailError}
          passwordError={passwordError}
          textButton={"Registrarse"}
        />

        <View style={styles.signupText}>
          <TouchableOpacity
            style={styles.buttonSignup}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signupTextRegular}>¿Ya tienes cuenta?</Text>
            <Text style={styles.signupTextLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
