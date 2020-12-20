import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { GameContext } from '../../App';
import CountdownTimer from '../components/CountdownTimer'
import DiscussionOrVoteModal from '../components/modals/DiscussionOrVote';
import PlayerVoteModal from '../components/modals/PlayerVote'
import WinnerDeclarationModal from '../components/modals/WinnerDeclaration'

let stage = 'daySpeech'
let speech = ''
let winnerSide = ''
let votedPlayerIndex = -1
const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

export default function DayTimeScreen() {
  const { push } = useNavigation<any>()
  const gameContext = useContext(GameContext)
  const [timerVisible, setTimerVisible] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [buttonVisible, setButtonVisible] = useState(false)
  const [playerVoteVisible, setPlayerVoteVisible] = useState(false)
  const [discussionOrVoteVisible, setDiscussionOrVoteVisible] = useState(false)
  const [winnerDeclarationVisible, setWinnerDeclarationVisible] = useState(false)

  // Returns true if screen is focused
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
  useEffect(() => { if (isFocused) { dayTimeLogic() }}, [isFocused])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'yellow' }}>
        <Text>Day Time of Day {gameContext.dayNumber}</Text>
      </View>
      <View style={{ flex: 10 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#cc0066' }}>
          <Text>Some label</Text>
          {Timer(timerKey, timerVisible, () => { if (gameContext.mode === 'extreme') { setButtonVisible(true) }})}
        </View>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white', alignItems: 'center' }}>
          {Add3MinutesButton(buttonVisible, setButtonVisible, timerKey, setTimerKey)}
          <TouchableHighlight style={{ width: buttonVisible == true ? '50%' : '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} 
            onPress={() => { dayTimeLogic() }}>
            <Text>Button</Text>
          </TouchableHighlight>
        </View>
      </View>
      <PlayerVoteModal visible={playerVoteVisible} setVisible={setPlayerVoteVisible} onOk={(playerVote) => { 
        votedPlayerIndex = playerVote
        dayTimeLogic()
      }}/>
      <DiscussionOrVoteModal visible={discussionOrVoteVisible} setVisible={setDiscussionOrVoteVisible} onDiscussion={() => {
        stage = 'discussion'
        dayTimeLogic()
      }} onVote={() => {
        stage = 'trial'
        dayTimeLogic()
      }}/>
      <WinnerDeclarationModal visible={winnerDeclarationVisible} setVisible={setWinnerDeclarationVisible} winnerSide={winnerSide}/>
    </View>
  )

  async function dayTimeLogic() {
    switch (stage) {
      case 'daySpeech':
        if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1) {
          speech = 'It is day time. A body has been discovered! Now then, after a certain amount of time has passed, the class trial will begin!'
        } else {
          speech = 'Mm, ahem, this is a school announcement. It is now the day time. Please make your way to the briefing room.'
        }
        await speakThenPause(speech, 1)
        stage = 'abilitiesOrItems'
        dayTimeLogic()
        break
      case 'abilitiesOrItems':
        stage = 'discussion'
        if (gameContext.mode === 'extreme') {
          await speakThenPause('Would anybody like to use a day time ability or item?')
        } else {
          dayTimeLogic()
        }
        break
      case 'discussion':
        await speakThenPause('Discuss anything you would like, starting now.')
        // Speech.speak('You may now start the Non-stop debate. The standard time limit is 3 minutes.')
        setTimerVisible(true)
        if (gameContext.blackenedAttack !== -1 && gameContext.dayNumber > 1) {
          stage = 'abilitiesOrItemsTrial'
        } else {
          stage = 'nightTime'
        }
        break
      case 'abilitiesOrItemsTrial':
        setTimerVisible(false)
        setButtonVisible(false)
        stage = 'trial'
        if (gameContext.mode === 'extreme') {
          await speakThenPause('We will start voting shortly. Please raise your hand if you would like to use a class trial ability or item.')
        } else {
          dayTimeLogic()
        }
        break
      case 'trial':
        stage = 'vote'
        await speakThenPause('Voting will begin. Make sure everybody is ready to vote.')
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
          const deadPlayersCount = gameContext.playersInfo.filter((value) => value.alive === false).length
          if (votedPlayerIndex === gameContext.playersInfo.find((value) => value.role === 'Blackened')?.playerIndex) {
            winnerSide = 'Hope'
            setWinnerDeclarationVisible(true)
          } else if (votedPlayerIndex === gameContext.playersInfo.find((value) => value.role === 'Ultimate Despair')?.playerIndex) {
            winnerSide = 'Ultimate Despair'
            setWinnerDeclarationVisible(true)
          } else if (deadPlayersCount / 2 === gameContext.killsRequired) {
            winnerSide = 'Despair'
            setWinnerDeclarationVisible(true)
          } else {
            const killOrKills = (gameContext.killsRequired - (deadPlayersCount / 2)) === 1 ? 'kill' : 'kills'
            if (gameContext.playersInfo[votedPlayerIndex].role === 'Alter Ego') {
              gameContext.alterEgoAlive = false
              await speakThenPause('U pu pu pu. ' + votedPlayer + ' was the Alter Ego. The game continues and the Blackened needs ' + 
              (gameContext.killsRequired - (deadPlayersCount / 2))  + ' more ' + killOrKills + 'to win.', 1)
            } else {
              await speakThenPause(votedPlayer + ' was not the Blackened player. The game continues and the Blackened needs ' + 
              (gameContext.killsRequired - (deadPlayersCount / 2))  + ' more ' + killOrKills + 'to win.', 1)
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
}

function Timer(timerKey:number, timerVisible:boolean, callback?:() => void) {
  if (timerVisible === true) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <CountdownTimer timerKey={timerKey.toString()} duration={10} callback={() => {
          Speech.speak('Time is up.')
          if (callback) { callback() }
        }}/>
      </View>
    )
  } else {
    return (
      <></>
    )
  }
}

function Add3MinutesButton(buttonVisible:boolean, setButtonVisible:React.Dispatch<any>, timerKey:number, setTimerKey:React.Dispatch<any>) {
  if (buttonVisible === true) {
    return (
      <TouchableHighlight style={{ width: '50%', height: '100%', alignItems: 'center', justifyContent: 'center' }} 
        onPress={() => { 
          setButtonVisible(false)
          setTimerKey(timerKey + 1)
        }}>
        <Text>Add 3 minutes</Text>
      </TouchableHighlight>
    )
  } else {
    return (
      <></>
    )
  }
}

async function speakThenPause(speech:string, seconds:number=0) {
  Speech.speak(speech)
  while (await Speech.isSpeakingAsync()) {}
  await sleep(seconds * 1000)
}