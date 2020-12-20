// import { StatusBar } from 'expo-status-bar'
import React from 'react';
import { StatusBar, View } from 'react-native'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { GameContextType } from './src/types/types'
import StartScreen from './src/screens/1 Start'
import SettingsScreen from './src/screens/2 Settings'
import IntroductionScreen from './src/screens/3 Introduction'
import RolesScreen from './src/screens/4 Roles'
import ItemsScreen from './src/screens/5 Items'
import NightTimeScreen from './src/screens/NightTime'
import MorningTimeScreen from './src/screens/MorningTime'
import DayTimeScreen from './src/screens/DayTime'

export type RootStackParamList = {
  StartScreen: undefined
  SettingsScreen: undefined
  IntroductionScreen: undefined
  RolesScreen: {Mode:string, PlayerCount:number}
  ItemsScreen: {Mode:string}
  NightTimeScreen: undefined
  MorningTimeScreen: undefined
  DayTimeScreen: undefined
};

const RootStack = createStackNavigator<RootStackParamList>()
export const GameContext = React.createContext({} as GameContextType)

export default function App() {
  return (
    <View style={{ flex: 1,  marginTop: StatusBar.currentHeight }}>
      <GameContext.Provider value={{
        mode: 'normal',
        playerCount: 4,
        killsRequired: 0,
        roleCounts: [],
        playersInfo: [],
        dayNumber: 0,
        blackenedAttack: -1,
        alterEgoAlive: true,
        monomiExploded: false,
        monomiProtect: -1,
        vicePlayed: false,
        currentPlayerIndex: 0
        }}>
        <NavigationContainer>
          <RootStack.Navigator>
            <RootStack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name="IntroductionScreen" component={IntroductionScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name="RolesScreen" component={RolesScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name="ItemsScreen" component={ItemsScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name="NightTimeScreen" component={NightTimeScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name="MorningTimeScreen" component={MorningTimeScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name="DayTimeScreen" component={DayTimeScreen} options={{ headerShown: false }}/>
          </RootStack.Navigator>
        </NavigationContainer>
      </GameContext.Provider>
    </View>
  );
}
