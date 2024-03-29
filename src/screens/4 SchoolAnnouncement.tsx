import { Video } from "expo-av"
import React, { useContext } from "react"
import { View } from "react-native"
import { nightTimeSpeech } from "../data/Speeches"
import * as Speech from 'expo-speech'
import { useNavigation } from "@react-navigation/native"
import { videos } from "../assets/videos/videos"
import { GameContext } from "../../AppContext"

export default function SchoolAnnouncementScreen() {
  const gameContext = useContext(GameContext)
  const { navigate } = useNavigation<any>()

  return (
    <View style={{flex: 1}}>
      <Video source={videos[0]} shouldPlay={true} resizeMode="cover"
        style={{width: '100%', height: '100%'}} volume={gameContext.musicVolume} onPlaybackStatusUpdate={async (playbackStatus:any) => {
          if (playbackStatus.didJustFinish) {
            await speakThenPause(nightTimeSpeech().schoolAnnouncement1, 3, async () => {
              await speakThenPause(nightTimeSpeech().schoolAnnouncement7, 3, () => {
                navigate('GameScreen')
              })
            })
          }
        }}
      />
    </View>
  )
}

const sleep = (milliseconds:number) => new Promise(res => setTimeout(res, milliseconds))

async function speakThenPause(speech:string, seconds:number=0, onDone?:() => void) {
  const callback = async(seconds:number) => {
    await sleep(seconds * 1000)
    if (onDone) { onDone() }
  }
  Speech.speak(speech, {onDone: () => {callback(seconds)}})
}