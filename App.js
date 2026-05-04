import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './src/lib/supabase';
import { ROUTES } from './src/constants/routes';
import LoginScreen from './src/pages/LoginScreen';
import RegisterScreen from './src/pages/RegisterScreen';
import WelcomeScreen from './src/pages/WelcomeScreen';
import ForgotPasswordScreen from './src/pages/ForgotPasswordScreen';
import OTPScreen from './src/pages/OTPScreen';
import ChangePasswordScreen from './src/pages/ChangePasswordScreen';
import FinancesScreen from './src/pages/FinancesScreen';
import PersonalFinancesScreen from './src/pages/PersonalFinancesScreen';
import CoupleFinancesScreen from './src/pages/CoupleFinancesScreen';
import SimulatorsScreen from './src/pages/SimulatorsScreen';
import CDTScreen from './src/pages/CDTScreen';
import BankDebtScreen from './src/pages/BankDebtScreen';
import EmergencyFundScreen from './src/pages/EmergencyFundScreen';
import SavingsScreen from './src/pages/SavingsScreen';
import PensionPlanScreen from './src/pages/PensionPlanScreen';
import LoansScreen from './src/pages/LoansScreen';
import PodcastScreen from './src/pages/PodcastScreen';

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
        <Stack.Screen name={ROUTES.FORGOT_PASSWORD}     component={ForgotPasswordScreen} />
        <Stack.Screen name={ROUTES.OTP_VERIFY}          component={OTPScreen} />
        <Stack.Screen name={ROUTES.CHANGE_PASSWORD}     component={ChangePasswordScreen} />
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
        <Stack.Screen name={ROUTES.SIMULATOR_PODCAST}   component={PodcastScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
