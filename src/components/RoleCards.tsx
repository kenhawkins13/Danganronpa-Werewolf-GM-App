import React from 'react'
import { View, Image, StyleSheet } from 'react-native'

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
      image = <Image key='Alter Ego' style={styles.image} source={require('../assets/RoleCards/Alter-Ego.png')}/>
      break
    case 'Blackened':
      image = <Image key='Blackened' style={styles.image} source={require('../assets/RoleCards/Blackened.png')}/>
      break
    case 'Despair Disease Patient':
      image = <Image key='Despair Disease Patient' style={styles.image} source={require('../assets/RoleCards/Despair-Disease-Patient.png')}/>
      break
    case 'Monomi':
      image = <Image key='Monomi' style={styles.image} source={require('../assets/RoleCards/Monomi.png')}/>
      break
    case 'Spotless':
      image = <Image key='Spotless' style={styles.image} source={require('../assets/RoleCards/Spotless.png')}/>
      break
    case 'Traitor':
      image = <Image key='Traitor' style={styles.image} source={require('../assets/RoleCards/Traitor.png')}/>
      break
    case 'Ultimate Despair':
      image = <Image key='Ultimate Despair' style={styles.image} source={require('../assets/RoleCards/Ultimate-Despair.png')}/>
      break
  }
  return image
}

type Props = {role:string}


const styles = StyleSheet.create({
  image: {
    flex: 1, resizeMode: 'contain', alignSelf: 'center', margin: '2.5%'
  }
})