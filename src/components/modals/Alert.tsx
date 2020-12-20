import React from "react"
import { Modal, View, Text, TouchableHighlight } from "react-native"
import { modalStyles } from "../../styles/styles"

export default function AlertModal({modalVisible, setModalVisible}:Props) {
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>Oops, the roles didn't add up. Have everyone re-enter their roles</Text>
            <TouchableHighlight
              style={{ ...modalStyles.button, backgroundColor: "#2196F3" }}
              onPress={() => { setModalVisible(!modalVisible) }}>
              <Text style={modalStyles.textStyle}>OK</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
};

type Props = {modalVisible:boolean, setModalVisible:React.Dispatch<any>}
