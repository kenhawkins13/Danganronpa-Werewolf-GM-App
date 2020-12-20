import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Modal } from 'react-native'
import { GameContext } from '../../../App'
import { GameContextType, PlayerInfo } from '../../types/types'

export default function PlayersModal({visible, setVisible, modal, onPlayerTouch, continueVisible, disableContinue, onContinue}:Props) {
  // modal.props.setVisisble(true) Is this possible so I don't need to pass in setModalVisible
  const gameContext = useContext(GameContext)
  const [bool, setBool] = useState(true)
  return (
    <View>
      <Modal visible={visible} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ height: '100%', width: '100%', flexDirection: 'column', flexWrap: 'wrap' }}>
            {PlayersBoxesLandscape(onPlayerTouch)}
          </View>
        </View>
      </Modal>
      {modal}
    </View>
  )
  
  function PlayersBoxesLandscape(onPlayerTouch:(playerIndex:number) => void) {
    return (
      [...Array(25)].map((elementInArray, index) => (
        <View key={'player' + index} style={frameStyleLandscape.frame1}>
          {PlayerBox(onPlayerTouch, index)}
        </View>
      ))
    )
  }
  
  function PlayerBox(onPlayerTouch:(playerIndex:number) => void, boxIndex:number) {
    if (playerBoxIndexes(gameContext.playerCount).includes(boxIndex)) {
      const playerIndex = playerBoxIndexes(gameContext.playerCount).indexOf(boxIndex)
      return (
        <View key={'player' + playerIndex} style={frameStyleLandscape.frame2}>
          <TouchableHighlight key={'player' + playerIndex + 1} style={boxStyle(gameContext.playersInfo[playerIndex]).style} 
            disabled={gameContext.playersInfo[playerIndex].colorScheme == 'grey' || gameContext.playersInfo[playerIndex].alive === false ? true : false}
            onPress={() => {
              gameContext.currentPlayerIndex = playerIndex
              onPlayerTouch(playerIndex)
              setBool(!bool) // to re-render PlayersBoxes
            }}>
            <Text style={textStyle(gameContext, playerIndex).style}>{gameContext.playersInfo[playerIndex].name}</Text>
          </TouchableHighlight>
        </View>
      )
    } else if (boxIndex === 12) {
      return (ContinueButton(continueVisible, disableContinue, setVisible, onContinue))
    } else if ([6, 7, 8, 11, 13, 16, 17, 18].includes(boxIndex)) {
      return (<View style={{flex: 1, width: '100%', height:'100%', backgroundColor: 'brown'}}/>)
    } else {
      return (<></>)
    }
  }
  
  function ContinueButton(visible:boolean, disabled:boolean, setPlayersModalVisible:React.Dispatch<any>, onContinue?:() => void) {
    if (visible) {
      return (
        <View style={{ flex: 1, width: '100%', backgroundColor: 'brown' }}>
          <TouchableHighlight disabled={disabled} 
            style={{ ...frameStyleLandscape.continueButton, backgroundColor: disabled == true ? 'grey' : 'lightblue' }} 
            onPress={() => {
              setPlayersModalVisible(false)
              if (onContinue) { onContinue() }
            }}>
            <Text style={{color: 'black'}}>Continue</Text>
          </TouchableHighlight>
        </View>
      )
    } else {
      return <View style={{width: '100%', height:'100%', backgroundColor: 'brown'}}/>
    }
  }
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>, modal:JSX.Element, onPlayerTouch:(playerIndex:number) => void, 
  continueVisible:boolean, disableContinue:boolean, onContinue?:() => void}

const frameStyleLandscape = StyleSheet.create({
  frame1: {
    width: '20%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  frame2: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
   continueButton: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 20,
    elevation: 2
   }
})

function textStyle(gameContext:GameContextType, playerIndex:number) {
  let colorScheme = gameContext.playersInfo[playerIndex].colorScheme
  let textColor = ''
  switch (colorScheme) {
    case 'black':
      textColor = 'white'
      break
    default:
      textColor = 'black'
      break
  }
  return StyleSheet.create({
    style: {
      color: textColor
    }
  })
}

function boxStyle(playerInfo:PlayerInfo) {
  let backgroundColor = ''
  if (playerInfo.alive === false) {
    backgroundColor = '#cc0066'
  } else {
    backgroundColor = playerInfo.colorScheme
  }
  return StyleSheet.create({
    style: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: backgroundColor,
      borderRadius: 20,
      padding: 10,
      elevation: 20
    }
  })
}

const playerBoxIndexes = (playerCount:number) => {
  switch (playerCount) {
    case 4:
      return [10, 22, 14, 2]
      break
    case 5:
      return [10, 22, 14, 3, 1]
      break
    case 6:
      return [10, 21, 23, 14, 3, 1]
      break
    case 7:
      return [15, 21, 23, 14, 3, 1, 5]
      break
    case 8:
      return [15, 21, 23, 19, 9, 3, 1, 5]
      break
    case 9:
      return [15, 21, 23, 19, 9, 3, 2, 1, 5]
      break
    case 10:
      return [15, 21, 22, 23, 19, 9, 3, 2, 1, 5]
      break
    case 11:
      return [10, 20, 21, 22, 23, 19, 9, 3, 2, 1, 0]
      break
    case 12:
      return [10, 20, 21, 22, 23, 24, 14, 4, 3, 2, 1, 0]
      break
    case 13:
      return [15, 20, 21, 22, 23, 24, 14, 4, 3, 2, 1, 0, 5]
      break
    case 14:
      return [15, 20, 21, 22, 23, 24, 19, 9, 4, 3, 2, 1, 0, 5]
      break
    case 15:
      return [10, 15, 20, 21, 22, 23, 24, 19, 9, 4, 3, 2, 1, 0, 5]
      break
    case 16:
      return [10, 15, 20, 21, 22, 23, 24, 19, 14, 9, 4, 3, 2, 1, 0, 5]
      break
    default:
      return []
  }
}

  // function PlayersBoxesPortrait(onPlayerTouch:(playerIndex:number) => void) {
  //   const heightPercent = ((1 / Math.ceil(gameContext.playerCount / 2)) * 100).toString() + '%'
  //   return (
  //     [...Array(gameContext.playerCount)].map((elementInArray, index) => (
  //       <View key={'player' + index} style={frameStylePortrait(heightPercent).frame}>
  //         <TouchableHighlight key={'player' + index+1} style={boxStyle(gameContext.playersInfo[index]).style} 
  //           disabled={gameContext.playersInfo[index].colorScheme == 'grey' || gameContext.playersInfo[index].alive === false ? true : false}
  //           onPress={() => {
  //             gameContext.currentPlayerIndex = index
  //             onPlayerTouch(index)
  //             setBool(!bool) // to re-render PlayersBoxes
  //           }}>
  //           <Text style={textStyle(gameContext, index).style}>{gameContext.playersInfo[index].name}</Text>
  //         </TouchableHighlight>
  //       </View>
  //     ))
  //   )
  // }
  // function frameStylePortrait(heightPercent: string) {
  //   return StyleSheet.create({
  //     frame: {
  //       width: '50%',
  //       height: heightPercent,
  //       borderColor: 'black',
  //       borderWidth: 5,
  //       alignItems: 'center',
  //       justifyContent: 'center'
  //     }
  //   })
  // }