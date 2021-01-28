import React, { useState } from 'react';
import { StatusBar, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { GameContext } from './AppContext'
import AppLoading from 'expo-app-loading'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'

import StartScreen from './src/screens/1 Start'
import DisclaimerScreen from './src/screens/2 Disclaimer'
import IntroductionScreen from './src/screens/3 Introduction'
import RolesScreen from './src/screens/4 Roles'
import ItemsScreen from './src/screens/5 Items'
import DirectionScreen from './src/screens/6 Direction'
import PlayersScreen from './src/screens/7 Players'
import NightTimeScreen from './src/screens/NightTime'
import MorningTimeScreen from './src/screens/MorningTime'
import DayTimeScreen from './src/screens/DayTime'

export type RootStackParamList = {
  StartScreen: undefined
  DisclaimerScreen: undefined
  IntroductionScreen: undefined
  RolesScreen: undefined
  ItemsScreen: undefined
  DirectionScreen: undefined
  PlayersScreen: undefined
  NightTimeScreen: undefined
  MorningTimeScreen: undefined
  DayTimeScreen: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()

export default function App() {
  const [isReady, setIsReady] = useState(false)

  async function loadAssetsAsync() {
    const assets = [
      require('./src/assets/background/Despair-Victory.png'),
      require('./src/assets/background/Ding-Dong-Bing-Bong.jpg'),
      require('./src/assets/background/Hope-Victory.png'),
      require('./src/assets/background/School-Announcement.png'),
      require('./src/assets/background/Setup.png'),
      require('./src/assets/background/Start.png'),
      require('./src/assets/background/Trial-Room.png'),
      require('./src/assets/background/Ultimate-Despair-Victory.png'),
      require('./src/assets/fonts/goodbyeDespair.ttf'),
      require('./src/assets/images/Green-Check.png'),
      require('./src/assets/images/Monokuma.png'),
      require('./src/assets/images/Red-X.png'),
      require('./src/assets/images/Speaker.png'),
      require('./src/assets/images/Table.png'),
      require('./src/assets/ItemCards/Alter-Ball.png'),
      require('./src/assets/ItemCards/Reverse.jpg'),
      require('./src/assets/RoleCards/Alter-Ego.png'),
      require('./src/assets/RoleCards/Blackened.png'),
      require('./src/assets/RoleCards/Despair-Disease-Patient.png'),
      require('./src/assets/RoleCards/Monomi.png'),
      require('./src/assets/RoleCards/Spotless.png'),
      require('./src/assets/RoleCards/Traitor.png'),
      require('./src/assets/RoleCards/Ultimate-Despair.png'),
      require('./src/assets/sounds/Dangan-Ronpa!.mp3'),
      require('./src/assets/sounds/Ding-Dong-Bing-Bong.mp3'),
      require('./src/assets/sounds/Revolver.mp3'),
      require('./src/assets/video/Ding-Dong-Bing-Bong.mp4'),
      require("./src/assets/music/DaytimeCalm/Beautiful-Days.mp3"),
      require("./src/assets/music/DaytimeCalm/Beautiful-Days-[Piano-Arrangement].mp3"),
      require("./src/assets/music/DaytimeCalm/Beautiful-Dead.mp3"),
      require("./src/assets/music/DaytimeCalm/Beautiful-Morning.mp3"),
      require("./src/assets/music/DaytimeCalm/Beautiful-Ruin.mp3"),
      require("./src/assets/music/DaytimeAggressive/Box-15.mp3"),
      require("./src/assets/music/DaytimeAggressive/Box-16.mp3"),
      require("./src/assets/music/DaytimeAggressive/Ekoroshia.mp3"),
      require("./src/assets/music/DaytimeAggressive/Ikoroshia.mp3"),
      require("./src/assets/music/ClassTrial/Discussion-BREAK.mp3"),
      require("./src/assets/music/ClassTrial/Discussion-HEAT-UP.mp3"),
      require("./src/assets/music/ClassTrial/Discussion-HOPE-VS-DESPAIR.mp3"),
      require("./src/assets/music/ClassTrial/Discussion-MIX.mp3"),
      require("./src/assets/music/NightTime/A-Dead-End-to-the-Ocean's-Aroma.mp3"),
      require("./src/assets/music/NightTime/Desire-for-Execution.mp3"),
      require("./src/assets/music/NightTime/Despair-Syndrome-1.mp3"),
      require("./src/assets/music/NightTime/Despair-Syndrome-2.mp3"),
      require("./src/assets/music/NightTime/Mr.-Monokuma's-Lesson.mp3"),
      require("./src/assets/music/NightTime/Mr.-Monokuma's-Tutoring.mp3"),
      require("./src/assets/music/NightTime/Weekly-Despair-Magazine.mp3"),
      require("./src/assets/music/NightTime/Welcome-to-Despair-Academy.mp3"),
      require("./src/assets/music/End/Climax-Reasoning.mp3")
    ]
    const cachedImages = assets.map(asset => { Asset.fromModule(asset).downloadAsync() })
    const cachedFonts = [Font.loadAsync({goodbyeDespair: require('./src/assets/fonts/goodbyeDespair.ttf')})]

    return await Promise.all([...cachedImages, ...cachedFonts]) as unknown as void
  }

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadAssetsAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    )
  } else {
    return (
      <View style={{flex: 1}}>
        <StatusBar hidden/>
        <GameContext.Provider value={{
          mode: 'normal',
          playerCount: 4,
          killsLeft: 0,
          roleCounts: [],
          playersInfo: [],
          dayNumber: 0,
          blackenedAttack: -1,
          alterEgoAlive: true,
          monomiExploded: false,
          monomiProtect: -1,
          vicePlayed: false,
          tieVote: false
          }}>
          <NavigationContainer>
            <RootStack.Navigator>
              <RootStack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="DisclaimerScreen" component={DisclaimerScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="IntroductionScreen" component={IntroductionScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="RolesScreen" component={RolesScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="ItemsScreen" component={ItemsScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="DirectionScreen" component={DirectionScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="PlayersScreen" component={PlayersScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="NightTimeScreen" component={NightTimeScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="MorningTimeScreen" component={MorningTimeScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="DayTimeScreen" component={DayTimeScreen} options={{ headerShown: false }}/>
            </RootStack.Navigator>
          </NavigationContainer>
        </GameContext.Provider>
      </View>
    )
  }
}
