import { useIsFocused } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import { GameContext } from '../../AppContext'
import * as ScreenOrientation from 'expo-screen-orientation'
import { OrientationLock } from 'expo-screen-orientation'
import { PlayerInfo } from '../types/types'
import { greyTransparent } from '../styles/colors'

export default function PlayersPage({middleSection, onPlayerClick}:Props) {
  // modal.props.setVisisble(true) Is this possible so I don't need to pass in setModalVisible
  const gameContext = useContext(GameContext)
  const [bool, setBool] = useState(false)

  // Check if screen is focused+
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
  useEffect(() => { if (isFocused) {
    ScreenOrientation.lockAsync(OrientationLock.LANDSCAPE)
  }})

  return (
    <View style={{ flex: 1 }}>
      {PlayerButtons(boxIndexes(gameContext.playerCount))}
      <View style={{ height: '60%', width: '60%', left: '20%', top: '20%', position: 'absolute' }}>
        {middleSection}
      </View>
    </View>
  )
  
  function PlayerButtons(boxIndexes:number[]) {
    return (
      boxIndexes.map((value, index) => (
        <View key={'box' + value} style={boxPosition(value).playerBox}>
          {PlayerButton(index)}
        </View>
      ))
    )
  }
  
  function PlayerButton(playerIndex:number) {
    return (
      <View key={'player' + playerIndex} style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <TouchableHighlight key={'player' + playerIndex + 1} 
          style={{...playerBoxStyle(gameContext.playersInfo[playerIndex]).boxStyle}}
          disabled={gameContext.playersInfo[playerIndex].playerButtonStyle.disabled === true || 
            gameContext.playersInfo[playerIndex].alive === false}
          onPress={() => { 
            onPlayerClick(playerIndex)
            setBool(!bool)
          }}>
          <Text adjustsFontSizeToFit style={playerBoxStyle(gameContext.playersInfo[playerIndex]).textStyle}>
            {gameContext.playersInfo[playerIndex].name}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

type Props = {middleSection:JSX.Element, onPlayerClick:(playerIndex:number) => void}

function playerBoxStyle(playerInfo:PlayerInfo) {
  let textColor = playerInfo.playerButtonStyle.textColor
  let backgroundColor = playerInfo.playerButtonStyle.backgroundColor
  let borderColor = playerInfo.playerButtonStyle.borderColor
  if (!playerInfo.alive) {
    textColor = greyTransparent
    backgroundColor = greyTransparent
    borderColor = greyTransparent
  }
  return StyleSheet.create({
    boxStyle: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: backgroundColor,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: borderColor,
      padding: '2.5%'
    }, 
    textStyle: {
      color: textColor,
      fontSize: 50,
      marginVertical: '5%',
      textAlign: 'center',
    }
  })
}

const boxPosition = (index:number) => {
  let position = {top:'', left:''}
  switch (index) {
    case 0:
      position.top = '0%'
      position.left = '40%'
      break
    case 1:
      position.top = '0%'
      position.left = '60%'
      break
    case 2:
      position.top = '0%'
      position.left = '80%'
      break
    case 3:
      position.top = '20%'
      position.left = '80%'
      break
    case 4:
      position.top = '40%'
      position.left = '80%'
      break
    case 5:
      position.top = '60%'
      position.left = '80%'
      break
    case 6:
      position.top = '80%'
      position.left = '80%'
      break
    case 7:
      position.top = '80%'
      position.left = '60%'
      break
    case 8:
      position.top = '80%'
      position.left = '40%'
      break
    case 9:
      position.top = '80%'
      position.left = '20%'
      break
    case 10:
      position.top = '80%'
      position.left = '0%'
      break
    case 11:
      position.top = '60%'
      position.left = '0%'
      break
    case 12:
      position.top = '40%'
      position.left = '0%'
      break
    case 13:
      position.top = '20%'
      position.left = '0%'
      break
    case 14:
      position.top = '0%'
      position.left = '0%'
      break
    case 15:
      position.top = '0%'
      position.left = '20%'
      break
  }
  return StyleSheet.create({
    playerBox: {
      height: '20%',
      width: '20%',
      top: position.top,
      left: position.left,
      position: 'absolute'
    }
  })
}

const boxIndexes = (playerCount:number) => {
  switch (playerCount) {
    case 4:
      return [0, 4, 8, 12]
    case 5:
      return [0, 4, 7, 9, 12]
    case 6:
      return [1, 4, 7, 9, 12, 15]
    case 7:
      return [1, 4, 7, 9, 11, 13, 15]
    case 8:
      return [1, 3, 5, 7, 9, 11, 13, 15]
    case 9:
      return [1, 3, 5, 7, 8, 9, 11, 13, 15]
    case 10:
      return [0, 1, 3, 5, 7, 8, 9, 11, 13, 15]
    case 11:
      return [0, 1, 3, 5, 7, 8, 9, 10, 12, 14, 15]
    case 12:
      return [0, 1, 2, 4, 6, 7, 8, 9, 10, 12, 14, 15]
    case 13:
      return [0, 1, 2, 4, 6, 7, 8, 9, 10, 11, 13, 14, 15]
    case 14:
      return [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15]
    case 15:
      return [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    case 16:
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    default:
      return []
  }
}
