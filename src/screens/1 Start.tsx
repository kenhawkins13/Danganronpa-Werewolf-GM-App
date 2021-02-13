import React, { useContext, useEffect, useState } from 'react'
import { Text, View, StyleSheet, ImageBackground, TouchableHighlight } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import SwitchSelector from 'react-native-switch-selector'
import Slider from '@react-native-community/slider'
import { appStyle } from '../styles/styles'
import { calculateRoles, requiredKills } from '../data/Table'
import { GameContextType } from '../types/types'
import { GameContext } from '../../AppContext'
import { Audio } from 'expo-av'
import { blackTransparent } from '../styles/colors'
import * as ScreenOrientation from 'expo-screen-orientation'
import { OrientationLock } from 'expo-screen-orientation'
import { startMusic } from '../assets/music/music';

let backgroundMusic:Audio.Sound

export default function StartScreen () {
  const gameContext = useContext(GameContext)
  const [gameMode, setGameMode] = useState(0)
  const [playerCount, setPlayerCount] = useState(4)
  const navigation = useNavigation()
  
  // Check if screen is focused
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
  useEffect(() => { if (isFocused) {
    ScreenOrientation.lockAsync(OrientationLock.PORTRAIT)
    playMusic()
  }}, [isFocused])

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{ width: '100%', height: '100%' }} source={require('../assets/background/Start.png')}>
        <View style={{ flex: 4}}/>
        <View style={{ flex: 6, alignItems: 'center', justifyContent: 'space-evenly'}}>
          <View>
            <Text style={appStyle.text}>  Mode:</Text>
            <View style={{...appStyle.frame, width: 300, height: 50}}>
              <SwitchSelector
                initial={0}
                value={gameMode}
                onPress={(value) => {
                  setGameMode(value as number)
                  gameContext.mode = value === 0 ? 'normal' : 'extreme'
                }}
                textColor='white'
                textStyle={{ fontSize: 20}}
                selectedTextStyle={{ fontSize: 20}}
                selectedColor='#cc0066'
                buttonColor='white'
                borderRadius={15}
                backgroundColor={blackTransparent}
                hasPadding={false}
                height={44} // 50 (height) - 3 (top borderwidth) - 3 (bottom borderwidth)
                style={{width: '100%', height: '100%'}}
                options={[
                  { label: 'NORMAL', value: 0 },
                  { label: 'EXTREME', value: 1 }
                ]}
              />
            </View>
          </View>
          <View>
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
                thumbTintColor='white'
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
              />
            </View>
          </View>
          <View>
            <Text> </Text>
            <View style={{...appStyle.frame, width: 300, height: 50}}>
              <TouchableHighlight style={styles.startGameButton} onPress={async() => {
                const { sound } = await Audio.Sound.createAsync(
                  require('../assets/sounds/Revolver.mp3')
                )
                await sound.playAsync()
                await sound.setVolumeAsync(.1)
                await stopMusic(backgroundMusic)
                fillContextInfo(gameContext)
                navigation.navigate('DisclaimerScreen')
                }}>
                <Text style={{color: 'white', fontSize: 20}}>START GAME</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={{ flex: 1}}/>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  startGameButton: {
    width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
  }
})

function fillContextInfo(gameContext:GameContextType) {
  gameContext.killsLeft = requiredKills(gameContext.playerCount)
  gameContext.roleCounts = calculateRoles(gameContext.mode, gameContext.playerCount)
  gameContext.dayNumber = 0
  gameContext.blackenedAttack = -1,
  gameContext.alterEgoAlive = true,
  gameContext.monomiExploded = false,
  gameContext.monomiProtect = -1,
  gameContext.vicePlayed = false,
  gameContext.tieVote = false,
  gameContext.winnerSide = ''

  // Delete existing data
  while (gameContext.playersInfo.length > 0) {
    gameContext.playersInfo.pop()
  }
  for (let i = 0; i < gameContext.playerCount; i++) {
    gameContext.playersInfo.push({
      playerIndex: i,
      name: 'Player ' + (i+1).toString(),
      side: '',
      role: '',
      alive: true,
      useAbility: '',
      useItem: '',
      playerButtonStyle: {disabled: false, textColor: 'white', backgroundColor: blackTransparent, borderColor: 'white'}
    })
  }
  return true
}

async function playMusic() {
  const { sound } = await Audio.Sound.createAsync(startMusic[0])
  await sound.playAsync()
  await sound.setVolumeAsync(.1)
  backgroundMusic = sound
}

async function stopMusic(sound:Audio.Sound) {
  await sound.unloadAsync()
}