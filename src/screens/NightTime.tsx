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
import { Audio } from 'expo-av'

let stage = 'schoolBell'
let abilityOrItem = ''
let currentPlayerIndex = 0
let previousPlayerIndex = -1
let timerDuration = 0
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))
let onPlayerClick = (playerIndex:number) => {}
let onContinue = () => {}
let backgroundMusic:Audio.Sound
let monomiBackgroundMusic:Audio.Sound
let isMusicPlaying = false
const updateMusicStatus = playbackStatus => { isMusicPlaying = playbackStatus.isPlaying }

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
              disabled={continueButtonDisabled} onPress={() => {
                onContinue()
                gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
                disableContinueButton()
                setDisabledPlayerIndexes([])
                onContinue = () => {}
                onPlayerClick = () => {}
              }}>
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
          await speakThenPause(speechSchoolAnnouncement1, 2, async() => {
            setSchoolAnnouncementVisible(false)
            await playMusic()
            stage = 'traitor'  
            nightTimeLogic()
          })        
        } else if (gameContext.mode === 'extreme' && gameContext.dayNumber > 0) {
          onPlayerClick = () => { setNightTimeAbilitiesItemsModallVisible(true) }
          onContinue = async () => {
            gameContext.playersInfo.forEach(playerInfo => { playerInfo.borderColor = 'white' })
            setNightTimeLabelVisible(false)
            await playMusic()
            stage = 'abilitiesOrItemsSleep'
            nightTimeLogic()
          }
          await speakThenPause(speechSchoolAnnouncement2, 0, () => {
            setContinueButtonColor(blackTransparent)
            setContinueButtonTextColor('white')
            setContinueButtonDisabled(false)
          })
        } else {
          setNightTimeLabelVisible(false)
          await speakThenPause(speechSchoolAnnouncement3, 2, async () => {
            await playMusic()
            stage = 'alterEgo'
            nightTimeLogic()
          })
        }
        break
      case 'abilitiesOrItemsSleep':
        await abilitiesAndItemsSleep()
        break
      case 'abilitiesOrItemsAwake':
        setContinueButtonText('Investigate')
        onPlayerClick = (playerIndex) => {
          gameContext.playersInfo.forEach(playerInfo => { playerInfo.backgroundColor = blackTransparent })
          gameContext.playersInfo[playerIndex].backgroundColor = pinkTransparent
          setPlayerIndex(playerIndex)
          setContinueButtonColor(pinkTransparent)
          setContinueButtonTextColor('white')
          setContinueButtonDisabled(false)
        }
        onContinue = () => {
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
          await speakThenPause(speechToTraitorsAwake, 0 , () => {
            timerDuration = 5
            stage = 'traitorSleep'
            setTimerVisible(true)
          })
        } else {
          stage = 'blackened'
          nightTimeLogic()
        }
        break
      case 'traitorSleep':
        gameContext.playersInfo.forEach(playerInfo => {playerInfo.backgroundColor = blackTransparent})
        setTimerVisible(false)
        stage = 'blackened'
        await speakThenPause(speechToTraitorsSleep, 2, nightTimeLogic)
        break
      case 'monomi':
        if (roleInPlay(gameContext.roleCounts, 'Monomi') && gameContext.dayNumber > 0 && !gameContext.monomiExploded && !gameContext.vicePlayed) {
          const monomiMusic = require("../assets/music/NightTime/Miss-Monomi's-Practice-Lesson.mp3")
          const { sound } = await Audio.Sound.createAsync(monomiMusic, {}, updateMusicStatus)
          monomiBackgroundMusic = sound
          await backgroundMusic.pauseAsync()
          await monomiBackgroundMusic.playAsync()
          await monomiBackgroundMusic.setVolumeAsync(.5)
          abilityOrItem = 'Protect'
          setContinueButtonText('Continue')
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
          await speakThenPause(speechToMonomiAwake, 0, () => {
            timerDuration = 10
            stage = 'monomiSleep'
            setTimerVisible(true)
          })
        } else {
          stage = 'alterEgo'
          nightTimeLogic()
        }
        break
      case 'monomiSleep':
        setTimerVisible(false)
        await speakThenPause(speechToMonomiSleep, 1, async () => {
          await monomiBackgroundMusic.pauseAsync()
          await backgroundMusic.playAsync()
          stage = 'alterEgo'
          nightTimeLogic()
        })
        break
      case 'alterEgo':
        if (gameContext.dayNumber > 0 && gameContext.alterEgoAlive) {
          abilityOrItem = 'Alter Ego'
          gameContext.playersInfo.forEach(playerInfo => {
            if (playerInfo.role === 'Alter Ego') { setDisabledPlayerIndexes([playerInfo.playerIndex]) }
            else { playerInfo.backgroundColor = blackTransparent }
          })
          setContinueButtonText('Investigate')
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
        stage = 'blackened'
        await speakThenPause(speechToAlterEgoSleep, 2, nightTimeLogic)
        break
      case 'blackened':
        if ((gameContext.dayNumber === 0 && gameContext.mode === 'extreme' || gameContext.dayNumber > 0) && !gameContext.vicePlayed) {
          abilityOrItem = 'Attack'
          setContinueButtonText('Attack')
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
          stage = 'morningTime'
          if (gameContext.vicePlayed === true) { 
            await speakThenPause(speechToBlackenedVice, 1, nightTimeLogic) 
          } else {
            nightTimeLogic()
          }
        }
        break
      case 'blackenedSleep':
        setContinueButtonText('Attack')
        stage = 'morningTime'
        await speakThenPause(speechToBlackenedSleep, 2, nightTimeLogic)
        break
      case 'morningTime':
        await backgroundMusic.unloadAsync()
        stage = 'schoolBell'
        gameContext.dayNumber += 1
        push('MorningTimeScreen')
    }
  }

  async function abilitiesAndItemsSleep() {  
    for (let i = 0; i <= gameContext.playerCount; i++) {
      // No one declared an investigative Ability or Item
      if (i === gameContext.playerCount && previousPlayerIndex === -1) {
        currentPlayerIndex  = 0 // probably can delete
        previousPlayerIndex = -1
        stage = 'monomi'
        await speakThenPause('Everyone should now be asleep.', 2, nightTimeLogic)
        return
      }
      // No more investigative Ability or Item
      else if (i === gameContext.playerCount && previousPlayerIndex !== -1) {
        await speakThenPause(gameContext.playersInfo[previousPlayerIndex].name + ', go to sleep.', 2, () => {
          currentPlayerIndex = 0
          previousPlayerIndex = -1
          stage = 'monomi'
          nightTimeLogic()
        })
        return
      // Someone declared an investigative Ability or Item
      } else if (gameContext.playersInfo[i].useAbility !== '' || gameContext.playersInfo[i].useItem !== '') {
        currentPlayerIndex = i
        let speech = ''
        if (previousPlayerIndex === -1) {
          speech = 'Everyone go to sleep.'
        } else if (currentPlayerIndex !== previousPlayerIndex && previousPlayerIndex !== -1) {
          speech = gameContext.playersInfo[previousPlayerIndex].name + ', go to sleep.'
        } else {
          stage = 'abilitiesOrItemsAwake'
          nightTimeLogic()
        }
        await speakThenPause(speech, 2, () => {
          setDisabledPlayerIndexes([currentPlayerIndex])
          stage = 'abilitiesOrItemsAwake'
          nightTimeLogic()
        })
        break
      }
    }
  }

  async function abilitiesAndItemsAwake() {
    let speech = ''
    if (previousPlayerIndex !== currentPlayerIndex) {
      speech += gameContext.playersInfo[currentPlayerIndex].name + ', wake up. '
    }
        
    if (gameContext.playersInfo[currentPlayerIndex].useAbility === "Kyoko Kirigiri") {
      abilityOrItem = "Kyoko Kirigiri"
      gameContext.playersInfo[currentPlayerIndex].useAbility = ''
      speech += 'Click the player you would like to investigate whether they are on the side of hope or despair.'
    } else if (gameContext.playersInfo[currentPlayerIndex].useAbility === "Yasuhiro Hagakure") {
      abilityOrItem = "Yasuhiro Hagakure"
      gameContext.playersInfo[currentPlayerIndex].useAbility = ''
      const role = gameContext.playerCount < 7 ? 'the despair disease patient' : 'monomi'
      speech +=  'Click the player you would like to investigate whether they are ' + role + ' or not ' + role
    } else if (gameContext.playersInfo[currentPlayerIndex].useItem === 'Glasses') {
      abilityOrItem = 'Glasses'
      gameContext.playersInfo[currentPlayerIndex].useItem = ''
      speech += 'Click the player you would like to investigate whether they are on the side of hope or despair.'
    } else if (gameContext.playersInfo[currentPlayerIndex].useItem === "Someone's Graduation Album") {
      abilityOrItem = "Someone's Graduation Album"
      gameContext.playersInfo[currentPlayerIndex].useItem = ''
      speech += 'Click the player you would like to investigate whether they are a traitor or not a traitor.'
    } else if (gameContext.playersInfo[currentPlayerIndex].useItem === 'Silent Receiver') {
      abilityOrItem = 'Silent Receiver'
      gameContext.playersInfo[currentPlayerIndex].useItem = ''
      speech += 'Click the player you would like to investigate whether they are a spotless or not a spotless.'
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

  async function speakThenPause(speech:string, seconds:number=0, onDone?:() => void) {
    if (backgroundMusic && isMusicPlaying) { await backgroundMusic.setVolumeAsync(.1) }
    if (monomiBackgroundMusic) { await monomiBackgroundMusic.setVolumeAsync(.1) }
    const callback = async(seconds:number) => {
      if (backgroundMusic && isMusicPlaying) {  await backgroundMusic.setVolumeAsync(.5) }
      if (monomiBackgroundMusic) { await monomiBackgroundMusic.setVolumeAsync(.5) }
      await sleep(seconds * 1000)
      if (onDone) { onDone() }
    }
    Speech.speak(speech, {onDone: () => {callback(seconds)}})
  }
  
  async function playMusic() {
    const randomNum = Math.floor(Math.random() * 8)
    let music:any
    switch (randomNum) {
      case 0:
        music = require("../assets/music/NightTime/A-Dead-End-to-the-Ocean's-Aroma.mp3")
        break
      case 1:
        music = require("../assets/music/NightTime/Desire-for-Execution.mp3")
        break
      case 2:
        music = require("../assets/music/NightTime/Despair-Syndrome-1.mp3")
        break
      case 3:
        music = require("../assets/music/NightTime/Despair-Syndrome-2.mp3")
        break
      case 4:
        music = require("../assets/music/NightTime/Mr.-Monokuma's-Lesson.mp3")
        break
      case 5:
        music = require("../assets/music/NightTime/Mr.-Monokuma's-Tutoring.mp3")
        break
      case 6:
        music = require("../assets/music/NightTime/Weekly-Despair-Magazine.mp3")
        break
      case 7:
        music = require("../assets/music/NightTime/Welcome-to-Despair-Academy.mp3")
        break
    }
    const { sound } = await Audio.Sound.createAsync(music, {}, updateMusicStatus)
    backgroundMusic = sound
    await backgroundMusic.playAsync()
    await backgroundMusic.setVolumeAsync(.5)
    await backgroundMusic.setIsLoopingAsync(true)
  }
}