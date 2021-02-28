import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import React, { useContext, useEffect, useState } from 'react'
import { Image, View, Text, TouchableHighlight } from 'react-native'
import { GameContext } from '../../AppContext'
import PlayersPage from '../components/PlayersPage'
import { goodMorningSpeech, morningTimeSpeech } from '../data/Speeches'
import { roleInPlay } from '../data/Table'
import { blackTransparent, darkGrey, greyTransparent, pinkTransparent } from '../styles/colors'
import { disablePlayerButton } from '../styles/playerButtonStyles'
import { appStyle } from '../styles/styles'
import { PlayerInfo } from '../types/types'
import { Audio } from 'expo-av'
import { sounds } from '../assets/sounds/sounds'

let speech = ''
let victim:PlayerInfo
let onSpeechDone = () => {}
let onContinue = () => {}
let onYes = () => {}
let onNo = () => {}
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function MorningTimeScreen({setTime}:Props) {
  const { navigate } = useNavigation<any>()
  const gameContext = useContext(GameContext)
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const [continueButtonColor, setContinueButtonColor] = useState(greyTransparent)
  const [continueButtonTextColor, setContinueButtonTextColor] = useState(darkGrey)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true)
  const [state, setState] = useState([])

  const isFocused = useIsFocused()
  useEffect(() => { if (isFocused) {
    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
    morningSpeech()
  }}, [isFocused])

  return (
    <View style={{ flex: 1 }}>
      <PlayersPage visible={true} middleSection={PlayersPageMiddleSection()} onPlayerClick={() => {}}/>
    </View>
  )

  function PlayersPageMiddleSection() {
    if (confirmationVisible) {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{flex: 2}}/>
            <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
              {MorningTimeLabel()}
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
              <View style={{...appStyle.frame, height: '62.5%', minWidth: '25%'}}>
                <TouchableHighlight style={{flex: 1,  borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  onPress={() => {
                    setConfirmationVisible(false)
                    onNo()
                  }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>No</Text>
                </TouchableHighlight>
              </View>
              <View style={{...appStyle.frame, height: '62.5%', minWidth: '25%'}}>
                <TouchableHighlight style={{flex: 1,  borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  onPress={async () => {
                    setConfirmationVisible(false)
                    onYes()
                  }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>Yes</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={{flex: 2}}/>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{flex: 2}}/>
            <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
              {MorningTimeLabel()}
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
              <View style={{...appStyle.frame, height: '62.5%', minWidth: '25%', backgroundColor: continueButtonColor}}>
                <TouchableHighlight style={{flex: 1,  borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  disabled={continueButtonDisabled} underlayColor={continueButtonColor} onPress={() => { onContinue() }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10, color: continueButtonTextColor}}>Continue</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={{flex: 2}}/>
          </View>
        </View>
      )
    }
  }

  function MorningTimeLabel() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View style={{...appStyle.frame, minWidth: '30%', justifyContent: 'center', backgroundColor: greyTransparent}}>
          <Text style={{...appStyle.text, textAlign: 'center', margin: '2.5%'}}>
            Morning{"\n"}of Day {gameContext.dayNumber}
          </Text>
        </View>
        <TouchableHighlight style={{height: 28, width: 28, position:'absolute', left: '35%'}}
          onPress={async() => {
            if (await Speech.isSpeakingAsync() === false) {
              Speech.speak(speech)                
            }
          }}>
          <Image style={{height: 28, width: 28,}} source={require('../assets/images/Speaker.png')}/>
        </TouchableHighlight>
      </View>
    )
  }

  async function morningSpeech() {
    gameContext.vicePlayed = false
    if (gameContext.blackenedAttack !== -1) {
      onSpeechDone = async () => await announceAttack()
    } else {
      onSpeechDone = async () => await dayTime()
    }
    speech = goodMorningSpeech(gameContext.dayNumber)
    await speakThenPause(speech, 1, onSpeechDone)
  }

  async function announceAttack() {
    victim = gameContext.playersInfo[gameContext.blackenedAttack]
    gameContext.playersInfo.forEach(playerInfo => {
      if (playerInfo === victim) {
        victim.playerButtonStyle.textColor = 'white'
        victim.playerButtonStyle.backgroundColor = pinkTransparent
        playerInfo.playerButtonStyle.borderColor = 'white'
        playerInfo.playerButtonStyle.disabled = true
      } else {
        disablePlayerButton(playerInfo)
      }
    })
    setState([]) // re-render screen
    if (gameContext.mode === 'extreme') {
      onSpeechDone = async () => await monomi()
    } else {
      onSpeechDone = async () => await bodyDiscovery()
    }
    speech = morningTimeSpeech(victim.name).announceAttack
    await speakThenPause(speech, 1, onSpeechDone)
  }

  async function monomi() {
    if (roleInPlay(gameContext.roleCounts, 'Monomi') && gameContext.dayNumber > 1 && gameContext.monomiExploded === false  && gameContext.blackenedAttack !== -1) {
      speech = morningTimeSpeech().monomi1
      await speakThenPause(speech, 1, async () => {
        if (gameContext.blackenedAttack === gameContext.monomiProtect) {
          const monomi = gameContext.playersInfo.find((value) => value.role === 'Monomi')!.playerIndex
          gameContext.monomiExploded = true
          gameContext.blackenedAttack = monomi
          gameContext.playersInfo[monomi].alive = false
          gameContext.killsLeft -= 1
          speech = morningTimeSpeech(victim.name, gameContext.playersInfo[monomi].name).monomi2
          await speakThenPause(speech, 1, async () => {
            speech = morningTimeSpeech().monomi3
            await speakThenPause(speech, 1, async () => { await dayTime() })
          })
        } else {          
          speech = morningTimeSpeech().monomi4
          onSpeechDone = async () => await victimActions1()
          await speakThenPause(speech, 1, onSpeechDone)
        }
      })
    } else {
      await victimActions1()
    }
  }

  async function victimActions1() {
    if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber === 1 && gameContext.mode === 'extreme') {
      victim = gameContext.playersInfo[gameContext.blackenedAttack]
      onContinue = async () => await dayTime()
      speech = morningTimeSpeech(victim.name).victim1
      await speakThenPause(speech, 0, enableContinueButton)
    } else if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1 && gameContext.mode === 'extreme') {
      victim = gameContext.playersInfo[gameContext.blackenedAttack]
      speech = morningTimeSpeech(victim.name).victim2
      await speakThenPause(speech, 0, () => {
        onYes = async () => {
          onNo = async () => {      
            gameContext.blackenedAttack = -2
            await dayTime()
          }
          await amuletOfTakejin()
        }
        onNo = async () => await playersAbilities()
        setConfirmationVisible(true)
      })          
    } else if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1 && gameContext.mode === 'normal') {
      await bodyDiscovery()
    } else {
      await dayTime()
    }
  }

  async function amuletOfTakejin() {
    onYes = async () => {
      do {
        gameContext.blackenedAttack -= 1
        if (gameContext.blackenedAttack === -1) {
          gameContext.blackenedAttack = gameContext.playerCount - 1
        }       
      } while (!gameContext.playersInfo[gameContext.blackenedAttack].alive)
      gameContext.playersInfo.forEach(playerInfo => {
        if (playerInfo.playerIndex === gameContext.blackenedAttack) {
          playerInfo.playerButtonStyle.textColor = 'white'
          playerInfo.playerButtonStyle.backgroundColor = pinkTransparent
        } else {
          playerInfo.playerButtonStyle.textColor = darkGrey
          playerInfo.playerButtonStyle.backgroundColor = greyTransparent
        }
      })
      await announceAttack()
    }
    speech = morningTimeSpeech(victim.name).amuletOfTakejin
    await speakThenPause(speech, 0, () => setConfirmationVisible(true))
  }

  async function playersAbilities() {
    onYes = async () => {
      gameContext.blackenedAttack = -2
      await dayTime()
    }
    onNo = async () => await giveItems()
    speech = morningTimeSpeech(victim.name).playersAbilities
    await speakThenPause(speech, 0, () => setConfirmationVisible(true))
  }

  async function giveItems() {
    onYes = async () => await victimActions2()
    onNo = async () => await bodyDiscovery()
    let indexRight = victim.playerIndex
    do {
      indexRight--
      if (indexRight === -1) { indexRight = gameContext.playerCount - 1 }          
    } while (!gameContext.playersInfo[indexRight].alive)
    let indexLeft =  victim.playerIndex
    do {
      indexLeft++
      if (indexLeft === gameContext.playerCount) { indexLeft = 0 }
    } while (!gameContext.playersInfo[indexLeft].alive)
    const leftPlayer = gameContext.playersInfo[indexLeft].name
    const rightPlayer = gameContext.playersInfo[indexRight].name
    speech = morningTimeSpeech(victim.name, leftPlayer, rightPlayer).giveItems
    await speakThenPause(speech, 0, () => setConfirmationVisible(true))
  }

  async function victimActions2() {
    onYes = async () => {
      onNo = async () => {
        gameContext.blackenedAttack = -2
        await dayTime()
      }
      await amuletOfTakejin()
    }
    onNo = async () => {await bodyDiscovery() }
    speech = morningTimeSpeech(victim.name).victim3
    await speakThenPause(speech, 0, () => setConfirmationVisible(true))
  }

  async function bodyDiscovery() {
    gameContext.playersInfo[gameContext.blackenedAttack].alive = false
    gameContext.killsLeft -= 1
    let onSoundDone = async () => {}
    const { sound } = await Audio.Sound.createAsync(sounds.despairPollution, {}, async (playbackStatus:any) => {
      if (playbackStatus.didJustFinish) {
        setState([]) // re-render screen
        await sound.unloadAsync()
        await onSoundDone()
      }
    })
    await sound.setVolumeAsync(.1)
    await sound.playAsync()
    if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Alter Ego') {
      gameContext.alterEgoAlive = false
      speech = morningTimeSpeech(victim.name).bodyDiscovery2
      onSoundDone = async () => await speakThenPause(speech, 2, async () => { await abilitiesOrItems() })
    } else if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Blackened') {
      speech = morningTimeSpeech(victim.name).bodyDiscovery3
      onSoundDone = async () => await speakThenPause(speech, 0, () => {
        gameContext.winnerSide = 'Hope'
        navigate('WinnerDeclarationScreen')
      })
    } else {
      speech = morningTimeSpeech(victim.name).bodyDiscovery1
      onSoundDone = async () => await speakThenPause(speech, 1, async () => { await abilitiesOrItems() })
    }
  }

  async function abilitiesOrItems() {
    if (gameContext.mode === 'extreme') {
      onContinue = async () => await viceConfirmation()
      speech = morningTimeSpeech().abilityOrItem
      await speakThenPause(speech, 0, enableContinueButton)
    } else {
      await dayTime()
    }
  }

  async function viceConfirmation() {
    if (gameContext.killsLeft !== 0) {
      onYes = async () => {
        gameContext.vicePlayed = true
        await dayTime()
      }
      onNo = async () => await dayTime()
      speech = morningTimeSpeech(victim.name).vice
      await speakThenPause(speech, 0, () => setConfirmationVisible(true))
    } else {
      await dayTime()
    }
  }

  async function dayTime() {
    setTime('DayTimeScreen')
  }
  
  function enableContinueButton() {
    setContinueButtonColor(blackTransparent)
    setContinueButtonTextColor('white')
    setContinueButtonDisabled(false)
  }
}

async function speakThenPause(speech:string, seconds:number=0, onDone?:() => void) {
  const callback = async(seconds:number) => {
    await sleep(seconds * 1000)
    if (onDone) { onDone() }
  }
  Speech.speak(speech, {onDone: () => {callback(seconds)}})
}

type Props = {setTime:React.Dispatch<any>}