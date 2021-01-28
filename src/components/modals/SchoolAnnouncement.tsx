import React from "react"
import { Modal, Image } from "react-native"

export default function SchoolAnnouncementModal({visible}:Props) {
  return (
    <Modal style={{flex: 1}} visible={visible}>
      <Image style={{flex: 1, resizeMode: 'contain'}} source={require('../../assets/background/School-Announcement.png')}/>
    </Modal>
  )
}

type Props = {visible:boolean}
