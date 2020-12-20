import { useNavigation } from "@react-navigation/native"
import React, { useContext, useState } from "react"
import { Modal, View, Text, TouchableHighlight } from "react-native"
import { GameContext } from "../../../App"
import { modalStyles } from "../../styles/styles"
import { GameContextType } from "../../types/types"
import Confirmation from "./Confirmation"

export default function RevealRoleModal({visible, setVisible, abilityOrItem, callback}:Props) {
  const gameContext = useContext(GameContext)
  const [revelationVisible, setRevelationVisible] = useState(false)
  const confirmationText = 'Investigate ' + gameContext.playersInfo[gameContext.currentPlayerIndex].name + '?'
  return (
    <View>
      <Confirmation visible={visible} setVisible={setVisible} text={confirmationText} onYes={() => setRevelationVisible(true)} onNo={() => {}}/>
      <Revelation visible={revelationVisible} setVisible={setRevelationVisible} abilityOrItem={abilityOrItem} callback={callback}/>
    </View>
  )
}

function Revelation({visible, setVisible, abilityOrItem, callback}:Props) {
  const gameContext = useContext(GameContext)
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalText}>
            {revealText(gameContext, abilityOrItem)}
          </Text>
          <TouchableHighlight style={{ ...modalStyles.button, backgroundColor: "#2196F3" }} 
            onPress={() => { 
              setVisible(false)
              if (callback) { callback() }
            }}>
            <Text style={modalStyles.textStyle}>OK</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  )
}

function revealText(gameContext:GameContextType, abilityOrItem:string):string {
  let string = ''
  switch (abilityOrItem) {
    case "Yasuhiro Hagakure":
      const role = gameContext.playerCount < 7 ? 'Despair Disease Patient' : 'Monomi'
      string = gameContext.playersInfo[gameContext.currentPlayerIndex].role == role ? role : 'Not ' + role
      break
    case "Alter Ego":
    case "Kyoko Kirigiri":
    case "Glasses":
      string = gameContext.playersInfo[gameContext.currentPlayerIndex].side
      break
    case "Someone's Graduation Album":
      string = gameContext.playersInfo[gameContext.currentPlayerIndex].role == 'Traitor' ? 'Traitor' : 'Not Traitor'
      break
    case "Silent Receiver":
      string = gameContext.playersInfo[gameContext.currentPlayerIndex].role == 'Spotless' ? 'Spotless' : 'Not Spotless'
      break
  }
  return string
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>, abilityOrItem:string, callback?:() => void}