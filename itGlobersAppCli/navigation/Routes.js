import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer, Text, View} from '@react-navigation/native';
import Login from '../screens/Login';
// import auth from '@react-native-firebase/auth';
// import {AuthContext} from './AuthProvider';

import AppStack from './AppStack';

const Routes = () => {
  // const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  // const onAuthStateChanged = (user) => {
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // };

  useEffect(() => {
    // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    // <NavigationContainer>
    <View>
      <Text>RN Social App</Text>
    </View>
    // </NavigationContainer>
  );
};

export default Routes;
