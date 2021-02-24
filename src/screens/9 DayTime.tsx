import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import React, { useContext, useEffect, useState } from 'react'
import { Image, View, Text, TouchableHighlight } from 'react-native'
import { GameContext } from '../../AppContext'
import CountdownTimer from '../components/CountdownTimer'
import PlayersPage from '../components/PlayersPage'
import { blackTransparent, darkGrey, greyTransparent, pinkTransparent, yellowTransparent } from '../styles/colors'
import { appStyle } from '../styles/styles'
import { Audio } from 'expo-av'
import { GameContextType } from '../types/types'
import { disablePlayerButton, enablePlayerButton } from '../styles/playerButtonStyles'
import { classTrialMusic, daytimeAggressiveMusic, daytimeCalmMusic, scrumMusic } from '../assets/music/music'
import { dayTimeSpeech } from '../data/Speeches'
import PunishmentTimeModal from '../components/modals/PunishmentTime'
import { sounds } from '../assets/sounds/sounds'

let speech = ''
let votedPlayerIndex = -1
let votedPlayer = ''
let discussionTime:number
let onContinue = () => {}
let onPlayerClick = (playerIndex:number) => {}
let onDiscussionDone = () => {}
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function DayTimeScreen({setTime}:Props) {
  const { push } = useNavigation<any>()
  const gameContext = useContext(GameContext)
  const [videoVisible, setVideoVisible] = useState(false)
  const [timerVisible, setTimerVisible] = useState(false)
  const [votingTime, setVotingTime] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
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
      <PlayersPage middleSection={PlayersPageMiddleSection()} onPlayerClick={onPlayerClick}/>
    </View>
  )

  function PlayersPageMiddleSection() {
    if (timerVisible) {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{flex: 2}}/>
            <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
              {DayTimeLabel()}
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 8}}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                  <View style={{...appStyle.frame, height: '62.5%', minWidth: '75%'}}>
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
                  <View style={{...appStyle.frame, height: '62.5%', minWidth: '75%', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableHighlight style={{flex:1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                      onPress={async () => {
                        await gameContext.backgroundMusic.unloadAsync()
                        setTimerVisible(false)
                        disableContinueButton()
                        onDiscussionDone()
                      }}>
                      <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>End{"\n"}Discussion</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </View>
            <View style={{flex: 2}}/>
          </View>
        </View>
      )      
    } else if (votingTime) {      
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{flex: 2}}/>
            <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
              {DayTimeLabel()}
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
              <View style={{...appStyle.frame, height: '62.5%', width: '25%'}}>
                <TouchableHighlight style={{flex: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  onPress={async () => {
                    votedPlayerIndex = -1
                    gameContext.tieVoteCount += 1
                    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
                    setVotingTime(false)
                    disableContinueButton()
                    let onSpeechDone = async () => {
                      discussionTime = 60
                      await discussion()
                    }
                    if (gameContext.tieVoteCount === 1) {
                      speech = dayTimeSpeech().tie1
                      await speakThenPause(speech, 1, onSpeechDone)
                    } else if (gameContext.tieVoteCount === 2) {
                      speech = dayTimeSpeech().tie2
                      await speakThenPause(speech, 1, onSpeechDone)
                    } else if (gameContext.tieVoteCount === 3) {
                      speech = dayTimeSpeech().tie3
                      onSpeechDone = async () => {
                        gameContext.winnerSide = 'Despair'
                        push('WinnerDeclarationScreen')
                      }
                      await speakThenPause(speech, 0, onSpeechDone)
                    }
                    }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>Tie</Text>
                </TouchableHighlight>
              </View>
              <View style={{...appStyle.frame, height: '62.5%', width: '25%', backgroundColor: continueButtonColor}}>
                <TouchableHighlight style={{flex: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  disabled={continueButtonDisabled} underlayColor={continueButtonColor} onPress={async () => {
                    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
                    setVotingTime(false)
                    disableContinueButton()
                    await execution()
                  }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10, color: continueButtonTextColor}}>Select</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={{flex: 2}}/>
          </View>
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
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{flex: 2}}/>
            <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
              {DayTimeLabel()}
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
              <View style={{...appStyle.frame, height: '62.5%', minWidth: '25%', backgroundColor: continueButtonColor}}>
                <TouchableHighlight style={{flex: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  disabled={continueButtonDisabled} underlayColor={continueButtonColor} onPress={() => {
                    disableContinueButton()
                    onContinue() 
                  }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10, color: continueButtonTextColor}}>Continue</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={{flex: 2}}/>
          </View>
          <PunishmentTimeModal visible={videoVisible} onDone={onVideoDone}/>
        </View>
      )
    }
  }

  function DayTimeLabel() {
    if (labelClassTrial) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{...appStyle.frame, height: '62.5%', minWidth: '30%', justifyContent: 'center', backgroundColor: pinkTransparent}}>
            <Text style={{...appStyle.text, textAlign: 'center', margin: '2.5%'}}>
              Class trial{"\n"}of Day {gameContext.dayNumber}
            </Text>
          </View>
          <TouchableHighlight style={{height: 28, width: 28, position:'absolute', left: '35%'}}
            onPress={async() => {
              if (await Speech.isSpeakingAsync() === false) {
                Speech.speak(speech)                
              }
            }}>
            <Image style={{height: 28, width: 28}} source={require('../assets/images/Speaker.png')}/>
          </TouchableHighlight>
        </View>
      )      
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{...appStyle.frame, height: '62.5%', minWidth: '30%', justifyContent: 'center', backgroundColor: yellowTransparent}}>
            <Text style={{...appStyle.text, textAlign: 'center', margin: '2.5%'}}>
              Daytime{"\n"}of Day {gameContext.dayNumber}
            </Text>
          </View>
          <TouchableHighlight style={{height: 28, width: 28, position:'absolute', left: '35%'}}
            onPress={async() => {
              if (await Speech.isSpeakingAsync() === false) {
                Speech.speak(speech)                
              }
            }}>
            <Image style={{height: 28, width: 28}} source={require('../assets/images/Speaker.png')}/>
          </TouchableHighlight>
        </View>
      )
    }
  }

  async function daySpeech() {
    let onSpeechDone = () => {}
    discussionTime = 180
    if (gameContext.mode === 'extreme') {
      onSpeechDone = async () => await abilitiesOrItems()
    } else {
      onSpeechDone = async () => await discussion()
    }
    if (gameContext.blackenedAttack >= 0 && gameContext.dayNumber > 1) {
      speech = dayTimeSpeech().daySpeech1
      const { sound } = await Audio.Sound.createAsync(sounds.dingDongBingBong2, {}, async (playbackStatus:any) => {
        if (playbackStatus.didJustFinish) {
          await sound.unloadAsync()
          await speakThenPause(speech, 1, onSpeechDone)
        }
      })
      await sound.playAsync()
      await sound.setVolumeAsync(.1)
    } else {
      speech = dayTimeSpeech().daySpeech2
      await speakThenPause(speech, 1, onSpeechDone)
    }
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
    if (gameContext.mode === 'extreme' && gameContext.tieVoteCount === 0) {
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
    onContinue = async () => {
      gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
      disableContinueButton()
      await execution()
    }
    onPlayerClick = (playerIndex) => {
      gameContext.playersInfo.forEach(playerInfo => {
        if (playerInfo.playerIndex === playerIndex) {
          playerInfo.playerButtonStyle.backgroundColor = pinkTransparent
          playerInfo.playerButtonStyle.underlayColor = pinkTransparent 
        } else {
          playerInfo.playerButtonStyle.backgroundColor = blackTransparent
          playerInfo.playerButtonStyle.underlayColor = blackTransparent
        }
      })
      votedPlayerIndex = playerIndex
      enableContinueButton()
    }
    speech = dayTimeSpeech().vote1
    await speakThenPause(speech, 2, async () => {
      speech = dayTimeSpeech().vote2
      await speakThenPause(speech, 0, () => {
        gameContext.playersInfo.forEach(playerInfo => {enablePlayerButton(playerInfo)})
        disableContinueButton()
        setVotingTime(true)
      })
    })
  }

  async function execution() {
    gameContext.tieVoteCount = 0
    gameContext.playersInfo[votedPlayerIndex].alive = false
    votedPlayer = gameContext.playersInfo[votedPlayerIndex].name
    if (gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')) {
      gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')!.side = 'Despair'
    }
    const { sound } = await Audio.Sound.createAsync(sounds.allRise, {}, async (playbackStatus:any) => {
      if (playbackStatus.didJustFinish) {
        await sound.unloadAsync()
        speech = dayTimeSpeech(votedPlayer).execution1
        await speakThenPause(speech, 1, () => setVideoVisible(true))
      }
    })
    await sound.playAsync()
    await sound.setVolumeAsync(.1)
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
  } else if (gameContext.tieVoteCount > 0) {
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