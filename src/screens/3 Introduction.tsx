import React from 'react'
import { View, Text, ImageBackground, Image, TouchableHighlight } from 'react-native'
import NavigationBar from '../components/NavigationBar'
import { appStyle } from '../styles/styles'
import * as Speech from 'expo-speech'

export default function IntroductionScreen() {  
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1, padding: '2.5%'}} source={require('../assets/background/Setup.png')}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Image style={{flex: 1, resizeMode: 'contain', marginTop: '10%'}} source={require('../assets/images/Monokuma.png')}/>
        </View>
        <View style={{ flex: 8 }}>
          <View style={{...appStyle.frame, flex: 1, padding: '5%', margin: '2.5%'}}>
            <Text style={{...appStyle.text, alignSelf: 'center', textAlign: 'center'}}>
              -Introduction-
            </Text>
            <TouchableHighlight style={{height: 15, width: 15, alignSelf: 'flex-end'}} 
              onPress={async() => {
                await Speech.stop()
                Speech.speak(text1 + ' ' + text2)
              }}>
              <Image style={{height: 15, width: 15,}} source={require('../assets/images/Speaker.png')}/>
            </TouchableHighlight>
            <Text style={{...appStyle.text}}>
              {"\n"}
              {text1}
              {"\n\n"}
              {text2}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar previousPage='DisclaimerScreen' nextPage='RolesScreen' onNext={() => {
            Speech.stop()
            return true
          }}></NavigationBar>
        </View>
      </ImageBackground>
    </View>
  )
}

const text1 = "Ahem... students. Welcome to Hope's Peak Academy! I am your adoorable headmaster, Monokuma!"
const text2 = "Now, I'm sure all of you want out of this school as quick as possible, but I can't allow that. \
I would be failing in my role as headmaster. Instead, to strenthen your bond as students of this \
academy, you will be playing a game filled with thrills, chills, and kills. A game of ultimate \
Werewolf for the ultimate students. How exciting!"
