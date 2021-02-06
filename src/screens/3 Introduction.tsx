import React, { useEffect } from 'react'
import { View, Text, ImageBackground, Image, TouchableHighlight } from 'react-native'
import NavigationBar from '../components/NavigationBar'
import { appStyle } from '../styles/styles'
import * as Speech from 'expo-speech'
import { useIsFocused } from '@react-navigation/native'
import * as ScreenOrientation from 'expo-screen-orientation'
import { Audio } from 'expo-av'
import { monokumaMusic } from '../assets/music/music'

let backgroundMusic:Audio.Sound

export default function IntroductionScreen() {
  
  const isFocused = useIsFocused()
  useEffect(() => { if (isFocused) {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    playMusic()
  }}, [isFocused])
  
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
                -Introduction-
              </Text>
              <TouchableHighlight style={{height: 28, width: 28, position:'absolute', right: 0}} 
                onPress={async() => {
                  await Speech.stop()
                  Speech.speak(speech1 + ' ' + speech2)
                }}>
                <Image style={{height: 28, width: 28,}} source={require('../assets/images/Speaker.png')}/>
              </TouchableHighlight>
            </View>
            <View>
              <Text style={{...appStyle.text}}>
                {"\n"}
                {body1}
                {"\n\n"}
                {body2}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar previousPage='DisclaimerScreen' nextPage='RolesScreen' onPrevious={() => {
            backgroundMusic.unloadAsync()
            Speech.stop()
            return true
          }} onNext={() => {
            backgroundMusic.unloadAsync()
            Speech.stop()
            return true
          }}/>
        </View>
      </ImageBackground>
    </View>
  )
}

async function playMusic() {
  const { sound } = await Audio.Sound.createAsync(monokumaMusic[0])
  await sound.playAsync()
  await sound.setVolumeAsync(.1)
  backgroundMusic = sound
}

const body1 = "Ahem... students. Welcome to Hope's Peak Academy! I am your adorable headmaster, Monokuma!"
const body2 = "Now, I'm sure all of you want out of this school as quick as possible, but I can't allow that. \
I would be failing in my role as headmaster. Instead, to strengthen your bond as students of this \
academy, you will be playing a game filled with thrills, chills, and kills. A game of ultimate \
Werewolf for the ultimate students.\n\nHow exciting!"
const speech1 = "Ahem... students. Welcome to Hope's Peak Academy! I am your adorable headmaster, Moenoekuma!"
const speech2 = "Now, I'm sure all of you want out of this school as quick as possible, but I can't allow that. \
I would be failing in my role as headmaster. Instead, to strengthen your bond as students of this \
academy, you will be playing a game filled with thrills, chills, and kills. A game of ultimate \
Werewolf for the ultimate students. How exciting!"
