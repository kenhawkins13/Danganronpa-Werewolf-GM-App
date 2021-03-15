import React, { useState } from 'react'
import { StatusBar, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { GameContext, MUSIC_VOLUME_DEFAULT } from './AppContext'
import AppLoading from 'expo-app-loading'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import { music } from './src/assets/music/music'
import { videos } from './src/assets/videos/videos'

import StartScreen from './src/screens/1 Start'
import DisclaimerScreen from './src/screens/2 Disclaimer'
import IntroductionScreen from './src/screens/3 Introduction'
import RolesScreen from './src/screens/5 Roles'
import ItemsScreen from './src/screens/6 Items'
import DirectionScreen from './src/screens/7 Direction'
import PlayersScreen from './src/screens/8 Players'
import SchoolAnnouncementScreen from './src/screens/9 SchoolAnnouncement'
import GameScreen from './src/screens/10 GameScreen'
import NightTimeScreen from './src/screens/10 NightTime'
import MorningTimeScreen from './src/screens/10 MorningTime'
import DayTimeScreen from './src/screens/10 DayTime'
import WinnerDeclarationScreen from './src/screens/11 WinnerDeclaration'
import { sounds } from './src/assets/sounds/sounds'
import { images } from './src/assets/images/images'
import { backgrounds } from './src/assets/backgrounds/backgrounds'
import { characters } from './src/assets/CharacterCards/characters'
import { items } from './src/assets/ItemCards/items'
import { roles } from './src/assets/RoleCards/roles'
import { fonts } from './src/assets/fonts/fonts'
import CharactersScreen from './src/screens/4 Characters'

export type RootStackParamList = {
  StartScreen: undefined
  DisclaimerScreen: undefined
  IntroductionScreen: undefined
  CharactersScreen: undefined
  RolesScreen: undefined
  ItemsScreen: undefined
  DirectionScreen: undefined
  PlayersScreen: undefined
  SchoolAnnouncementScreen: undefined
  GameScreen:undefined
  NightTimeScreen: undefined
  MorningTimeScreen: undefined
  DayTimeScreen: undefined
  WinnerDeclarationScreen:undefined
}

const RootStack = createStackNavigator<RootStackParamList>()

export default function App() {
  const [isReady, setIsReady] = useState(false)

  async function loadAssetsAsync() {
    const assets = [
      ...Object.values(backgrounds),
      ...Object.values(characters),
      ...Object.values(fonts),
      ...Object.values(images),
      ...Object.values(items),
      ...music,
      ...Object.values(roles),
      ...Object.values(sounds),
      ...videos
    ]
    const cachedImages = assets.map(asset => { Asset.fromModule(asset).downloadAsync() })
    const cachedFonts = [Font.loadAsync({goodbyeDespair: fonts.goodbyeDespair})]

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
          tieVoteCount: 0,
          winnerSide: '',
          backgroundMusic: '',
          musicVolume: MUSIC_VOLUME_DEFAULT
          }}>
          <NavigationContainer>
            <RootStack.Navigator>
              <RootStack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="DisclaimerScreen" component={DisclaimerScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="IntroductionScreen" component={IntroductionScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="CharactersScreen" component={CharactersScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="RolesScreen" component={RolesScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="ItemsScreen" component={ItemsScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="DirectionScreen" component={DirectionScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="PlayersScreen" component={PlayersScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="SchoolAnnouncementScreen" component={SchoolAnnouncementScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="GameScreen" component={GameScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="NightTimeScreen" component={NightTimeScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="MorningTimeScreen" component={MorningTimeScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="DayTimeScreen" component={DayTimeScreen} options={{ headerShown: false }}/>
              <RootStack.Screen name="WinnerDeclarationScreen" component={WinnerDeclarationScreen} options={{ headerShown: false }}/>
            </RootStack.Navigator>
          </NavigationContainer>
        </GameContext.Provider>
      </View>
    )
  }
}
