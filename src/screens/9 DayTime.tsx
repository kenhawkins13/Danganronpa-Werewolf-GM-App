import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import React, { useContext, useEffect, useState } from 'react'
import { Image, View, Text, TouchableHighlight } from 'react-native'
import { GameContext } from '../../AppContext'
import CountdownTimer from '../components/CountdownTimer'
import DiscussionOrVoteModal from '../components/modals/DiscussionOrVote'
import PlayerVoteModal from '../components/modals/PlayerVote'
import PlayersPage from '../components/PlayersPage'
import { blackTransparent, darkGrey, greyTransparent, pinkTransparent, yellowTransparent } from '../styles/colors'
import { appStyle } from '../styles/styles'
import { Audio } from 'expo-av'
import { GameContextType } from '../types/types'
import { disablePlayerButton } from '../styles/playerButtonStyles'
import { classTrialMusic, daytimeAggressiveMusic, daytimeCalmMusic, scrumMusic } from '../assets/music/music'
import { dayTimeSpeech } from '../data/Speeches'
import PunishmentTimeModal from '../components/modals/PunishmentTime'

let speech = ''
let votedPlayerIndex = -1
let votedPlayer = ''
let discussionTime:number
let onContinue = () => {}
let onDiscussionDone = () => {}
let onPlayerVote = () => {}
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function DayTimeScreen({setTime}:Props) {
  const { push } = useNavigation<any>()
  const gameContext = useContext(GameContext)
  const [videoVisible, setVideoVisible] = useState(false)
  const [timerVisible, setTimerVisible] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [playerVoteVisible, setPlayerVoteVisible] = useState(false)
  const [discussionOrVoteVisible, setDiscussionOrVoteVisible] = useState(false)
  const [continueButtonColor, setContinueButtonColor] = useState(greyTransparent)
  const [continueButtonTextColor, setContinueButtonTextColor] = useState(darkGrey)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true)
  const [labelClassTrial, setLabelToClassTrial] = useState(false)
  const [state, setState] = useState([])

  const isFocused = useIsFocused()
  useEffect(() => { if (isFocused) {
    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
    setState([]) // re-render screen
    daySpeech() 
  }}, [isFocused])


  return (
    <View style={{ flex: 1 }}>
      <PlayersPage middleSection={PlayersPageMiddleSection()} onPlayerClick={() => {}}/>
      <PlayerVoteModal visible={playerVoteVisible} setVisible={setPlayerVoteVisible} onOk={(playerVote) => { 
        votedPlayerIndex = playerVote
        onPlayerVote()
      }}/>
      <DiscussionOrVoteModal visible={discussionOrVoteVisible} setVisible={setDiscussionOrVoteVisible} onDiscussion={async () => {
        discussionTime = 60
        await discussion()
      }} onVote={async () => { await trial() }}/>
    </View>
  )

  function PlayersPageMiddleSection() {
    if (timerVisible) {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 2}}/>
          <View style={{flex: 5, alignItems: 'center', justifyContent: 'center'}}>
            <View>
              {DayTimeLabel()}
              <TouchableHighlight style={{height: 28, width: 28, position:'absolute', right: -50, top: 15}} 
                onPress={async() => {
                  if (await Speech.isSpeakingAsync() === false) {
                    Speech.speak(speech)                
                  }
                }}>
                <Image style={{height: 28, width: 28}} source={require('../assets/images/Speaker.png')}/>
              </TouchableHighlight>
            </View>
          </View>
          <View style={{flex: 1}}/>
          <View style={{flex: 10, flexDirection: 'row'}}>
            <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
              <View style={{...appStyle.frame, height: '50%', minWidth: '75%', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableHighlight style={{flex: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  onPress={async () => { setTimerKey(timerKey + 1) }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>Restart{"\n"}Timer</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <CountdownTimer timerKey={timerKey.toString()} duration={discussionTime} onDone={async () => {
                if (timerVisible) { 
                  await gameContext.backgroundMusic.setVolumeAsync(.1)
                  speech = "Time is up"
                  Speech.speak(speech)
                }
              }}/>
            </View>
            <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
              <View style={{...appStyle.frame, height: '50%', minWidth: '75%', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableHighlight style={{flex:1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  onPress={async () => {
                    await gameContext.backgroundMusic.unloadAsync()
                    setTimerVisible(false)
                    onDiscussionDone()
                  }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>End{"\n"}Discussion</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <View style={{flex: 1}}/>
        </View>
      )      
    } else {
      const onVideoDone = async () => {
        await speakThenPause(dayTimeSpeech(votedPlayer).execution2, 1, () => {
          setVideoVisible(false)
          declareWinner()
        })
      }
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
          <View>
            {DayTimeLabel()}
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
            <TouchableHighlight style={{flex: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
              disabled={continueButtonDisabled} underlayColor={continueButtonColor} onPress={() => {
                disableContinueButton()
                onContinue() 
              }}>
              <Text style={{...appStyle.text, textAlign: 'center', margin: 10, color: continueButtonTextColor}}>Continue</Text>
            </TouchableHighlight>
          </View>
          <PunishmentTimeModal visible={videoVisible} setVisible={setVideoVisible} onDone={onVideoDone}/>
        </View>
      )
    }
  }

  function DayTimeLabel() {
    if (labelClassTrial) {
      return (
        <View style={{...appStyle.frame, minWidth: '30%', justifyContent: 'center', backgroundColor: pinkTransparent}}>
          <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>
            Class trial{"\n"}of Day {gameContext.dayNumber}
          </Text>
        </View>
      )      
    } else {
      return (
        <View style={{...appStyle.frame, minWidth: '30%', justifyContent: 'center', backgroundColor: yellowTransparent}}>
          <Text style={{...appStyle.text, textAlign: 'center', margin: '2.5%'}}>
            Daytime{"\n"}of Day {gameContext.dayNumber}
          </Text>
        </View>
      )
    }
  }

  async function daySpeech() {
    let onSpeechDone = () => {}
    discussionTime = 180
    if (gameContext.blackenedAttack >= 0 && gameContext.dayNumber > 1) {
      speech = dayTimeSpeech().daySpeech1
    } else {
      speech = dayTimeSpeech().daySpeech2
    }
    if (gameContext.mode === 'extreme') {
      onSpeechDone = async () => await abilitiesOrItems()
    } else {
      onSpeechDone = async () => await discussion()
    }
    await speakThenPause(speech, 1, onSpeechDone)
  }

  async function abilitiesOrItems() {
    speech = dayTimeSpeech().abilityOrItem
    await speakThenPause(speech, 0, () => {
      onContinue = async () => await discussion()
      enableContinueButton()
    })
  }

  async function discussion() {
    await playMusic(gameContext)
    if (gameContext.blackenedAttack >= 0 && gameContext.dayNumber > 1) {
      setLabelToClassTrial(true)
      onDiscussionDone = async () => await abilitiesOrItemsTrial()
    } else {
      onDiscussionDone = async () => await nightTime()
    }
    speech = dayTimeSpeech().discussion
    await speakThenPause(speech, 0, () => { setTimerVisible(true) })
  }

  async function abilitiesOrItemsTrial() {
    if (gameContext.mode === 'extreme' && gameContext.tieVote === false) {
      onContinue = async () => await trial()
      speech = dayTimeSpeech().abilityOrItemTrial
      await speakThenPause(speech, 0, enableContinueButton)
    } else {
      await trial()
    }
  }

  async function trial() {
    onContinue = async () => await vote()
    speech = dayTimeSpeech().trial
    await speakThenPause(speech, 0, enableContinueButton)
  }

  async function vote() {
    onPlayerVote = async () => await execution()
    speech = dayTimeSpeech().vote
    await speakThenPause(speech, 0, () => { setPlayerVoteVisible(true) })
  }

  async function execution() {
    if (votedPlayerIndex === -1) { // Tie vote
      gameContext.tieVote = true
      setDiscussionOrVoteVisible(true)
    } else {
      gameContext.tieVote = false
      gameContext.playersInfo[votedPlayerIndex].alive = false
      votedPlayer = gameContext.playersInfo[votedPlayerIndex].name
      if (gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')) {
        gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')!.side = 'Despair'
      }
      speech = dayTimeSpeech(votedPlayer).execution1
      await speakThenPause(speech, 1, () => setVideoVisible(true))
    }
  }

  async function declareWinner() {
    if (votedPlayerIndex === gameContext.playersInfo.find((value) => value.role === 'Blackened')?.playerIndex) {
      await speakThenPause(dayTimeSpeech(votedPlayer).winnerDeclaration1, 0, () => {
        gameContext.winnerSide = 'Hope'
        push('WinnerDeclarationScreen')
      })
    } else if (votedPlayerIndex === gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')?.playerIndex) {
      await speakThenPause(dayTimeSpeech(votedPlayer).winnerDeclaration2, 0, () => {
        gameContext.winnerSide = 'Ultimate Despair'
        push('WinnerDeclarationScreen')
      })
    } else if (gameContext.killsLeft === 0) {
      await speakThenPause(dayTimeSpeech(votedPlayer).winnerDeclaration3, 0, () => {
        gameContext.winnerSide = 'Despair'
        push('WinnerDeclarationScreen')
      })
    } else {
      if (gameContext.playersInfo[votedPlayerIndex].role === 'Alter Ego') {
        gameContext.alterEgoAlive = false
        speech = dayTimeSpeech(votedPlayer, gameContext.killsLeft).killsLeft1
      } else {
        speech = dayTimeSpeech(votedPlayer, gameContext.killsLeft).killsLeft2
      }
      await speakThenPause(speech, 1, nightTime)
    }
  }

  async function nightTime() {
    setTime('NightTimeScreen')
  }

  function enableContinueButton() {
    setContinueButtonColor(blackTransparent)
    setContinueButtonTextColor('white')
    setContinueButtonDisabled(false)
  }

  function disableContinueButton() {
    setContinueButtonColor(greyTransparent)
    setContinueButtonTextColor(darkGrey)
    setContinueButtonDisabled(true)
  }
}

async function speakThenPause(speech:string, seconds:number=0, onDone?:() => void) {
  const callback = async(seconds:number) => {
    await sleep(seconds * 1000)
    if (onDone) { onDone() }
  }
  Speech.speak(speech, {onDone: () => {callback(seconds)}})
}

async function playMusic(gameContext:GameContextType) {
  let music:any[]
  if (gameContext.dayNumber === 1 || gameContext.blackenedAttack === -1) {
    music = daytimeCalmMusic
  } else if (gameContext.blackenedAttack === -2) {
    music = daytimeAggressiveMusic
  } else if (gameContext.tieVote === true) {
    music = scrumMusic
  } else {
    music = classTrialMusic
  }
  const randomNum = Math.floor(Math.random() * music.length)
  const { sound } = await Audio.Sound.createAsync(music[randomNum])
  await sound.playAsync()
  await sound.setVolumeAsync(.1)
  await sound.setIsLoopingAsync(true)
  gameContext.backgroundMusic = sound
}

type Props = {setTime:React.Dispatch<any>}