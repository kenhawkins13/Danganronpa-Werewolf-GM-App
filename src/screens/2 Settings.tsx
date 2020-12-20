import React, { useContext, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import {Picker} from '@react-native-picker/picker'
import SwitchSelector from 'react-native-switch-selector'
import { GameContext } from '../../App'
import NavigationBar from '../components/NavigationBar'
import { GameContextType } from '../types/types';
import { calculateRoles, requiredKills } from '../data/Table'
import { useIsFocused } from '@react-navigation/native'

export default function SettingsScreen() {
  const [gameMode, setGameMode] = useState(0)
  const [playerCount, setPlayerCount] = useState(4)
  const gameContext = useContext(GameContext)

  // Check if screen is focused
  const isFocused = useIsFocused()
  // Listen for isFocused. If useFocused changes, force re-render by setting state
  useEffect(() => { if (isFocused) {
    setGameMode(0)
    setPlayerCount(4)
  }}, [isFocused])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 9 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#cc0066' }}>
          <View>
            <Text>Mode:</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <SwitchSelector
              initial={0}
              value={gameMode}
              onPress={(value) => {
                setGameMode(value as number)
                gameContext.mode = value === 0 ? 'normal' : 'extreme'
              }}
              textColor='black'
              selectedColor='white'
              buttonColor='#cc0066'
              borderColor='black'
              borderRadius={20}
              hasPadding={true}
              style={{width: 200, height: 100}}
              options={[
                { label: 'NORMAL', value: 0 },
                { label: 'EXTREME', value: 1 }
              ]}
            />
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
          <View>
            <Text>Number of Players:</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Picker style={{width: 100}} selectedValue={gameContext.playerCount = playerCount}
              onValueChange={(value) => {
                value = parseInt(value.toString())
                gameContext.playerCount = value
                setPlayerCount(value)
              }}>
              <Picker.Item key='4' label='4' value={4}/>
              <Picker.Item key='5' label='5' value={5}/>
              <Picker.Item key='6' label='6' value={6}/>
              <Picker.Item key='7' label='7' value={7} />
              <Picker.Item key='8' label='8' value={8} />
              <Picker.Item key='9' label='9' value={9} />
              <Picker.Item key='10' label='10' value={10} />
              <Picker.Item key='11' label='11' value={11} />
              <Picker.Item key='12' label='12' value={12} />
              <Picker.Item key='13' label='13' value={13} />
              <Picker.Item key='14' label='14' value={14} />
              <Picker.Item key='15' label='15' value={15} />
              <Picker.Item key='16' label='16' value={16} />
            </Picker>
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <NavigationBar previousPage='StartScreen' nextPage='IntroductionScreen' callback={function() {return fillContextInfo(gameContext)}}></NavigationBar>
      </View>
    </View>
  )
}

function fillContextInfo(gameContext:GameContextType) {
  gameContext.roleCounts = calculateRoles(gameContext.mode, gameContext.playerCount)
  gameContext.killsRequired = requiredKills(gameContext.playerCount)
  // Delete existing data
  while (gameContext.playersInfo.length > 0) {
    gameContext.playersInfo.pop()
  }
  for (let i = 0; i < gameContext.playerCount; i++) {
    gameContext.playersInfo.push({
      playerIndex: i,
      name: 'Player ' + (i+1).toString(),
      side: '',
      role: '',
      alive: true,
      colorScheme: 'lightblue',
      useAbility: '',
      useItem: ''
    })
  }
  return true
}
