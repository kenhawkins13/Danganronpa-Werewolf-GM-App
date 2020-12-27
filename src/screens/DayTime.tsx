import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { GameContext } from '../../AppContext'
import CountdownTimer from '../components/CountdownTimer'
import DiscussionOrVoteModal from '../components/modals/DiscussionOrVote'
import PlayerVoteModal from '../components/modals/PlayerVote'
import WinnerDeclarationModal from '../components/modals/WinnerDeclaration'
import PlayersPage from '../components/PlayersPage'
import { blackTransparent, darkGrey, greyTransparent, pinkTransparent, yellowTransparent } from '../styles/colors'
import { appStyle } from '../styles/styles'

let stage = 'daySpeech'
let speech = ''
let winnerSide = ''
let votedPlayerIndex = -1
let discussionTime = 180
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function DayTimeScreen() {
  const { push } = useNavigation<any>()
  const gameContext = useContext(GameContext)
  const [timerVisible, setTimerVisible] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [playerVoteVisible, setPlayerVoteVisible] = useState(false)
  const [discussionOrVoteVisible, setDiscussionOrVoteVisible] = useState(false)
  const [winnerDeclarationVisible, setWinnerDeclarationVisible] = useState(false)
  const [continueButtonColor, setContinueButtonColor] = useState(greyTransparent)
  const [continueButtonTextColor, setContinueButtonTextColor] = useState(darkGrey)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true)

  // Returns true if screen is focused
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
  useEffect(() => { if (isFocused) { dayTimeLogic() }}, [isFocused])

  return (
    <View style={{ flex: 1 }}>
      <PlayersPage middleSection={PlayersPageMiddleSection()} onPlayerClick={() => {}}/>
      <PlayerVoteModal visible={playerVoteVisible} setVisible={setPlayerVoteVisible} onOk={(playerVote) => { 
        votedPlayerIndex = playerVote
        dayTimeLogic()
      }}/>
      <DiscussionOrVoteModal visible={discussionOrVoteVisible} setVisible={setDiscussionOrVoteVisible} onDiscussion={() => {
        stage = 'discussion'
        discussionTime = 60
        dayTimeLogic()
      }} onVote={() => {
        stage = 'trial'
        dayTimeLogic()
      }}/>
      <WinnerDeclarationModal visible={winnerDeclarationVisible} winnerSide={winnerSide}/>
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
                  onPress={() => { setTimerKey(timerKey + 1) }}>
                  <Text style={{...appStyle.text, textAlign: 'center', margin: 10}}>Restart{"\n"}Timer</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <CountdownTimer timerKey={timerKey.toString()} duration={discussionTime} onDone={() => {
                if (timerVisible) { Speech.speak("Time is up") }
              }}/>
            </View>
            <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
              <View style={{...appStyle.frame, height: '50%', minWidth: '75%', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableHighlight style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}} 
                  onPress={() => { 
                    setTimerVisible(false)
                    dayTimeLogic() 
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
              disabled={continueButtonDisabled} onPress={() => { dayTimeLogic() }}>
              <Text style={{...appStyle.text, textAlign: 'center', margin: 10, color: continueButtonTextColor}}>Continue</Text>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
  }

  function DayTimeLabel() {
    const trialStages = ['discussion', 'abilitiesOrItemsTrial', 'trial', 'vote', 'execution']
    if (trialStages.includes(stage) && gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1) {
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

  async function dayTimeLogic() {
    switch (stage) {
      case 'daySpeech':
        if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1) {
          speech = 'It is day time. A body has been discovered! Now then, after a certain amount of time has passed, the class trial will begin!'
        } else {
          speech = 'Mm, ahem, it is now the day time.'
        }
        await speakThenPause(speech, 1)
        stage = 'abilitiesOrItems'
        dayTimeLogic()
        break
      case 'abilitiesOrItems':
        if (gameContext.mode === 'extreme') {
          await speakThenPause('Would anybody like to use an ability or item?')
          enableContinueButton()
          stage = 'discussion'
        } else {
          stage = 'discussion'
          dayTimeLogic()
        }
        break
      case 'discussion':
        await speakThenPause('Discussion starts now.')
        setTimerVisible(true)
        // Speech.speak('You may now start the Non-stop debate. The standard time limit is 3 minutes.')
        if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1) {
          stage = 'abilitiesOrItemsTrial'
        } else {
          stage = 'nightTime'
        }
        break
      case 'abilitiesOrItemsTrial':
        enableContinueButton()
        stage = 'trial'
        if (gameContext.mode === 'extreme') {
          await speakThenPause('Would anybody like to use an ability or item before voting?')
        } else {
          dayTimeLogic()
        }
        break
      case 'trial':
        stage = 'vote'
        await speakThenPause('The countdown to vote will occur next. Click Continue when everybody is ready to vote.')
        break
      case 'vote':
        stage = 'execution'
        await speakThenPause('Three. Two. One. Vote!')
        setPlayerVoteVisible(true)
        break
      case 'execution':
        if (votedPlayerIndex === -1) { // Tie vote
          setDiscussionOrVoteVisible(true)
        } else {
          const votedPlayer = gameContext.playersInfo[votedPlayerIndex].name
          gameContext.playersInfo[votedPlayerIndex].alive = false
          await speakThenPause(votedPlayer + ' has received the most votes and has been executed.', 1)
          if (gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')) {
            gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')!.side = 'Despair'
          }
          if (votedPlayerIndex === gameContext.playersInfo.find((value) => value.role === 'Blackened')?.playerIndex) {
            winnerSide = 'Hope'
            setWinnerDeclarationVisible(true)
          } else if (votedPlayerIndex === gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')?.playerIndex) {
            winnerSide = 'Ultimate Despair'
            setWinnerDeclarationVisible(true)
          } else if (gameContext.killsLeft === 0) {
            winnerSide = 'Despair'
            setWinnerDeclarationVisible(true)
          } else {
            const killOrKills = gameContext.killsLeft === 1 ? 'kill' : 'kills'
            if (gameContext.playersInfo[votedPlayerIndex].role === 'Alter Ego') {
              gameContext.alterEgoAlive = false
              await speakThenPause('U pu pu pu. ' + votedPlayer + ' was the Alter Ego. The game continues and the Blackened needs ' + 
              gameContext.killsLeft  + ' more ' + killOrKills + 'to win.', 1)
            } else {
              await speakThenPause(votedPlayer + ' was not the Blackened player. The game continues and the Blackened needs ' + 
              gameContext.killsLeft  + ' more ' + killOrKills + 'to win.', 1)
            }
            stage = 'nightTime'
            dayTimeLogic()
          }
        }
        break
      case 'nightTime':
        stage = 'daySpeech'
        push('NightTimeScreen')
        break
    }
  }

  function enableContinueButton() {
    setContinueButtonColor(blackTransparent)
    setContinueButtonTextColor('white')
    setContinueButtonDisabled(false)
  }
}

async function speakThenPause(speech:string, seconds:number=0) {
  Speech.speak(speech)
  while (await Speech.isSpeakingAsync()) {}
  await sleep(seconds * 1000)
}