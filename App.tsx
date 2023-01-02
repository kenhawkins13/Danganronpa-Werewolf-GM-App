import React, { useEffect, useState } from 'react'
import { StatusBar, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen';
// import { useKeepAwake } from 'expo-keep-awake'

import { GameContext, MUSIC_VOLUME_DEFAULT } from './AppContext'
import StartScreen from './src/screens/1 Start'
import SettingsScreen from './src/screens/2 SettingsScreen'
import PlayersScreen from './src/screens/3 Players'
import SchoolAnnouncementScreen from './src/screens/4 SchoolAnnouncement'
import GameScreen from './src/screens/5 GameScreen'
import WinnerDeclarationScreen from './src/screens/6 WinnerDeclaration'
import { sounds } from './src/assets/sounds/sounds'
import { images } from './src/assets/images/images'
import { backgrounds } from './src/assets/backgrounds/backgrounds'
import { characters } from './src/assets/CharacterCards/characters'
import { items } from './src/assets/ItemCards/items'
import { roles } from './src/assets/RoleCards/roles'
import { fonts } from './src/assets/fonts/fonts'
import { music } from './src/assets/music/music'
import { videos } from './src/assets/videos/videos'

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

    // useKeepAwake()

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
  
  useEffect(() => {
    async function loadAssets() {
      await loadAssetsAsync()
      setAppIsReady(true)
      SplashScreen.hideAsync()
    }

    loadAssets()
  }, [])

  if (!appIsReady) {
    return null
  }

  return (
    <GameContext.Provider value={{
      mode: 'normal',
      playerCount: 4,
      customizeRolesMode: '',
      roleCountAll: [],
      playersInfo: [],
      dayNumber: 0,
      killsLeft: 0,
      blackenedAttack: -1,
      alterEgoAlive: true,
      monomiExploded: false,
      monomiProtect: -1,
      zakemonoDead: false,
      remnantsOfDespairFound: false,
      nekomaruNidaiEscort: -1,
      nekomaruNidaiIndex: -1,
      vicePlayed: false,
      easterEggIndex: -1,
      tieVoteCount: 0,
      winnerSide: '',
      isMusicPlaying: false,
      backgroundMusic: '',
      musicVolume: MUSIC_VOLUME_DEFAULT
      }}>
      <StatusBar hidden/>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="PlayersScreen" component={PlayersScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="SchoolAnnouncementScreen" component={SchoolAnnouncementScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="GameScreen" component={GameScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="WinnerDeclarationScreen" component={WinnerDeclarationScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </GameContext.Provider>
  )
}
