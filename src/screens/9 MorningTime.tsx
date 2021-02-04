import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { GameContext } from '../../AppContext'
import Confirmation from '../components/modals/Confirmation'
import ConfirmationMorning from '../components/modals/ConfirmationMorning'
import PlayersPage from '../components/PlayersPage'
import { roleInPlay } from '../data/Table'
import { blackTransparent, darkGrey, greyTransparent, pinkTransparent } from '../styles/colors'
import { disablePlayerButton } from '../styles/playerButtonStyles'
import { appStyle } from '../styles/styles'
import { PlayerInfo } from '../types/types'

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

  // Returns true if screen is focused
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
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
        {MorningTimeLabel()}
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
    await speakThenPause(goodMorningSpeech(gameContext.dayNumber), 1, onSpeechDone)
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
    await speakThenPause(victim.name + ', was attacked by the Blackened last night.', 1, onSpeechDone)
  }

  async function monomi() {
    if (roleInPlay(gameContext.roleCounts, 'Monomi') && gameContext.dayNumber > 1 && gameContext.monomiExploded === false  && gameContext.blackenedAttack !== -1) {
      let speech = 'Did Monomi protect' + victim.name + ' last night? '
      if (gameContext.blackenedAttack === gameContext.monomiProtect) {
        const monomi = gameContext.playersInfo.find((value) => value.role === 'Monomi')!.playerIndex
        gameContext.monomiExploded = true
        gameContext.blackenedAttack = monomi
        gameContext.playersInfo[monomi].alive = false
        gameContext.killsLeft -= 1
        speech += 'Yes, she did. ' + gameContext.playersInfo[monomi].name + ' explodes and dies to protect ' + victim.name
        onSpeechDone = async () => await dayTime()
      } else {          
        speech += 'No, she did not.'
        onSpeechDone = async () => await victimActions()
      }
      await speakThenPause(speech, 1, onSpeechDone)
    } else {
      await victimActions()
    }
  }

  async function victimActions() {
    if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber === 1 && gameContext.mode === 'extreme') {
      victim = gameContext.playersInfo[gameContext.blackenedAttack]
      onContinue = async () => await dayTime()
      await speakThenPause(victim.name + ', discard one Item card.', 0, enableContinueButton)
    } else if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1 && gameContext.mode === 'extreme') {
      victim = gameContext.playersInfo[gameContext.blackenedAttack]
      confirmationText = 'Does ' + victim.name + ' protect themselves?'
      amuletVisible = true
      await speakThenPause(victim.name + ', would you like to use an ability or item to prevent your death?', 0, () => {
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
    await speakThenPause('Would anybody like to use an ability to protect ' + victim.name + '?', 0, () => {
      onNo = async () => await giveItems()
      setConfirmationMorningVisible(true)
    })
  }

  async function giveItems() {
    let speech = ''
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
    speech = gameContext.playersInfo[indexLeft].name + ' and ' + gameContext.playersInfo[indexRight].name + 
      ', would either of you like to give an item to ' + victim.name + '?'
    confirmationText = 'Did ' + victim.name + ' protect himself?'
    amuletVisible = true
    onNo = async () => await bodyDiscovery()
    await speakThenPause(speech, 0, () => { setConfirmationMorningVisible(true) })
  }

  async function bodyDiscovery() {
    gameContext.playersInfo[gameContext.blackenedAttack].alive = false
    gameContext.killsLeft -= 1
    await speakThenPause(victim.name + ' has been killed.', 1, async () => {
      if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Alter Ego') {
        gameContext.alterEgoAlive = false
        await speakThenPause('U pu pu pu. ' + victim.name + ' was the Alter Ego.', 2, async () => { await useAbilitiesOrItems() })
      } else if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Blackened') {
        await speakThenPause('How disappointing. ' + victim.name + ' was the Blackened', 0, () => {
          gameContext.winnerSide = 'Hope'
          push('WinnerDeclarationScreen')
        })
      } else {
        await useAbilitiesOrItems()
      }
    })
  }

  async function useAbilitiesOrItems() {
    if (gameContext.mode === 'extreme') {
      onContinue = async () => await viceConfirmation()
      await speakThenPause('Would anybody like to use an ability or item before moving on to day time?', 0, enableContinueButton)
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

function goodMorningSpeech(dayNumber:number) {
  const days = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eight', 'ninth']
  if (dayNumber < 10) {
    return 'Good morning, everyone! It is the morning of the ' + days[dayNumber] + ' day. Get ready to greet another beee-yutiful day'
  } else {
    return 'Good morning, everyone! What day is it today? I lost count. Does it mattter anyways? Get ready to greet another beee-yutiful day'
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