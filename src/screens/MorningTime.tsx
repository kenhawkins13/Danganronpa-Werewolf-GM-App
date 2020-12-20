import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { GameContext } from '../../App'
import Confirmation from '../components/modals/Confirmation'
import ConfirmationMorning from '../components/modals/ConfirmationMorning'
import WinnerDeclarationModal from '../components/modals/WinnerDeclaration'
import { roleInPlay } from '../data/Table'

let stage = 'morningSpeech'
let victimName = ''
let confirmationText = ''
let amuletVisible = true
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function MorningTimeScreen() {
  const { push } = useNavigation<any>()
  const gameContext = useContext(GameContext)
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const [confirmationMorningVisible, setConfirmationMorningVisible] = useState(false)
  const [winnerDeclarationVisible, setWinnerDeclarationVisible] = useState(false)

  // Returns true if screen is focused
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
  useEffect(() => { if (isFocused) { morningTimeLogic() }}, [isFocused])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey' }}>
        <Text>Morning Time of Day {gameContext.dayNumber}</Text>
      </View>
      <View style={{ flex: 10 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#cc0066' }}>
          <Text>some label</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <TouchableHighlight style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} 
            onPress={() => { morningTimeLogic() }}>
            <Text>button</Text>
          </TouchableHighlight>
        </View>
      </View>
      <Confirmation visible={confirmationVisible} setVisible={setConfirmationVisible} text='Was Vice Played?'
      onYes={() => { 
        morningTimeLogic()
        gameContext.vicePlayed = true 
      }} onNo={() => { morningTimeLogic() }}/>
      <ConfirmationMorning visible={confirmationMorningVisible} setVisible={setConfirmationMorningVisible} 
        text={confirmationText} amuletVisible={amuletVisible}
          onYes={() => {
            stage = 'dayTime'
            gameContext.blackenedAttack = -1
            morningTimeLogic()
          }}
          onNo={() => {
            morningTimeLogic()
          }}
          onAmulet={() => {
            gameContext.blackenedAttack += 1
            if (gameContext.blackenedAttack === gameContext.playerCount) {
              gameContext.blackenedAttack = 0
            }
            stage = 'victim'
            morningTimeLogic()
          }}
        />
        <WinnerDeclarationModal visible={winnerDeclarationVisible} setVisible={setWinnerDeclarationVisible} winnerSide='Hope'/>
    </View>
  )

  async function morningTimeLogic() {
    Speech.stop()
    // Speech.speak(sequence.toString())
    let speech = ''
  
    switch (stage) {
      case 'morningSpeech':
        gameContext.vicePlayed = false
        await speakThenPause(goodMorningSpeech(gameContext.dayNumber), 1)
      case 'announceAttack':
        if (gameContext.blackenedAttack !== -1) {
          victimName = gameContext.playersInfo[gameContext.blackenedAttack].name
          await speakThenPause(victimName + ', has been attacked by the Blackened last night.', 1)
        }
      case 'monomi':
        if (roleInPlay(gameContext.roleCounts, 'Monomi') && gameContext.dayNumber > 1 && gameContext.monomiExploded === false  && gameContext.blackenedAttack !== -1) {
          await speakThenPause('Did Monomi protect' + victimName + ' last night?', 1)
          if (gameContext.blackenedAttack === gameContext.monomiProtect) {
            const monomi = gameContext.playersInfo.find((value) => value.role === 'Monomi')!.playerIndex
            gameContext.monomiExploded = true
            gameContext.blackenedAttack = monomi // TODO: remove line? doesn't do anything but still theoretically correct
            gameContext.playersInfo[monomi].alive = false
            speech = 'Yes, she did. ' + gameContext.playersInfo[monomi].name + ' explodes and dies to protect ' + victimName
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
          victimName = gameContext.playersInfo[gameContext.blackenedAttack].name
          await speakThenPause(victimName + ', discard one Item card.')
          stage = 'dayTime'
        } else if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1 && gameContext.mode === 'extreme') {
          victimName = gameContext.playersInfo[gameContext.blackenedAttack].name
          await speakThenPause(victimName + ', would you like to use a character ability or an item to prevent your death?')
          confirmationText = 'Did ' + victimName + ' protect himself?'
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
        await speakThenPause('Would anybody like to use a player ability to protect ' + victimName + '?')
        confirmationText = 'Did somebody protect ' + victimName + '?'
        amuletVisible = false
        stage = 'giveItems'
        setConfirmationMorningVisible(true)
        break
      case 'giveItems':
        // TODO: figure out who the persons left and right of the victim are. Say their names. Ignore dead people
        speech = 'Persons to the left and right of ' + victimName + ', would either of you like to give an item to ' + victimName + '?'
        // This item does not have to save ' + victimName + ' and ' + victimName + ' does not have to use this item.'
        await speakThenPause(speech)
        confirmationText = 'Did ' + victimName + ' protect himself?'
        stage = 'bodyDiscovery'
        amuletVisible = true
        setConfirmationMorningVisible(true)
        break
      case 'bodyDiscovery':
        await speakThenPause(victimName + ' has been killed.', 1)
        gameContext.playersInfo[gameContext.blackenedAttack].alive = false
        if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Alter Ego') {
          gameContext.alterEgoAlive = false
          await speakThenPause('U pu pu pu. ' + victimName + ' was the Alter Ego.', 1)
        } else if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Blackened') {
          await speakThenPause('How disappointing. ' + victimName + ' was the Blackened', 1)
          setWinnerDeclarationVisible(true)
          break
        }
      case 'useAbilityOrItem':
        if (gameContext.mode === 'extreme') {
          stage = 'viceConfirmation'
          await speakThenPause('Would anybody like to use an ability or item before moving on to Day time?')
        } else {
          stage = 'dayTime'
          morningTimeLogic()
        }
        break
      case 'viceConfirmation':
        stage = 'dayTime'
        setConfirmationVisible(true)
        break
      case 'dayTime':
        push('DayTimeScreen')
        stage = 'morningSpeech'
        break
    }
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
  while (await Speech.isSpeakingAsync()) {}
  await sleep(seconds * 1000)
}
