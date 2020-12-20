import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { GameContext } from '../../App'
import PlayersModal from '../components/modals/Players'
import { roleInPlay } from '../data/Table'
import { speechSchoolAnnouncement1, speechSchoolAnnouncement2, speechToAlterEgoAwake, speechToAlterEgoSleep, speechToBlackenedAwake1, speechToBlackenedAwake2, speechToBlackenedSleep, speechToBlackenedVice, speechToMonomiAwake, speechToMonomiSleep, speechToTraitorsAwake, speechToTraitorsSleep } from "../data/NightTimeDialogue"
import * as Speech from 'expo-speech'
import NightTimeAbilitiesItemsModal from '../components/modals/NightTimeAbilitiesItem'
import RevealRoleModal from '../components/modals/RevealRole'

let stage = 'schoolAnnouncement'
let abilityOrItem = ''
let modalType = ''
let previousPlayerIndex = -1
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function NightTimeScreen() {
  const gameContext = useContext(GameContext)
  const { push } = useNavigation<any>()
  const [playersModalVisible, setPlayersModalVisible] = useState(false)

  // Check if screen is focused
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
  useEffect(() => { if (isFocused) { nightTimeLogic() }}, [isFocused])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'lightblue' }}>
        <Text>Night Time of Day {gameContext.dayNumber}</Text>
      </View>
      <View style={{ flex: 10 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#cc0066' }}>
          <Text>Some text</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white' }}>
          <TouchableHighlight style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { nightTimeLogic() }}>
            <Text>Button</Text>
          </TouchableHighlight>
        </View>
      </View>
      {PlayersModalCustomized(modalType, playersModalVisible, setPlayersModalVisible, nightTimeLogic)}
    </View>
  )

  async function nightTimeLogic() {
    // Speech.stop()
    switch (stage) {
      case 'schoolAnnouncement':
        gameContext.blackenedAttack = -1
        if (gameContext.mode === 'extreme' && gameContext.dayNumber > 0) {
          stage = 'abilitiesOrItems'
          await speakThenPause(speechSchoolAnnouncement2)
          gameContext.playersInfo.forEach(playerInfo => { playerInfo.colorScheme = 'white' })
          modalType = 'nightTimeAbilitiesItems'
          setPlayersModalVisible(true)
        } else {
          await speakThenPause(speechSchoolAnnouncement1, 2)
          stage = 'traitor'
          nightTimeLogic()
        }
        break
      case 'abilitiesOrItems':
        await abilitiesAndItemsSpeech()
        break
      case 'traitor':
        if (roleInPlay(gameContext.roleCounts, 'Traitor') && gameContext.dayNumber === 0) {
          gameContext.playersInfo.forEach(playerInfo => {
            if (playerInfo.role === 'Blackened') { playerInfo.colorScheme = 'black' }
            else if (playerInfo.role === 'Traitor') { playerInfo.colorScheme = 'grey' }
            else { playerInfo.colorScheme = 'white' }
          })
          setPlayersModalVisible(true)
          await speakThenPause(speechToTraitorsAwake, 5)
          setPlayersModalVisible(false)
          await speakThenPause(speechToTraitorsSleep, 2)
        }
        stage = 'monomi'
        nightTimeLogic()
        break
      case 'monomi':
        if (roleInPlay(gameContext.roleCounts, 'Monomi') && gameContext.dayNumber > 0 && !gameContext.monomiExploded && !gameContext.vicePlayed) {
          modalType = 'monomi'
          abilityOrItem = 'Protect'
          gameContext.playersInfo.forEach(playerInfo => { playerInfo.colorScheme = 'white' })
          setPlayersModalVisible(true)
          await speakThenPause(speechToMonomiAwake, 10)
          setPlayersModalVisible(false)
          await speakThenPause(speechToMonomiSleep, 1)
        }
        stage = 'alterEgo'
        nightTimeLogic()
        break
      case 'alterEgo':
        if (gameContext.dayNumber > 0 && gameContext.alterEgoAlive) {
          stage = 'alterEgoSleep'
          await speakThenPause(speechToAlterEgoAwake)
          modalType = 'revealRole'
          abilityOrItem = 'Alter Ego'
          gameContext.playersInfo.forEach(playerInfo => {
            if (playerInfo.role === 'Alter Ego') { playerInfo.colorScheme = 'grey' }
            else { playerInfo.colorScheme = 'white' }
          })
          setPlayersModalVisible(true)
        } else {
          stage = 'blackened'
          nightTimeLogic()
        }
        break
      case 'alterEgoSleep':
        await speakThenPause(speechToAlterEgoSleep, 2)
        stage = 'blackened'
        nightTimeLogic()
        break
      case 'blackened':
        stage = 'blackenedSleep'
        if ((gameContext.dayNumber === 0 && gameContext.mode === 'extreme' || gameContext.dayNumber > 0) && !gameContext.vicePlayed) {
          if (gameContext.dayNumber === 0 && gameContext.mode === 'extreme') {
            await speakThenPause(speechToBlackenedAwake1)
          } else if (gameContext.dayNumber > 0) {
            await speakThenPause(speechToBlackenedAwake2)
          }
          modalType = 'blackened'
          abilityOrItem = 'Attack'
          gameContext.playersInfo.forEach(playerInfo => { playerInfo.colorScheme = 'white' })
          setPlayersModalVisible(true)
        } else {
          if (gameContext.vicePlayed === true) { await speakThenPause(speechToBlackenedVice, 1) }
          stage = 'morningTime'
          nightTimeLogic()
        }
        break
      case 'blackenedSleep':
        await speakThenPause(speechToBlackenedSleep, 2)
      case 'morningTime':
        stage = 'schoolAnnouncement'
        gameContext.dayNumber += 1
        push('MorningTimeScreen')
  
    }
  }

  async function abilitiesAndItemsSpeech() {
    let speech = ''
    if (previousPlayerIndex === -1) {
      await speakThenPause('Everyone, go to sleep.', 2)
    }
  
    for (let i = 0; i <= gameContext.playerCount; i++) {
      // No one declared an investigative Ability or Item 
      if (i === gameContext.playerCount && previousPlayerIndex === -1) {
        setPlayersModalVisible(false)
        gameContext.currentPlayerIndex = 0
        previousPlayerIndex = -1
        await speakThenPause('Everyone should now be asleep.', 2)
        stage= 'monomi'
        nightTimeLogic()
        return
      }
      // No more investigative Ability or Item
      else if (i === gameContext.playerCount && previousPlayerIndex !== -1) {
        speech = gameContext.playersInfo[previousPlayerIndex].name + ', go to sleep.'
        gameContext.currentPlayerIndex = 0
        previousPlayerIndex = -1
        await speakThenPause(speech, 2)
        setPlayersModalVisible(false)
        stage= 'monomi'
        nightTimeLogic()
        return
      // Someone declared an investigative Ability or Item  
      } else if (gameContext.playersInfo[i].useAbility !== '' || gameContext.playersInfo[i].useItem !== '') {
        gameContext.currentPlayerIndex = i
        break
      }
    }
    
    gameContext.playersInfo.forEach(playerInfo => { playerInfo.colorScheme = 'white' })
    gameContext.playersInfo[gameContext.currentPlayerIndex].colorScheme = 'grey'
    
    if (previousPlayerIndex === -1) { 
      speech = gameContext.playersInfo[gameContext.currentPlayerIndex].name + ', wake up.'
      await speakThenPause(speech)
    } else if (gameContext.currentPlayerIndex !== previousPlayerIndex) {
      speech = gameContext.playersInfo[previousPlayerIndex].name + ', go to sleep. ' 
      + gameContext.playersInfo[gameContext.currentPlayerIndex].name + ', wake up.'
      await speakThenPause(speech)
    }
  
    if (gameContext.playersInfo[gameContext.currentPlayerIndex].useAbility === "Kyoko Kirigiri") {
      abilityOrItem = "Kyoko Kirigiri"
      gameContext.playersInfo[gameContext.currentPlayerIndex].useAbility = ''
      speech = 'Click the player you would like to investigate whether they are on the side of hope or despair.'
    } else if (gameContext.playersInfo[gameContext.currentPlayerIndex].useAbility === "Yasuhiro Hagakure") {
      abilityOrItem = "Yasuhiro Hagakure"
      gameContext.playersInfo[gameContext.currentPlayerIndex].useAbility = ''
      const role = gameContext.playerCount < 7 ? 'the despair disease patient' : 'monomi'
      speech =  'Click the player you would like to investigate whether they are ' + role + ' or not ' + role
    } else if (gameContext.playersInfo[gameContext.currentPlayerIndex].useItem === 'Glasses') {
      abilityOrItem = 'Glasses'
      gameContext.playersInfo[gameContext.currentPlayerIndex].useItem = ''
      speech = 'Click the player you would like to investigate whether they are on the side of hope or despair.'
    } else if (gameContext.playersInfo[gameContext.currentPlayerIndex].useItem === "Someone's Graduation Album") {
      abilityOrItem = "Someone's Graduation Album"
      gameContext.playersInfo[gameContext.currentPlayerIndex].useItem = ''
      speech = 'Click the player you would like to investigate whether they are a traitor or not a traitor.'
    } else if (gameContext.playersInfo[gameContext.currentPlayerIndex].useItem === 'Silent Receiver') {
      abilityOrItem = 'Silent Receiver'
      gameContext.playersInfo[gameContext.currentPlayerIndex].useItem = ''
      speech = 'Click the player you would like to investigate whether they are a spotless or not a spotless.'
    }
    previousPlayerIndex = gameContext.currentPlayerIndex
    modalType='revealRole'
    stage = 'abilitiesOrItems'
    await speakThenPause(speech)
    setPlayersModalVisible(true)
  }
}

function PlayersModalCustomized(modalType:string, PlayersModalVisible:boolean, setPlayersModalVisible:React.Dispatch<any>, nightTimeLogic:() => void) {
  const gameContext = useContext(GameContext)
  const [subModalVisible, setSubModalVisible] = useState(false)
  const [disableContinueButton, setDisableContinueButton] = useState(true)
  let continueButtonVisible = false
  let onPlayerTouch = (playerIndex:number) => {}
  let subModal = <></>

  if (modalType === 'nightTimeAbilitiesItems') {
    continueButtonVisible = true
    if (disableContinueButton === true) { setDisableContinueButton(false) }
    onPlayerTouch = (playerIndex:number) => { setSubModalVisible(true) }
    subModal = <NightTimeAbilitiesItemsModal visible={subModalVisible} setVisible={setSubModalVisible}/>
  } else if (modalType === 'revealRole') {
    continueButtonVisible = false
    if (disableContinueButton === false) { setDisableContinueButton(true) }
    onPlayerTouch = (playerIndex:number) => { setSubModalVisible(true) }
    subModal = <RevealRoleModal visible={subModalVisible} setVisible={setSubModalVisible} abilityOrItem={abilityOrItem} callback={() => {
      setPlayersModalVisible(false)
      nightTimeLogic()
    }}/>
  } else if (modalType === 'monomi') {
    continueButtonVisible = false
    if (disableContinueButton === false) { setDisableContinueButton(true) }
    onPlayerTouch = (playerIndex:number) => {
      gameContext.playersInfo.forEach(playerInfo => { playerInfo.colorScheme = 'white' })
      if (playerIndex !== gameContext.monomiProtect) {
        gameContext.playersInfo[playerIndex].colorScheme = 'lightblue'
        gameContext.monomiProtect = playerIndex
      } else {
        gameContext.monomiProtect = -1
      }
    }
  } else if (modalType === 'blackened') {
    // disableContinueButton must equal true before coming into here. Can't set it false here otherwise 
    // onPlayerTouch() setting it to false will get overwritten as it re-renders and reruns this method
    continueButtonVisible = true
    onPlayerTouch = (playerIndex:number) => {
      gameContext.playersInfo.forEach(playerInfo => { playerInfo.colorScheme = 'white' })
      gameContext.playersInfo[playerIndex].colorScheme = '#cc0066'
      gameContext.blackenedAttack = playerIndex
      setDisableContinueButton(false)
    }
  }
  
  return (
    <PlayersModal visible={PlayersModalVisible} setVisible={setPlayersModalVisible} modal={subModal} continueVisible={continueButtonVisible}
    disableContinue={disableContinueButton} onPlayerTouch={onPlayerTouch} onContinue={() => nightTimeLogic()}/>
  )
}

async function speakThenPause(speech:string, seconds:number=0) {
  Speech.speak(speech)
  while (await Speech.isSpeakingAsync()) {}
  await sleep(seconds * 1000)
}