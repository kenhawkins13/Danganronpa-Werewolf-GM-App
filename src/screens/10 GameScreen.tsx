import React, { useState } from "react";
import { ImageBackground, View } from "react-native";
import { backgrounds } from "../assets/backgrounds/backgrounds";
import DayTimeScreen from "./10 DayTime";
import MorningTimeScreen from "./10 MorningTime";
import NightTimeScreen from "./10 NightTime";

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
      return (<NightTimeScreen setTime={setScreen}/>)
    } else if (screen === 'MorningTimeScreen') {
      return (<MorningTimeScreen setTime={setScreen}/>)
    } else if (screen === 'DayTimeScreen') {
      return (<DayTimeScreen setTime={setScreen}/>)
    } else {
      return (<></>)
    }
  }
}