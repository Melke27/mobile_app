import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ReportItemScreen from '../screens/ReportItemScreen';
import SearchScreen from '../screens/SearchScreen';
import SavedItemsScreen from '../screens/SavedItemsScreen';
import ItemDetailScreen from '../screens/ItemDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import VerificationScreen from '../screens/VerificationScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_META = {
  Home: { icon: '🏠', label: 'Home Feed' },
  Report: { icon: '📝', label: 'Report Item' },
  Search: { icon: '🔎', label: 'Search' },
  Saved: { icon: '⭐', label: 'Saved' },
  Alerts: { icon: '🔔', label: 'Alerts' },
  Verify: { icon: '✅', label: 'Verify' },
  Admin: { icon: '🛡️', label: 'Admin' },
};

const MainTabs = ({ isAdmin }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#ffffff' },
        headerShadowVisible: false,
        headerTintColor: '#103943',
        headerTitleStyle: { fontWeight: '800' },
        tabBarActiveTintColor: '#0b7285',
        tabBarInactiveTintColor: '#688189',
        tabBarLabelStyle: { fontWeight: '700', fontSize: 12 },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#d7e6ea',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: '#f9feff',
        },
        tabBarIcon: ({ color, focused }) => (
          <Text style={{ fontSize: focused ? 18 : 16, color }}>{TAB_META[route.name]?.icon || '⬤'}</Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: TAB_META.Home.label }} />
      <Tab.Screen name="Report" component={ReportItemScreen} options={{ title: TAB_META.Report.label }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: TAB_META.Search.label }} />
      <Tab.Screen name="Saved" component={SavedItemsScreen} options={{ title: TAB_META.Saved.label }} />
      <Tab.Screen name="Alerts" component={NotificationsScreen} options={{ title: TAB_META.Alerts.label }} />
      <Tab.Screen name="Verify" component={VerificationScreen} options={{ title: TAB_META.Verify.label }} />
      {isAdmin && <Tab.Screen name="Admin" component={AdminDashboardScreen} options={{ title: TAB_META.Admin.label }} />}
    </Tab.Navigator>
  );
};

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
    <Stack.Screen name="ItemDetail" component={ItemDetailScreen} options={{ title: 'Item Details' }} />
  </Stack.Navigator>
);

const AppStack = ({ isAdmin }) => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen name="Main" options={{ headerShown: false }}>
      {() => <MainTabs isAdmin={isAdmin} />}
    </Stack.Screen>
    <Stack.Screen name="ItemDetail" component={ItemDetailScreen} options={{ title: 'Item Details' }} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <AppStack isAdmin={isAdmin} /> : <AuthStack />;
};

export default AppNavigator;
