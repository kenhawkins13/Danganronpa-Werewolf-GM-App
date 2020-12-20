import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { GameContext } from '../../App'
import NavigationBar from '../components/NavigationBar'

export default function IntroductionScreen() {
  const gameContext = useContext(GameContext)
  
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 9 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#cc0066' }}>
          <Text>
            “Welcome to Danganronpa Werewolf. We are Japanese high school students that are being held
            captive inside of our school by the headmaster and the only way the headmaster will allow us to
            leave is if one of us kills another classmate and is not discovered by his classmates. But surely,
            we will all maintain hope, trust each other, and not lose ourselves to despair, right?”
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
          <Text>
            Distribute one Character Card to each player and have each character introduce themselves by giving
            their name, their gender, their ultimate title, {extraText(gameContext.mode)} and optionally their quotes.
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <NavigationBar previousPage='SettingsScreen' nextPage='RolesScreen'></NavigationBar>
      </View>
    </View>
  )
}

function extraText(Mode:string) {
  if (Mode === 'normal') {
    return ''
  } else if (Mode === 'extreme') {
    return 'their character ability,'
  }
}
