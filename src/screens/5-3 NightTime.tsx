import { useIsFocused } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { Image, Text, TouchableHighlight, View } from 'react-native'
import { roleInPlay } from '../data/Table'
import { nightTimeSpeech } from "../data/Speeches"
import * as Speech from 'expo-speech'
import NightTimeAbilitiesItemsModal from '../components/modals/NightTimeAbilitiesItem'
import RevealRoleModal from '../components/modals/RevealRole'
import { GameContext } from '../../AppContext'
import PlayersPage from '../components/PlayersPage'
import { colors } from '../styles/colors'
import { appStyle } from '../styles/styles'
import CountdownTimer from '../components/CountdownTimer'
import { Audio } from 'expo-av'
import { enablePlayerButton, disablePlayerButton } from '../styles/playerButtonStyles'
import { monomiMusic, nighttimeMusic } from '../assets/music/music'
import { images } from '../assets/images/images'

const NIGHTTIME_VOLUME_ADJUST = 3
let abilityOrItem = ''
let timerDuration = 0
let currentPlayerIndex = 0
let previousPlayerIndex = -1
let onTimerDone = () => {}
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))
let onPlayerClick = (playerIndex:number) => {}
let onContinue = () => {}
let onRevealRoleModalOk = () => {}
let intervalId:NodeJS.Timer

export default function NightTimeScreen({setScreen}:Props) {
  const gameContext = useContext(GameContext)
  const [nightTimeAbilitiesItemsModallVisible, setNightTimeAbilitiesItemsModallVisible] = useState(false)
  const [revealRoleModalVisible, setRevealRoleModalVisible] = useState(false)
  const [timerVisible, setTimerVisible] = useState(false)
  const [nightTimeLabelVisible, setNightTimeLabelVisible] = useState(false)
  const [continueButtonText, setContinueButtonText] = useState('')
  const [continueButtonColor, setContinueButtonColor] = useState(colors.blackTransparent)
  const [continueButtonTextColor, setContinueButtonTextColor] = useState(colors.blackTransparent)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true)
  const [speakerColor, setSpeakerColor] = useState(colors.white)
  const [state, setState] = useState([])
  const updateMusicStatus = playbackStatus => { gameContext.isMusicPlaying = playbackStatus.isPlaying }

  const isFocused = useIsFocused()
  useEffect(() => { if (isFocused) {
    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
    setState([]) // re-render screen
    setup()
  }}, [isFocused])

  return (
    <View style={{flex: 1}}>
      <PlayersPage visible={true} middleSection={PlayersPageMiddleSection()} onPlayerClick={(playerIndex) => {
          currentPlayerIndex = playerIndex
          onPlayerClick(playerIndex)
        }}/>
      <NightTimeAbilitiesItemsModal visible={nightTimeAbilitiesItemsModallVisible} setVisible={setNightTimeAbilitiesItemsModallVisible} playerIndex={currentPlayerIndex}/>
      <RevealRoleModal visible={revealRoleModalVisible} setVisible={setRevealRoleModalVisible} playerIndex={currentPlayerIndex} abilityOrItem={abilityOrItem}
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
    } else if (nightTimeLabelVisible) {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{flex: 2}}/>
            <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
              {NightTimeLabel()}
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
              <View style={{...appStyle.frame, height: '62.5%', minWidth: '25%', backgroundColor: continueButtonColor}}>
                <TouchableHighlight style={{flex: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  disabled={continueButtonDisabled} underlayColor={continueButtonColor} onPress={() => {
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
            <View style={{flex: 2}}/>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
          <View style={{...appStyle.frame, height: '25%', minWidth: '25%', backgroundColor: continueButtonColor}}>
            <TouchableHighlight style={{flex: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
              disabled={continueButtonDisabled} underlayColor={continueButtonColor} onPress={() => {
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
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View style={{...appStyle.frame, height: '62.5%', justifyContent: 'center', backgroundColor: colors.blueTransparent}}>
          <Text numberOfLines={1} style={{...appStyle.text, fontSize: 20, textAlign: 'center', margin: '2.5%'}}>
            Nighttime of Day {gameContext.dayNumber}
          </Text>
        </View>
        <TouchableHighlight style={{height: 30, width: 30, position:'absolute', left: 240}}
          onPress={async() => {
            if (await Speech.isSpeakingAsync() === false) {
              const speech = gameContext.dayNumber === 1 ? nightTimeSpeech().schoolAnnouncement3 : nightTimeSpeech().schoolAnnouncement4
              speakThenPause(speech)            
            }
          }}>
          <Image style={{height: 30, width: 30, tintColor: speakerColor}} source={images.replay}/>
        </TouchableHighlight>
      </View>
    )
  }

  async function setup() {
    gameContext.blackenedAttack = -1
    const remnantsOfDespair = gameContext.playersInfo.find((playerInfo) => playerInfo.role === 'Remnants of Despair')
    const blackend = gameContext.playersInfo.find((playerInfo) => playerInfo.role === 'Blackened')
    blackend!.side = remnantsOfDespair && remnantsOfDespair.alive ? 'Hope' : 'Despair'
    await schoolAnnouncement()
  }

  async function schoolAnnouncement() {
    setNightTimeLabelVisible(true)
    disableContinueButton()
    onPlayerClick = () => {}
    onContinue = () => {}
    setContinueButtonText('Continue')
    if (gameContext.dayNumber === 0) {
      setNightTimeLabelVisible(false)
      await playMusic()
      await traitors()
    } else if (gameContext.mode !== 'normal' && gameContext.dayNumber > 0) {
      onPlayerClick = () => { setNightTimeAbilitiesItemsModallVisible(true) }
      onContinue = async () => {
        gameContext.nekomaruNidaiEscort = -1
        gameContext.nekomaruNidaiIndex = -1
        setNightTimeLabelVisible(false)
        await playMusic()
        await speakThenPause(nightTimeSpeech().schoolAnnouncement5, 3, async () => {
          await speakThenPause(nightTimeSpeech().schoolAnnouncement7, 3, async () => { await abilitiesOrItems() })
        })
      }
      await speakThenPause(nightTimeSpeech().schoolAnnouncement2, 0, async () => {
        const speech = gameContext.dayNumber === 1 ? nightTimeSpeech().schoolAnnouncement3 : nightTimeSpeech().schoolAnnouncement4
        await speakThenPause(speech, 0, () => {
          gameContext.playersInfo.forEach(playerInfo => {
            if (playerInfo.playerIndex == gameContext.nekomaruNidaiIndex) {
              disablePlayerButton(playerInfo)
            } else {
              enablePlayerButton(playerInfo)
            }
          })
          setContinueButtonColor(colors.blackTransparent)
          setContinueButtonTextColor(colors.white)
          setContinueButtonDisabled(false)
        })
      })
    } else {
      setNightTimeLabelVisible(false)
      await playMusic()
      await speakThenPause(nightTimeSpeech().schoolAnnouncement6, 3, async () => {
        await speakThenPause(nightTimeSpeech().schoolAnnouncement7, 3, async () => {
          await alterEgo()
        })
      })
    }
  }

  async function abilitiesOrItems() {
    for (let i = 0; i < gameContext.playerCount; i++) {
      if (gameContext.playersInfo[i].useAbility || gameContext.playersInfo[i].useItem) {
       await abilitiesOrItemsSpeech(i)
       break
      } else if (i === (gameContext.playerCount - 1)) {
        await monomi()
      }
    }
  }

  async function abilitiesOrItemsSpeech(playerIndex:number) { 
    onPlayerClick = (playerIndex) => {
      gameContext.playersInfo.forEach(playerInfo => {
        if (playerInfo.playerIndex === playerIndex) {
          playerInfo.playerButtonStyle.backgroundColor = colors.pinkTransparent
        } else if (playerInfo.playerButtonStyle.disabled === false)
          playerInfo.playerButtonStyle.backgroundColor = colors.blackTransparent
      })
      if (abilityOrItem === "Nekomaru Nidai (Maniax)") {
        gameContext.nekomaruNidaiEscort = playerIndex
      }
      setContinueButtonColor(colors.pinkTransparent)
      setContinueButtonTextColor(colors.white)
      setContinueButtonDisabled(false)
      setState([]) // re-render screen
    }
    setContinueButtonText('Investigate')
    onContinue = async () => { setRevealRoleModalVisible(true) }
    onRevealRoleModalOk = async () => {
      clearInterval(intervalId)
      if (gameContext.playersInfo[playerIndex].useAbility === '' && gameContext.playersInfo[playerIndex].useItem === '') {
        await speakThenPause(gameContext.playersInfo[playerIndex].name + ', go to sleep.', 2, abilitiesOrItems)
      } else {
        await abilitiesOrItems()
      }
    }
    let speech1 = ''
    if (playerIndex === previousPlayerIndex) {
      speech1 =  gameContext.playersInfo[playerIndex].name
    } else {
      speech1 = gameContext.playersInfo[playerIndex].name + ', wake up.'
    }
    let speech2 = ''
    if (gameContext.playersInfo[playerIndex].useAbility === "Kyoko Kirigiri") {
      abilityOrItem = "Kyoko Kirigiri"
      gameContext.playersInfo[playerIndex].useAbility = ''
      speech2 = nightTimeSpeech().kyokoKirigiri
    } else if (gameContext.playersInfo[playerIndex].useAbility === "Kyoko Kirigiri (Maniax)") {
      abilityOrItem = "Kyoko Kirigiri (Maniax)"
      gameContext.playersInfo[playerIndex].useAbility = ''
      speech2 = nightTimeSpeech().kyokoKirigiriManiax
    } else if (gameContext.playersInfo[playerIndex].useAbility === "Nekomaru Nidai (Maniax)") {
      setContinueButtonText('Select')
      onContinue = onRevealRoleModalOk
      abilityOrItem = "Nekomaru Nidai (Maniax)"
      gameContext.playersInfo[playerIndex].useAbility = ''
      gameContext.nekomaruNidaiIndex = playerIndex
      speech2 = nightTimeSpeech().nekomaruNidaiManiax
    } else if (gameContext.playersInfo[playerIndex].useAbility === "Yasuhiro Hagakure") {
      abilityOrItem = "Yasuhiro Hagakure"
      gameContext.playersInfo[playerIndex].useAbility = ''
      speech2 = gameContext.playerCount < 7 ? nightTimeSpeech().yasuhiroHagakure1 : nightTimeSpeech().yasuhiroHagakure2
    } else if (gameContext.playersInfo[playerIndex].useItem === 'Glasses') {
      abilityOrItem = 'Glasses'
      gameContext.playersInfo[playerIndex].useItem = ''
      speech2 = nightTimeSpeech().glasses
    } else if (gameContext.playersInfo[playerIndex].useItem === "Someone's Graduation Album") {
      abilityOrItem = "Someone's Graduation Album"
      gameContext.playersInfo[playerIndex].useItem = ''
      speech2 = nightTimeSpeech().someonesGraduationAlbum
    } else if (gameContext.playersInfo[playerIndex].useItem === 'Silent Receiver') {
      abilityOrItem = 'Silent Receiver'
      gameContext.playersInfo[playerIndex].useItem = ''
      speech2 = nightTimeSpeech().silentReceiver
    } else if (gameContext.playersInfo[playerIndex].useItem === "Emperor's Thong") {
      abilityOrItem = "Emperor's Thong"
      gameContext.playersInfo[playerIndex].useItem = ''
      speech2 = nightTimeSpeech().emperorsThong
    } else if (gameContext.playersInfo[playerIndex].useItem === 'Secrets of Omoplata') {
      abilityOrItem = 'Secrets of Omoplata'
      gameContext.playersInfo[playerIndex].useItem = ''
      speech2 = nightTimeSpeech().secretsOfOmoplata
    }    
    await speakThenPause(speech1, 1, async () => {
      await speakThenPause(speech2, 0, () => {
        gameContext.playersInfo.forEach(playerInfo => {
          if (playerInfo.playerIndex === playerIndex || abilityOrItem === 'Secrets of Omoplata') {
            disablePlayerButton(playerInfo)
          } else {
            enablePlayerButton(playerInfo)
          }
          if (abilityOrItem === 'Secrets of Omoplata') {
            setContinueButtonColor(colors.pinkTransparent)
            setContinueButtonTextColor(colors.white)
            setContinueButtonDisabled(false)           
          }
          setState([]) // re-render screen
        })
        intervalId = setInterval(async () => await speakThenPause(gameContext.playersInfo[playerIndex].name + ", " + speech2), 15000)
      })
    })
    previousPlayerIndex = playerIndex
  }

  async function traitors() {
    if (roleInPlay(gameContext.roleCountAll, 'Traitor') && gameContext.dayNumber === 0) {
      const traitorInPlay = gameContext.playersInfo.find((playerInfo) => playerInfo.role === 'Traitor')
      setContinueButtonText('Continue')
      await speakThenPause(nightTimeSpeech().traitors1, 1, async () => {
        gameContext.playersInfo.forEach(playerInfo => {
          if (playerInfo.role === 'Traitor') {
            playerInfo.playerButtonStyle.textColor = colors.white
            playerInfo.playerButtonStyle.backgroundColor = colors.greyTransparent
          } else if (traitorInPlay && playerInfo.role === 'Blackened') { 
            playerInfo.playerButtonStyle.textColor = colors.white
            playerInfo.playerButtonStyle.backgroundColor = colors.pinkTransparent 
          } else {
            playerInfo.playerButtonStyle.backgroundColor = colors.greyTransparent
            playerInfo.playerButtonStyle.borderColor = colors.greyTransparent
            playerInfo.playerButtonStyle.textColor = colors.greyTransparent
          }
        })
        await speakThenPause(nightTimeSpeech().traitors2, 0, async () => {
          timerDuration = 10
          onTimerDone = async () => await traitorsSleep()
          setTimerVisible(true)
        })
      })
    } else {
      await blackened()
    }      
  }

  async function traitorsSleep() {
    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
    setTimerVisible(false)
    await speakThenPause(nightTimeSpeech().traitors3, 2, blackened)
  }

  async function monomi() {
    if (roleInPlay(gameContext.roleCountAll, 'Monomi') && gameContext.dayNumber > 0 && !gameContext.monomiExploded && !gameContext.vicePlayed) {
      await gameContext.backgroundMusic.unloadAsync()
      gameContext.backgroundMusic = ''
      await playMusic(true)
      abilityOrItem = 'Protect'
      setContinueButtonText('Continue')
      onPlayerClick = (playerIndex) => {
        gameContext.playersInfo.forEach(playerInfo => {
          playerInfo.playerButtonStyle.backgroundColor = colors.blackTransparent 
          playerInfo.playerButtonStyle.underlayColor = colors.blackTransparent 
        })
        if (playerIndex !== gameContext.monomiProtect) {
          gameContext.playersInfo[playerIndex].playerButtonStyle.backgroundColor = colors.pinkTransparent
          gameContext.playersInfo[playerIndex].playerButtonStyle.underlayColor = colors.blackTransparent
          gameContext.monomiProtect = playerIndex
        } else {
          gameContext.monomiProtect = -1
        }    
        setState([]) // re-render screen
      }
      await speakThenPause(nightTimeSpeech().monomi1, 1, async () => {
        await speakThenPause(nightTimeSpeech().monomi2, 0, () => {
          const monomiIndex = gameContext.playersInfo.find((value) => value.role === 'Monomi')?.playerIndex
          if (monomiIndex && gameContext.playersInfo[monomiIndex].alive === true) {
            gameContext.playersInfo.forEach(playerInfo => {enablePlayerButton(playerInfo) })
          } else {
            gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo) })
          }
          timerDuration = 15
          onTimerDone = async () => await monomiSleep()
          setTimerVisible(true)
        })
      })
    } else {
      await alterEgo()
    }
  }

  async function monomiSleep() {
    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
    setTimerVisible(false)
    await speakThenPause(nightTimeSpeech().monomi3, 1, async () => {
      await gameContext.backgroundMusic.unloadAsync()
      gameContext.backgroundMusic = ''
      await playMusic()
      await alterEgo()
    })
  }

  async function alterEgo() {
    if (gameContext.easterEggIndex !== -1) {
      await speakThenPause(nightTimeSpeech(0, gameContext.playersInfo[gameContext.easterEggIndex].name).alterEgo4, 1, blackened)
    } else if (gameContext.dayNumber > 0 && gameContext.alterEgoAlive) {
      abilityOrItem = 'Alter Ego'
      onPlayerClick = (playerIndex) => {
        gameContext.playersInfo.forEach(playerInfo => {
          if (playerInfo.playerIndex === playerIndex) {  
            playerInfo.playerButtonStyle.backgroundColor = colors.pinkTransparent
            playerInfo.playerButtonStyle.underlayColor = colors.pinkTransparent
          } 
          else if (playerInfo.role !== 'Alter Ego') { 
            playerInfo.playerButtonStyle.backgroundColor = colors.blackTransparent
            playerInfo.playerButtonStyle.underlayColor = colors.blackTransparent
          }
        })
        setContinueButtonColor(colors.pinkTransparent)
        setContinueButtonTextColor(colors.white)
        setContinueButtonDisabled(false)
        setState([]) // re-render screen
      }
      onContinue = async () => {
        if (gameContext.playersInfo[currentPlayerIndex].role === 'Remnants of Despair') {
          gameContext.remnantsOfDespairFound = true
          gameContext.playersInfo[currentPlayerIndex].alive = false
        }
        onRevealRoleModalOk = async () => {
          clearInterval(intervalId)
          await speakThenPause(nightTimeSpeech().alterEgo3, 2, blackened)
        }
        setRevealRoleModalVisible(true)
      }
      await speakThenPause(nightTimeSpeech().alterEgo1, 1, async () => {
        await speakThenPause(nightTimeSpeech().alterEgo2, 0, () => {
          gameContext.playersInfo.forEach(playerInfo => {
            if (playerInfo.role === 'Alter Ego') { disablePlayerButton(playerInfo) }
            else { enablePlayerButton(playerInfo) }
          })
          setContinueButtonText('Investigate')
          intervalId = setInterval(async () => await speakThenPause("Alter ego, " + nightTimeSpeech().alterEgo2), 15000)
          setState([]) // re-render screen if setContinueButtonText() doesn't
        })
      })
    } else {
      await blackened()
    }
  }

  async function blackened() {
    if (!gameContext.vicePlayed) {
      abilityOrItem = 'Attack'
      if (gameContext.dayNumber === 0) {
        setContinueButtonText('Select')
      } else {
        setContinueButtonText('Attack')
      }
      onPlayerClick = (playerIndex) => {
        gameContext.playersInfo.forEach(playerInfo => { 
          playerInfo.playerButtonStyle.backgroundColor = colors.blackTransparent
          playerInfo.playerButtonStyle.underlayColor = colors.blackTransparent
        })
        gameContext.playersInfo[playerIndex].playerButtonStyle.backgroundColor = colors.pinkTransparent
        gameContext.playersInfo[playerIndex].playerButtonStyle.underlayColor = colors.pinkTransparent
        gameContext.blackenedAttack = playerIndex
        setContinueButtonColor(colors.pinkTransparent)
        setContinueButtonTextColor(colors.white)
        setContinueButtonDisabled(false)
        setState([]) // re-render screen
      }
      onContinue = async () => {
        clearInterval(intervalId)
        const speech = gameContext.dayNumber === 0 ? nightTimeSpeech().blackened6 : nightTimeSpeech().blackened7
        await speakThenPause(speech, 2, morningTime)
      }
      if (gameContext.dayNumber === 0 && gameContext.mode !== 'normal') {
        await speakThenPause(nightTimeSpeech().blackened1, 2, async () => {
          await speakThenPause(nightTimeSpeech(gameContext.killsLeft).blackened2, 2, async () => {
            await speakThenPause(nightTimeSpeech().blackened3, 0, () => {
              gameContext.playersInfo.forEach(playerInfo => { enablePlayerButton(playerInfo) })
              intervalId = setInterval(async () => await speakThenPause("Blackened, " + nightTimeSpeech().blackened3), 15000)
              setState([]) // re-render screen
            })
          })
        })
      } else if (gameContext.dayNumber === 0 && gameContext.mode === 'normal') {
        await speakThenPause(nightTimeSpeech().blackened1, 2, async () => {
          await speakThenPause(nightTimeSpeech(gameContext.killsLeft).blackened2, 2, async () => {
            await speakThenPause(nightTimeSpeech(gameContext.killsLeft).blackened6, 2, async () => {
              await morningTime()
            })
          })
        })
      } else if (gameContext.dayNumber > 0) {
        await speakThenPause(nightTimeSpeech().blackened1, 1, async () => {
          await speakThenPause(nightTimeSpeech().blackened4, 0, () => {
            gameContext.playersInfo.forEach(playerInfo => { enablePlayerButton(playerInfo) })
            intervalId = setInterval(async () => await speakThenPause("Blackened, " + nightTimeSpeech().blackened4), 15000)
            setState([]) // re-render screen
          })
        })
      }
    } else {
      await speakThenPause(nightTimeSpeech().blackened5, 1, morningTime)
    }
  }

  async function morningTime() {
    await gameContext.backgroundMusic.unloadAsync()
    gameContext.backgroundMusic = ''
    gameContext.dayNumber += 1
    setScreen('MorningTimeScreen')
  }

  function disableContinueButton() {
    setContinueButtonColor(colors.greyTransparent)
    setContinueButtonTextColor(colors.darkGrey)
    setContinueButtonDisabled(true)
  }

  async function speakThenPause(speech:string, seconds:number=0, onDone?:() => void) {
    setSpeakerColor(colors.greyTransparent)
    if (gameContext.backgroundMusic && gameContext.isMusicPlaying) { await gameContext.backgroundMusic.setVolumeAsync(gameContext.musicVolume * NIGHTTIME_VOLUME_ADJUST / 5) }
    const callback = async(seconds:number) => {
      if (gameContext.backgroundMusic && gameContext.isMusicPlaying) {  await gameContext.backgroundMusic.setVolumeAsync(gameContext.musicVolume * NIGHTTIME_VOLUME_ADJUST) }
      await sleep(seconds * 1000)
      setSpeakerColor(colors.white)
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
    gameContext.backgroundMusic = sound
    await gameContext.backgroundMusic.setVolumeAsync(gameContext.musicVolume * NIGHTTIME_VOLUME_ADJUST)
    await gameContext.backgroundMusic.playAsync()
    await gameContext.backgroundMusic.setIsLoopingAsync(true)
  }
}

type Props = {setScreen:React.Dispatch<any>}