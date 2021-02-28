import React, { useContext, useState } from "react"
import { Modal, TouchableHighlight, View, Text } from "react-native"
import { Picker } from '@react-native-picker/picker'
import { TextInput } from "react-native-gesture-handler"
import { modalStyles } from "../../styles/styles"
import { GameContextType } from "../../types/types"
import { GameContext } from "../../../AppContext"
import { colors } from "../../styles/colors"

export default function PlayerInfoModal({visible, setVisible, playerIndex}:Props) {
  const gameContext = useContext(GameContext)
  const [playerRole, setPlayerRole] = useState(gameContext.playersInfo[playerIndex].role)
  return (
    <Modal animationType='slide' transparent={true} visible={visible}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
            <Text style={{...modalStyles.modalText, width: 75, margin: 0}}>Name:</Text>
            <TextInput style={modalStyles.modalTextInput} placeholder={gameContext.playersInfo[playerIndex].name} maxLength={15}
              placeholderTextColor={colors.black} onChangeText={(text) => {
                text = text.trim()
                gameContext.playersInfo[playerIndex].name=text
              }}/>
          </View>
          <View style={{borderWidth: 1, borderColor: colors.black, margin: 10}}>
            <Picker style={{width: 200}} itemStyle={{fontFamily: 'goodbyeDespair'}} dropdownIconColor='#ffffff' 
            selectedValue={playerRole}  onValueChange={(value) => {setPlayerRole(value.toString())}}>
              {getPickerItems(gameContext)}
            </Picker>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight
              style={{ ...modalStyles.button}}
              onPress={() => {
                  gameContext.playersInfo[playerIndex].name = 'Player ' + (playerIndex + 1).toString()
                  gameContext.playersInfo[playerIndex].role = ''
                  gameContext.playersInfo[playerIndex].side = ''
                  gameContext.playersInfo[playerIndex].playerButtonStyle.backgroundColor = colors.blackTransparent
                  gameContext.playersInfo[playerIndex].playerButtonStyle.underlayColor = colors.blackTransparent
                  setVisible(false)
                  setPlayerRole('')
                }}>
              <Text style={modalStyles.textStyle}>Clear</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...modalStyles.button}}
              onPress={() => {
                if (playerRole !== '') {
                  gameContext.playersInfo[playerIndex].role = playerRole
                  gameContext.playersInfo[playerIndex].side = 
                    ['Spotless', 'Alter Ego', 'Ultimate Despair'].indexOf(playerRole) !== -1 ? 'Hope' : 'Despair'
                  gameContext.playersInfo[playerIndex].playerButtonStyle.backgroundColor = colors.greyTransparent
                  gameContext.playersInfo[playerIndex].playerButtonStyle.underlayColor = colors.greyTransparent
                } else {
                  gameContext.playersInfo[playerIndex].role = ''
                  gameContext.playersInfo[playerIndex].side = ''
                  gameContext.playersInfo[playerIndex].playerButtonStyle.backgroundColor = colors.blackTransparent
                  gameContext.playersInfo[playerIndex].playerButtonStyle.underlayColor = colors.blackTransparent
                }
                setPlayerRole('')
                setVisible(false)
              }}>
              <Text style={modalStyles.textStyle}>Save</Text>
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

type Props = {visible: boolean, setVisible: React.Dispatch<any>, playerIndex:number}
