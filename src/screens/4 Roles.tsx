import { useNavigation } from '@react-navigation/native'
import React, { useContext, useState } from 'react'
import { View, Text } from 'react-native'
import { GameContext } from '../../App'
import AlertModal from '../components/modals/Alert'
import NavigationBar from '../components/NavigationBar'
import PlayersModal from '../components/modals/Players'
import RoleCards from '../components/RoleCards'
import { GameContextType, RoleCount } from '../types/types'
import PlayerInfoModal from '../components/modals/PlayerInfo'

export default function RolesScreen() {
  const { push } = useNavigation<any>()
  const gameContext = useContext(GameContext)
  const [playersModalVisible, setPlayersModalVisible] = useState(false)
  const [playerInfoModalVisible, setPlayerInfoModalVisible] = useState(false)
  const [alertModalVisible, setAlertModalVisible] = useState(false)
  const playerInfoModal = <PlayerInfoModal visible={playerInfoModalVisible} setVisible={setPlayerInfoModalVisible}/>

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 9 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#cc0066' }}>
          <Text>
            Prepare the following Role Cards and distribute one card to each player.

            After distributing the Role Cards, have each player enter in their role on the next page
          </Text>
        </View>
        {DisplayRoleCards(gameContext)}
      </View>
      <View style={{ flex: 1 }}>
        <NavigationBar previousPage='IntroductionScreen' nextPage=''
          callback={() => { 
            setPlayersModalVisible(true)
            return false
          }}/>
      </View>
      <PlayersModal visible={playersModalVisible} setVisible={setPlayersModalVisible} modal={playerInfoModal} continueVisible={true}
        disableContinue={false} onPlayerTouch={() => { setPlayerInfoModalVisible(true) }} onContinue={() => {
          if (confirmPlayerRoles(gameContext)) {
            push('ItemsScreen')
          } else {
            setPlayersModalVisible(false)
            setAlertModalVisible(true)
          }
        }}/>
      <AlertModal modalVisible={alertModalVisible} setModalVisible={setAlertModalVisible}/>
    </View>
  )
}

function DisplayRoleCards(gameContext:GameContextType) {
  const roleCard = gameContext.roleCounts.map((neededRole) => 
    <RoleCards key={neededRole.roles.toString()} roles={neededRole.roles} count={neededRole.count}/>
  )
  return (
    <View  style={{flex: 4, flexDirection: 'row', flexWrap: "wrap", alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: 'white'}}>
      {roleCard}
    </View>
  )
}

// Make sure that the roles people entered match up with the roles required to play game
// Displays alert modal and returns false when roles don't match up
function confirmPlayerRoles(gameContext:GameContextType) {
  for (let i = 0; i < gameContext.playersInfo.length; i++) {
    if (gameContext.playersInfo[i].colorScheme === 'white' || gameContext.playersInfo[i].role === '') {
      return false      
    }
  }
  const countPlayersRoles:RoleCount[] = []
  gameContext.roleCounts.forEach(roleCount => {
    countPlayersRoles.push({roles: roleCount.roles, count:0})
  });
  let countRandomRoles:RoleCount[] = []
  if (gameContext.mode === 'extreme') {
    // Take the randomRoles (last array item in countRoles) and break into individual RoleCounts to keep track of each role count
    const lastArrayItem = countPlayersRoles.pop()!
    lastArrayItem.roles.forEach(role => {
      countRandomRoles.push({roles: [role], count: 0})
    });
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
  });
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