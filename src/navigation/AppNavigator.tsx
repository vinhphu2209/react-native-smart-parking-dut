import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Màn hình cho người dùng chưa đăng nhập
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Màn hình cho người dùng đã đăng nhập
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LinkBankScreen from '../screens/LinkBankScreen';
import TopUpScreen from '../screens/TopUpScreen';

// Stack Navigator cho xác thực
const AuthStack = createNativeStackNavigator();
const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#4a6ea9' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <AuthStack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ headerShown: false }}
    />
  </AuthStack.Navigator>
);

// Stack Navigator cho màn hình liên kết ngân hàng
const BankStack = createNativeStackNavigator();
const BankNavigator = () => (
  <BankStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#4a6ea9' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <BankStack.Screen 
      name="LinkBank" 
      component={LinkBankScreen} 
      options={{ title: 'Liên Kết Ngân Hàng' }}
    />
  </BankStack.Navigator>
);

// Stack Navigator cho màn hình nạp tiền
const TopUpStack = createNativeStackNavigator();
const TopUpNavigator = () => (
  <TopUpStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#4a6ea9' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <TopUpStack.Screen 
      name="TopUp" 
      component={TopUpScreen} 
      options={{ title: 'Nạp Tiền' }}
    />
  </TopUpStack.Navigator>
);

// Tab Navigator cho người dùng đã đăng nhập
const AppTab = createBottomTabNavigator();
const MainTabNavigator = () => (
  <AppTab.Navigator
    screenOptions={({ route }) => ({
      headerStyle: { backgroundColor: '#4a6ea9' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      tabBarActiveTintColor: '#4a6ea9',
      tabBarInactiveTintColor: 'gray',
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'History') {
          iconName = focused ? 'time' : 'time-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
    })}
  >
    <AppTab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ title: 'Trang chủ' }}
    />
    <AppTab.Screen 
      name="History" 
      component={HistoryScreen} 
      options={{ title: 'Lịch sử ra vào' }}
    />
    <AppTab.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ title: 'Tài khoản' }}
    />
  </AppTab.Navigator>
);

// Stack Navigator chính
const MainStack = createNativeStackNavigator();
const AppNavigator = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4a6ea9" />
      </View>
    );
  }
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      {signed ? (
        <>
          <MainStack.Screen name="Main" component={MainTabNavigator} />
          <MainStack.Screen name="BankStack" component={BankNavigator} />
          <MainStack.Screen name="TopUpStack" component={TopUpNavigator} />
        </>
      ) : (
        <MainStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </MainStack.Navigator>
  );
};

export default AppNavigator;
