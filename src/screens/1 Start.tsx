import React, { useContext } from 'react'
import { Text, View, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'
import { GameContext } from '../../App'

export default function StartScreen () {
  const gameContext = useContext(GameContext)
  const navigation = useNavigation()
  gameContext.mode = 'normal'
  gameContext.playerCount = 4
  gameContext.killsRequired = 0
  gameContext.roleCounts = []
  gameContext.playersInfo = []
  gameContext.dayNumber = 0
  gameContext.blackenedAttack = -1
  gameContext.alterEgoAlive = true
  gameContext.monomiExploded = false
  gameContext.monomiProtect = -1,
  gameContext.vicePlayed = false,
  gameContext.currentPlayerIndex = 0

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#cc0066' }}>
        <Text>Danganronpa 1·2 Ultimate High School Werewolf</Text>
        <Text>ダンガンロンパ１·２ 超高校級の人狼</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <Button title='Start Game' onPress={() => {
          Speech.speak('Start Game')  // Necessary to speak once or `await Speech.isSpeakingAsync()` doesn't work 1st time
          navigation.navigate('SettingsScreen')
        }}/>
      </View>
    </View>
  )
}
