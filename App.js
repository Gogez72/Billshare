import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import GroupsScreen from './screens/GroupsScreen';
import SettleScreen from './screens/SettleScreen';
import PremiumScreen from './screens/PremiumScreen';
import { initializeUserPremium } from './utils/premiumService';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const existingData = await AsyncStorage.getItem('billshareData');
      if (!existingData) {
        const initialData = {
          groups: [],
          expenses: [],
          friends: []
        };
        await AsyncStorage.setItem('billshareData', JSON.stringify(initialData));
      }
      
      // Initialize premium/subscription data
      await initializeUserPremium();
      
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing data:', error);
      setIsReady(true);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'AddExpense') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Groups') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Settle') {
              iconName = focused ? 'checkmark-done' : 'checkmark-done-outline';
            } else if (route.name === 'Premium') {
              iconName = focused ? 'star' : 'star-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6C63FF',
          tabBarInactiveTintColor: '#999',
          headerShown: true,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Dashboard' }} 
        />
        <Tab.Screen 
          name="AddExpense" 
          component={AddExpenseScreen} 
          options={{ title: 'Add Expense' }} 
        />
        <Tab.Screen 
          name="Groups" 
          component={GroupsScreen} 
          options={{ title: 'Groups' }} 
        />
        <Tab.Screen 
          name="Settle" 
          component={SettleScreen} 
          options={{ title: 'Settle Up' }} 
        />
        <Tab.Screen 
          name="Premium" 
          component={PremiumScreen} 
          options={{ title: 'Premium' }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
