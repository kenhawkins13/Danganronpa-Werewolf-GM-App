import React, { useState } from "react";
import { ImageBackground, View } from "react-native";
import { backgrounds } from "../assets/backgrounds/backgrounds";
import DayTimeScreen from "./5-2 DayTime";
import MorningTimeScreen from "./5-1 MorningTime";
import NightTimeScreen from "./5-3 NightTime";
import PunishmentTimeScreen from "./5-4 PunishmentTime";

export default function GameScreen() {
  const [screen, setScreen] = useState('NightTimeScreen')

  return (
    <View style={{flex: 1}}>
      <ImageBackground style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }} resizeMode='cover'
        source={backgrounds.main}>
        {Screen()}
      </ImageBackground>
    </View>
  )

  function Screen() {
    if (screen === 'NightTimeScreen') {
      return (<NightTimeScreen setScreen={setScreen}/>)
    } else if (screen === 'MorningTimeScreen') {
      return (<MorningTimeScreen setScreen={setScreen}/>)
    } else if (screen === 'DayTimeScreen') {
      return (<DayTimeScreen setScreen={setScreen}/>)
    } else if (screen === 'PunishmentTimeScreen') {
      return (<PunishmentTimeScreen setScreen={setScreen}/>)
    } else {
      return (<></>)
    }
  }
}