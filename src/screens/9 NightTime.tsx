import { useIsFocused } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { Text, TouchableHighlight, View } from 'react-native'
import { roleInPlay } from '../data/Table'
import { speechSchoolAnnouncement2, speechSchoolAnnouncement3, speechToAlterEgoAwake, speechToAlterEgoSleep, speechToBlackenedAwake1, speechToBlackenedAwake2, speechToBlackenedSleep, speechToBlackenedVice, speechToMonomiAwake, speechToMonomiSleep, speechToTraitorsAwake, speechToTraitorsSleep } from "../data/NightTimeDialogue"
import * as Speech from 'expo-speech'
import NightTimeAbilitiesItemsModal from '../components/modals/NightTimeAbilitiesItem'
import RevealRoleModal from '../components/modals/RevealRole'
import { GameContext } from '../../AppContext'
import PlayersPage from '../components/PlayersPage'
import { blackTransparent, blueTransparent, darkGrey, greyTransparent, pinkTransparent } from '../styles/colors'
import { appStyle } from '../styles/styles'
import CountdownTimer from '../components/CountdownTimer'
import { Audio } from 'expo-av'
import { disablePlayerButton, enablePlayerButton } from '../styles/playerButtonStyles'
import { monomiMusic, nighttimeMusic } from '../assets/music/music'

let abilityOrItem = ''
let currentPlayerIndex = 0
let previousPlayerIndex = -1
let timerDuration = 0
let onTimerDone = () => {}
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))
let onPlayerClick = (playerIndex:number) => {}
let onContinue = () => {}
let onRevealRoleModalOk = () => {}
let backgroundMusic:Audio.Sound
let isMusicPlaying = false
const updateMusicStatus = playbackStatus => { isMusicPlaying = playbackStatus.isPlaying }

export default function NightTimeScreen({setTime}:Props) {
  const gameContext = useContext(GameContext)
  const [nightTimeAbilitiesItemsModallVisible, setNightTimeAbilitiesItemsModallVisible] = useState(false)
  const [revealRoleModalVisible, setRevealRoleModalVisible] = useState(false)
  const [timerVisible, setTimerVisible] = useState(false)
  const [nightTimeLabelVisible, setNightTimeLabelVisible] = useState(false)
  const [continueButtonText, setContinueButtonText] = useState('')
  const [continueButtonColor, setContinueButtonColor] = useState(blackTransparent)
  const [continueButtonTextColor, setContinueButtonTextColor] = useState(blackTransparent)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true)
  const [playerIndex, setPlayerIndex] = useState(0)
  const [state, setState] = useState([])

  // Check if screen is focused
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
  useEffect(() => { if (isFocused) { 
    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
    setState([]) // re-render screen
    schoolAnnouncement()
  }}, [isFocused])

  return (
    <View style={{flex: 1}}>
      <PlayersPage middleSection={PlayersPageMiddleSection()}  onPlayerClick={(playerIndex) => {
        setPlayerIndex(playerIndex)
        onPlayerClick(playerIndex)
        }}/>
      <NightTimeAbilitiesItemsModal visible={nightTimeAbilitiesItemsModallVisible} setVisible={setNightTimeAbilitiesItemsModallVisible} playerIndex={playerIndex}/>
      <RevealRoleModal visible={revealRoleModalVisible} setVisible={setRevealRoleModalVisible} playerIndex={playerIndex} abilityOrItem={abilityOrItem}
        onOk={() => {
          gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
          onRevealRoleModalOk()
      }}/>
    </View>
  )

  function PlayersPageMiddleSection() {
    if (timerVisible) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <CountdownTimer timerKey={'0'} duration={timerDuration} onDone={() => { onTimerDone() }}/>
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
                gameContext.playersInfo.forEach(playerInfo => { disablePlayerButton(playerInfo) })
                onContinue = () => {}
                onPlayerClick = () => {}
                disableContinueButton()
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

  async function schoolAnnouncement() {
    gameContext.blackenedAttack = -1
    setNightTimeLabelVisible(true)
    disableContinueButton()
    onPlayerClick = () => {}
    onContinue = () => {}
    setContinueButtonText('Continue')
    if (gameContext.dayNumber === 0) {
      setNightTimeLabelVisible(false)
      await playMusic()
      await traitors()
    } else if (gameContext.mode === 'extreme' && gameContext.dayNumber > 0) {
      onPlayerClick = () => { setNightTimeAbilitiesItemsModallVisible(true) }
      onContinue = async () => {
        setNightTimeLabelVisible(false)
        await playMusic()
        await abilitiesOrItemsSleep()
      }
      await speakThenPause(speechSchoolAnnouncement2, 0, () => {
        gameContext.playersInfo.forEach(playerInfo => {enablePlayerButton(playerInfo)})
        setContinueButtonColor(blackTransparent)
        setContinueButtonTextColor('white')
        setContinueButtonDisabled(false)
      })
    } else {
      setNightTimeLabelVisible(false)
      await speakThenPause(speechSchoolAnnouncement3, 2, async () => {
        await playMusic()
        await alterEgo()
      })
    }
  }

  async function abilitiesOrItemsSleep() {
    for (let i = 0; i <= gameContext.playerCount; i++) {
      // No one declared an investigative Ability or Item
      if (i === gameContext.playerCount && previousPlayerIndex === -1) {
        currentPlayerIndex  = 0 // probably can delete
        previousPlayerIndex = -1
        await speakThenPause('Everyone should now be asleep.', 2, monomi)
        return
      }
      // No more investigative Ability or Item
      else if (i === gameContext.playerCount && previousPlayerIndex !== -1) {
        await speakThenPause(gameContext.playersInfo[previousPlayerIndex].name + ', go to sleep.', 2, async () => {
          currentPlayerIndex = 0
          previousPlayerIndex = -1
          await monomi()
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
          await abilitiesOrItemsAwake()
        }
        await speakThenPause(speech, 2, async () => {
          await abilitiesOrItemsAwake()
        })
        break
      }
    }
  }

  async function abilitiesOrItemsAwake() {
    setContinueButtonText('Investigate')
    onPlayerClick = (playerIndex) => {
      gameContext.playersInfo.forEach(playerInfo => {
        if (playerInfo.playerIndex === playerIndex) {
          playerInfo.playerButtonStyle.backgroundColor = pinkTransparent
        } else if (playerInfo.playerIndex !== currentPlayerIndex) {
          playerInfo.playerButtonStyle.backgroundColor = blackTransparent 
        }
      })
      setPlayerIndex(playerIndex)
      setContinueButtonColor(pinkTransparent)
      setContinueButtonTextColor('white')
      setContinueButtonDisabled(false)
    }
    onContinue = () => {
      onRevealRoleModalOk = async () => await abilitiesOrItemsSleep()
      setRevealRoleModalVisible(true)
    }
    
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
    await speakThenPause(speech, 0, () => {
      gameContext.playersInfo.forEach(playerInfo => {
        if (playerInfo.playerIndex === currentPlayerIndex) {
          disablePlayerButton(playerInfo)
        } else {
          enablePlayerButton(playerInfo)
        }
        setState([]) // re-render screen
      })
    })
  }

  async function traitors() {
    if (roleInPlay(gameContext.roleCounts, 'Traitor') && gameContext.dayNumber === 0) {
      const traitorInPlay = gameContext.playersInfo.find((playerInfo) => playerInfo.role === 'Traitor')
      if (traitorInPlay) {
        gameContext.playersInfo.forEach(playerInfo => {
          playerInfo.playerButtonStyle.textColor = 'white'
          if (playerInfo.role === 'Blackened') { playerInfo.playerButtonStyle.backgroundColor = pinkTransparent }
          else if (playerInfo.role === 'Traitor') { playerInfo.playerButtonStyle.backgroundColor = greyTransparent }
          else { playerInfo.playerButtonStyle.backgroundColor = blackTransparent }
        })            
      }
      setContinueButtonText('Continue')
      await speakThenPause(speechToTraitorsAwake, 0 , () => {
        timerDuration = 10
        onTimerDone = async () => await traitorsSleep()
        setTimerVisible(true)
      })
    } else {
      await blackened()
    }      
  }

  async function traitorsSleep() {
    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
    setTimerVisible(false)
    await speakThenPause(speechToTraitorsSleep, 2, blackened)
  }

  async function monomi() {
    if (roleInPlay(gameContext.roleCounts, 'Monomi') && gameContext.dayNumber > 0 && !gameContext.monomiExploded && !gameContext.vicePlayed) {
      await backgroundMusic.unloadAsync()
      await playMusic(true)
      abilityOrItem = 'Protect'
      setContinueButtonText('Continue')
      onPlayerClick = (playerIndex) => {
        const monomiIndex = gameContext.playersInfo.find((value) => value.role === 'Monomi')?.playerIndex
        if (monomiIndex && gameContext.playersInfo[monomiIndex].alive === true) {
          gameContext.playersInfo.forEach(playerInfo => { playerInfo.playerButtonStyle.backgroundColor = blackTransparent })
          if (playerIndex !== gameContext.monomiProtect) {
            gameContext.playersInfo[playerIndex].playerButtonStyle.backgroundColor = pinkTransparent
            gameContext.monomiProtect = playerIndex
          } else {
            gameContext.monomiProtect = -1
          }              
        }
      }
      await speakThenPause(speechToMonomiAwake, 0, () => {
        gameContext.playersInfo.forEach(playerInfo => {enablePlayerButton(playerInfo) })
        timerDuration = 15
        onTimerDone = async () => await monomiSleep()
        setTimerVisible(true)
      })
    } else {
      await alterEgo()
    }
  }

  async function monomiSleep() {
    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
    setTimerVisible(false)
    await speakThenPause(speechToMonomiSleep, 1, async () => {
      await backgroundMusic.unloadAsync()
      await playMusic()
      await alterEgo()
    })
  }

  async function alterEgo() {
    if (gameContext.dayNumber > 0 && gameContext.alterEgoAlive) {
      abilityOrItem = 'Alter Ego'
      onPlayerClick = (playerIndex) => {
        gameContext.playersInfo.forEach(playerInfo => {
          if (playerInfo.playerIndex === playerIndex) { playerInfo.playerButtonStyle.backgroundColor = pinkTransparent } 
          else if (playerInfo.role !== 'Alter Ego') { playerInfo.playerButtonStyle.backgroundColor = blackTransparent }
        })
        setContinueButtonColor(pinkTransparent)
        setContinueButtonTextColor('white')
        setContinueButtonDisabled(false) 
      }
      onContinue = async () => {
        onRevealRoleModalOk = async () => await speakThenPause(speechToAlterEgoSleep, 2, blackened)
        setRevealRoleModalVisible(true) 
      }
      await speakThenPause(speechToAlterEgoAwake, 0, () => {
        gameContext.playersInfo.forEach(playerInfo => {
          if (playerInfo.role === 'Alter Ego') { disablePlayerButton(playerInfo) }
          else { enablePlayerButton(playerInfo) }
        })
        setContinueButtonText('Investigate')
        setState([]) // re-render screen if setContinueButtonText() doesn't
      })
    } else {
      await blackened()
    }
  }

  async function blackened() {
    if ((gameContext.dayNumber === 0 && gameContext.mode === 'extreme' || gameContext.dayNumber > 0) && !gameContext.vicePlayed) {
      abilityOrItem = 'Attack'
      setContinueButtonText('Attack')
      onPlayerClick = (playerIndex) => {
        gameContext.playersInfo.forEach(playerInfo => { playerInfo.playerButtonStyle.backgroundColor = blackTransparent })
        gameContext.playersInfo[playerIndex].playerButtonStyle.backgroundColor = pinkTransparent
        gameContext.blackenedAttack = playerIndex
        setContinueButtonColor(pinkTransparent)
        setContinueButtonTextColor('white')
        setContinueButtonDisabled(false)
      }
      onContinue = async () => { await speakThenPause(speechToBlackenedSleep, 2, morningTime) }
      if (gameContext.dayNumber === 0 && gameContext.mode === 'extreme') {
        await speakThenPause(speechToBlackenedAwake1, 0, () => {
          gameContext.playersInfo.forEach(playerInfo => { enablePlayerButton(playerInfo) })
          setState([]) // re-render screen
        })
      } else if (gameContext.dayNumber > 0) {
        await speakThenPause(speechToBlackenedAwake2, 0, () => {
          gameContext.playersInfo.forEach(playerInfo => { enablePlayerButton(playerInfo) })
          setState([]) // re-render screen
        })
      }
    } else {
      if (gameContext.vicePlayed === true) { 
        await speakThenPause(speechToBlackenedVice, 1, morningTime) 
      } else {
        await morningTime()
      }
    }
  }

  async function morningTime() {
    await backgroundMusic.unloadAsync()
    gameContext.dayNumber += 1
    setTime('MorningTimeScreen')
  }

  function disableContinueButton() {
    setContinueButtonColor(greyTransparent)
    setContinueButtonTextColor(darkGrey)
    setContinueButtonDisabled(true)
  }

  async function speakThenPause(speech:string, seconds:number=0, onDone?:() => void) {
    if (backgroundMusic && isMusicPlaying) { await backgroundMusic.setVolumeAsync(.1) }
    const callback = async(seconds:number) => {
      if (backgroundMusic && isMusicPlaying) {  await backgroundMusic.setVolumeAsync(.5) }
      await sleep(seconds * 1000)
      if (onDone) { onDone() }
    }
    Speech.speak(speech, {onDone: () => {callback(seconds)}})
  }
  
  async function playMusic(monomi:boolean=false) {
    let music:any
    if (monomi) {
      music = monomiMusic[0]
    } else {
      const randomNum = Math.floor(Math.random() * nighttimeMusic.length)
      music = nighttimeMusic[randomNum]
    }
    const { sound } = await Audio.Sound.createAsync(music, {}, updateMusicStatus)
    backgroundMusic = sound
    await backgroundMusic.playAsync()
    await backgroundMusic.setVolumeAsync(.5)
    await backgroundMusic.setIsLoopingAsync(true)
  }
}

type Props = {setTime:React.Dispatch<any>}