import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import { ROUTES } from './constants/routes';
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
        initialRouteName={session ? ROUTES.HOME : ROUTES.LOGIN}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name={ROUTES.LOGIN}                component={LoginScreen} />
        <Stack.Screen name={ROUTES.REGISTER}             component={RegisterScreen} />
        <Stack.Screen name={ROUTES.WELCOME}              component={WelcomeScreen} />
        <Stack.Screen name={ROUTES.HOME}                 component={HomeScreen} />
        <Stack.Screen name={ROUTES.FINANZAS_PERSONALES}  component={FinanzasPersonalesScreen} />
        <Stack.Screen name={ROUTES.FINANZAS_PAREJA}      component={FinanzasParejaScreen} />
        <Stack.Screen name={ROUTES.SIMULADORES}          component={SimuladoresScreen} />
        <Stack.Screen name={ROUTES.SIMULADOR_CDT}        component={CDTScreen} />
        <Stack.Screen name={ROUTES.SIMULADOR_DEUDA}      component={DeudaBancoScreen} />
        <Stack.Screen name={ROUTES.SIMULADOR_EMERGENCIA} component={FondoEmergenciaScreen} />
        <Stack.Screen name={ROUTES.SIMULADOR_AHORRO}     component={AhorroScreen} />
        <Stack.Screen name={ROUTES.SIMULADOR_PENSION}    component={PlanPensionScreen} />
        <Stack.Screen name={ROUTES.SIMULADOR_PRESTAMOS}  component={PrestamosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
