import { useIsFocused } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { CountdownCircleTimer } from "react-native-countdown-circle-timer"
import Animated from "react-native-reanimated"
import { colors } from "../styles/colors"
import { appStyle } from "../styles/styles"

let timerFlashingHandle:number

export default function CountdownTimer({timerKey, duration, onDone}:Props) {
  let lastTimeTimerBackgroundUpdated = 0

  const isFocused = useIsFocused()
  useEffect(() => {
    return function cleanup() {
      clearInterval(timerFlashingHandle)
    }
  }, [isFocused])


  return (
    <CountdownCircleTimer key={timerKey} isPlaying={true} duration={duration} size={80} strokeWidth={12} strokeLinecap='round'
    trailColor='#FFFFFF' colors='#000000' onComplete={() => {if (onDone) {onDone()}}}>
      {({ remainingTime }) => {return displayTime(remainingTime!)}}
    </CountdownCircleTimer>
  )

  function displayTime(remainingTime:number) {
    const [backgroundColor, setBackgroundColor] = useState(colors.invisible)
    let _backgroundColor = backgroundColor

    if (duration > 15 && remainingTime === 11 && remainingTime !== lastTimeTimerBackgroundUpdated) {
      lastTimeTimerBackgroundUpdated = remainingTime
      timerFlashingHandle = setInterval(() => changeBackgroundColor(), 1000)
    } else if (duration > 15 && remainingTime > 11) {
      clearInterval(timerFlashingHandle)
    }

    return (
      <View style={{height:56, width: 56, borderRadius: 50, justifyContent: 'center', alignItems: 'center', 
        backgroundColor: backgroundColor}}>
        <Animated.Text style={{...appStyle.text, fontSize: 20}}>
          {remainingTime}
        </Animated.Text>
      </View>
    )

    function changeBackgroundColor() {
      _backgroundColor = _backgroundColor === colors.invisible ? colors.pinkTransparent : colors.invisible
      setBackgroundColor(_backgroundColor)
    }
  }
}

type Props = {timerKey:string, duration:number, onDone?:() => void}