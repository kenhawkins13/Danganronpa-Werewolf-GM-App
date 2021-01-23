import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { GameContext } from '../../AppContext'
import Confirmation from '../components/modals/Confirmation'
import ConfirmationMorning from '../components/modals/ConfirmationMorning'
import WinnerDeclarationModal from '../components/modals/WinnerDeclaration'
import PlayersPage from '../components/PlayersPage'
import { roleInPlay } from '../data/Table'
import { blackTransparent, darkGrey, greyTransparent, pinkTransparent } from '../styles/colors'
import { appStyle } from '../styles/styles'
import { PlayerInfo } from '../types/types'

let stage = 'morningSpeech'
let victim:PlayerInfo
let confirmationText = ''
let amuletVisible = true
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function MorningTimeScreen() {
  const { push } = useNavigation<any>()
  const gameContext = useContext(GameContext)
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const [confirmationMorningVisible, setConfirmationMorningVisible] = useState(false)
  const [winnerDeclarationVisible, setWinnerDeclarationVisible] = useState(false)
  const [continueButtonColor, setContinueButtonColor] = useState(greyTransparent)
  const [continueButtonTextColor, setContinueButtonTextColor] = useState(darkGrey)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true)
  const [array, setArray] = useState([])

  // Returns true if screen is focused
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
  useEffect(() => { if (isFocused) { morningTimeLogic() }}, [isFocused])

  return (
    <View style={{ flex: 1 }}>
      <PlayersPage middleSection={PlayersPageMiddleSection()} onPlayerClick={() => {}}/>
      <Confirmation visible={confirmationVisible} setVisible={setConfirmationVisible} text='Was Vice Played?'
      onYes={() => { 
        morningTimeLogic()
        gameContext.vicePlayed = true 
      }} onNo={() => { morningTimeLogic() }}/>
      <ConfirmationMorning visible={confirmationMorningVisible} setVisible={setConfirmationMorningVisible} 
        text={confirmationText} amuletVisible={amuletVisible}
        onYes={() => {
          stage = 'dayTime'
          gameContext.blackenedAttack = -2
          morningTimeLogic()
        }}
        onNo={() => {
          morningTimeLogic()
        }}
        onAmulet={() => {
          do {
            gameContext.blackenedAttack -= 1
            if (gameContext.blackenedAttack === -1) {
              gameContext.blackenedAttack = gameContext.playerCount - 1
            }       
          } while (!gameContext.playersInfo[gameContext.blackenedAttack].alive)
          stage = 'victim'
          morningTimeLogic()
        }}
      />
      <WinnerDeclarationModal visible={winnerDeclarationVisible} winnerSide='Hope'/>
    </View>
  )

  function PlayersPageMiddleSection() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
        {MorningTimeLabel()}
        <View style={{...appStyle.frame, height: '25%', minWidth: '25%', backgroundColor: continueButtonColor}}>
          <TouchableHighlight style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}} 
            disabled={continueButtonDisabled} onPress={() => { morningTimeLogic() }}>
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

  async function morningTimeLogic() {
    let speech = ''
  
    switch (stage) {
      case 'morningSpeech':
        gameContext.vicePlayed = false
        await speakThenPause(goodMorningSpeech(gameContext.dayNumber), 1)
      case 'announceAttack':
        if (gameContext.blackenedAttack !== -1) {
          victim = gameContext.playersInfo[gameContext.blackenedAttack]
          gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
          victim.backgroundColor = pinkTransparent
          setArray([])
          await speakThenPause(victim.name + ', was attacked by the Blackened last night.', 1)
        }
      case 'monomi':
        if (roleInPlay(gameContext.roleCounts, 'Monomi') && gameContext.dayNumber > 1 && gameContext.monomiExploded === false  && gameContext.blackenedAttack !== -1) {
          await speakThenPause('Did Monomi protect' + victim.name + ' last night?', 1)
          if (gameContext.blackenedAttack === gameContext.monomiProtect) {
            const monomi = gameContext.playersInfo.find((value) => value.role === 'Monomi')!.playerIndex
            gameContext.monomiExploded = true
            gameContext.blackenedAttack = monomi
            gameContext.playersInfo[monomi].alive = false
            gameContext.killsLeft -= 1
            speech = 'Yes, she did. ' + gameContext.playersInfo[monomi].name + ' explodes and dies to protect ' + victim.name
            stage = 'dayTime'
          } else {          
            speech = 'No, she did not.'
            stage = 'victim'
          }
          await speakThenPause(speech, 1)
        } else {
          stage = 'victim'
        }
        morningTimeLogic()
        break
      case 'victim':
        if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber === 1 && gameContext.mode === 'extreme') {
          victim = gameContext.playersInfo[gameContext.blackenedAttack]
          await speakThenPause(victim.name + ', discard one Item card.')
          stage = 'dayTime'
          enableContinueButton()
        } else if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1 && gameContext.mode === 'extreme') {
          victim = gameContext.playersInfo[gameContext.blackenedAttack]
          gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
          victim.backgroundColor = pinkTransparent
          setArray([]) // to re-render screen
          await speakThenPause(victim.name + ', would you like to use an ability or item to prevent your death?')
          confirmationText = 'Did ' + victim.name + ' protect himself?'
          amuletVisible = true
          stage = 'playersAbilities'
          setConfirmationMorningVisible(true)
        } else if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1 && gameContext.mode === 'normal') {
          stage = 'bodyDiscovery'
          morningTimeLogic()
        } else {
          stage = 'dayTime'
          morningTimeLogic()
        }
        break
      case 'playersAbilities':
        await speakThenPause('Would anybody like to use an ability to protect ' + victim.name + '?')
        confirmationText = 'Did somebody protect ' + victim.name + '\nwith a character ability?'
        amuletVisible = false
        stage = 'giveItems'
        setConfirmationMorningVisible(true)
        break
      case 'giveItems':
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
        await speakThenPause(speech)
        confirmationText = 'Did ' + victim.name + ' protect himself?'
        stage = 'bodyDiscovery'
        amuletVisible = true
        setConfirmationMorningVisible(true)
        break
      case 'bodyDiscovery':
        await speakThenPause(victim.name + ' has been killed.', 1)
        gameContext.playersInfo[gameContext.blackenedAttack].alive = false
        gameContext.killsLeft -= 1
        if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Alter Ego') {
          gameContext.alterEgoAlive = false
          await speakThenPause('U pu pu pu. ' + victim.name + ' was the Alter Ego.', 1)
        } else if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Blackened') {
          await speakThenPause('How disappointing. ' + victim.name + ' was the Blackened', 1)
          setWinnerDeclarationVisible(true)
          break
        }
      case 'useAbilityOrItem':
        if (gameContext.mode === 'extreme') {
          stage = 'viceConfirmation'
          await speakThenPause('Would anybody like to use an ability or item before moving on to day time?')
          enableContinueButton()
        } else {
          stage = 'dayTime'
          morningTimeLogic()
        }
        break
      case 'viceConfirmation':
        stage = 'dayTime'
        if (gameContext.killsLeft !== 0) {
          setConfirmationVisible(true)          
        } else {
          morningTimeLogic()
        }
        break
      case 'dayTime':
        gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
        push('DayTimeScreen')
        stage = 'morningSpeech'
        break
    }
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

async function speakThenPause(speech:string, seconds:number=0) {
  Speech.speak(speech)
  do {} while (await Speech.isSpeakingAsync())
  await sleep(seconds * 1000)
}
