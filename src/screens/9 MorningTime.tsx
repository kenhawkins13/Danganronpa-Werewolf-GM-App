import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import React, { useContext, useEffect, useState } from 'react'
import { Image, View, Text, TouchableHighlight } from 'react-native'
import { GameContext } from '../../AppContext'
import Confirmation from '../components/modals/Confirmation'
import ConfirmationMorning from '../components/modals/ConfirmationMorning'
import PlayersPage from '../components/PlayersPage'
import { goodMorningSpeech, morningTimeSpeech } from '../data/Speeches'
import { roleInPlay } from '../data/Table'
import { blackTransparent, darkGrey, greyTransparent, pinkTransparent } from '../styles/colors'
import { disablePlayerButton } from '../styles/playerButtonStyles'
import { appStyle } from '../styles/styles'
import { PlayerInfo } from '../types/types'

let speech = ''
let victim:PlayerInfo
let onSpeechDone = () => {}
let onContinue = () => {}
let confirmationText = ''
let onNo = () => {}
let amuletVisible = true
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function MorningTimeScreen({setTime}:Props) {
  const { push } = useNavigation<any>()
  const gameContext = useContext(GameContext)
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const [confirmationMorningVisible, setConfirmationMorningVisible] = useState(false)
  const [continueButtonColor, setContinueButtonColor] = useState(greyTransparent)
  const [continueButtonTextColor, setContinueButtonTextColor] = useState(darkGrey)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true)
  const [array, setArray] = useState([])

  const isFocused = useIsFocused()
  useEffect(() => { if (isFocused) {
    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
    morningSpeech()
  }}, [isFocused])

  return (
    <View style={{ flex: 1 }}>
      <PlayersPage middleSection={PlayersPageMiddleSection()} onPlayerClick={() => {}}/>
      <Confirmation visible={confirmationVisible} setVisible={setConfirmationVisible} text='Was the Item Card "Vice" Played?'
      onYes={() => { 
        gameContext.vicePlayed = true 
        dayTime()
      }} onNo={() => { dayTime() }}/>
      <ConfirmationMorning visible={confirmationMorningVisible} setVisible={setConfirmationMorningVisible} 
        text={confirmationText} amuletVisible={amuletVisible}
        onYes={async () => {
          gameContext.blackenedAttack = -2
          await dayTime()
        }}
        onNo={() => { onNo() }}
        onAmulet={() => {
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
          victimActions()
        }}
      />
    </View>
  )

  function PlayersPageMiddleSection() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
        <View>
          {MorningTimeLabel()}
          <TouchableHighlight style={{height: 28, width: 28, position:'absolute', right: -50, top: 15}} 
            onPress={async() => {
              if (await Speech.isSpeakingAsync() === false) {
                Speech.speak(speech)                
              }
            }}>
            <Image style={{height: 28, width: 28,}} source={require('../assets/images/Speaker.png')}/>
          </TouchableHighlight>
        </View>
        <View style={{...appStyle.frame, height: '25%', minWidth: '25%', backgroundColor: continueButtonColor}}>
          <TouchableHighlight style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}} 
            disabled={continueButtonDisabled} onPress={() => { onContinue() }}>
            <Text style={{...appStyle.text, textAlign: 'center', margin: 10, color: continueButtonTextColor}}>Continue</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  function MorningTimeLabel() {
    return (
      <View style={{...appStyle.frame, minWidth: '30%', justifyContent: 'center', backgroundColor: greyTransparent}}>
        <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>
          Morning{"\n"}of Day {gameContext.dayNumber}
        </Text>
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
    setArray([])
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
      speech = morningTimeSpeech(victim.name).monomi1
      await speakThenPause(speech, 1, async () => {
        if (gameContext.blackenedAttack === gameContext.monomiProtect) {
          const monomi = gameContext.playersInfo.find((value) => value.role === 'Monomi')!.playerIndex
          gameContext.monomiExploded = true
          gameContext.blackenedAttack = monomi
          gameContext.playersInfo[monomi].alive = false
          gameContext.killsLeft -= 1
          speech = morningTimeSpeech(victim.name, gameContext.playersInfo[monomi].name).monomi2
          onSpeechDone = async () => await dayTime()
        } else {          
          speech = morningTimeSpeech().monomi3
          onSpeechDone = async () => await victimActions()
        }
        await speakThenPause(speech, 1, onSpeechDone)
      })
    } else {
      await victimActions()
    }
  }

  async function victimActions() {
    if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber === 1 && gameContext.mode === 'extreme') {
      victim = gameContext.playersInfo[gameContext.blackenedAttack]
      onContinue = async () => await dayTime()
      speech = morningTimeSpeech(victim.name).victim1
      await speakThenPause(speech, 0, enableContinueButton)
    } else if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1 && gameContext.mode === 'extreme') {
      victim = gameContext.playersInfo[gameContext.blackenedAttack]
      confirmationText = 'Does ' + victim.name + ' protect themselves?'
      amuletVisible = true
      speech = morningTimeSpeech(victim.name).victim2
      await speakThenPause(speech, 0, () => {
        onNo = async () => await playersAbilities()
        setConfirmationMorningVisible(true)
      })          
    } else if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1 && gameContext.mode === 'normal') {
      await bodyDiscovery()
    } else {
      await dayTime()
    }
  }

  async function playersAbilities() {
    confirmationText = 'Did somebody protect ' + victim.name + '\nwith a character ability?'
    amuletVisible = false
    speech = morningTimeSpeech(victim.name).playersAbilities
    await speakThenPause(speech, 0, () => {
      onNo = async () => await giveItems()
      setConfirmationMorningVisible(true)
    })
  }

  async function giveItems() {
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
    confirmationText = 'Did ' + victim.name + ' protect himself?'
    amuletVisible = true
    onNo = async () => await bodyDiscovery()
    await speakThenPause(speech, 0, () => { setConfirmationMorningVisible(true) })
  }

  async function bodyDiscovery() {
    gameContext.playersInfo[gameContext.blackenedAttack].alive = false
    gameContext.killsLeft -= 1
    speech = morningTimeSpeech(victim.name).bodyDiscovery1
    await speakThenPause(speech, 1, async () => {
      if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Alter Ego') {
        gameContext.alterEgoAlive = false
        speech = morningTimeSpeech(victim.name).bodyDiscovery2
        await speakThenPause(speech, 2, async () => { await abilitiesOrItems() })
      } else if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Blackened') {
        speech = morningTimeSpeech(victim.name).bodyDiscovery3
        await speakThenPause(speech, 0, () => {
          gameContext.winnerSide = 'Hope'
          push('WinnerDeclarationScreen')
        })
      } else {
        await abilitiesOrItems()
      }
    })
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
      setConfirmationVisible(true)
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