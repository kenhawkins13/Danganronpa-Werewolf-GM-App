import React, { useContext, useEffect } from 'react'
import { View, Text, ImageBackground, Image } from 'react-native'
import NavigationBar from '../components/NavigationBar'
import { appStyle, imageStyles } from '../styles/styles'
import { GameContext } from '../../AppContext'
import { useIsFocused } from '@react-navigation/native'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as Speech from 'expo-speech'
import { Audio } from 'expo-av'
import { daytimeCalmMusic } from '../assets/music/music'
import { colors } from '../styles/colors'
import SpeakerButton from '../components/SpeakerButton'
import { backgrounds } from '../assets/backgrounds/backgrounds'
import { images } from '../assets/images/images'
import { characters } from '../assets/CharacterCards/characters'

let isMusicPlaying = false
const updateMusicStatus = playbackStatus => { isMusicPlaying = playbackStatus.isPlaying }

export default function CharactersScreen() {
  const gameContext = useContext(GameContext)
  
  const isFocused = useIsFocused()
  useEffect(() => { if (isFocused) {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    if (!isMusicPlaying) { playMusic() }    
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
              <SpeakerButton speech={speech(gameContext.mode)}/>
            </View>
            <View>
              <Text style={{...appStyle.text, textAlign: 'center'}}>
                -Characters-
              </Text>
              <Text style={{...appStyle.text}}>
                {"\n"}
                {body(gameContext.mode)}
              </Text>
            </View>
            <View style={{borderBottomColor: colors.white, borderBottomWidth: 2, marginVertical: 10}}/>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginVertical: '2.5%'}}>
              <View style={{flex: 1}}/>
              <View style={{flex: 3}}>
                <Image source={characters.makotoNaegi} style={imageStyles.cards}/>
              </View>
              <View style={{flex: 1}}/>
              <View style={{flex: 3}}>
                <Image source={characters.reverse} style={imageStyles.cards}/>
              </View>
              <View style={{flex: 1}}/>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar previousPage='IntroductionScreen' nextPage='RolesScreen'onPrevious={() => {
            isMusicPlaying = false
            gameContext.backgroundMusic.unloadAsync()
            Speech.stop()
            return true
          }} onNext={() => {
            Speech.stop()
            return true
          }}/>
        </View>
      </ImageBackground>
    </View>
  )
  
  async function playMusic() {
    const randomNum = Math.floor(Math.random() * 5)
    const { sound } = await Audio.Sound.createAsync(daytimeCalmMusic[randomNum], {}, updateMusicStatus)
    gameContext.backgroundMusic = sound
    await gameContext.backgroundMusic.setVolumeAsync(gameContext.musicVolume)
    await gameContext.backgroundMusic.playAsync()
    await gameContext.backgroundMusic.setIsLoopingAsync(false)
    gameContext.backgroundMusic.setOnPlaybackStatusUpdate(async (playbackStatus:any) => {
      if (playbackStatus.didJustFinish) { await playMusic() }
    })
  }
}
  
const body = (gameMode:string) => `Prepare one character card for each player then have everyone introduce their character's name, \
gender, ultimate title, ${(extraText(gameMode))} and quotes.`

const speech = (gameMode:string) => `Prepare one character card for each player then have everyone introduce their character's name, \
gender, ultimate title, ${(extraText(gameMode))} and quotes.`

const extraText = (Mode:string) => {
  if (Mode === 'normal') {
    return ''
  } else if (Mode === 'extreme') {
    return ' character ability,'
  }
}