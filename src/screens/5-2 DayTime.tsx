import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import React, { useContext, useEffect, useState } from 'react'
import { Image, View, Text, TouchableHighlight } from 'react-native'
import { GameContext } from '../../AppContext'
import CountdownTimer from '../components/CountdownTimer'
import PlayersPage from '../components/PlayersPage'
import { colors } from '../styles/colors'
import { appStyle } from '../styles/styles'
import { Audio } from 'expo-av'
import { GameContextType } from '../types/types'
import { disablePlayerButton, enablePlayerButton } from '../styles/playerButtonStyles'
import { classTrialMusic, daytimeAggressiveMusic, daytimeCalmMusic, scrumMusic } from '../assets/music/music'
import { dayTimeSpeech } from '../data/Speeches'
import PunishmentTimeModal from '../components/modals/PunishmentTime'
import { sounds } from '../assets/sounds/sounds'
import { images } from '../assets/images/images'
import { requiredKills } from '../data/Table'

let speech = ''
let votedPlayerIndex = -1
let votedPlayer = ''
let discussionTime:number
let onContinue = () => {}
let onPlayerClick = (playerIndex:number) => {}
let onDiscussionDone = () => {}
let onTie = () => {}
let isMusicPlaying = false
const updateMusicStatus = playbackStatus => { isMusicPlaying = playbackStatus.isPlaying }
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function DayTimeScreen({setTime}:Props) {
  const { navigate } = useNavigation<any>()
  const gameContext = useContext(GameContext)
  const [videoVisible, setVideoVisible] = useState(false)
  const [timerVisible, setTimerVisible] = useState(false)
  const [votingTime, setVotingTime] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [continueButtonColor, setContinueButtonColor] = useState(colors.greyTransparent)
  const [continueButtonTextColor, setContinueButtonTextColor] = useState(colors.darkGrey)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true)
  const [labelClassTrial, setLabelToClassTrial] = useState(false)
  const [speakerColor, setSpeakerColor] = useState(colors.white)
  const [state, setState] = useState([])

  const isFocused = useIsFocused()
  useEffect(() => { if (isFocused) {
    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
    setState([]) // re-render screen
    daySpeech() 
  }}, [isFocused])


  return (
    <View style={{ flex: 1 }}>
      <PlayersPage visible={true} middleSection={PlayersPageMiddleSection()} onPlayerClick={onPlayerClick}/>
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
                      speech = "Time is up"
                      speakThenPause(speech)
                    }
                  }}/>
                </View>
                <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <View style={{...appStyle.frame, height: '62.5%', minWidth: '75%', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableHighlight style={{flex:1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                      onPress={async () => {
                        await gameContext.backgroundMusic.unloadAsync()
                        gameContext.backgroundMusic = ''
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
                  onPress={async () => { onTie() }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>Tie</Text>
                </TouchableHighlight>
              </View>
              <View style={{...appStyle.frame, height: '62.5%', width: '25%', backgroundColor: continueButtonColor}}>
                <TouchableHighlight style={{flex: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  disabled={continueButtonDisabled} underlayColor={continueButtonColor} onPress={async () => {
                    onContinue()
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
          trialResult()
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
          <View style={{...appStyle.frame, height: '62.5%', minWidth: '30%', justifyContent: 'center', backgroundColor: colors.pinkTransparent}}>
            <Text numberOfLines={1} style={{...appStyle.text, fontSize: 20, textAlign: 'center', margin: '2.5%'}}>
              Class trial of Day {gameContext.dayNumber}
            </Text>
          </View>
          <TouchableHighlight style={{height: 30, width: 30, position:'absolute', left: 260}}
            onPress={async() => {
              if (await Speech.isSpeakingAsync() === false) {
                speakThenPause(speech)
              }
            }}>
            <Image style={{height: 30, width: 30, tintColor: speakerColor}} source={images.replay}/>
          </TouchableHighlight>
        </View>
      )      
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{...appStyle.frame, height: '62.5%', minWidth: '30%', justifyContent: 'center', backgroundColor: colors.yellowTransparent}}>
            <Text numberOfLines={1} style={{...appStyle.text, fontSize: 20, textAlign: 'center', margin: '2.5%'}}>
              Daytime of Day {gameContext.dayNumber}
            </Text>
          </View>
          <TouchableHighlight style={{height: 30, width: 30, position:'absolute', left: 220}}
            onPress={async() => {
              if (await Speech.isSpeakingAsync() === false) {
                speakThenPause(speech)
              }
            }}>
            <Image style={{height: 30, width: 30, tintColor: speakerColor}} source={images.replay}/>
          </TouchableHighlight>
        </View>
      )
    }
  }

  async function daySpeech() {
    let onSpeechDone = () => {}
    discussionTime = 180
    if (gameContext.mode !== 'normal') {
      onSpeechDone = async () => await abilitiesOrItems()
    } else {
      onSpeechDone = async () => await discussion()
    }
    if (gameContext.blackenedAttack >= 0 && gameContext.dayNumber > 1) {
      speech = gameContext.killsLeft === requiredKills(gameContext.playerCount) - 1 ? dayTimeSpeech().daySpeech2 : dayTimeSpeech().daySpeech1
      const { sound } = await Audio.Sound.createAsync(sounds.dingDongBingBong2, {}, async (playbackStatus:any) => {
        if (playbackStatus.didJustFinish) {
          await sound.unloadAsync()
          await speakThenPause(speech, 1, onSpeechDone)
        }
      })
      await sound.setVolumeAsync(gameContext.musicVolume)
      await sound.playAsync()
    } else {
      speech = dayTimeSpeech().daySpeech1
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
      onDiscussionDone = async () => await abilitiesOrItemsBeforeTrial()
    } else {
      onDiscussionDone = async () => await nightTime()
    }
    speech = (discussionTime / 60).toString() + dayTimeSpeech().discussion
    await speakThenPause(speech, 0, () => { setTimerVisible(true) })
  }

  async function abilitiesOrItemsBeforeTrial() {
    if (gameContext.mode !== 'normal' && gameContext.tieVoteCount === 0) {
      onContinue = async () => await trial()
      speech = dayTimeSpeech().abilityOrItemBeforeTrial
      await speakThenPause(speech, 0, enableContinueButton)
    } else {
      await trial()
    }
  }

  async function trial() {
    onContinue = async () => await vote()
    if (gameContext.killsLeft === requiredKills(gameContext.playerCount) - 1 && gameContext.tieVoteCount === 0) {
      speech = dayTimeSpeech().trial1
    } else {
      speech = dayTimeSpeech().trial2
    }
    await speakThenPause(speech, 0, enableContinueButton)
  }

  async function vote() {
    onContinue = async () => {
      gameContext.tieVoteCount = 0
      votedPlayer = gameContext.playersInfo[votedPlayerIndex].name
      gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
      disableContinueButton()
      setVotingTime(false)
      await execution()
    }
    onTie = async () => {
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
          navigate('WinnerDeclarationScreen')
        }
        await speakThenPause(speech, 0, onSpeechDone)
      }
    }
    onPlayerClick = (playerIndex) => {
      gameContext.playersInfo.forEach(playerInfo => {
        if (playerInfo.playerIndex === playerIndex) {
          playerInfo.playerButtonStyle.backgroundColor = colors.pinkTransparent
          playerInfo.playerButtonStyle.underlayColor = colors.pinkTransparent 
        } else {
          playerInfo.playerButtonStyle.backgroundColor = colors.blackTransparent
          playerInfo.playerButtonStyle.underlayColor = colors.blackTransparent
        }
      })
      votedPlayerIndex = playerIndex
      enableContinueButton()
      setState([]) // re-render screen
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
    gameContext.playersInfo[votedPlayerIndex].alive = false
    if (gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')) {
      gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')!.side = 'Despair'
    }
    const { sound } = await Audio.Sound.createAsync(sounds.allRise, {}, async (playbackStatus:any) => {
      if (playbackStatus.didJustFinish) {
        await sound.unloadAsync()
        if (votedPlayerIndex === gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')?.playerIndex) {
          await speakThenPause(dayTimeSpeech(votedPlayer).winnerDeclaration2, 0, () => {
            gameContext.winnerSide = 'Ultimate Despair'
            navigate('WinnerDeclarationScreen')
          })
        } else if (gameContext.killsLeft === 0 && requiredKills(gameContext.playerCount) > 1) {
          await trialResult()
        } else {
          speech = dayTimeSpeech(votedPlayer).execution1
          await speakThenPause(speech, 1, () => setVideoVisible(true))
        }
      }
    })
    await sound.setVolumeAsync(gameContext.musicVolume)
    await sound.playAsync()
  }

  async function trialResult() {    
    if (votedPlayerIndex === gameContext.playersInfo.find((value) => value.role === 'Blackened')?.playerIndex) {
      await speakThenPause(dayTimeSpeech(votedPlayer).winnerDeclaration1, 0, () => {
        gameContext.winnerSide = 'Hope'
        navigate('WinnerDeclarationScreen')
      })
    } else if (gameContext.killsLeft === 0) {
      await speakThenPause(dayTimeSpeech(votedPlayer).winnerDeclaration3, 0, () => {
        gameContext.winnerSide = 'Despair'
        navigate('WinnerDeclarationScreen')
      })
    } else {
      if (gameContext.playersInfo[votedPlayerIndex].role === 'Alter Ego') {
        gameContext.alterEgoAlive = false
        speech = dayTimeSpeech(votedPlayer).revealRole1
        await speakThenPause(speech, 1, async () => {
          speech = dayTimeSpeech('', gameContext.killsLeft).killsLeft
          await speakThenPause(speech, 1, abilitiesOrItemsAfterTrial)
        })
      } else if (gameContext.playersInfo[votedPlayerIndex].role === 'Future Foundation') {
        speech = dayTimeSpeech(votedPlayer).revealRole2
        await speakThenPause(speech, 1, async () => {
          onContinue = async () => {
            speech = dayTimeSpeech('', gameContext.killsLeft).killsLeft
            await speakThenPause(speech, 1, abilitiesOrItemsAfterTrial)
          }
          enableContinueButton()
        })
      } else {
        speech = dayTimeSpeech(votedPlayer).revealRole3
        await speakThenPause(speech, 1, async () => {
          speech = dayTimeSpeech('', gameContext.killsLeft).killsLeft
          await speakThenPause(speech, 1, abilitiesOrItemsAfterTrial)
        })
      }
    }
  }

  async function abilitiesOrItemsAfterTrial() {
    if (gameContext.mode !== 'normal') {
      onContinue = async () => await nightTime()
      speech = dayTimeSpeech().abilityOrItemAfterTrial
      await speakThenPause(speech, 0, enableContinueButton)
    } else {
      await nightTime()
    }
  }

  async function nightTime() {
    setTime('NightTimeScreen')
  }

  function enableContinueButton() {
    setContinueButtonColor(colors.blackTransparent)
    setContinueButtonTextColor(colors.white)
    setContinueButtonDisabled(false)
  }

  function disableContinueButton() {
    setContinueButtonColor(colors.greyTransparent)
    setContinueButtonTextColor(colors.darkGrey)
    setContinueButtonDisabled(true)
  }

  async function speakThenPause(speech:string, seconds:number=0, onDone?:() => void) {
    setSpeakerColor(colors.greyTransparent)
    if (gameContext.backgroundMusic && isMusicPlaying) { await gameContext.backgroundMusic.setVolumeAsync(gameContext.musicVolume / 5) }
    const callback = async(seconds:number) => {
      if (gameContext.backgroundMusic && isMusicPlaying) { await gameContext.backgroundMusic.setVolumeAsync(gameContext.musicVolume) }
      await sleep(seconds * 1000)
      setSpeakerColor(colors.white)
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
    const { sound } = await Audio.Sound.createAsync(music[randomNum], {}, updateMusicStatus)
    gameContext.backgroundMusic = sound
    await gameContext.backgroundMusic.setVolumeAsync(gameContext.musicVolume)
    await gameContext.backgroundMusic.playAsync()
    await gameContext.backgroundMusic.setIsLoopingAsync(true)
  }
}

type Props = {setTime:React.Dispatch<any>}