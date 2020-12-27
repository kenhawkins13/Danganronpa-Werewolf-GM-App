import React, { useContext } from 'react'
import { View, Text, Image, ImageBackground, } from 'react-native'
import { GameContext } from '../../AppContext'
import NavigationBar from '../components/NavigationBar'
import { appStyle } from '../styles/styles'

export default function ItemsScreen() {
  const gameContext = useContext(GameContext)
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1, padding: '2.5%'}} source={require('../assets/background/Setup.png')}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Image style={{flex: 1, resizeMode: 'contain', marginTop: '10%'}} source={require('../assets/images/Monokuma.png')}/>
        </View>
        <View style={{ flex: 8 }}>
          {getText(gameContext.mode)}
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar previousPage='RolesScreen' nextPage='DirectionScreen'></NavigationBar>
        </View>
      </ImageBackground>
    </View>
  )
}

function getText(mode:string) {
  if (mode === 'extreme') {
    return (
      <View style={{...appStyle.frame, flex: 1, padding: '5%', margin: '2.5%'}}>
        <View>
          <Text style={{...appStyle.text, textAlign: 'center'}}>
            -Items-
            {"\n"}
          </Text>
          <Text style={appStyle.text}>
            Randomly draw and distrivute two item cards for each player. Every player has the option to mulligan both their
            cards and redraw a new set. You cannot redraw just one card, it must be both.
            {"\n"}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <View style={{flex: 1, margin: '5%'}}>
              <Image style={{flex: 1, resizeMode: 'contain', alignSelf: 'center'}} source={require('../assets/images/Green-Check.png')}/>
            </View>
            <View style={{flex: 3}}>
              <Text style={{...appStyle.text, alignSelf: 'center', margin: '1%'}}>Redraw 2</Text>
              <View style={{flex: 1, flexDirection: 'row', margin: '5%'}}>
                <Image style={{ flex: 1, resizeMode: 'contain', height: '100%', alignSelf: 'center' }} source={require('../assets/ItemCards/Alter-Ball.png')}/>
                <Image style={{ flex: 1, resizeMode: 'contain', height: '100%', alignSelf: 'center' }} source={require('../assets/ItemCards/Alter-Ball.png')}/>
              </View>
            </View>
            <View style={{flex: 3}}>
            <Text style={{...appStyle.text, alignSelf: 'center', margin: '1%'}}>Redraw None</Text>
              <View style={{flex: 1, flexDirection: 'row', margin: '5%'}}>
                <Image style={{ flex: 1, resizeMode: 'contain', height: '100%', alignSelf: 'center' }} source={require('../assets/ItemCards/Reverse.jpg')}/>
                <Image style={{ flex: 1, resizeMode: 'contain', height: '100%', alignSelf: 'center' }} source={require('../assets/ItemCards/Reverse.jpg')}/>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={{flex: 1, margin: '5%'}}>
                <Image style={{flex: 1, resizeMode: 'contain', alignSelf: 'center'}} source={require('../assets/images/Red-X.png')}/>
              </View>
              <View style={{flex: 3}}>
                <Text style={{...appStyle.text, alignSelf: 'center', margin: '1%'}}>Redraw 1</Text>
                <View style={{flex: 1, flexDirection: 'row', margin: '5%'}}>
                  <Image style={{ flex: 1, resizeMode: 'contain', height: '100%', alignSelf: 'center' }} source={require('../assets/ItemCards/Alter-Ball.png')}/>
                  <Image style={{ flex: 1, resizeMode: 'contain', height: '100%', alignSelf: 'center' }} source={require('../assets/ItemCards/Reverse.jpg')}/>
                </View>
              </View>
              <View style={{flex: 3}}>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  } else {
    return (
      <View style={{...appStyle.frame, flex: 1, padding: '5%', margin: '2.5%'}}>
        <View>
          <Text style={{...appStyle.text, textAlign: 'center'}}>
            -Items-
            {"\n"}
          </Text>
          <Text style={appStyle.text}>
            Since you selected Normal Mode, please skip this section as you will not use Item Cards
          </Text>
        </View>
      </View>
    )
  }
}
