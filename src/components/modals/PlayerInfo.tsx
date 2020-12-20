import React, { useContext, useState } from "react"
import { Modal, TouchableHighlight, View, Text } from "react-native"
import { Picker } from '@react-native-picker/picker'
import { GameContext } from "../../../App"
import { TextInput } from "react-native-gesture-handler"
import { modalStyles } from "../../styles/styles"
import { GameContextType } from "../../types/types"

export default function PlayerInfoModal({visible, setVisible}:Props) {
  const gameContext = useContext(GameContext)
  const [playerRole, setPlayerRole] = useState(gameContext.playersInfo[gameContext.currentPlayerIndex].role)
  return (
    <Modal animationType='slide' transparent={true} visible={visible}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalText}>Name:</Text>
          <TextInput style={modalStyles.modalTextInput} placeholder={gameContext.playersInfo[gameContext.currentPlayerIndex].name} 
            onChangeText={(text) => gameContext.playersInfo[gameContext.currentPlayerIndex].name=text}/>
          <Picker style={{width: 200}} selectedValue={playerRole} onValueChange={(value) => {setPlayerRole(value.toString())}}>
            {getPickerItems(gameContext)}
          </Picker>
          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight
              style={{ ...modalStyles.button, backgroundColor: '#2196F3'}}
              onPress={() => {
                gameContext.playersInfo[gameContext.currentPlayerIndex].role = playerRole
                gameContext.playersInfo[gameContext.currentPlayerIndex].side = 
                  ['Spotless', 'Alter Ego', 'Ultimate Despair'].indexOf(playerRole) !== -1 ? 'Hope' : 'Despair'
                gameContext.playersInfo[gameContext.currentPlayerIndex].colorScheme = 'blue'
                setVisible(false)
                setPlayerRole('')
              }}>
              <Text style={modalStyles.textStyle}>Save</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...modalStyles.button, backgroundColor: '#2196F3'}}
              onPress={() => {
                  gameContext.playersInfo[gameContext.currentPlayerIndex].name = 'Player ' + (gameContext.currentPlayerIndex + 1).toString()
                  gameContext.playersInfo[gameContext.currentPlayerIndex].role = ''
                  gameContext.playersInfo[gameContext.currentPlayerIndex].side = ''
                  gameContext.playersInfo[gameContext.currentPlayerIndex].colorScheme = 'lightblue'
                  setVisible(false)
                }}>
              <Text style={modalStyles.textStyle}>Clear</Text>
            </TouchableHighlight>
            </View>
        </View>
      </View>
    </Modal>
  )
}

function getPickerItems(gameContext:GameContextType) {
  const pickerItems:JSX.Element[] = []
  pickerItems.push(<Picker.Item key='' label='Select Your Role' value=''/>)
  gameContext.roleCounts.forEach(neededRole  => {
    if (neededRole.count != 0) {
      neededRole.roles.forEach(role => {
        // if role does not exist in pickerItems, push new pickerItem
        if (pickerItems.find((value) => { return value.key === role }) == undefined) {
          pickerItems.push(<Picker.Item key={role} label={role} value={role}/>)
        }
      })
    }
  })
  return pickerItems
}

type Props = {visible: boolean, setVisible: React.Dispatch<any>}
