import React from "react"
import { View, Text, TouchableHighlight, Modal } from "react-native"
import { modalStyles } from "../../styles/styles"

export default function ConfirmationMorning({visible, setVisible, text, onYes, onNo, amuletVisible, onAmulet}:Props) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View  style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalText}>{text}</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight style={{...modalStyles.button}} onPress={() => {
                setVisible(false)
                onYes()
              }}>
              <Text style={modalStyles.textStyle}>Yes</Text>
            </TouchableHighlight>
            <TouchableHighlight style={{...modalStyles.button}} onPress={() => { 
                setVisible(false)
                onNo()
              }}>
              <Text style={modalStyles.textStyle}>No</Text>
            </TouchableHighlight>
          </View>
          <AmuletOfTakejinButton visible={amuletVisible} setModalVisible={setVisible} onAmulet={onAmulet}/>
        </View>
      </View>
    </Modal>
  )
}

function AmuletOfTakejinButton({visible, setModalVisible, onAmulet}:AmuletOfTakejinButtonProps) {
  if (visible) {
    return (
      <View>
        <TouchableHighlight style={{...modalStyles.button, width: 150}} onPress={() => { 
          setModalVisible(false)
          onAmulet()
          }}>
          <Text style={modalStyles.textStyle}>Amulet of Takejin</Text>
        </TouchableHighlight>
      </View>
    )
  } else {
    return (<></>)
  }
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>, text:string, onYes:() => void, onNo:() => void, amuletVisible:boolean, onAmulet:() => void}
type AmuletOfTakejinButtonProps = {visible:boolean, setModalVisible:React.Dispatch<any>, onAmulet:() => void}