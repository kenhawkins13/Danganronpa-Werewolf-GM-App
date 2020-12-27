import { Video } from "expo-av"
import React from "react"
import { Modal } from "react-native"

export default function DingDongBingBongModal({visible, setVisible, onDone}:Props) {
  return (
    <Modal style={{flex: 1}} visible={visible}>
      <Video source={require('../../assets/video/Ding-Dong-Bing-Bong.mp4')} shouldPlay={true} resizeMode="cover" style={{ width: '100%', height: '100%' }}
        onPlaybackStatusUpdate= { (playbackStatus:any) => { if (playbackStatus.didJustFinish) {
          onDone()
          setVisible(false)
        }
      }}/>
    </Modal>
  )
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>, onDone:() => void}
