import React, { useContext, useEffect } from 'react'
import { View, Text, ImageBackground, Image } from 'react-native'
import NavigationBar from '../components/NavigationBar'
import { appStyle } from '../styles/styles'
import * as Speech from 'expo-speech'
import { useIsFocused } from '@react-navigation/native'
import * as ScreenOrientation from 'expo-screen-orientation'
import { Audio } from 'expo-av'
import { monokumaMusic } from '../assets/music/music'
import { GameContext } from '../../AppContext'
import SpeakerButton from '../components/SpeakerButton'
import { backgrounds } from '../assets/backgrounds/backgrounds'
import { images } from '../assets/images/images'

export default function IntroductionScreen({setScreen}:Props) {
  const gameContext = useContext(GameContext)
  
  const isFocused = useIsFocused()
  useEffect(() => { if (isFocused) {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    playMusic()
  }}, [isFocused])
  
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
              -Introduction-
            </Text>
            <Text style={{...appStyle.text}}>
              {"\n"}
              {body1}
              {"\n\n"}
              {body2}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar onPrevious={() => {
            gameContext.backgroundMusic.unloadAsync()
            gameContext.backgroundMusic = ''
            Speech.stop()
            setScreen('DisclaimerScreen')
          }} onNext={() => {
            gameContext.backgroundMusic.unloadAsync()
            gameContext.backgroundMusic = ''
            Speech.stop()
            setScreen('CharactersScreen')
          }}/>
        </View>
      </ImageBackground>
    </View>
  )

  async function playMusic() {
    const { sound } = await Audio.Sound.createAsync(monokumaMusic[0])
    gameContext.backgroundMusic = sound
    await gameContext.backgroundMusic.setVolumeAsync(gameContext.musicVolume)
    await gameContext.backgroundMusic.playAsync()
  }
}

type Props = {setScreen:React.Dispatch<any>}

const body1 = "Ahem... students. Welcome to Hope's Peak Academy! I am your adorable headmaster, Monokuma!"
const body2 = "Now, I'm sure all of you want out of this school as quick as possible, but I can't allow that. \
I would be failing in my role as headmaster. Instead, to strengthen your bond as students of this \
academy, you will be playing a game filled with thrills, chills, and kills. A game of ultimate \
Werewolf for the ultimate students.\n\nHow exciting!"
const speech = "Ahem students. Welcome to Hope's Peak Academy! I am your adorable headmaster, Mownohkuma! \
Now, I'm sure all of you want out of this school as quick as possible, but I can't allow that. \
I would be failing in my role as headmaster. Instead, to strengthen your bond as students of this \
academy, you will be playing a game filled with thrills, chills, and kills. A game of ultimate \
Werewolf for the ultimate students. How exciting!"
