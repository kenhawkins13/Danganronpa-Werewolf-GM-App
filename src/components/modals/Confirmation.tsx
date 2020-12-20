import React from "react"
import { View, Text, TouchableHighlight, Modal } from "react-native"
import { modalStyles } from "../../styles/styles"

export default function Confirmation({visible, setVisible, text, onYes, onNo}:Props) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View  style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalText}>{text}</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight style={{ ...modalStyles.button, backgroundColor: "#2196F3" }} onPress={() => {
                setVisible(false)
                onYes() 
              }}>
              <Text style={modalStyles.textStyle}>Yes</Text>
            </TouchableHighlight>
            <TouchableHighlight style={{ ...modalStyles.button, backgroundColor: "#2196F3" }} onPress={() => { 
                setVisible(false)
                onNo()
              }}>
              <Text style={modalStyles.textStyle}>No</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  )
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>, text:string, onYes:() => void, onNo:() => void}