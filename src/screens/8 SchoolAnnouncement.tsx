import { Video } from "expo-av"
import React, { useState } from "react"
import { View, Image } from "react-native"
import { nightTimeSpeech } from "../data/Speeches"
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
          style={{width: '100%', height: '100%'}} volume={0.1} onPlaybackStatusUpdate={async (playbackStatus:any) => {
            if (playbackStatus.didJustFinish) {
              setVideoPlaying(false) 
              await speakThenPause(nightTimeSpeech.schoolAnnouncement1, 3, async () => {
                await speakThenPause(nightTimeSpeech.everyoneSleep2, 3, () => {
                  push('GameScreen')
                })
              })
            }
          }}
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

const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

async function speakThenPause(speech:string, seconds:number=0, onDone?:() => void) {
  const callback = async(seconds:number) => {
    await sleep(seconds * 1000)
    if (onDone) { onDone() }
  }
  Speech.speak(speech, {onDone: () => {callback(seconds)}})
}