import { useIsFocused } from '@react-navigation/native'
import React, { useContext, useEffect } from 'react'
import { View, Text, ImageBackground, Image } from 'react-native'
import NavigationBar from '../components/NavigationBar'
import { appStyle } from '../styles/styles'
import * as ScreenOrientation from 'expo-screen-orientation'
import { OrientationLock } from 'expo-screen-orientation'
import { GameContext } from '../../AppContext'

export default function DirectionScreen() {
  const gameContext = useContext(GameContext)
    // Check if screen is focused
    const isFocused = useIsFocused()
    // Listen for isFocused. If useFocused changes, force re-render by setting state
    useEffect(() => { if (isFocused) {
      ScreenOrientation.lockAsync(OrientationLock.PORTRAIT)
    }})

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1, padding: '2.5%'}} source={require('../assets/background/Setup.png')}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Image style={{flex: 1, resizeMode: 'contain', marginTop: '10%'}} source={require('../assets/images/Monokuma.png')}/>
        </View>
        <View style={{ flex: 8 }}>
          <View style={{...appStyle.frame, flex: 1, padding: '5%', margin: '2.5%'}}>
            <Text style={{...appStyle.text, textAlign: 'center'}}>
              -Input Roles-
            </Text>
            <Text style={{...appStyle.text}}>
              {"\n"}
              Place your phone in the center of the play area like so:
            </Text>
            <Image source={require('../assets/images/Table.png')} style={{flex: 1, resizeMode: 'contain', alignSelf: 'center', margin: '5%'}}/>
            <Text style={{...appStyle.text}}>
              On the next page, have each player click the slot corresponding to their seating position and have them enter 
              their name and role. Do not swap seating as some of the later gameplay will be affected.
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar previousPage='ItemsScreen' nextPage='PlayersScreen'/>
        </View>
      </ImageBackground>
    </View>
  )
}
