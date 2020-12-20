import React from 'react'
import { View, Text, Image } from 'react-native'

// const images = {
//   alterEgo: { uri: require('../assets/Role Cards/Alter Ego.png') },
//   blackened: { uri: require('../assets/Role Cards/Blackened.png') },
//   despairDiseasePatient: { uri: require('../assets/Role Cards/Despair Disease Patient.png') },
//   monomi: { uri: require('../assets/Role Cards/Monomi.png') },
//   spotless: { uri: require('../assets/Role Cards/Spotless.png') },
//   traitor: { uri: require('../assets/Role Cards/Traitor.png') },
//   ultimateDespair: { uri: require('../assets/Role Cards/Ultimate Despair.png') },
// }

export default function RoleCards({roles, count}: Props) {
  // let imageSource = {}
  // let source:NodeRequire[]
  // roles.forEach(role => {
  //   switch (role) {
  //     case 'Alter Ego':
  //       source = images.alterEgo.uri
  //       break
  //     case 'Blackened':
  //       source = images.blackened.uri
  //       break
  //     case 'Despair Disease Patient':
  //       source = images.despairDiseasePatient.uri
  //       break
  //     case 'Monomi':
  //       source = images.monomi.uri
  //       break
  //     case 'Spotless':
  //       source = images.spotless.uri
  //       break
  //     case 'Traitor':
  //       source = images.traitor.uri
  //       break
  //     case 'Ultimate Despair':
  //       source = images.ultimateDespair.uri
  //       break
  //   }
  // });
  const thumbnails = roles.map((role) =>
    <View key={role}>
      <Image
        style={{width: 50, height: 70}}
        source={require('../assets/RoleCards/Alter Ego.png')}
      />
      <Text>{role}</Text>
    </View>
  )
  if (count > 0) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'grey' }}>
        {thumbnails}
        <Text style={{ fontSize: 20 }}>x {count}</Text>
      </View>
    )
  } else {
    return (<></>)
  }
}

type Props = {roles:string[], count:number}