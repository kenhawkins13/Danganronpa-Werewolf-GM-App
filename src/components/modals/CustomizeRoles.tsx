import React, { useContext, useState } from "react"
import { Modal, TouchableHighlight, View, Text } from "react-native"
import { Picker } from '@react-native-picker/picker'
import { modalStyles } from "../../styles/styles"
import { GameContext } from "../../../AppContext"
import { colors } from "../../styles/colors"
import { calculateRoles } from "../../data/Table"

export default function CustomizeRolesModal({visible, setVisible}:Props) {
  const gameContext = useContext(GameContext)
  const [mode, setMode] = useState(gameContext.customizeRolesMode)
  
  return (
    <Modal animationType='slide' transparent={true} visible={visible}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
            <Text style={{...modalStyles.modalText}}>Customize Roles</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{...modalStyles.modalText, textAlignVertical: 'center'}}>Mode:</Text>
            <View style={{borderWidth: 1, borderColor: colors.black, margin: 10}}>
              <Picker style={{width: 150}} itemStyle={{fontFamily: 'goodbyeDespair'}} dropdownIconColor='#ffffff' 
              selectedValue={mode} onValueChange={(value) => {
                  setMode(String(value))
                }}>
                  {getPickerItems()}
              </Picker>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight
              style={{ ...modalStyles.button}}
              onPress={() => {
                  setMode(gameContext.customizeRolesMode)
                  setVisible(false)
                }}>
              <Text style={modalStyles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...modalStyles.button}}
              onPress={() => {
                gameContext.customizeRolesMode = mode
                gameContext.roleCountAll = calculateRoles(mode, gameContext.playerCount)
                setVisible(false)
              }}>
              <Text style={modalStyles.textStyle}>Save</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  )

  function getPickerItems() {
    const pickerItems:JSX.Element[] = []
    switch (gameContext.mode) {
      case 'maniax':
        pickerItems.push(<Picker.Item key='maniax with Monomi' label='MANIAX with Monomi' value='maniax with Monomi'/>)
        pickerItems.push(<Picker.Item key='maniax' label='MANIAX' value='maniax'/>)
      case 'extreme':
        pickerItems.push(<Picker.Item key='extreme' label='EXTREME' value='extreme'/>)
      case 'normal':
        pickerItems.push(<Picker.Item key='normal' label='NORMAL' value='normal'/>)
    }
    return pickerItems.reverse()
  }
}

type Props = {visible: boolean, setVisible: React.Dispatch<any>}
