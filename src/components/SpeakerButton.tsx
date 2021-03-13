import * as Speech from 'expo-speech'
import React, { useState } from "react"
import { Image, TouchableHighlight } from "react-native"
import { images } from '../assets/images/images'
import { colors } from "../styles/colors"
import { iconStyles } from "../styles/styles"

export default function SpeakerButton({speech}:Props) {
  const [speakerColor, setSpeakerColor] = useState(colors.white)

  return (
    <TouchableHighlight style={{...iconStyles.speaker, borderColor: speakerColor}}  
      onPress={async() => {
        if (await Speech.isSpeakingAsync() === true) {
          setSpeakerColor(colors.white)
          await Speech.stop()
        } else {
          setSpeakerColor(colors.greyTransparent)
          Speech.speak(speech, {onDone: () => setSpeakerColor(colors.white)})
        }
      }}>
      <Image style={{height: 20, width: 20, tintColor: speakerColor}} source={images.speaker}/>
    </TouchableHighlight>
  )
}


type Props = {speech:string}