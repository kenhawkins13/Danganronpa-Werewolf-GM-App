import { useNavigation } from "@react-navigation/native"
import React from "react"
import { TouchableHighlight, View, Text } from "react-native"
import { pinkTransparent } from "../styles/colors"
import { appStyle } from "../styles/styles"
import { Audio } from 'expo-av'
import { sounds } from "../assets/sounds/sounds"

export default function NavigationBar({previousPage, nextPage, onPrevious, onNext}: Props) {
  const navigation = useNavigation()
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {previousButton(navigation, previousPage, onPrevious)}
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {nextButton(navigation, nextPage, onNext)}
        </View>
      </View>
    )
}

function previousButton(navigation:any, previousPage:string, onPrevious?:() => boolean) {
  return (
    <TouchableHighlight style={{...appStyle.frame, width: 150, height: 50, alignItems: 'center', justifyContent: 'center'}} 
      onPress={async () => {
        const { sound } = await Audio.Sound.createAsync(sounds.previousOption, {}, async (playbackStatus:any) => {
          if (playbackStatus.didJustFinish) { await sound.unloadAsync() }
        })
        await sound.playAsync()
        await sound.setVolumeAsync(.1)
        onButton(navigation, previousPage, onPrevious)
      }}>
      <Text style={appStyle.text}>PREVIOUS</Text>
    </TouchableHighlight>
  )
}

function nextButton(navigation:any, nextPage:string, onNext?:() => boolean) {
  if (nextPage === 'NightTimeScreen') {
    return (
      <TouchableHighlight style={{...appStyle.frame, width: 150, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: pinkTransparent}} 
        onPress={async () => {
          const { sound } = await Audio.Sound.createAsync(sounds.optionSelected, {}, async (playbackStatus:any) => {
            if (playbackStatus.didJustFinish) { await sound.unloadAsync() }
          })
          await sound.playAsync()
          await sound.setVolumeAsync(.1)
          onButton(navigation, nextPage, onNext)
        }}>
        <Text style={appStyle.text}>START</Text>
      </TouchableHighlight>
    )    
  } else {
    return (
      <TouchableHighlight style={{...appStyle.frame, width: 150, height: 50, alignItems: 'center', justifyContent: 'center'}} 
        onPress={async () => {
          const { sound } = await Audio.Sound.createAsync(sounds.optionSelected, {}, async (playbackStatus:any) => {
            if (playbackStatus.didJustFinish) { await sound.unloadAsync() }
          })
          await sound.playAsync()
          await sound.setVolumeAsync(.1)
          onButton(navigation, nextPage, onNext)
        }}>
        <Text style={appStyle.text}>NEXT</Text>
      </TouchableHighlight>
    )
  }
}

function onButton(navigation: any, page: string, onButton?: () => boolean) {
  if (onButton) {
    if (onButton()) {
      navigation.navigate(page)
    }
  } else {
    navigation.navigate(page)
  }
}

type Props = { previousPage: string, nextPage: string, onPrevious?: () => boolean, onNext?: () => boolean }
