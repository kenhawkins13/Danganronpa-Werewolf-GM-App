import React, { useContext } from "react"
import { Modal, View, Text, TouchableHighlight } from "react-native"
import { GameContext } from "../../../AppContext"
import { modalStyles } from "../../styles/styles"
import { GameContextType } from "../../types/types"

export default function RevealRoleModal({visible, setVisible, playerIndex, abilityOrItem, onOk}:Props) {
  const gameContext = useContext(GameContext)
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={modalStyles.centeredView}>
        <TouchableHighlight onPress={() => { 
            setVisible(false)
            if (onOk) { onOk() }
          }}>
          <View style={modalStyles.modalView}>
            <Text adjustsFontSizeToFit style={{...modalStyles.modalText, fontSize: 60}}>
              {revealText(gameContext, playerIndex, abilityOrItem)}
            </Text>
            <TouchableHighlight style={{...modalStyles.button}} onPress={() => { 
                setVisible(false)
                if (onOk) { onOk() }
              }}>
              <Text style={modalStyles.textStyle}>OK</Text>
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      </View>
    </Modal>
  )
}

function revealText(gameContext:GameContextType, playerIndex:number, abilityOrItem:string):string {
  let string = ''
  switch (abilityOrItem) {
    case "Yasuhiro Hagakure":
      let role = gameContext.playerCount < 7 ? 'Despair Disease Patient' : 'Monomi'
      string = gameContext.playersInfo[playerIndex].role === role ? role : 'Not\n' + role
      break
    case "Alter Ego":
    case "Kyoko Kirigiri":
    case "Glasses":
      string = gameContext.playersInfo[playerIndex].side
      break
    case "Someone's Graduation Album":
      string = gameContext.playersInfo[playerIndex].role === 'Traitor' ? 'Traitor' : 'Not\nTraitor'
      break
    case "Silent Receiver":
      string = gameContext.playersInfo[playerIndex].role === 'Spotless' ? 'Spotless' : 'Not\nSpotless'
      break
    case "Reveal Roles":
      string = gameContext.playersInfo[playerIndex].role
      break
    case "Kyoko Kirigiri (Maniax)":
      let roles = ['Future Foundation', 'Zakemono', 'Remnants of Despair']
      string = roles.includes(gameContext.playersInfo[playerIndex].role) ? 'Maniax' : 'Not\nManiax'
      break
    case "Emperor's Thong":
      role = 'Ultimate Despair'
      const roleFormatted = 'Ultimate\nDespair'
      string = gameContext.playersInfo[playerIndex].role === role ? roleFormatted : 'Not\n' + roleFormatted
      break
    case "Secrets of Omoplata":
      string = gameContext.playersInfo.find(playerInfo => playerInfo.role === 'Remnants of Despair') ? 'Yes' : 'No'
      break
  }
  return string
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>, playerIndex:number, abilityOrItem:string, onOk?:() => void}