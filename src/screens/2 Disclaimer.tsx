import React from 'react'
import { View, Text, ImageBackground, Image, Linking, TouchableHighlight } from 'react-native'
import NavigationBar from '../components/NavigationBar'
import { appStyle } from '../styles/styles'
import * as Speech from 'expo-speech'

export default function DisclaimerScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1, padding: '2.5%'}} source={require('../assets/background/Setup.png')}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Image style={{flex: 1, resizeMode: 'contain', marginTop: '10%'}} source={require('../assets/images/Monokuma.png')}/>
        </View>
        <View style={{flex: 8}}>
          <View style={{...appStyle.frame, flex: 1, padding: '5%', margin: '2.5%'}}>
          <View style={{height: 28, justifyContent: 'center'}}>
              <Text style={{...appStyle.text, textAlign: 'center'}}>
                -Disclaimer-
              </Text>
              <TouchableHighlight style={{height: 28, width: 28, position:'absolute', right: 0}} 
                onPress={async() => {
                  if (await Speech.isSpeakingAsync() === true) {
                    await Speech.stop()
                  } else {
                    Speech.speak(speech1 + ' ' + speech2)
                  }
                }}>
                <Image style={{height: 28, width: 28,}} source={require('../assets/images/Speaker.png')}/>
              </TouchableHighlight>
            </View>
            <View>
              <Text style={appStyle.text}>
                {"\n"}
                {body1}
                {"\n"}
              </Text>
              <Text style={{...appStyle.text, color: 'lightblue'}} onPress={() => Linking.openURL('https://boardgamegeek.com/filepage/193245/translated-cards-print-play')}>
                https://boardgamegeek.com/filepage/193245/translated-cards-print-play
              </Text>
              <Text style={appStyle.text}>
                {"\n"}
                {body2} 
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar previousPage='StartScreen' nextPage='IntroductionScreen' onNext={() => {
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

const body1 = 'This app replaces the Monokuma (Gamemaster) role in the Danganronpa 1·2 Ultimate High School Werewolf \
card game. So now, all the players can participate in the fun killing game. The cards from the original \
game are still required to play and they can be found here:'
const body2 = 'We hope this app allows you to share the Danganronpa experience with your friends. Enjoy!'
const speech1 = 'This app replaces the Moenoekuma, game master, role in the Dawngawnrownpa 1, 2, Ultimate High School Werewolf \
card game. So now, all the players can participate in the fun killing game. The cards from the original \
game are still required to play and can be found here.'
const speech2 = 'We hope this app allows you to share the Dawngawnrownpa experience with your friends. Enjoy!'