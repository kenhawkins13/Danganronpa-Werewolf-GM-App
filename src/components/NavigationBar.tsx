import { useNavigation } from "@react-navigation/native"
import React, { useContext } from "react"
import { TouchableHighlight, View, Text } from "react-native"
import { appStyle } from "../styles/styles"
import { Audio } from 'expo-av'
import { sounds } from "../assets/sounds/sounds"
import { GameContext } from "../../AppContext"

export default function NavigationBar({onPrevious, onNext}: Props) {
  const gameContext = useContext(GameContext)

  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {button('PREVIOUS', onPrevious, sounds.previousOption)}
      </View>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {button('NEXT', onNext, sounds.optionSelected)}
      </View>
    </View>
  )

  function button(buttonText:string, onClick:() => void, soundSource:any) {
    return (
      <TouchableHighlight style={{...appStyle.frame, width: 150, height: 50, alignItems: 'center', justifyContent: 'center'}} 
        onPress={async () => {
          const { sound } = await Audio.Sound.createAsync(soundSource, {}, async (playbackStatus:any) => {
            if (playbackStatus.didJustFinish) { await sound.unloadAsync() }
          })
          await sound.setVolumeAsync(gameContext.musicVolume)
          await sound.playAsync()
          onClick()
        }}>
        <Text style={appStyle.text}>{buttonText}</Text>
      </TouchableHighlight>
    )
  }
}

type Props = {onPrevious: () => void, onNext: () => void}