import { Video } from "expo-av"
import React, { useContext } from "react"
import { View } from "react-native"
import { videos } from "../assets/videos/videos"
import { GameContext } from "../../AppContext"

export default function PunishmentTimeScreen({setScreen}:Props) {
  const gameContext = useContext(GameContext)

  return (
    <View style={{flex: 1}}>
      <Video source={videos[1]} shouldPlay={true} resizeMode="cover"
        style={{width: '100%', height: '100%'}} volume={gameContext.musicVolume} onPlaybackStatusUpdate={async (playbackStatus:any) => {
          if (playbackStatus.didJustFinish) { setScreen('DayTimeScreen') }
        }}
      />
    </View>
  )
}

type Props = {setScreen:React.Dispatch<any>}