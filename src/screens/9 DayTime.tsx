import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
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

let votedPlayerIndex = -1
let discussionTime:number
let onContinue = () => {}
let onDiscussionDone = () => {}
let onPlayerVote = () => {}
let backgroundMusic:Audio.Sound
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function DayTimeScreen({setTime}:Props) {
  const { push } = useNavigation<any>()
  const gameContext = useContext(GameContext)
  const [timerVisible, setTimerVisible] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [playerVoteVisible, setPlayerVoteVisible] = useState(false)
  const [discussionOrVoteVisible, setDiscussionOrVoteVisible] = useState(false)
  const [continueButtonColor, setContinueButtonColor] = useState(greyTransparent)
  const [continueButtonTextColor, setContinueButtonTextColor] = useState(darkGrey)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true)
  const [labelClassTrial, setLabelToClassTrial] = useState(false)
  const [state, setState] = useState([])

  // Returns true if screen is focused
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
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
          <View style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
            {DayTimeLabel()}
          </View>
          <View style={{flex: 1}}/>
          <View style={{flex: 10, flexDirection: 'row'}}>
            <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
              <View style={{...appStyle.frame, height: '50%', minWidth: '75%', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableHighlight style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} 
                  onPress={async () => { setTimerKey(timerKey + 1) }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>Restart{"\n"}Timer</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <CountdownTimer timerKey={timerKey.toString()} duration={discussionTime} onDone={async () => {
                if (timerVisible) { 
                  await backgroundMusic.setVolumeAsync(.1)
                  Speech.speak("Time is up")
                }
              }}/>
            </View>
            <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
              <View style={{...appStyle.frame, height: '50%', minWidth: '75%', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableHighlight style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}} 
                  onPress={async () => {
                    await backgroundMusic.unloadAsync()
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
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
          {DayTimeLabel()}
          <View style={{...appStyle.frame, height: '25%', minWidth: '25%', backgroundColor: continueButtonColor}}>
            <TouchableHighlight style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}} 
              disabled={continueButtonDisabled} onPress={() => {
                disableContinueButton()
                onContinue() 
              }}>
              <Text style={{...appStyle.text, textAlign: 'center', margin: 10, color: continueButtonTextColor}}>Continue</Text>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
  }

  function DayTimeLabel() {
    const trialStages = [ 'discussion', 'abilitiesOrItemsTrial', 'trial', 'vote', 'execution', 'declareWinner']
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
    let speech = ''
    let onSpeechDone = () => {}
    discussionTime = 180
    if (gameContext.blackenedAttack >= 0 && gameContext.dayNumber > 1) {
      speech = 'It is day time. A body has been discovered! Now then, after a certain amount of time has passed, the class trial will begin!'
    } else {
      speech = 'Mm, ahem, it is now the day time.'
    }
    if (gameContext.mode === 'extreme') {
      onSpeechDone = async () => await abilitiesOrItems()
    } else {
      onSpeechDone = async () => await discussion()
    }
    await speakThenPause(speech, 1, onSpeechDone)
  }

  async function abilitiesOrItems() {
    await speakThenPause('Would anybody like to use an ability or item?', 0, () => {
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
    await speakThenPause('Discussion starts now.', 0, () => { setTimerVisible(true) })
  }

  async function abilitiesOrItemsTrial() {
    if (gameContext.mode === 'extreme' && gameContext.tieVote === false) {
      onContinue = async () => await trial()
      await speakThenPause('Would anybody like to use an ability or item before voting?', 0, enableContinueButton)
    } else {
      await trial()
    }
  }

  async function trial() {
    onContinue = async () => await vote()
    await speakThenPause('Up next is the voting segment where each player points to who they think is the Blackened.\
    Click Continue when everyone is ready to vote.', 0, enableContinueButton)
  }

  async function vote() {
    onPlayerVote = async () => await execution()
    await speakThenPause('Three. Two. One. Vote!', 0, () => { setPlayerVoteVisible(true) })
  }

  async function execution() {
    if (votedPlayerIndex === -1) { // Tie vote
      gameContext.tieVote = true
      setDiscussionOrVoteVisible(true)
    } else {
      gameContext.tieVote = false
      gameContext.playersInfo[votedPlayerIndex].alive = false
      const votedPlayer = gameContext.playersInfo[votedPlayerIndex].name
      if (gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')) {
        gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')!.side = 'Despair'
      }
      await speakThenPause(votedPlayer + ' has received the most votes and has been executed.', 1, declareWinner)
    }
  }

  async function declareWinner() {
    if (votedPlayerIndex === gameContext.playersInfo.find((value) => value.role === 'Blackened')?.playerIndex) {
      gameContext.winnerSide = 'Hope'
      push('WinnerDeclarationScreen')
    } else if (votedPlayerIndex === gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')?.playerIndex) {
      gameContext.winnerSide = 'Ultimate Despair'
      push('WinnerDeclarationScreen')
    } else if (gameContext.killsLeft === 0) {
      gameContext.winnerSide = 'Despair'
      push('WinnerDeclarationScreen')
    } else {
      const votedPlayer = gameContext.playersInfo[votedPlayerIndex].name
      const killOrKills = gameContext.killsLeft === 1 ? 'kill' : 'kills'
      if (gameContext.playersInfo[votedPlayerIndex].role === 'Alter Ego') {
        gameContext.alterEgoAlive = false
        await speakThenPause('U pu pu pu. ' + votedPlayer + ' was the Alter Ego. The game continues and the Blackened needs ' + 
        gameContext.killsLeft  + ' more ' + killOrKills + 'to win.', 1, nightTime)
      } else {
        await speakThenPause(votedPlayer + ' was not the Blackened player. The game continues and the Blackened needs ' + 
        gameContext.killsLeft  + ' more ' + killOrKills + 'to win.', 1, nightTime)
      }
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
  backgroundMusic = sound
}

type Props = {setTime:React.Dispatch<any>}