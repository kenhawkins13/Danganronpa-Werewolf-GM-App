import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, ImageBackground, TouchableHighlight } from 'react-native'
import { GameContext } from '../../AppContext'
import { GameContextType, RoleCount } from '../types/types'
import AlertModal from '../components/modals/Alert'
import PlayerInfoModal from '../components/modals/PlayerInfo'
import PlayersPage from '../components/PlayersPage'
import { blackTransparent, darkGrey, greyTransparent, pinkTransparent } from '../styles/colors'
import * as ScreenOrientation from 'expo-screen-orientation'
import { OrientationLock } from 'expo-screen-orientation'
import { appStyle } from '../styles/styles'

export default function PlayersScreen() {
  const gameContext = useContext(GameContext)
  const { push } = useNavigation<any>()
  const [startButtonColor, setStartButtonColor] = useState(greyTransparent)
  const [startButtonTextColor, setStartButtonTextColor] = useState(darkGrey)
  const [startButtonDisabled, setStartButtonDisabled] = useState(true)
  const [playerInfoModalVisible, setPlayerInfoModalVisible] = useState(false)
  const [alertModalVisible, setAlertModalVisible] = useState(false)
  const [playerIndex, setPlayerIndex] = useState(0)

    // Check if screen is focused
    const isFocused = useIsFocused()
    // Listen for isFocused. If useFocused changes, force re-render by setting state
    useEffect(() => { if (isFocused) {
      ScreenOrientation.lockAsync(OrientationLock.LANDSCAPE)
      if (gameContext.playersInfo.every((value) => { return value.role !== ''})) {
        setStartButtonColor(pinkTransparent)
        setStartButtonTextColor('white')
        setStartButtonDisabled(false)
      } else {
        setStartButtonColor(greyTransparent)
        setStartButtonTextColor(darkGrey)
        setStartButtonDisabled(true)
      }
    }})

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1}} source={require('../assets/background/Setup.png')}>
        <View style={{ flex: 1 }}>
          <PlayersPage middleSection = {PlayersPageMiddleSection()} onPlayerClick={(playerIndex) => {
            setPlayerIndex(playerIndex)
            setPlayerInfoModalVisible(true)
          }}/>
        </View>
      </ImageBackground>
      <PlayerInfoModal visible={playerInfoModalVisible} setVisible={setPlayerInfoModalVisible} playerIndex={playerIndex}/>
      <AlertModal visible={alertModalVisible} setVisible={setAlertModalVisible}/>
    </View>
  )

  function PlayersPageMiddleSection() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row'}}>
        <View style={{...appStyle.frame, height: '25%', width: '25%', margin: '2.5%'}}>
          <TouchableHighlight style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}} onPress={() => { 
            gameContext.playersInfo.forEach(playerInfo => { playerInfo.role = '' })
            gameContext.playersInfo.forEach(playerInfo => { playerInfo.playerButtonStyle.backgroundColor = blackTransparent })
            gameContext.playersInfo.forEach(playerInfo => { playerInfo.playerButtonStyle.borderColor = 'white' })
            push('DirectionScreen')
            }}> 
            <Text adjustsFontSizeToFit={true} style={{...appStyle.text, margin: '2.5%'}}>Back</Text>
          </TouchableHighlight>
        </View>
        <View style={{...appStyle.frame, height: '25%', width: '25%', margin: '2.5%', backgroundColor: startButtonColor}}>
          <TouchableHighlight style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}} 
            disabled={startButtonDisabled} onPress={() => {
            if (gameContext.playersInfo.every((value) => value.role !== '') && confirmPlayerRoles(gameContext)) {
              push('SchoolAnnouncementScreen')
            } else {
              gameContext.playersInfo.forEach(playerInfo => { playerInfo.role = '' })
              gameContext.playersInfo.forEach(playerInfo => { playerInfo.playerButtonStyle.backgroundColor = blackTransparent })
              gameContext.playersInfo.forEach(playerInfo => { playerInfo.playerButtonStyle.borderColor = 'white' })
              setAlertModalVisible(true)
            }
          }}>
            <Text adjustsFontSizeToFit={true} style={{...appStyle.text, color: startButtonTextColor, margin: '2.5%'}}>START</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

// Make sure that the roles people entered match up with the roles required to play game
// Displays alert modal and returns false when roles don't match up
function confirmPlayerRoles(gameContext:GameContextType) {
  for (let i = 0; i < gameContext.playersInfo.length; i++) {
    if (gameContext.playersInfo[i].role === '') {
      return false      
    }
  }
  const countPlayersRoles:RoleCount[] = []
  gameContext.roleCounts.forEach(roleCount => {
    countPlayersRoles.push({roles: roleCount.roles, count:0})
  })
  let countRandomRoles:RoleCount[] = []
  if (gameContext.mode === 'extreme') {
    // Take the randomRoles (last array item in countRoles) and break into individual RoleCounts to keep track of each role count
    const lastArrayItem = countPlayersRoles.pop()!
    lastArrayItem.roles.forEach(role => {
      countRandomRoles.push({roles: [role], count: 0})
    })
  }
  gameContext.playersInfo.forEach(playerInfo => {
    const countPlayerRole = countPlayersRoles.find((countRole) => {return areEqual(countRole.roles, [playerInfo.role])})!
    const expectedCount = gameContext.roleCounts.find((roleCount) => {return areEqual(roleCount.roles, [playerInfo.role])})!.count
    // If said role met its expected count, then +1 into one of the randomRoles
    if (countPlayerRole.count == expectedCount && gameContext.mode === 'extreme') {
      if (countRandomRoles.find((randomRole) => {return areEqual(randomRole.roles, countPlayerRole.roles)})) {
        countRandomRoles.find((randomRole) => {return areEqual(randomRole.roles, countPlayerRole.roles)})!.count += 1
      }
    } else {
      countPlayerRole.count += 1
    }
  })
  if (gameContext.mode === 'extreme') {
    let randomRoles:string[] = []
    let randomRolesCount:number = 0
    // no role in randomRoles should have a count higher than 1
    for (let i = 0; i < countRandomRoles.length; i++) {
      if (countRandomRoles[i].count > 1) {
        return false      
      }
      randomRoles.push(countRandomRoles[i].roles[0])
      randomRolesCount += countRandomRoles[i].count
    }
    countPlayersRoles.push({roles: randomRoles, count: randomRolesCount})
  }
  if (areEqual(countPlayersRoles, gameContext.roleCounts)) {
    return true
  } else {
    return false
  }
}

function areEqual(array1: any[], array2: any[]):boolean {
  if (JSON.stringify(array1) === JSON.stringify(array2)) {
    return true
  } else {
    return false
  }
}
