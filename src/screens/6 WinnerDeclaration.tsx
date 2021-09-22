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
import { backgrounds } from "../assets/backgrounds/backgrounds"

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
    gameContext.playersInfo.forEach((playerInfo) => { 
      if (playerInfo.role === 'Ultimate Despair') {
        playerInfo.side = 'Ultimate Despair'
      } else if (playerInfo.role === 'Blackened') {
        playerInfo.side = 'Despair'
      } else if (playerInfo.role === 'Monomi') {
        playerInfo.side = 'Hope'
      } else if (playerInfo.role === 'Despair Disease Patient') {
        playerInfo.side = 'Hope'
      }
      playerInfo.alive = true
      playerInfo.playerButtonStyle.disabled = false
      if (playerInfo.side === gameContext.winnerSide) {
        playerInfo.playerButtonStyle.textColor = colors.black
        playerInfo.playerButtonStyle.backgroundColor = colors.whiteTransparent
        playerInfo.playerButtonStyle.borderColor = colors.white
        playerInfo.playerButtonStyle.underlayColor = colors.greyTransparent
      } else {
        playerInfo.playerButtonStyle.textColor = colors.darkGrey
        playerInfo.playerButtonStyle.backgroundColor = colors.greyTransparent
        playerInfo.playerButtonStyle.borderColor = colors.darkGrey
        playerInfo.playerButtonStyle.underlayColor = colors.blackTransparent
      }
    })
    return (
      <View style={{flex: 1}}>
        <ImageBackground style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }} resizeMode='cover'
          source={backgrounds.main}>
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
        <ImageBackground style={{flex: 1}} source={backgrounds.hopeVictory}>
          <TouchableHighlight style={{flex: 1}} onPress={() => setWinnerBannerVisible(true)}>
            <View style={{flex: 1}}/>
          </TouchableHighlight>
        </ImageBackground>
      )
    } else if (gameContext.winnerSide === 'Despair') {
      return (
        <ImageBackground style={{flex: 1}} source={backgrounds.despairVictory}>
          <TouchableHighlight style={{flex: 1}} onPress={() => setWinnerBannerVisible(true)}>
            <View style={{flex: 1}}/>
          </TouchableHighlight>
        </ImageBackground>
      )
    } else if (gameContext.winnerSide === 'Ultimate Despair') {
      return (
        <ImageBackground style={{flex: 1}} source={backgrounds.ultimateDespairVictory}>
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
      <View style={{flex: 1}}>
      <View style={{flex: 1}}/>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{...appStyle.text, fontSize: 30}}>CONGRATULATIONS</Text>
        </View>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{...appStyle.frame, height: '75%', minWidth: '25%'}}>
            <TouchableHighlight style={{flex: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
            disabled={false} onPress={async () => {
              await gameContext.backgroundMusic.unloadAsync()
              gameContext.backgroundMusic = ''
              navigate('StartScreen')
            }}>
              <Text style={{...appStyle.text, textAlign: 'center', margin: '1%'}}>Restart</Text>
            </TouchableHighlight>
          </View>
        </View>
      <View style={{flex: 1}}/>
      </View>
    )
  }

  async function playMusic() {
    const randomNum = Math.floor(Math.random() * endMusic.length)
    const { sound } = await Audio.Sound.createAsync(endMusic[randomNum])
    await sound.setVolumeAsync(gameContext.musicVolume)
    await sound.playAsync()
    await sound.setIsLoopingAsync(true)
    gameContext.backgroundMusic = sound
  }
}
