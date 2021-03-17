import React, { useState } from "react"
import { ImageBackground, View } from "react-native"
import { backgrounds } from "../assets/backgrounds/backgrounds"
import DisclaimerScreen from "./2-1 Disclaimer"
import IntroductionScreen from "./2-2 Introduction"
import CharactersScreen from "./2-3 Characters"
import RolesScreen from "./2-4 Roles"
import ItemsScreen from "./2-5 Items"
import DirectionScreen from "./2-6 Direction"

export default function SettingsScreen() {
  const [screen, setScreen] = useState('DisclaimerScreen')

  return (
    <View style={{flex: 1}}>
      <ImageBackground style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }} resizeMode='cover'
        source={backgrounds.main}>
        {Screen()}
      </ImageBackground>
    </View>
  )

  function Screen() {
    switch (screen) {
      case 'DisclaimerScreen':
        return (<DisclaimerScreen setScreen={setScreen}/>)
      case 'IntroductionScreen':
        return (<IntroductionScreen setScreen={setScreen}/>)
      case 'CharactersScreen':
        return (<CharactersScreen setScreen={setScreen}/>)
      case 'RolesScreen':
        return (<RolesScreen setScreen={setScreen}/>)
      case 'ItemsScreen':
        return (<ItemsScreen setScreen={setScreen}/>)
      case 'DirectionScreen':
        return (<DirectionScreen setScreen={setScreen}/>)
      default:
        return (<></>)
    }
  }
}