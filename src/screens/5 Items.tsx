import React, { useContext } from 'react'
import { View, Text, Image, } from 'react-native'
import { GameContext } from '../../App'
import NavigationBar from '../components/NavigationBar'

export default function ItemsScreen() {
  const gameContext = useContext(GameContext)
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 9 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#cc0066' }}>
            <Text>
              {getText(gameContext.mode)}
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            <Image
              style={{ width: 100, height: 140 }}
              source={require('../assets/Item Cards/Alter Ball.png')}
            />
            <Image
              style={{ width: 100, height: 140 }}
              source={require('../assets/Item Cards/Item Card.jpg')}
            />
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <NavigationBar previousPage='RolesScreen' nextPage='NightTimeScreen'></NavigationBar>
      </View>
    </View>
  )
}

function getText(mode:string) {
  if (mode === 'extreme') {
    return `
Randomly distribute two Item Cards to each player. Each player has the \
option to return both Item Cards and draw two new Item Cards. You cannot redraw just one Item Card. \
\n \n
You cannot hold more than two cards during the game. If you ever obtain more than two cards, discard \
down to two cards first before continuing.
    `
  } else {
    return `
Since you selected Normal Mode, please skip this section as you will not use Item Cards
    `
  }
}
