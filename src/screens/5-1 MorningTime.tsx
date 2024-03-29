import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import React, { useContext, useEffect, useState } from 'react'
import { Image, View, Text, TouchableHighlight } from 'react-native'
import { GameContext } from '../../AppContext'
import PlayersPage from '../components/PlayersPage'
import { goodMorningSpeech, morningTimeSpeech } from '../data/Speeches'
import { roleInPlay } from '../data/Table'
import { colors } from '../styles/colors'
import { disablePlayerButton } from '../styles/playerButtonStyles'
import { appStyle } from '../styles/styles'
import { PlayerInfo } from '../types/types'
import { Audio } from 'expo-av'
import { sounds } from '../assets/sounds/sounds'
import { images } from '../assets/images/images'

let speech = ''
let victim:PlayerInfo
let didMonomiProtect = false
let onSpeechDone = () => {}
let onContinue = () => {}
let onYes = () => {}
let onNo = () => {}
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function MorningTimeScreen({setScreen}:Props) {
  const { navigate } = useNavigation<any>()
  const gameContext = useContext(GameContext)
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const [continueButtonColor, setContinueButtonColor] = useState(colors.greyTransparent)
  const [continueButtonTextColor, setContinueButtonTextColor] = useState(colors.darkGrey)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true)
  const [speakerColor, setSpeakerColor] = useState(colors.white)
  const [state, setState] = useState([])

  const isFocused = useIsFocused()
  useEffect(() => { if (isFocused) {
    gameContext.playersInfo.forEach(playerInfo => {disablePlayerButton(playerInfo)})
    setup()
  }}, [isFocused])

  return (
    <View style={{ flex: 1 }}>
      <PlayersPage visible={true} middleSection={PlayersPageMiddleSection()} onPlayerClick={() => {}}/>
    </View>
  )

  function PlayersPageMiddleSection() {
    if (confirmationVisible) {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{flex: 2}}/>
            <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
              {MorningTimeLabel()}
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
              <View style={{...appStyle.frame, height: '62.5%', minWidth: '25%'}}>
                <TouchableHighlight style={{flex: 1,  borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  onPress={() => {
                    setConfirmationVisible(false)
                    onNo()
                  }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>No</Text>
                </TouchableHighlight>
              </View>
              <View style={{...appStyle.frame, height: '62.5%', minWidth: '25%'}}>
                <TouchableHighlight style={{flex: 1,  borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  onPress={async () => {
                    setConfirmationVisible(false)
                    onYes()
                  }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>Yes</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={{flex: 2}}/>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{flex: 2}}/>
            <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
              {MorningTimeLabel()}
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
              <View style={{...appStyle.frame, height: '62.5%', minWidth: '25%', backgroundColor: continueButtonColor}}>
                <TouchableHighlight style={{flex: 1,  borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
                  disabled={continueButtonDisabled} underlayColor={continueButtonColor} onPress={() => { onContinue() }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10, color: continueButtonTextColor}}>Continue</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={{flex: 2}}/>
          </View>
        </View>
      )
    }
  }

  function MorningTimeLabel() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View style={{...appStyle.frame, height: '62.5%', minWidth: '30%', justifyContent: 'center', backgroundColor: colors.greyTransparent}}>
          <Text style={{...appStyle.text, fontSize: 20, textAlign: 'center', margin: '2.5%'}}>
            Morning of Day {gameContext.dayNumber}
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

  async function setup() {
    gameContext.easterEggIndex = -1
    await morningSpeech()
  }

  async function morningSpeech() {
    gameContext.vicePlayed = false
    onSpeechDone = async () => await remnantsOfDespairFound()
    speech = goodMorningSpeech(gameContext.dayNumber)
    await speakThenPause(speech, 0, onSpeechDone)
  }

  async function remnantsOfDespairFound() {
    if (gameContext.remnantsOfDespairFound === true) {
      gameContext.remnantsOfDespairFound = false
      const remnant = gameContext.playersInfo.find((playerInfo) => playerInfo.role === 'Remnants of Despair')!
      speech = morningTimeSpeech(remnant.name).remnantFound
      onSpeechDone = async () => {
        if (gameContext.blackenedAttack !== -1) {
          await announceAttack()
        } else {
          await dayTime()
        }
      }
      await speakThenPause(speech, 0, onSpeechDone)
    } else {
      if (gameContext.blackenedAttack !== -1) {
        await announceAttack()
      } else {
        await dayTime()
      }
    }
  }

  async function announceAttack() {
    victim = gameContext.playersInfo[gameContext.blackenedAttack]
    gameContext.playersInfo.forEach(playerInfo => {
      if (playerInfo === victim) {
        victim.playerButtonStyle.textColor = colors.white
        victim.playerButtonStyle.backgroundColor = colors.pinkTransparent
        playerInfo.playerButtonStyle.borderColor = colors.white
        playerInfo.playerButtonStyle.disabled = true
      } else {
        disablePlayerButton(playerInfo)
      }
    })
    setState([]) // re-render screen
    onSpeechDone = async () => await monomi()
    speech = gameContext.dayNumber === 1 ? morningTimeSpeech(victim.name).announceAttack1 : morningTimeSpeech(victim.name).announceAttack2
    await speakThenPause(speech, 0, onSpeechDone)
  }

  async function monomi() {
    if (roleInPlay(gameContext.roleCountAll, 'Monomi') && gameContext.dayNumber > 1 && gameContext.monomiExploded === false  && gameContext.blackenedAttack !== -1) {
      speech = morningTimeSpeech().monomi1
      await speakThenPause(speech, 0, async () => {
        if (gameContext.blackenedAttack === gameContext.monomiProtect) {
          gameContext.monomiProtect = -1
          didMonomiProtect = true
          const monomi = gameContext.playersInfo.find((value) => value.role === 'Monomi')!.playerIndex
          gameContext.monomiExploded = true
          gameContext.blackenedAttack = monomi
          gameContext.playersInfo[monomi].alive = false
          gameContext.killsLeft -= 1
          speech = morningTimeSpeech(victim.name, gameContext.playersInfo[monomi].name).monomi2
          await speakThenPause(speech, 0, async () => {
            speech = morningTimeSpeech().monomi3
            await speakThenPause(speech, 0, async () => { await abilitiesOrItems() })
          })
        } else {
          gameContext.monomiProtect = -1  
          speech = gameContext.dayNumber === 2 ? morningTimeSpeech().monomi4 : morningTimeSpeech().monomi5
          onSpeechDone = async () => await nekomaruNidaiManiax()
          await speakThenPause(speech, 0, onSpeechDone)
        }
      })
    } else {
      await nekomaruNidaiManiax()
    }
  }

  async function nekomaruNidaiManiax() {
    if (gameContext.nekomaruNidaiEscort != -1) {
      const playerName = gameContext.playersInfo[gameContext.nekomaruNidaiIndex].name
      await speakThenPause(morningTimeSpeech(playerName).nekomaruNidaiManiax1, 0, async () => {
        if (gameContext.nekomaruNidaiEscort === gameContext.blackenedAttack) {
          speech = morningTimeSpeech(playerName).nekomaruNidaiManiax2
          gameContext.blackenedAttack = -2
        } else {
          speech = morningTimeSpeech(playerName).nekomaruNidaiManiax3
        }
        await speakThenPause(speech, 0, async () => {
          await victimActions1()
        })
      })      
    } else {
      await victimActions1()
    }
  }

  async function victimActions1() {
    if (gameContext.blackenedAttack >= 0 && gameContext.dayNumber === 1 && gameContext.mode !== 'normal') {
      victim = gameContext.playersInfo[gameContext.blackenedAttack]
      onContinue = async () => await dayTime()
      speech = morningTimeSpeech(victim.name).victim1
      await speakThenPause(speech, 0, enableContinueButton)
    } else if (gameContext.blackenedAttack >= 0 && gameContext.dayNumber > 1 && gameContext.mode !== 'normal') {
      victim = gameContext.playersInfo[gameContext.blackenedAttack]
      speech = morningTimeSpeech(victim.name).victim2
      await speakThenPause(speech, 0, () => {
        onYes = async () => {
          onNo = async () => {      
            gameContext.blackenedAttack = -2
            await dayTime()
          }
          await amuletOfTakejin()
        }
        onNo = async () => await playersAbilities()
        setConfirmationVisible(true)
      })          
    } else if (gameContext.blackenedAttack >= 0 && gameContext.dayNumber > 1 && gameContext.mode === 'normal') {
      await bodyDiscovery()
    } else {
      await dayTime()
    }
  }

  async function amuletOfTakejin() {
    onYes = async () => {
      do {
        gameContext.blackenedAttack -= 1
        if (gameContext.blackenedAttack === -1) {
          gameContext.blackenedAttack = gameContext.playerCount - 1
        }       
      } while (!gameContext.playersInfo[gameContext.blackenedAttack].alive)
      gameContext.playersInfo.forEach(playerInfo => {
        if (playerInfo.playerIndex === gameContext.blackenedAttack) {
          playerInfo.playerButtonStyle.textColor = colors.white
          playerInfo.playerButtonStyle.backgroundColor = colors.pinkTransparent
        } else {
          playerInfo.playerButtonStyle.textColor = colors.darkGrey
          playerInfo.playerButtonStyle.backgroundColor = colors.greyTransparent
        }
      })
      await announceAttack()
    }
    speech = morningTimeSpeech(victim.name).amuletOfTakejin
    await speakThenPause(speech, 0, () => setConfirmationVisible(true))
  }

  async function playersAbilities() {
    onYes = async () => {
      gameContext.blackenedAttack = -2
      await dayTime()
    }
    onNo = async () => await giveItems()
    speech = morningTimeSpeech(victim.name).playersAbilities
    await speakThenPause(speech, 0, () => setConfirmationVisible(true))
  }

  async function giveItems() {
    onYes = async () => await victimActions2()
    onNo = async () => await bodyDiscovery()
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
    const leftPlayer = gameContext.playersInfo[indexLeft].name
    const rightPlayer = gameContext.playersInfo[indexRight].name
    speech = morningTimeSpeech(victim.name, leftPlayer, rightPlayer).giveItems
    await speakThenPause(speech, 0, () => setConfirmationVisible(true))
  }

  async function victimActions2() {
    onYes = async () => {
      onNo = async () => {
        gameContext.blackenedAttack = -2
        await dayTime()
      }
      await amuletOfTakejin()
    }
    onNo = async () => {await bodyDiscovery() }
    speech = morningTimeSpeech(victim.name).victim3
    await speakThenPause(speech, 0, () => setConfirmationVisible(true))
  }

  async function bodyDiscovery() {
    gameContext.playersInfo[gameContext.blackenedAttack].alive = false
    if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Zakemono') { 
      gameContext.zakemonoDead = true
    }
    gameContext.killsLeft -= 1
    const { sound } = await Audio.Sound.createAsync(sounds.despairPollution, {}, async (playbackStatus:any) => {
      if (playbackStatus.didJustFinish) {
        setState([]) // re-render screen
        await sound.unloadAsync()
      }
    })
    await sound.setVolumeAsync(gameContext.musicVolume)
    await sound.playAsync()
    await sleep(1000)
    if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Alter Ego') {
      gameContext.alterEgoAlive = false
      speech = morningTimeSpeech(victim.name).bodyDiscovery2
      await speakThenPause(speech, 0, async () => { await abilitiesOrItems() })
    } else if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Blackened') {
      speech = morningTimeSpeech(victim.name).bodyDiscovery3
      await speakThenPause(speech, 0, () => {
        gameContext.winnerSide = 'Hope'
        navigate('WinnerDeclarationScreen')
      })
    } else if (gameContext.playersInfo[gameContext.blackenedAttack].role === 'Future Foundation') {
      speech = morningTimeSpeech(victim.name).bodyDiscovery1
      await speakThenPause(speech, 0, async () => {
        speech = morningTimeSpeech(victim.name).bodyDiscovery4
        await speakThenPause(speech, 0, async () => { 
          onContinue = async () => {
            await abilitiesOrItems()
          }
          enableContinueButton()
        })
      })
    } else {
      speech = morningTimeSpeech(victim.name).bodyDiscovery1
      await speakThenPause(speech, 0, async () => { await abilitiesOrItems() })
    }
  }

  async function abilitiesOrItems() {
    if ((gameContext.mode === 'extreme' && !didMonomiProtect) || gameContext.mode === 'maniax') {
      onContinue = async () => {
        disableContinueButton()
        await viceConfirmation()
      }
      speech = morningTimeSpeech().abilityOrItem
      await speakThenPause(speech, 0, enableContinueButton)
    } else {
      await dayTime()
    }
  }

  async function viceConfirmation() {
    if (gameContext.killsLeft !== 0 && !didMonomiProtect) {
      onYes = async () => {
        gameContext.vicePlayed = true
        await dayTime()
      }
      onNo = async () => await dayTime()
      speech = morningTimeSpeech().vice
      await speakThenPause(speech, 0, () => setConfirmationVisible(true))
    } else {
      await dayTime()
    }
  }

  async function dayTime() {
    setScreen('DayTimeScreen')
  }
  
  function enableContinueButton() {
    setContinueButtonColor(colors.blackTransparent)
    setContinueButtonTextColor(colors.white)
    setContinueButtonDisabled(false)
  }

  async function speakThenPause(speech:string, seconds:number=0, onDone?:() => void) {
    setSpeakerColor(colors.greyTransparent)
    const callback = async(seconds:number) => {
      await sleep(seconds * 1000)
      setSpeakerColor(colors.white)
      if (onDone) { onDone() }
    }
    Speech.speak(speech, {onDone: () => { callback(seconds) }})
  }

  function disableContinueButton() {
    setContinueButtonColor(colors.greyTransparent)
    setContinueButtonTextColor(colors.darkGrey)
    setContinueButtonDisabled(true)
  }
}

type Props = {setScreen:React.Dispatch<any>}