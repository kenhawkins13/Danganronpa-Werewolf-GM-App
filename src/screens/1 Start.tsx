import React, { useContext, useEffect, useState } from 'react'
import { Text, View, Image, ImageBackground, TouchableHighlight, BackHandler, StyleSheet, Dimensions } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import SwitchSelector from 'react-native-switch-selector'
import Slider from '@react-native-community/slider'
import { appStyle } from '../styles/styles'
import { GameContext } from '../../AppContext'
import { Audio } from 'expo-av'
import { colors } from '../styles/colors'
import * as ScreenOrientation from 'expo-screen-orientation'
import { OrientationLock } from 'expo-screen-orientation'
import { sounds } from '../assets/sounds/sounds'
import { backgrounds } from '../assets/backgrounds/backgrounds'
import { images } from '../assets/images/images'
import { startMusic } from '../assets/music/music'
import { GameContextType } from '../types/types'
import { calculateRoles, requiredKills } from '../data/Table'
import VolumeModal from '../components/modals/Volume'

const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function StartScreen () {
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(300)
  const gameContext = useContext(GameContext)
  const [volumeModalVisible, setVolumeModalVisible] = useState(false)
  const [gameMode, setGameMode] = useState(0)
  const [playerCount, setPlayerCount] = useState(4)
  const { navigate } = useNavigation<any>()
  
  // Returns true if screen is focused
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
  useEffect(() => { 
    if (isFocused) {
      ScreenOrientation.lockAsync(OrientationLock.PORTRAIT)
      // wait for screen to rotate then set background image width
      sleep(500).then(() => { setBackgroundImageWidth() })
      playMusic()
    }
    BackHandler.addEventListener('hardwareBackPress', () => true)
  }, [isFocused])

  return (
    <View style={{flex: 1, backgroundColor: colors.black, justifyContent: 'center'}}>
      <ImageBackground style={{width: width, height: height}} source={backgrounds.start}>
        <View style={{flex: 3}}/>
        <View style={{flex: 7, alignItems: 'center', justifyContent: 'space-evenly'}}>
          <View style={{flex: 2, width: '75%', justifyContent: 'center'}}>
            <TouchableHighlight style={{height: 45, width: 45, borderWidth: 2, borderColor: colors.white, borderRadius: 10, alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center'}} 
            onPress={() => setVolumeModalVisible(true)}>
              <Image source={images.volume} style={{height: 45, width: 45}}/>
            </TouchableHighlight>
          </View>
          <View style={{flex: 2}}>
            <Text style={appStyle.text}>  Mode:</Text>
            <View style={{...appStyle.frame, width: 300, height: 50}}>
              {GameModeSwitch(gameMode, setGameMode, gameContext)}
            </View>
          </View>
          <View style={{flex: 2}}>
            <Text style={appStyle.text}>  Players: {playerCount}</Text>
            <View style={{...appStyle.frame, width: 300, height: 50}}>
              <Slider
                style={{width: 294, height: 50}}
                value={playerCount}
                minimumValue={4}
                maximumValue={16}
                step={1}
                onValueChange={(value) => {
                  gameContext.playerCount = value
                  setPlayerCount(value)
                }}
                thumbTintColor={colors.white}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
              />
            </View>
          </View>
          <View style={{flex: 2}}>
            <Text> </Text>
            <View style={{...appStyle.frame, width: 300, height: 50}}>
              <TouchableHighlight style={styles.startGameButton} onPress={async() => {
                const { sound } = await Audio.Sound.createAsync(sounds.revolver, {}, async (playbackStatus:any) => {
                  if (playbackStatus.didJustFinish) { await sound.unloadAsync() }
                })
                await sound.setVolumeAsync(gameContext.musicVolume)
                await sound.playAsync()
                await gameContext.backgroundMusic.unloadAsync()
                gameContext.backgroundMusic = ''
                fillContextInfo(gameContext)
                navigate('SettingsScreen')
                }}>
                <Text style={{color: colors.white, fontSize: 20}}>START GAME</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={{ flex: 1}}/>
      </ImageBackground>
      <VolumeModal visible={volumeModalVisible} setVisible={setVolumeModalVisible} sound={gameContext.backgroundMusic}/>
    </View>
  )

  async function playMusic() {
    const { sound } = await Audio.Sound.createAsync(startMusic[0])
    gameContext.backgroundMusic = sound
    gameContext.backgroundMusic.setVolumeAsync(gameContext.musicVolume)
    gameContext.backgroundMusic.playAsync()
  }
  
  function fillContextInfo(gameContext:GameContextType) {
    switch (gameMode) {
      case 0:
        gameContext.mode = 'normal'
        break
      case 1:
        gameContext.mode = 'extreme'
        break
      case 2:
        gameContext.mode = 'maniax'
        break
    }
    if (gameContext.customizeRolesMode === '') {
      gameContext.customizeRolesMode = gameContext.mode
    }
    gameContext.roleCountAll = calculateRoles(gameContext.customizeRolesMode, gameContext.playerCount)
    gameContext.dayNumber = 0
    gameContext.killsLeft = requiredKills(gameContext.playerCount)
    gameContext.blackenedAttack = -1,
    gameContext.alterEgoAlive = true,
    gameContext.monomiExploded = false,
    gameContext.monomiProtect = -1,
    gameContext.remnantsOfDespairFound = false,
    gameContext.nekomaruNidaiEscort = -1,
    gameContext.nekomaruNidaiIndex = -1,
    gameContext.vicePlayed = false,
    gameContext.easterEggIndex = -1,
    gameContext.zakemonoDead = false
    gameContext.tieVoteCount = 0,
    gameContext.winnerSide = ''
    // Delete existing playerInfo element if more than playerCount
    while (gameContext.playersInfo.length > gameContext.playerCount) {
      gameContext.playersInfo.pop()
    }
    for (let i = 0; i < gameContext.playerCount; i++) {
      const playerName = gameContext.playersInfo.length > i ? gameContext.playersInfo[i].name : 'Player ' + (i+1).toString()
      const playerInfo = {
        playerIndex: i,
        name: playerName,
        side: '',
        role: '',
        alive: true,
        victory: false,
        useAbility: '',
        useItem: '',
        playerButtonStyle: {
          disabled: false, 
          textColor: colors.white, 
          backgroundColor: colors.blackTransparent, 
          borderColor: colors.white, 
          underlayColor: colors.blackTransparent
        }
      }
      if (gameContext.playersInfo.length > i) {
        gameContext.playersInfo[i] = playerInfo
      } else {
        gameContext.playersInfo.push(playerInfo)
      }
    }
    return true
  }

  function setBackgroundImageWidth() {  
    const {width, height} = Image.resolveAssetSource(backgrounds.start);
    // calculate image width and height 
    const screenWidth = Dimensions.get('window').width
    const scaleFactor = width / screenWidth
    const imageHeight = height / scaleFactor
    setWidth(screenWidth)
    setHeight(imageHeight)
  }
}
  
const styles = StyleSheet.create({
  startGameButton: {
    flex: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'
  }
})

const doesNothing = Promise.resolve(0);

// Fix for issue with SwitchSelector https://github.com/jkdrangel/react-native-switch-selector/issues/11
const GameModeSwitch = (gameMode:number, setGameMode:React.Dispatch<React.SetStateAction<number>>, gameContext:GameContextType) => {
  interface SwitchFix extends React.Component {}
  const Switch = SwitchSelector as any as {
      new (): SwitchFix
  }

  const props: any = {
      initial: 0,
      value: gameMode,
      onPress: (value:number) => {
        setGameMode(value)
        gameContext.customizeRolesMode = ''
      },
      textColor: colors.white,
      textStyle: { fontSize: 16},
      selectedTextStyle: { fontSize: 16},
      selectedColor: '#cc0066',
      buttonColor: colors.white,
      borderRadius: 15,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      hasPadding: false,
      height: 44, // 50 (height) - 3 (top borderwidth) - 3 (bottom borderwidth)
      style: {width: '100%', height: '100%'},
      options: [
        { label: 'NORMAL', value: 0 },
        { label: 'EXTREME', value: 1 },
        { label: 'MANIAX', value: 2 }
      ]
  }

  return <Switch {...props} />
}