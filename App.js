import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import FinanzasPersonalesScreen from './screens/FinanzasPersonalesScreen';
import FinanzasParejaScreen from './screens/FinanzasParejaScreen';
import SimuladoresScreen from './screens/SimuladoresScreen';
import CDTScreen from './screens/CDTScreen';
import DeudaBancoScreen from './screens/DeudaBancoScreen';
import FondoEmergenciaScreen from './screens/FondoEmergenciaScreen';
import AhorroScreen from './screens/AhorroScreen';
import PlanPensionScreen from './screens/PlanPensionScreen';
import PrestamosScreen from './screens/PrestamosScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // undefined = cargando, null = sin sesión, objeto = sesión activa
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // Verificar sesión existente al iniciar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuchar cambios de autenticación (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Splash mientras verifica sesión
  if (session === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: '#C8F090', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#1E7A3E" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName={session ? 'Home' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login"              component={LoginScreen} />
        <Stack.Screen name="Register"           component={RegisterScreen} />
        <Stack.Screen name="Welcome"            component={WelcomeScreen} />
        <Stack.Screen name="Home"               component={HomeScreen} />
        <Stack.Screen name="FinanzasPersonales" component={FinanzasPersonalesScreen} />
        <Stack.Screen name="FinanzasPareja"     component={FinanzasParejaScreen} />
        <Stack.Screen name="Simuladores"          component={SimuladoresScreen} />
        <Stack.Screen name="SimuladorCDT"         component={CDTScreen} />
        <Stack.Screen name="SimuladorDeuda"       component={DeudaBancoScreen} />
        <Stack.Screen name="SimuladorEmergencia"  component={FondoEmergenciaScreen} />
        <Stack.Screen name="SimuladorAhorro"      component={AhorroScreen} />
        <Stack.Screen name="SimuladorPension"     component={PlanPensionScreen} />
        <Stack.Screen name="SimuladorPrestamos"   component={PrestamosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
