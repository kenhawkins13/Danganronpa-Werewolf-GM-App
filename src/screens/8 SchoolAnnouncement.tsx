import { Video } from "expo-av"
import React, { useState } from "react"
import { View, Image } from "react-native"
import { speechSchoolAnnouncement1 } from "../data/NightTimeDialogue"
import * as Speech from 'expo-speech'
import { useNavigation } from "@react-navigation/native"
import { video } from "../assets/video/video"

export default function SchoolAnnouncementScreen() {
  const [videoPlaying, setVideoPlaying] = useState(true)
  const { push } = useNavigation<any>()

  if (videoPlaying) {
    return (
      <View style={{flex: 1}}>
        <Video source={video[0]} shouldPlay={true} resizeMode="cover"
          style={{width: '100%', height: '100%'}} volume={0.5} onPlaybackStatusUpdate={(playbackStatus:any) => {
            if (playbackStatus.didJustFinish) { 
              setVideoPlaying(false) 
              Speech.speak(speechSchoolAnnouncement1, {onDone: () => push('NightTimeScreen')})}
            }
          }
        />
      </View>
    )    
  } else {
    return (
      <View style={{flex: 1}}>
        <Image style={{flex: 1, resizeMode: 'contain'}} source={require('../assets/background/School-Announcement.png')}/>
      </View>
    )
  }
}