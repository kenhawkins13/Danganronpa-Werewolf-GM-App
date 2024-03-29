import React from 'react'
import { View, Text, ImageBackground, Image, Linking } from 'react-native'
import NavigationBar from '../components/NavigationBar'
import { appStyle } from '../styles/styles'
import * as Speech from 'expo-speech'
import SpeakerButton from '../components/SpeakerButton'
import { backgrounds } from '../assets/backgrounds/backgrounds'
import { images } from '../assets/images/images'
import { useNavigation } from '@react-navigation/native'

export default function DisclaimerScreen({setScreen}:Props) {
  const { navigate } = useNavigation<any>()
  
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1, padding: '2.5%'}} source={backgrounds.main}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Image style={{flex: 1, resizeMode: 'contain', marginTop: '10%'}} source={images.monokuma}/>
        </View>
        <View style={{flex: 8}}>
          <View style={{...appStyle.frame, flex: 1, padding: '5%', margin: '2.5%'}}>
            <View style={{left: '100%', top: '2.5%', position: 'absolute'}}>
              <SpeakerButton speech={speech}/>
            </View>
            <Text style={{...appStyle.text, alignSelf: 'center'}}>
              -Disclaimer-
            </Text>
            <Text style={appStyle.text}>
              {"\n"}
              {body1}
              {"\n"}
            </Text>
            <Text style={{...appStyle.text, color: 'lightblue'}} onPress={() => Linking.openURL('https://boardgamegeek.com/filepage/193246/danganronpa-rules')}>
            https://boardgamegeek.com/filepage/193246/danganronpa-rules
            </Text>
            <Text style={appStyle.text}>
              {"\n"}
              {body2}
              {"\n"}
            </Text>
            <Text style={{...appStyle.text, color: 'lightblue'}} onPress={() => Linking.openURL('https://boardgamegeek.com/filepage/193245/translated-cards-print-play')}>
              https://boardgamegeek.com/filepage/193245/translated-cards-print-play
            </Text>
            <Text style={appStyle.text}>
              {"\n"}
              {body3} 
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar onNext={() => {
            Speech.stop()
            setScreen('IntroductionScreen')
          }} onPrevious={() => {
            Speech.stop()
            navigate('StartScreen')
          }}/>
        </View>
      </ImageBackground>
    </View>
  )
}

type Props = {setScreen:React.Dispatch<any>}

const body1 = 'This app replaces the Monokuma (Gamemaster) role in the Danganronpa 1·2 Ultimate High School Werewolf \
card game. So now, all the players can participate in the fun killing game. The summary of the rules can be found here:'
const body2 = 'The cards for the game can be found here:'
const body3 = 'We hope this app allows you to share the Danganronpa experience with your friends. Enjoy!'
const speech = 'This app replaces the Mownohkuma, game master, role in the Dawngawnrownpa 1, 2, Ultimate High School Werewolf \
card game. So now, all the players can participate in the fun killing game. The summary of the rules can be found here. \
The cards for the game can be found here. \
We hope this app allows you to share the Dawngawnrownpa experience with your friends. Enjoy!'