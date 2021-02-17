import { Video } from "expo-av"
import React from "react"
import { Modal, View } from "react-native"
import { video } from "../../assets/video/video"

export default function PunishmentTimeModal({visible, setVisible, onDone}:Props) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Video source={video[1]} shouldPlay={true} resizeMode="cover" style={{flex: 1}} volume={0.1} 
          onPlaybackStatusUpdate={async (playbackStatus:any) => {
            if (playbackStatus.didJustFinish) { onDone() }
          }}
        />
      </View>
    </Modal>
  )
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>, onDone: () => void}
