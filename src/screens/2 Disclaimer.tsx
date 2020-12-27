import React from 'react'
import { View, Text, ImageBackground, Image, Linking } from 'react-native'
import NavigationBar from '../components/NavigationBar'
import { appStyle } from '../styles/styles'

export default function DisclaimerScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1, padding: '2.5%'}} source={require('../assets/background/Setup.png')}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Image style={{flex: 1, resizeMode: 'contain', marginTop: '10%'}} source={require('../assets/images/Monokuma.png')}/>
        </View>
        <View style={{flex: 8}}>
          <View style={{...appStyle.frame, flex: 1, padding: '5%', margin: '2.5%'}}>
            <Text style={{...appStyle.text, textAlign: 'center'}}>
              -Disclaimer-
              {"\n"}
            </Text>
            <Text style={appStyle.text}>
              This app replaces the Monokuma (Gamemaster) role in the Danganronpa 1·2 Ultimate High School Werewolf 
              card game. So now, all the players can participate in the fun killing game. The cards from the original 
              game are still required to play this game and they can be found here:
            </Text>
            <Text style={{...appStyle.text, color: 'lightblue'}} onPress={() => Linking.openURL('https://boardgamegeek.com/filepage/193245/translated-cards-print-play')}>
              https://boardgamegeek.com/filepage/193245/translated-cards-print-play
            </Text>
            <Text style={appStyle.text}>
              {"\n"}
              We hope this app allows you to share the Danganronpa experience with your friends. Enjoy! 
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar previousPage='StartScreen' nextPage='IntroductionScreen'></NavigationBar>
        </View>
      </ImageBackground>
    </View>
  )
}
