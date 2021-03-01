import { useIsFocused } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View, Text, ImageBackground, Image, TouchableHighlight } from 'react-native'
import NavigationBar from '../components/NavigationBar'
import { appStyle } from '../styles/styles'
import * as ScreenOrientation from 'expo-screen-orientation'
import { OrientationLock } from 'expo-screen-orientation'
import * as Speech from 'expo-speech'

export default function DirectionScreen() {
    const isFocused = useIsFocused()
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
            <View style={{height: 28, justifyContent: 'center'}}>
              <Text style={{...appStyle.text, textAlign: 'center'}}>
                -Setup-
              </Text>
              <TouchableHighlight style={{height: 28, width: 28, position:'absolute', right: 0}} 
                onPress={async() => {
                  if (await Speech.isSpeakingAsync() === true) {
                    await Speech.stop()
                  } else {
                    Speech.speak(speech)
                  }
                }}>
                <Image style={{height: 28, width: 28,}} source={require('../assets/images/Speaker.png')}/>
              </TouchableHighlight>
            </View>
            <View style={{flex:1}}>
              <Text style={{...appStyle.text}}>
                {"\n"}
                {body1}
              </Text>
              <Image source={require('../assets/images/Table.png')} 
                style={{flex: 1, resizeMode: 'contain', alignSelf: 'center', margin: '5%'}}/>
              <Text style={{...appStyle.text}}>
                {body2}
              </Text>
            </View>
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
their name and role.\n\nAdditionaly, use the speaker icon to test out the volume so that everyone can hear the instructions clearly.\
\n\nDon't forget to turn off your phone's screen timeout."
const speech = "Place your phone in the center of the play area like so. On the next page, have each player click on the slot \
corresponding to their seating position and enter their name and role. Additionaly, use the speaker icon to test out the volume \
so that everyone can hear the instructions clearly. Don't forget to turn off your phone's screen timeout."
