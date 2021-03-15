import * as Speech from 'expo-speech'
import React, { useContext, useState } from "react"
import { Image, TouchableHighlight } from "react-native"
import { GameContext } from '../../AppContext'
import { images } from '../assets/images/images'
import { colors } from "../styles/colors"
import { iconStyles } from "../styles/styles"

export default function SpeakerButton({speech, color=colors.white}:Props) {
  const gameContext = useContext(GameContext)
  const [speakerColor, setSpeakerColor] = useState(color)

  return (
    <TouchableHighlight style={{...iconStyles.speaker, borderColor: speakerColor}}  
      onPress={async() => {
        if (await Speech.isSpeakingAsync() === true) {
          if (gameContext.backgroundMusic) {
            gameContext.backgroundMusic.setVolumeAsync(gameContext.musicVolume)
          }
          setSpeakerColor(color)
          await Speech.stop()
        } else {
          if (gameContext.backgroundMusic) {
            await gameContext.backgroundMusic.setVolumeAsync(gameContext.musicVolume / 5)
          }
          setSpeakerColor(colors.greyTransparent)
          Speech.speak(speech, {onDone: () => {
            if (gameContext.backgroundMusic) {
              gameContext.backgroundMusic.setVolumeAsync(gameContext.musicVolume)
            }
            setSpeakerColor(color)
          }})
        }
      }}>
      <Image style={{height: 20, width: 20, tintColor: speakerColor}} source={images.speaker}/>
    </TouchableHighlight>
  )
}


type Props = {speech:string, color?:string}