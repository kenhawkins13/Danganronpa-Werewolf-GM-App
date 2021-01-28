import React, { useContext, useState } from "react"
import { Modal, View, Text, TouchableHighlight, DevSettings, ImageBackground } from "react-native"
import { GameContext } from "../../../AppContext"
import { blackTransparent, blueTransparent, greenTransparent, greyTransparent, pink, pinkTransparent, whiteTransparent } from "../../styles/colors"
import { appStyle } from "../../styles/styles"
import PlayersPage from "../PlayersPage"
import RevealRoleModal from "./RevealRole"
import { Audio } from 'expo-av'

export default function WinnerDeclarationModal({visible, winnerSide}:Props) {
  const gameContext = useContext(GameContext)
  const [playersPageVisible, setPlayersPageVisible] = useState(false)
  const [playerIndex, setPlayerIndex] = useState(0)
  const [revealRoleModalVisible, setRevealRoleModalVisible] = useState(false)

  if (visible) {
    if (!playersPageVisible) {
      playMusic()
      return (
        <Modal animationType="slide" transparent={true} visible={visible}>
          {BackgroundImage()}
        </Modal>
      )
    } 
    else {
      gameContext.playersInfo.forEach(playerInfo => {
        playerInfo.alive = true
        playerInfo.playerButtonStyle.disabled = false
        switch (playerInfo.role) {
          case 'Spotless':
            playerInfo.playerButtonStyle.textColor = 'white'
            playerInfo.playerButtonStyle.backgroundColor = whiteTransparent
            playerInfo.playerButtonStyle.borderColor = 'white'
            break
          case 'Alter Ego':
            playerInfo.playerButtonStyle.textColor = greenTransparent
            playerInfo.playerButtonStyle.backgroundColor = whiteTransparent
            playerInfo.playerButtonStyle.borderColor = 'white'
            break
          case 'Blackened':
            playerInfo.playerButtonStyle.textColor = pinkTransparent
            playerInfo.playerButtonStyle.backgroundColor = blackTransparent
            playerInfo.playerButtonStyle.borderColor = 'black'
            break
          case 'Traitor':
            playerInfo.playerButtonStyle.textColor = greyTransparent
            playerInfo.playerButtonStyle.backgroundColor = blackTransparent
            playerInfo.playerButtonStyle.borderColor = 'black'
            break
          case 'Despair Disease Patient':
            playerInfo.playerButtonStyle.textColor = blueTransparent
            playerInfo.playerButtonStyle.backgroundColor = whiteTransparent 
            playerInfo.playerButtonStyle.borderColor = 'white'
            break
          case 'Monomi':
            playerInfo.playerButtonStyle.textColor = pinkTransparent
            playerInfo.playerButtonStyle.backgroundColor = whiteTransparent 
            playerInfo.playerButtonStyle.borderColor = 'white'
            break
          case 'Ultimate Despair':
            playerInfo.playerButtonStyle.textColor = 'black'
            playerInfo.playerButtonStyle.backgroundColor = pinkTransparent
            playerInfo.playerButtonStyle.borderColor = pink
            break
        }      
      })
      return (
        <View style={{flex: 1}}>
          <Modal animationType="slide" transparent={true} visible={visible}>
            <PlayersPage middleSection={RestartButton()} onPlayerClick={(playerIndex) => {
              setPlayerIndex(playerIndex)
              setRevealRoleModalVisible(true)
            }}/>
          </Modal>
          <RevealRoleModal visible={revealRoleModalVisible} setVisible={setRevealRoleModalVisible} playerIndex={playerIndex}
            abilityOrItem='Reveal Roles'/>
        </View>
      ) 
    }
  } else {
    return (<></>)
  }

  function BackgroundImage() {
    setTimeout(() => { setPlayersPageVisible(true) }, 10000)
    if (winnerSide === 'Hope') {
      return (
        <View style={{flex: 1}}>
          <ImageBackground style={{flex: 1}} source={require('../../assets/background/Hope-Victory.png')}>
            <TouchableHighlight style={{flex: 1}} onPress={() => setPlayersPageVisible(true)}>
              <View style={{flex: 1}}/>
            </TouchableHighlight>
          </ImageBackground>
        </View>
      )
    } else if (winnerSide === 'Despair') {
      return (
        <View style={{flex: 1}}>
          <ImageBackground style={{flex: 1}} source={require('../../assets/background/Despair-Victory.png')}>
            <TouchableHighlight style={{flex: 1}} onPress={() => setPlayersPageVisible(true)}>
              <View style={{flex: 1}}/>
            </TouchableHighlight>
          </ImageBackground>
        </View>
      )
    } else {
      return (
        <View style={{flex: 1}}>
          <ImageBackground style={{flex: 1}} source={require('../../assets/background/Ultimate-Despair-Victory.png')}>
            <TouchableHighlight style={{flex: 1}} onPress={() => setPlayersPageVisible(true)}>
              <View style={{flex: 1}}/>
            </TouchableHighlight>
          </ImageBackground>
        </View>
      )
    }
  }

  function RestartButton() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{...appStyle.frame, height: '25%', minWidth: '25%'}}>
          <TouchableHighlight style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}} 
          disabled={false} onPress={() => { DevSettings.reload() }}>
            <Text style={{...appStyle.text, textAlign: 'center', margin: '2.5%'}}>Restart</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

type Props = {visible:boolean, winnerSide:string}

async function playMusic() {
  const music = require("../../assets/music/End/Climax-Reasoning.mp3")
  const { sound } = await Audio.Sound.createAsync(music)
  await sound.playAsync()
  await sound.setVolumeAsync(.1)
  await sound.setIsLoopingAsync(true)
}
