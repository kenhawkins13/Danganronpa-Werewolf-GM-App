import React from "react";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Animated from "react-native-reanimated";

export default function CountdownTimer({timerKey, duration, callback}:Props) {
  return (
    <CountdownCircleTimer key={timerKey} isPlaying={true} duration={duration} size={100} strokeWidth={10} strokeLinecap='square' colors={[
        ['#004777', 0.4],
        ['#F7B801', 0.4],
        ['#A30000', 0.2],
      ]} onComplete={() => {if (callback) {callback()}}}
    >
      {({ remainingTime }) => (
        <Animated.Text style={{ color: 'black' }}>
          {remainingTime}
        </Animated.Text>
      )}
    </CountdownCircleTimer>
  )
}

type Props = {timerKey:string, duration:number, callback?:() => void}