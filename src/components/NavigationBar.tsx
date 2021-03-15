import { useNavigation } from "@react-navigation/native"
import React, { useContext } from "react"
import { TouchableHighlight, View, Text } from "react-native"
import { appStyle } from "../styles/styles"
import { Audio } from 'expo-av'
import { sounds } from "../assets/sounds/sounds"
import { GameContext } from "../../AppContext"

export default function NavigationBar({previousPage, nextPage, onPrevious, onNext}: Props) {
  const gameContext = useContext(GameContext)
  const { navigate } = useNavigation<any>()

  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {previousButton(navigate, previousPage, onPrevious)}
      </View>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {nextButton(navigate, nextPage, onNext)}
      </View>
    </View>
  )

  function previousButton(navigate:any, previousPage:string, onPrevious?:() => boolean) {
    return (
      <TouchableHighlight style={{...appStyle.frame, width: 150, height: 50, alignItems: 'center', justifyContent: 'center'}} 
        onPress={async () => {
          const { sound } = await Audio.Sound.createAsync(sounds.previousOption, {}, async (playbackStatus:any) => {
            if (playbackStatus.didJustFinish) { await sound.unloadAsync() }
          })
          await sound.setVolumeAsync(gameContext.musicVolume)
          await sound.playAsync()
          onButton(navigate, previousPage, onPrevious)
        }}>
        <Text style={appStyle.text}>PREVIOUS</Text>
      </TouchableHighlight>
    )
  }
  
  function nextButton(navigate:any, nextPage:string, onNext?:() => boolean) {
    return (
      <TouchableHighlight style={{...appStyle.frame, width: 150, height: 50, alignItems: 'center', justifyContent: 'center'}} 
        onPress={async () => {
          const { sound } = await Audio.Sound.createAsync(sounds.optionSelected, {}, async (playbackStatus:any) => {
            if (playbackStatus.didJustFinish) { await sound.unloadAsync() }
          })
          await sound.setVolumeAsync(gameContext.musicVolume)
          await sound.playAsync()
          onButton(navigate, nextPage, onNext)
        }}>
        <Text style={appStyle.text}>NEXT</Text>
      </TouchableHighlight>
    )
  }
  
  function onButton(navigate: any, page: string, onButton?: () => boolean) {
    if (onButton) {
      if (onButton()) {
        navigate(page)
      }
    } else {
      navigate(page)
    }
  }
}

type Props = { previousPage: string, nextPage: string, onPrevious?: () => boolean, onNext?: () => boolean }
