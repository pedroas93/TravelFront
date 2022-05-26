import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootTabScreenProps } from '../types';
import { RootState } from '../store/store';
import CryptoJS from "react-native-crypto-js";
import { logOut } from '../slices/userSlice';

export default function ModalScreen({ navigation }: RootTabScreenProps<'Modal'>) {
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState("");
  const screenState = useSelector((state: RootState) => state.userDataPersist);

  useEffect(() => {
    const bytes = CryptoJS.AES.decrypt(screenState?.email, screenState?.token);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    setEmail(originalText)
  }, [screenState]);

  const onSignOut = (e: any) => {
    dispatch(logOut());
    navigation.navigate('Login');
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información del usuario</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.buttonText}>Email: {email}</Text>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={onSignOut}
      >
        <Text style={styles.buttonText}>Salir</Text>
      </TouchableOpacity>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonContainer: {
    marginTop: 10,
    // backgroundColor: "#1a73d8",
    borderRadius: 30,
    paddingVertical: 15,
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  buttonText: {
    color: "#000000",
    textAlign: "left",
    fontSize: 18,
  },
});
