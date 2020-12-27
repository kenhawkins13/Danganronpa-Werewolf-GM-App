import React from "react"
import { Modal, View, Text, TouchableHighlight } from "react-native"
import { modalStyles } from "../../styles/styles"

export default function AlertModal({visible, setVisible}:Props) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={{...modalStyles.modalText, margin: 10}}>
            Oops, the roles didn't add up.{"\n"}Have everyone re-enter their roles
          </Text>
          <TouchableHighlight
            style={{...modalStyles.button}}
            onPress={() => { setVisible(!visible) }}>
            <Text style={modalStyles.textStyle}>OK</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  )
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>}
