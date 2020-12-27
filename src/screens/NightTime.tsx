import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { Text, TouchableHighlight, View } from 'react-native'
import { roleInPlay } from '../data/Table'
import { speechSchoolAnnouncement1, speechSchoolAnnouncement2, speechSchoolAnnouncement3, speechToAlterEgoAwake, speechToAlterEgoSleep, speechToBlackenedAwake1, speechToBlackenedAwake2, speechToBlackenedSleep, speechToBlackenedVice, speechToMonomiAwake, speechToMonomiSleep, speechToTraitorsAwake, speechToTraitorsSleep } from "../data/NightTimeDialogue"
import * as Speech from 'expo-speech'
import NightTimeAbilitiesItemsModal from '../components/modals/NightTimeAbilitiesItem'
import RevealRoleModal from '../components/modals/RevealRole'
import { GameContext } from '../../AppContext'
import PlayersPage from '../components/PlayersPage'
import DingDongBingBongModal from '../components/modals/DingDongBingBong'
import SchoolAnnouncementModal from '../components/modals/SchoolAnnouncement'
import { blackTransparent, blueTransparent, darkGrey, greyTransparent, pinkTransparent } from '../styles/colors'
import { appStyle } from '../styles/styles'
import CountdownTimer from '../components/CountdownTimer'

let stage = 'schoolBell'
let abilityOrItem = ''
let currentPlayerIndex = 0
let previousPlayerIndex = -1
let timerDuration = 0
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))
let onPlayerClick = (playerIndex:number) => {}
let onContinue = () => {}

export default function NightTimeScreen() {
  const gameContext = useContext(GameContext)
  const { push } = useNavigation<any>()
  const [nightTimeAbilitiesItemsModallVisible, setNightTimeAbilitiesItemsModallVisible] = useState(false)
  const [dingDongBingBongModalVisible, setDingDongBingBongModalVisible] = useState(false)
  const [schoolAnnouncementVisible, setSchoolAnnouncementVisible] = useState(false)
  const [revealRoleModalVisible, setRevealRoleModalVisible] = useState(false)
  const [timerVisible, setTimerVisible] = useState(false)
  const [nightTimeLabelVisible, setNightTimeLabelVisible] = useState(false)
  const [continueButtonText, setContinueButtonText] = useState('')
  const [continueButtonColor, setContinueButtonColor] = useState(blackTransparent)
  const [continueButtonTextColor, setContinueButtonTextColor] = useState(blackTransparent)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true)
  const [disabledPlayerIndexes, setDisabledPlayerIndexes] = useState([] as number[])
  const [playerIndex, setPlayerIndex] = useState(0)

  // Check if screen is focused
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
  useEffect(() => { if (isFocused) { nightTimeLogic() }}, [isFocused])

  return (
    <View style={{flex: 1}}>
      <PlayersPage disabledPlayerIndexes={disabledPlayerIndexes} middleSection={PlayersPageMiddleSection()} 
        onPlayerClick={(playerIndex) => {
          setPlayerIndex(playerIndex)
          onPlayerClick(playerIndex)
      }}/>
      <DingDongBingBongModal visible={dingDongBingBongModalVisible} setVisible={setDingDongBingBongModalVisible} onDone={() => {
        stage = 'schoolAnnouncement'
        nightTimeLogic()
      }}/>
      <SchoolAnnouncementModal visible={schoolAnnouncementVisible}/>
      <NightTimeAbilitiesItemsModal visible={nightTimeAbilitiesItemsModallVisible} setVisible={setNightTimeAbilitiesItemsModallVisible} playerIndex={playerIndex}/>
      <RevealRoleModal visible={revealRoleModalVisible} setVisible={setRevealRoleModalVisible} playerIndex={playerIndex} abilityOrItem={abilityOrItem}
        onOk={() => {
          gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
          nightTimeLogic()
          setDisabledPlayerIndexes([])
      }}/>
    </View>
  )

  function PlayersPageMiddleSection() {
    if (timerVisible) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <CountdownTimer timerKey={'0'} duration={timerDuration} onDone={() => { nightTimeLogic() }}/>          
        </View>
      )
    } else {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
          {NightTimeLabel()}
          <View style={{...appStyle.frame, height: '25%', minWidth: '25%', backgroundColor: continueButtonColor}}>
            <TouchableHighlight style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} 
              disabled={continueButtonDisabled} onPress={() => { onContinue() }}>
              <Text style={{...appStyle.text, color: continueButtonTextColor, textAlign: 'center', margin: 10}}>{continueButtonText}</Text>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
  }

  function NightTimeLabel() {
    if (nightTimeLabelVisible) {
      return (
        <View style={{...appStyle.frame, minWidth: '30%', justifyContent: 'center', backgroundColor: blueTransparent}}>
          <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>
            Nighttime{"\n"}of Day {gameContext.dayNumber}
          </Text>
        </View>
      )      
    } else {
      return (<></>)
    }
  }

  async function nightTimeLogic() {
    switch (stage) {
      case 'schoolBell':
        setNightTimeLabelVisible(true)
        if (gameContext.dayNumber === 0) {
          setDingDongBingBongModalVisible(true)
        } else {
          stage = 'schoolAnnouncement'
          nightTimeLogic()
        }
        break
      case 'schoolAnnouncement':
        gameContext.blackenedAttack = -1
        setContinueButtonText('Continue')
        disableContinueButton()
        setDisabledPlayerIndexes([])
        onPlayerClick = () => {}
        onContinue = () => {}
        if (gameContext.dayNumber === 0) {
          setNightTimeLabelVisible(false)
          setSchoolAnnouncementVisible(true)
          await speakThenPause(speechSchoolAnnouncement1, 2)
          setSchoolAnnouncementVisible(false)
          stage = 'traitor'
          nightTimeLogic()
        } else if (gameContext.mode === 'extreme' && gameContext.dayNumber > 0) {
          setContinueButtonColor(blackTransparent)
          setContinueButtonTextColor('white')
          setContinueButtonDisabled(false)
          onPlayerClick = () => { setNightTimeAbilitiesItemsModallVisible(true) }
          onContinue = () => {
            setNightTimeLabelVisible(false)
            gameContext.playersInfo.forEach(playerInfo => { playerInfo.borderColor = 'white' })
            setDisabledPlayerIndexes([])
            nightTimeLogic()
          }
          stage = 'abilitiesOrItemsSleep'
          await speakThenPause(speechSchoolAnnouncement2, 1)
        } else {
          setNightTimeLabelVisible(false)
          await speakThenPause(speechSchoolAnnouncement3, 2)
          stage = 'alterEgo'
          nightTimeLogic()
        }
        break
      case 'abilitiesOrItemsSleep':
        disableContinueButton()
        setDisabledPlayerIndexes([])
        onPlayerClick  = () => {}
        onContinue = () => {}
        await abilitiesAndItemsSleep()
        break
      case 'abilitiesOrItemsAwake':
        setContinueButtonText('Investigate')
        disableContinueButton()
        onPlayerClick = (playerIndex) => {
          gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
          gameContext.playersInfo[playerIndex].backgroundColor = pinkTransparent
          setPlayerIndex(playerIndex)
          setContinueButtonColor(pinkTransparent)
          setContinueButtonTextColor('white')
          setContinueButtonDisabled(false)
        } // move to onContinue
        onContinue = () => {
          gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
          setRevealRoleModalVisible(true)
        }
        await abilitiesAndItemsAwake()
        break
      case 'traitor':
        if (roleInPlay(gameContext.roleCounts, 'Traitor') && gameContext.dayNumber === 0) {
          gameContext.playersInfo.forEach(playerInfo => {
            if (playerInfo.role === 'Blackened') { playerInfo.backgroundColor = pinkTransparent }
            else if (playerInfo.role === 'Traitor') { playerInfo.backgroundColor = greyTransparent }
            else { playerInfo.backgroundColor = blackTransparent }
          })
          setContinueButtonText('Continue')
          disableContinueButton()
          setDisabledPlayerIndexes([])
          onPlayerClick = () => {}
          onContinue = () => {}
          await speakThenPause(speechToTraitorsAwake)
          timerDuration = 5
          setTimerVisible(true)
          stage = 'traitorSleep'
        } else {
          stage = 'blackened'
          nightTimeLogic()
        }
        break
      case 'traitorSleep':
        gameContext.playersInfo.forEach(playerInfo => {playerInfo.backgroundColor = blackTransparent})
        setTimerVisible(false)
        await speakThenPause(speechToTraitorsSleep, 2)
        stage = 'blackened'
        nightTimeLogic()
        break
      case 'monomi':
        if (roleInPlay(gameContext.roleCounts, 'Monomi') && gameContext.dayNumber > 0 && !gameContext.monomiExploded && !gameContext.vicePlayed) {
          abilityOrItem = 'Protect'
          gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
          setContinueButtonText('Continue')
          disableContinueButton()
          setDisabledPlayerIndexes([])
          onContinue = () => {}
          onPlayerClick = (playerIndex) => {
            const monomiIndex = gameContext.playersInfo.find((value) => value.role === 'Monomi')?.playerIndex
            if (monomiIndex && gameContext.playersInfo[monomiIndex].alive === true) {
              gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
              if (playerIndex !== gameContext.monomiProtect) {
                gameContext.playersInfo[playerIndex].backgroundColor = pinkTransparent
                gameContext.monomiProtect = playerIndex
              } else {
                gameContext.monomiProtect = -1
              }              
            }
          }
          await speakThenPause(speechToMonomiAwake)
          timerDuration = 10
          setTimerVisible(true)
          stage = 'monomiSleep'
        } else {
          stage = 'alterEgo'
          nightTimeLogic()
        }
        break
      case 'monomiSleep':
        gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
        onContinue = () => {}
        onPlayerClick = () => {}
        setTimerVisible(false)
        await speakThenPause(speechToMonomiSleep, 1)
      case 'alterEgo':
        if (gameContext.dayNumber > 0 && gameContext.alterEgoAlive) {
          abilityOrItem = 'Alter Ego'
          gameContext.playersInfo.forEach(playerInfo => {
            if (playerInfo.role === 'Alter Ego') { setDisabledPlayerIndexes([playerInfo.playerIndex]) }
            else { playerInfo.backgroundColor = blackTransparent }
          })
          setContinueButtonText('Investigate')
          disableContinueButton()
          onPlayerClick = (playerIndex) => {
            gameContext.playersInfo.forEach(playerInfo => {playerInfo.backgroundColor = blackTransparent})
            gameContext.playersInfo[playerIndex].backgroundColor = pinkTransparent
            setContinueButtonColor(pinkTransparent)
            setContinueButtonTextColor('white')
            setContinueButtonDisabled(false) 
          }
          onContinue = () => { 
            stage = 'alterEgoSleep'
            setRevealRoleModalVisible(true) 
          }
          await speakThenPause(speechToAlterEgoAwake, 1)
        } else {
          stage = 'blackened'
          nightTimeLogic()
        }
        break
      case 'alterEgoSleep':
        setContinueButtonText('Investigate')
        disableContinueButton()
        setDisabledPlayerIndexes([])
        onContinue = () => {}
        onPlayerClick = () => {}
        await speakThenPause(speechToAlterEgoSleep, 2)
        stage = 'blackened'
        nightTimeLogic()
        break
      case 'blackened':
        if ((gameContext.dayNumber === 0 && gameContext.mode === 'extreme' || gameContext.dayNumber > 0) && !gameContext.vicePlayed) {
          abilityOrItem = 'Attack'
          gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
          setContinueButtonText('Attack')
          disableContinueButton()
          setDisabledPlayerIndexes([])
          onPlayerClick = (playerIndex) => {
            gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
            gameContext.playersInfo[playerIndex].backgroundColor = pinkTransparent
            gameContext.blackenedAttack = playerIndex
            setContinueButtonColor(pinkTransparent)
            setContinueButtonTextColor('white')
            setContinueButtonDisabled(false)
          }
          onContinue = () => {
            stage = 'blackenedSleep'
            nightTimeLogic()
          }
          if (gameContext.dayNumber === 0 && gameContext.mode === 'extreme') {
            await speakThenPause(speechToBlackenedAwake1, 1)
          } else if (gameContext.dayNumber > 0) {
            await speakThenPause(speechToBlackenedAwake2, 1)
          }
        } else {
          if (gameContext.vicePlayed === true) { await speakThenPause(speechToBlackenedVice, 1) }
          stage = 'morningTime'
          nightTimeLogic()
        }
        break
      case 'blackenedSleep':
        gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
        setContinueButtonText('Attack')
        disableContinueButton()
        setDisabledPlayerIndexes([])
        onContinue = () => {}
        onPlayerClick = () => {}
        await speakThenPause(speechToBlackenedSleep, 2)
      case 'morningTime':
        stage = 'schoolBell'
        gameContext.dayNumber += 1
        push('MorningTimeScreen')
    }
  }

  async function abilitiesAndItemsSleep() {
    if (previousPlayerIndex === -1) {
      await speakThenPause('Everyone, go to sleep.', 2)
    }
  
    for (let i = 0; i <= gameContext.playerCount; i++) {
      // No one declared an investigative Ability or Item
      if (i === gameContext.playerCount && previousPlayerIndex === -1) {
        currentPlayerIndex  = 0 // probably can delete
        previousPlayerIndex = -1
        await speakThenPause('Everyone should now be asleep.', 2)
        stage = 'monomi'
        nightTimeLogic()
        return
      }
      // No more investigative Ability or Item
      else if (i === gameContext.playerCount && previousPlayerIndex !== -1) {
        await speakThenPause(gameContext.playersInfo[previousPlayerIndex].name + ', go to sleep.', 2)
        currentPlayerIndex = 0
        previousPlayerIndex = -1
        stage = 'monomi'
        nightTimeLogic()
        return
      // Someone declared an investigative Ability or Item
      } else if (gameContext.playersInfo[i].useAbility !== '' || gameContext.playersInfo[i].useItem !== '') {
        currentPlayerIndex = i
        if (currentPlayerIndex !== previousPlayerIndex && previousPlayerIndex !== -1) {
          await speakThenPause(gameContext.playersInfo[previousPlayerIndex].name + ', go to sleep.', 2)
        }
        stage = 'abilitiesOrItemsAwake'
        nightTimeLogic()
        setDisabledPlayerIndexes([currentPlayerIndex])
        break
      }
    }
  }

  async function abilitiesAndItemsAwake() {
    if (previousPlayerIndex !== currentPlayerIndex) {
      await speakThenPause(gameContext.playersInfo[currentPlayerIndex].name + ', wake up.')
    }
  
    let speech = ''        
    if (gameContext.playersInfo[currentPlayerIndex].useAbility === "Kyoko Kirigiri") {
      abilityOrItem = "Kyoko Kirigiri"
      gameContext.playersInfo[currentPlayerIndex].useAbility = ''
      speech = 'Click the player you would like to investigate whether they are on the side of hope or despair.'
    } else if (gameContext.playersInfo[currentPlayerIndex].useAbility === "Yasuhiro Hagakure") {
      abilityOrItem = "Yasuhiro Hagakure"
      gameContext.playersInfo[currentPlayerIndex].useAbility = ''
      const role = gameContext.playerCount < 7 ? 'the despair disease patient' : 'monomi'
      speech =  'Click the player you would like to investigate whether they are ' + role + ' or not ' + role
    } else if (gameContext.playersInfo[currentPlayerIndex].useItem === 'Glasses') {
      abilityOrItem = 'Glasses'
      gameContext.playersInfo[currentPlayerIndex].useItem = ''
      speech = 'Click the player you would like to investigate whether they are on the side of hope or despair.'
    } else if (gameContext.playersInfo[currentPlayerIndex].useItem === "Someone's Graduation Album") {
      abilityOrItem = "Someone's Graduation Album"
      gameContext.playersInfo[currentPlayerIndex].useItem = ''
      speech = 'Click the player you would like to investigate whether they are a traitor or not a traitor.'
    } else if (gameContext.playersInfo[currentPlayerIndex].useItem === 'Silent Receiver') {
      abilityOrItem = 'Silent Receiver'
      gameContext.playersInfo[currentPlayerIndex].useItem = ''
      speech = 'Click the player you would like to investigate whether they are a spotless or not a spotless.'
    }
    previousPlayerIndex = currentPlayerIndex
    stage = 'abilitiesOrItemsSleep'
    await speakThenPause(speech)
  }

  function disableContinueButton() {
    setContinueButtonColor(greyTransparent)
    setContinueButtonTextColor(darkGrey)
    setContinueButtonDisabled(true)
  }
}

async function speakThenPause(speech:string, seconds:number=0) {
  Speech.speak(speech)
  while (await Speech.isSpeakingAsync()) {}
  await sleep(seconds * 1000)
}