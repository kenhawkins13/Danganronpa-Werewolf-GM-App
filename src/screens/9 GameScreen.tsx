import React, { useState } from "react";
import { ImageBackground, View } from "react-native";
import DayTimeScreen from "./9 DayTime";
import MorningTimeScreen from "./9 MorningTime";
import NightTimeScreen from "./9 NightTime";

export default function GameScreen() {
  const [screen, setScreen] = useState('NightTimeScreen')

  return (
    <View style={{flex: 1}}>
      <ImageBackground style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }} resizeMode='cover'
        source={require('../assets/background/Setup.png')}>
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