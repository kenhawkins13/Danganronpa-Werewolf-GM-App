import { Video } from "expo-av"
import React from "react"
import { Modal, View } from "react-native"
import { videos } from "../../assets/videos/videos"

export default function PunishmentTimeModal({visible, onDone}:Props) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Video source={videos[1]} shouldPlay={true} resizeMode="cover" style={{flex: 1}} volume={0.1} 
          onPlaybackStatusUpdate={async (playbackStatus:any) => {
            if (playbackStatus.didJustFinish) { onDone() }
          }}
        />
      </View>
    </Modal>
  )
}

type Props = {visible:boolean, onDone: () => void}
