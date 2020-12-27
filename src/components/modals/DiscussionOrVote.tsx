import React from "react"
import { Modal, View, Text, TouchableHighlight } from "react-native"
import { modalStyles } from "../../styles/styles"

export default function DiscussionOrVoteModal({visible, setVisible, onDiscussion, onVote}:Props) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalText}>Would you like a have a 1 minute discussion{"\n"}or go straight to the re-vote?</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight style={{...modalStyles.button}} onPress={() => {
                setVisible(false)
                onDiscussion()
              }}>
              <Text style={modalStyles.textStyle}>Discuss</Text>
            </TouchableHighlight>
            <TouchableHighlight style={{...modalStyles.button}} onPress={() => {
                setVisible(false)
                onVote()
              }}>
              <Text style={modalStyles.textStyle}>Vote</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  )
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>, onDiscussion:() => void, onVote:() => void}
