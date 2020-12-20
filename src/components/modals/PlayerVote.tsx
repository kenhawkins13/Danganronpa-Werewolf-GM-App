import React, { useContext, useState } from "react"
import { Modal, View, Text, TouchableHighlight } from "react-native"
import { modalStyles } from "../../styles/styles"
import { Picker } from '@react-native-picker/picker'
import { GameContext } from "../../../App"
import { GameContextType } from "../../types/types"

export default function PlayerVoteModal({visible, setVisible, onOk}:Props) {
  const gameContext = useContext(GameContext)
  const [playerVote, setPlayerVote] = useState(-1)
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={visible} >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text>Who received the most votes:</Text>
            <Picker style={{width: 200}} selectedValue={playerVote} onValueChange={(value) => { setPlayerVote(parseInt(value.toString())) }}>
              {getPickerItems(gameContext)}
            </Picker>
            <View style={{flexDirection: 'row'}}>
              <TouchableHighlight
                style={{ ...modalStyles.button, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setVisible(false)
                  onOk(playerVote)
                }}>
                <Text style={modalStyles.textStyle}>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

function getPickerItems(gameContext:GameContextType) {
  const pickerItems:JSX.Element[] = []
  pickerItems.push(<Picker.Item key='-1' label='Tie' value='-1'/>)
  gameContext.playersInfo.forEach(playerInfo => {
    if (playerInfo.alive === true) {
      pickerItems.push(<Picker.Item key={playerInfo.playerIndex} label={playerInfo.name} value={playerInfo.playerIndex}/>)
    }
  })
  return pickerItems
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>, onOk:(value:number) => void}
