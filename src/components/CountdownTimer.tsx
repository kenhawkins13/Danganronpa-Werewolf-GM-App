import React from "react"
import { View } from "react-native"
import { CountdownCircleTimer } from "react-native-countdown-circle-timer"
import Animated from "react-native-reanimated"
import { greyTransparent } from "../styles/colors"
import { appStyle } from "../styles/styles"

export default function CountdownTimer({timerKey, duration, onDone}:Props) {
  return (
    <CountdownCircleTimer key={timerKey} isPlaying={true} duration={duration} size={100} strokeWidth={12} strokeLinecap='round'
    trailColor='#ffffff' colors='#000000' onComplete={() => {if (onDone) {onDone()}}}>
        {({ remainingTime }) => (
          <Animated.Text style={{...appStyle.text, fontSize: 20}}>
            {remainingTime}
          </Animated.Text>
        )}
    </CountdownCircleTimer>
  )
}

type Props = {timerKey:string, duration:number, onDone?:() => void}