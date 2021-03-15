import { useIsFocused } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View, Text, ImageBackground, Image } from 'react-native'
import NavigationBar from '../components/NavigationBar'
import { appStyle } from '../styles/styles'
import * as ScreenOrientation from 'expo-screen-orientation'
import { OrientationLock } from 'expo-screen-orientation'
import * as Speech from 'expo-speech'
import SpeakerButton from '../components/SpeakerButton'
import { backgrounds } from '../assets/backgrounds/backgrounds'
import { images } from '../assets/images/images'

export default function DirectionScreen() {
    const isFocused = useIsFocused()
    useEffect(() => { if (isFocused) {
      ScreenOrientation.lockAsync(OrientationLock.PORTRAIT)
    }})

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1, padding: '2.5%'}} source={backgrounds.main}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Image style={{flex: 1, resizeMode: 'contain', marginTop: '10%'}} source={images.monokuma}/>
        </View>
        <View style={{ flex: 8 }}>
          <View style={{...appStyle.frame, flex: 1, padding: '5%', margin: '2.5%'}}>
            <View style={{left: '100%', top: '2.5%', position: 'absolute'}}>
              <SpeakerButton speech={speech}/>
            </View>
            <Text style={{...appStyle.text, textAlign: 'center'}}>
              -Setup-
            </Text>
            <Text style={{...appStyle.text}}>
              {"\n"}
              {body1}
            </Text>
            <Image source={images.table} 
              style={{flex: 1, resizeMode: 'contain', alignSelf: 'center', margin: '5%'}}/>
            <Text style={{...appStyle.text}}>
              {body2}
              </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar previousPage='ItemsScreen' nextPage='PlayersScreen' onNext={() => {
            Speech.stop()
            return true
          }} onPrevious={() => {
            Speech.stop()
            return true
          }}/>
        </View>
      </ImageBackground>
    </View>
  )
}

const body1 = "Place your phone in the center of the play area like so:"
const body2 = "On the next page, have each player click on the slot corresponding to their seating position and enter \
their name and role.\n\nDon't forget to turn off your phone's screen timeout."
const speech = "Place your phone in the center of the play area like so. On the next page, have each player click on the slot \
corresponding to their seating position and enter their name and role. Don't forget to turn off your phone's screen timeout."
