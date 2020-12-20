import React, { useContext, useState } from "react"
import { Modal, View, Text, TouchableHighlight } from "react-native"
import { modalStyles } from "../../styles/styles"
import { Picker } from '@react-native-picker/picker'
import { GameContext } from "../../../App"

export default function NightTimeAbilitiesItemsModal({visible, setVisible}:Props) {
  const gameContext = useContext(GameContext)
  const [itemCard, setItemCard] = useState('')
  const [playerAbility, setPlayerAbility] = useState('')
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={visible} >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Picker style={{width: 250}} selectedValue={playerAbility || gameContext.playersInfo[gameContext.currentPlayerIndex].useAbility}
              onValueChange={(value) => {setPlayerAbility(value.toString())}}>
              <Picker.Item key="" label="Select an ability" value=""/>
              <Picker.Item key="Kyoko Kirigiri" label="Kyoko Kirigiri" value="Kyoko Kirigiri"/>
              <Picker.Item key="Yasuhiro Hagakure" label="Yasuhiro Hagakure" value="Yasuhiro Hagakure"/>
            </Picker>
            <Picker style={{width: 250}} selectedValue={itemCard || gameContext.playersInfo[gameContext.currentPlayerIndex].useItem}
              onValueChange={(value) => {setItemCard(value.toString())}}>
              <Picker.Item key="" label="Select an item" value=""/>
              <Picker.Item key="Glasses" label="Glasses" value="Glasses"/>
              <Picker.Item key="Someone's Graduation Album" label="Someone's Graduation Album" value="Someone's Graduation Album"/>
              <Picker.Item key="Silent Receiver" label="Silent Receiver" value="Silent Receiver"/>
            </Picker>
            <View style={{flexDirection: 'row'}}>
              <TouchableHighlight
                style={{ ...modalStyles.button, backgroundColor: "#2196F3" }}
                onPress={() => {
                  if (playerAbility !== '' || itemCard !== '') {
                    gameContext.playersInfo[gameContext.currentPlayerIndex].useAbility = playerAbility   
                    gameContext.playersInfo[gameContext.currentPlayerIndex].useItem = itemCard   
                    gameContext.playersInfo[gameContext.currentPlayerIndex].colorScheme = 'lightblue'                  
                  }
                  setPlayerAbility('')
                  setItemCard('')
                  setVisible(!visible)
                }}>
                <Text style={modalStyles.textStyle}>OK</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...modalStyles.button, backgroundColor: "#2196F3" }}
                onPress={() => { 
                  gameContext.playersInfo[gameContext.currentPlayerIndex].useAbility = ''
                  gameContext.playersInfo[gameContext.currentPlayerIndex].useItem = ''
                  gameContext.playersInfo[gameContext.currentPlayerIndex].colorScheme = 'white'
                  setPlayerAbility('')
                  setItemCard('')
                  setVisible(!visible) 
                }}>
                <Text style={modalStyles.textStyle}>Clear</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>}
