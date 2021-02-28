import React, { useContext, useState } from "react"
import { Modal, View, Text, TouchableHighlight } from "react-native"
import { modalStyles } from "../../styles/styles"
import { Picker } from '@react-native-picker/picker'
import { GameContext } from "../../../AppContext"
import { colors } from "../../styles/colors"

export default function NightTimeAbilitiesItemsModal({visible, setVisible, playerIndex}:Props) {
  const gameContext = useContext(GameContext)
  const [itemCard, setItemCard] = useState('')
  const [playerAbility, setPlayerAbility] = useState('')
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={visible} >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={{...modalStyles.modalText}}>Enter Abilties or Items</Text>
            <View style={{borderWidth: 1, margin: 10}}>
              <Picker style={{width: 250, borderWidth: 1, borderColor: colors.black}} selectedValue={playerAbility}
                onValueChange={(value) => {setPlayerAbility(value.toString())}}>
                <Picker.Item key="" label="Select an ability" value=""/>
                {KyokoKirigiri()}
                <Picker.Item key="Yasuhiro Hagakure" label="Yasuhiro Hagakure" value="Yasuhiro Hagakure"/>
              </Picker>
            </View>
            <View style={{borderWidth: 1, margin: 10}}>
              <Picker style={{width: 250, borderWidth: 1}} selectedValue={itemCard}
                onValueChange={(value) => {setItemCard(value.toString())}}>
                <Picker.Item key="" label="Select an item" value=""/>
                <Picker.Item key="Glasses" label="Glasses" value="Glasses"/>
                <Picker.Item key="Someone's Graduation Album" label="Someone's Graduation Album" value="Someone's Graduation Album"/>
                <Picker.Item key="Silent Receiver" label="Silent Receiver" value="Silent Receiver"/>
              </Picker>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableHighlight
                style={{...modalStyles.button}}
                onPress={() => { 
                  gameContext.playersInfo[playerIndex].useAbility = ''
                  gameContext.playersInfo[playerIndex].useItem = ''
                  gameContext.playersInfo[playerIndex].playerButtonStyle.backgroundColor = colors.blackTransparent
                  setPlayerAbility('')
                  setItemCard('')
                  setVisible(!visible) 
                }}>
                <Text style={modalStyles.textStyle}>Clear</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{...modalStyles.button}}
                onPress={() => {
                  gameContext.playersInfo[playerIndex].useAbility = playerAbility
                  gameContext.playersInfo[playerIndex].useItem = itemCard
                  if (playerAbility !== '' || itemCard !== '') {
                    gameContext.playersInfo[playerIndex].playerButtonStyle.backgroundColor = colors.greyTransparent
                    gameContext.playersInfo[playerIndex].playerButtonStyle.underlayColor = colors.greyTransparent
                  } else {
                    gameContext.playersInfo[playerIndex].playerButtonStyle.backgroundColor = colors.blackTransparent
                    gameContext.playersInfo[playerIndex].playerButtonStyle.underlayColor = colors.blackTransparent
                  }
                  setPlayerAbility('')
                  setItemCard('')
                  setVisible(!visible)
                }}>
                <Text style={modalStyles.textStyle}>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
  function KyokoKirigiri() {
    if (gameContext.dayNumber >= 4) {
      return (<Picker.Item key="Kyoko Kirigiri" label="Kyoko Kirigiri" value="Kyoko Kirigiri"/>)
    } else {
      return (null)
    }
  }
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>, playerIndex:number}
