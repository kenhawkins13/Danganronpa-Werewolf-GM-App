import React from 'react'
import { View, Image } from 'react-native'
import { roles } from '../assets/RoleCards/roles'
import { imageStyles } from '../styles/styles'

export default function RoleCards({role}: Props) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
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
    case 'Spotless':
      image = <Image key='Spotless' style={imageStyles.cards} source={roles.spotless}/>
      break
    case 'Monomi':
      image = <Image key='Monomi' style={imageStyles.cards} source={roles.monomi}/>
      break
    case 'Despair Disease Patient':
      image = <Image key='Despair Disease Patient' style={imageStyles.cards} source={roles.despairDiseasePatient}/>
      break
    case 'Future Foundation':
      image = <Image key='Future Foundation' style={imageStyles.cards} source={roles.futureFoundation}/>
      break
    case 'Blackened':
      image = <Image key='Blackened' style={imageStyles.cards} source={roles.blackened}/>
      break
    case 'Zakemono':
      image = <Image key='Zakemono' style={imageStyles.cards} source={roles.zakemono}/>
      break
    case 'Traitor':
      image = <Image key='Traitor' style={imageStyles.cards} source={roles.traitor}/>
      break
    case 'Remnants of Despair':
      image = <Image key='Remnants of Despair' style={imageStyles.cards} source={roles.remnantsOfDespair}/>
      break
    case 'Ultimate Despair':
      image = <Image key='Ultimate Despair' style={imageStyles.cards} source={roles.ultimateDespair}/>
      break
  }
  return image
}

type Props = {role:string}