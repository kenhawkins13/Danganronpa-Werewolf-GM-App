import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { roles } from '../assets/RoleCards/roles'
import { imageStyles } from '../styles/styles'

export default function RoleCards({role}: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
      {getRoleCardImage(role)}
    </View>
  )
}

function getRoleCardImage(role:string) {
  let image:JSX.Element = <></>
  switch (role) {
    case 'Alter Ego':
      image = <Image key='Alter Ego' style={imageStyles.cards} source={roles.alterEgo}/>
      break
    case 'Blackened':
      image = <Image key='Blackened' style={imageStyles.cards} source={roles.blackened}/>
      break
    case 'Despair Disease Patient':
      image = <Image key='Despair Disease Patient' style={imageStyles.cards} source={roles.despairDiseasePatient}/>
      break
    case 'Monomi':
      image = <Image key='Monomi' style={imageStyles.cards} source={roles.monomi}/>
      break
    case 'Spotless':
      image = <Image key='Spotless' style={imageStyles.cards} source={roles.spotless}/>
      break
    case 'Traitor':
      image = <Image key='Traitor' style={imageStyles.cards} source={roles.traitor}/>
      break
    case 'Ultimate Despair':
      image = <Image key='Ultimate Despair' style={imageStyles.cards} source={roles.ultimateDespair}/>
      break
  }
  return image
}

type Props = {role:string}