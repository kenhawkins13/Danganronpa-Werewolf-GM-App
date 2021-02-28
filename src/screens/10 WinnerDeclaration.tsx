import React, { useContext, useState } from "react"
import { View, Text, TouchableHighlight, ImageBackground } from "react-native"
import { GameContext } from "../../AppContext"
import { colors } from "../styles/colors"
import { appStyle } from "../styles/styles"
import PlayersPage from "../components/PlayersPage"
import RevealRoleModal from "../components/modals/RevealRole"
import { Audio } from 'expo-av'
import { endMusic } from "../assets/music/music"
import { useNavigation } from "@react-navigation/native"

export default function WinnerDeclarationScreen() {
  const gameContext = useContext(GameContext)
  const { navigate } = useNavigation<any>()
  const [winnerBannerVisible, setWinnerBannerVisible] = useState(false)
  const [playerIndex, setPlayerIndex] = useState(0)
  const [revealRoleModalVisible, setRevealRoleModalVisible] = useState(false)

  if (!winnerBannerVisible) {
    playMusic()
    return (
      <View style={{flex: 1}}>
        {BackgroundImage()}
      </View>
    )
  } 
  else {
    gameContext.playersInfo.forEach(playerInfo => {
      playerInfo.alive = true
      playerInfo.playerButtonStyle.disabled = false
      switch (playerInfo.role) {
        case 'Spotless':
          playerInfo.playerButtonStyle.textColor = colors.white
          playerInfo.playerButtonStyle.backgroundColor = colors.whiteTransparent
          playerInfo.playerButtonStyle.borderColor = colors.white
          playerInfo.playerButtonStyle.underlayColor = colors.greyTransparent
          break
        case 'Alter Ego':
          playerInfo.playerButtonStyle.textColor = colors.greenTransparent
          playerInfo.playerButtonStyle.backgroundColor = colors.whiteTransparent
          playerInfo.playerButtonStyle.borderColor = colors.white
          playerInfo.playerButtonStyle.underlayColor = colors.greyTransparent
          break
        case 'Blackened':
          playerInfo.playerButtonStyle.textColor = colors.pinkTransparent
          playerInfo.playerButtonStyle.backgroundColor = colors.blackTransparent
          playerInfo.playerButtonStyle.borderColor = colors.white
          playerInfo.playerButtonStyle.underlayColor = colors.black
          break
        case 'Traitor':
          playerInfo.playerButtonStyle.textColor = colors.greyTransparent
          playerInfo.playerButtonStyle.backgroundColor = colors.blackTransparent
          playerInfo.playerButtonStyle.borderColor = colors.white
          playerInfo.playerButtonStyle.underlayColor = colors.black
          break
        case 'Despair Disease Patient':
          playerInfo.playerButtonStyle.textColor = colors.blueTransparent
          playerInfo.playerButtonStyle.backgroundColor = colors.whiteTransparent 
          playerInfo.playerButtonStyle.borderColor = colors.white
          playerInfo.playerButtonStyle.underlayColor = colors.greyTransparent
          break
        case 'Monomi':
          playerInfo.playerButtonStyle.textColor = colors.pinkTransparent
          playerInfo.playerButtonStyle.backgroundColor = colors.whiteTransparent 
          playerInfo.playerButtonStyle.borderColor = colors.white
          playerInfo.playerButtonStyle.underlayColor = colors.greyTransparent
          break
        case 'Ultimate Despair':
          playerInfo.playerButtonStyle.textColor = colors.black
          playerInfo.playerButtonStyle.backgroundColor = colors.pinkTransparent
          playerInfo.playerButtonStyle.borderColor = colors.white
          playerInfo.playerButtonStyle.underlayColor = colors.pink
          break
      }      
    })
    return (
      <View style={{flex: 1}}>
        <ImageBackground style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }} resizeMode='cover'
          source={require('../assets/background/Setup.png')}>
          <PlayersPage visible={true} middleSection={RestartButton()} onPlayerClick={(playerIndex) => {
            setPlayerIndex(playerIndex)
            setRevealRoleModalVisible(true)
          }}/>
          <RevealRoleModal visible={revealRoleModalVisible} setVisible={setRevealRoleModalVisible} playerIndex={playerIndex}
            abilityOrItem='Reveal Roles'/>
        </ImageBackground>
      </View>
    ) 
  }

  function BackgroundImage() {
    setTimeout(() => { setWinnerBannerVisible(true) }, 10000)
    if (gameContext.winnerSide === 'Hope') {
      return (
        <ImageBackground style={{flex: 1}} source={require('../assets/background/Hope-Victory.png')}>
          <TouchableHighlight style={{flex: 1}} onPress={() => setWinnerBannerVisible(true)}>
            <View style={{flex: 1}}/>
          </TouchableHighlight>
        </ImageBackground>
      )
    } else if (gameContext.winnerSide === 'Despair') {
      return (
        <ImageBackground style={{flex: 1}} source={require('../assets/background/Despair-Victory.png')}>
          <TouchableHighlight style={{flex: 1}} onPress={() => setWinnerBannerVisible(true)}>
            <View style={{flex: 1}}/>
          </TouchableHighlight>
        </ImageBackground>
      )
    } else if (gameContext.winnerSide === 'Ultimate Despair') {
      return (
        <ImageBackground style={{flex: 1}} source={require('../assets/background/Ultimate-Despair-Victory.png')}>
          <TouchableHighlight style={{flex: 1}} onPress={() => setWinnerBannerVisible(true)}>
            <View style={{flex: 1}}/>
          </TouchableHighlight>
        </ImageBackground>
      )
    } else {
      return (<></>)
    }
  }

  function RestartButton() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{...appStyle.frame, height: '25%', minWidth: '25%'}}>
          <TouchableHighlight style={{flex: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
          disabled={false} onPress={async () => {
            await gameContext.backgroundMusic.unloadAsync()           
            navigate('StartScreen')
           }}>
            <Text style={{...appStyle.text, textAlign: 'center', margin: '2.5%'}}>Restart</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  async function playMusic() {
    const randomNum = Math.floor(Math.random() * endMusic.length)
    const { sound } = await Audio.Sound.createAsync(endMusic[randomNum])
    await sound.setVolumeAsync(.1)
    await sound.playAsync()
    await sound.setIsLoopingAsync(true)
    gameContext.backgroundMusic = sound
  }
}
