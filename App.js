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
import FinancesScreen from './screens/FinancesScreen';
import PersonalFinancesScreen from './screens/PersonalFinancesScreen';
import CoupleFinancesScreen from './screens/CoupleFinancesScreen';
import SimulatorsScreen from './screens/SimulatorsScreen';
import CDTScreen from './screens/CDTScreen';
import BankDebtScreen from './screens/BankDebtScreen';
import EmergencyFundScreen from './screens/EmergencyFundScreen';
import SavingsScreen from './screens/SavingsScreen';
import PensionPlanScreen from './screens/PensionPlanScreen';
import LoansScreen from './screens/LoansScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        initialRouteName={session ? ROUTES.FINANCES : ROUTES.LOGIN}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name={ROUTES.LOGIN}               component={LoginScreen} />
        <Stack.Screen name={ROUTES.REGISTER}            component={RegisterScreen} />
        <Stack.Screen name={ROUTES.WELCOME}             component={WelcomeScreen} />
        <Stack.Screen name={ROUTES.FINANCES}            component={FinancesScreen} />
        <Stack.Screen name={ROUTES.PERSONAL_FINANCES}   component={PersonalFinancesScreen} />
        <Stack.Screen name={ROUTES.COUPLE_FINANCES}     component={CoupleFinancesScreen} />
        <Stack.Screen name={ROUTES.SIMULATORS}          component={SimulatorsScreen} />
        <Stack.Screen name={ROUTES.SIMULATOR_CDT}       component={CDTScreen} />
        <Stack.Screen name={ROUTES.SIMULATOR_DEBT}      component={BankDebtScreen} />
        <Stack.Screen name={ROUTES.SIMULATOR_EMERGENCY} component={EmergencyFundScreen} />
        <Stack.Screen name={ROUTES.SIMULATOR_SAVINGS}   component={SavingsScreen} />
        <Stack.Screen name={ROUTES.SIMULATOR_PENSION}   component={PensionPlanScreen} />
        <Stack.Screen name={ROUTES.SIMULATOR_LOANS}     component={LoansScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
