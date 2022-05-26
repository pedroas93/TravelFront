import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store/store';
import * as React from 'react';
import { Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import SingupScreen from './screens/SingupScreen';
import ListUsers from './screens/ListUsers';
import ModalScreen from './screens/ModalScreen';


const Stack = createNativeStackNavigator();

const HomeStack = createNativeStackNavigator();


export default function App() {
  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Group>
              <HomeStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <HomeStack.Screen name="SingupScreen" component={SingupScreen} options={{ headerShown: false }} />
              <HomeStack.Screen name="ListUsers" component={ListUsers}
                options={({ navigation }: any) => ({
                  title: 'IT GLOBERS TEST MOBILE',
                  headerBackVisible: false,
                  headerRight: () => (
                    <Button
                      onPress={() => navigation.navigate('Configuración')}
                      title="Perfil"
                      color="black"
                    />
                  ),
                })}
              />
              <Stack.Screen name="Configuración" component={ModalScreen} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </ReduxProvider >
    </SafeAreaProvider>
  );
}
