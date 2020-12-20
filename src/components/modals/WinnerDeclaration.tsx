import { useNavigation } from "@react-navigation/native"
import React, { useContext, useState } from "react"
import { Modal, View, Text, TouchableHighlight, DevSettings } from "react-native"
import { GameContext } from "../../../App"
import { modalStyles } from "../../styles/styles"
import PlayersModal from "./Players"

export default function WinnerDeclarationModal({visible, setVisible, winnerSide}:Props) {
  const gameContext = useContext(GameContext)
  const [playerVisible, setPlayerVisible] = useState(false)
  if (visible) {    
    return (
      <View>
        <Modal animationType="slide" transparent={true} visible={visible}>
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <Text style={modalStyles.modalText}>{winnerSide} wins!</Text>
              <TouchableHighlight
                style={{ ...modalStyles.button, backgroundColor: "#2196F3" }}
                onPress={() => { 
                  setVisible(false)
                  setPlayerVisible(true)
                   }}>
                <Text style={modalStyles.textStyle}>Reveal Roles</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    )
  } else if (playerVisible) {
    gameContext.playersInfo.forEach(playerInfo => {
      playerInfo.alive = true // to prevent playerBox background from being pink
      switch (playerInfo.role) {
        case 'Alter Ego':
          playerInfo.colorScheme = 'green'
          break
        case 'Blackened':
          playerInfo.colorScheme = 'black'
          break
        case 'Spotless':
          playerInfo.colorScheme = 'white'
          break
        case 'Despair Disease Patient':
        case 'Monomi':
          playerInfo.colorScheme = 'lightblue'
          break
        case 'Traitor':
          playerInfo.colorScheme = 'grey'
          break
        case 'Ultimate Despair':
          playerInfo.colorScheme = '#cc0066'
          break
      }
    })
    return (
      <PlayersModal visible={playerVisible} setVisible={setPlayerVisible} modal={<></>} onPlayerTouch={() => {}} 
        continueVisible={true} disableContinue={false} onContinue={() => {
          DevSettings.reload()
      }}/>
    )
  } else {
    return (<></>)
  }
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>, winnerSide:string}
