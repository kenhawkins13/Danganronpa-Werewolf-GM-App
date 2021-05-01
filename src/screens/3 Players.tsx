import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, ImageBackground, TouchableHighlight } from 'react-native'
import { GameContext } from '../../AppContext'
import { GameContextType, RoleCount } from '../types/types'
import AlertModal from '../components/modals/Alert'
import PlayerInfoModal from '../components/modals/PlayerInfo'
import PlayersPage from '../components/PlayersPage'
import { colors } from '../styles/colors'
import * as ScreenOrientation from 'expo-screen-orientation'
import { OrientationLock } from 'expo-screen-orientation'
import { appStyle } from '../styles/styles'
import * as Speech from 'expo-speech'
import { Audio } from 'expo-av'
import { sounds } from "../assets/sounds/sounds"
import { backgrounds } from '../assets/backgrounds/backgrounds'

export default function PlayersScreen() {
  const gameContext = useContext(GameContext)
  const { navigate } = useNavigation<any>()
  const [rotationComplete, setRotationComplete] = useState(false)
  const [startButtonColor, setStartButtonColor] = useState(colors.greyTransparent)
  const [startButtonTextColor, setStartButtonTextColor] = useState(colors.darkGrey)
  const [startButtonDisabled, setStartButtonDisabled] = useState(true)
  const [playerInfoModalVisible, setPlayerInfoModalVisible] = useState(false)
  const [alertModalVisible, setAlertModalVisible] = useState(false)
  const [playerIndex, setPlayerIndex] = useState(0)

    const isFocused = useIsFocused()
    useEffect(() => { if (isFocused) {
      ScreenOrientation.lockAsync(OrientationLock.LANDSCAPE)
      setRotationComplete(true)
      if (gameContext.playersInfo.every((value) => { return value.role !== ''})) {
        setStartButtonColor(colors.pinkTransparent)
        setStartButtonTextColor(colors.white)
        setStartButtonDisabled(false)
      } else {
        setStartButtonColor(colors.greyTransparent)
        setStartButtonTextColor(colors.darkGrey)
        setStartButtonDisabled(true)
      }
    }})

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1}} source={backgrounds.main}>
        <View style={{ flex: 1 }}>
          <PlayersPage visible={rotationComplete} middleSection={PlayersPageMiddleSection()} onPlayerClick={(playerIndex) => {
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
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
        <View style={{...appStyle.frame, height: '25%', width: '25%'}}>
          <TouchableHighlight style={{height: '100%', width: '100%', borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}
            onPress={async () => {
              const { sound } = await Audio.Sound.createAsync(sounds.previousOption, {}, async (playbackStatus:any) => {
                if (playbackStatus.didJustFinish) { await sound.unloadAsync() }
              })
              await sound.setVolumeAsync(gameContext.musicVolume)
              await sound.playAsync()
              gameContext.playersInfo.forEach(playerInfo => { playerInfo.role = '' })
              gameContext.playersInfo.forEach(playerInfo => { playerInfo.playerButtonStyle.backgroundColor = colors.blackTransparent })
              gameContext.playersInfo.forEach(playerInfo => { playerInfo.playerButtonStyle.underlayColor = colors.blackTransparent })
              gameContext.playersInfo.forEach(playerInfo => { playerInfo.playerButtonStyle.borderColor = colors.white })
              setRotationComplete(false)
              navigate('SettingsScreen')
            }}> 
            <Text adjustsFontSizeToFit={true} style={{...appStyle.text, margin: '2.5%'}}>Back</Text>
          </TouchableHighlight>
        </View>
        <View style={{...appStyle.frame, height: '25%', width: '25%', backgroundColor: startButtonColor}}>
          <TouchableHighlight style={{height: '100%', width: '100%', borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} 
            disabled={startButtonDisabled} underlayColor={startButtonColor} activeOpacity={1} onPress={async () => {
            await Speech.stop()
            gameContext.playersInfo.forEach(playerInfo => {
              playerInfo.playerButtonStyle.backgroundColor = colors.blackTransparent
              playerInfo.playerButtonStyle.underlayColor = colors.blackTransparent
              playerInfo.playerButtonStyle.borderColor = colors.white
            })
            if (gameContext.playersInfo.every((value) => value.role !== '') && confirmPlayerRoles(gameContext)) {
              gameContext.backgroundMusic.unloadAsync()
              gameContext.backgroundMusic = ''
              navigate('SchoolAnnouncementScreen')
            } else {
              gameContext.playersInfo.forEach(playerInfo => { playerInfo.role = '' })
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
  const actualRoleCountAll:RoleCount[] = []
  gameContext.roleCountAll.forEach(roleCount => {
    actualRoleCountAll.push({roles: roleCount.roles, count:0})
  })
  let actualRandomRoles:RoleCount[] = []
  // If there are random roles in, the last array item in countRoles will have multiple roles
  const lastArrayItem = actualRoleCountAll.pop()!
  const hasRandomRoles = lastArrayItem.roles.length > 1 ? true : false
  if (hasRandomRoles) {
    // Take the randomRoles (last array item in countRoles) and break into individual RoleCounts to keep track of each role count
    lastArrayItem.roles.forEach(role => {
      actualRandomRoles.push({roles: [role], count: 0})
    })
  }
  gameContext.playersInfo.forEach(playerInfo => {
    const actualRoleCount = actualRoleCountAll.find((roleCount) => {return areEqual(roleCount.roles, [playerInfo.role])})!
    const expectedRoleCount = gameContext.roleCountAll.find((roleCount) => {return areEqual(roleCount.roles, [playerInfo.role])})!.count
    // If said role met its expected count, then +1 into one of the randomRoles
    if (actualRoleCount.count == expectedRoleCount && hasRandomRoles) {
      if (actualRandomRoles.find((randomRole) => {return areEqual(randomRole.roles, actualRoleCount.roles)})) {
        actualRandomRoles.find((randomRole) => {return areEqual(randomRole.roles, actualRoleCount.roles)})!.count += 1
      }
    } else {
      actualRoleCount.count += 1
    }
  })
  if (hasRandomRoles) {
    let randomRoles:string[] = []
    let randomRolesCount:number = 0
    // no role in randomRoles should have a count higher than 1
    for (let i = 0; i < actualRandomRoles.length; i++) {
      if (actualRandomRoles[i].count > 1) {
        return false      
      }
      randomRoles.push(actualRandomRoles[i].roles[0])
      randomRolesCount += actualRandomRoles[i].count
    }
    actualRoleCountAll.push({roles: randomRoles, count: randomRolesCount})
  }
  if (areEqual(actualRoleCountAll, gameContext.roleCountAll)) {
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
