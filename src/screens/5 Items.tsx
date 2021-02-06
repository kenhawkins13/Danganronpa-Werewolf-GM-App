import React, { useContext } from 'react'
import { View, Text, Image, ImageBackground, TouchableHighlight, } from 'react-native'
import { GameContext } from '../../AppContext'
import NavigationBar from '../components/NavigationBar'
import { appStyle } from '../styles/styles'
import * as Speech from 'expo-speech'

export default function ItemsScreen() {
  const gameContext = useContext(GameContext)
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1, padding: '2.5%'}} source={require('../assets/background/Setup.png')}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Image style={{flex: 1, resizeMode: 'contain', marginTop: '10%'}} source={require('../assets/images/Monokuma.png')}/>
        </View>
        <View style={{ flex: 8 }}>
          {getBody(gameContext.mode)}
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar previousPage='RolesScreen' nextPage='DirectionScreen'></NavigationBar>
        </View>
      </ImageBackground>
    </View>
  )
}

function getBody(mode:string) {
  if (mode === 'extreme') {
    return (
      <View style={{...appStyle.frame, flex: 1, padding: '5%', margin: '2.5%'}}>
        <View>
          <View style={{height: 28, justifyContent: 'center'}}>
            <Text style={{...appStyle.text, textAlign: 'center'}}>
              -Items-
            </Text>
            <TouchableHighlight style={{height: 28, width: 28, position:'absolute', right: 0}} 
              onPress={async() => {
                await Speech.stop()
                Speech.speak(body2)
              }}>
              <Image style={{height: 28, width: 28,}} source={require('../assets/images/Speaker.png')}/>
            </TouchableHighlight>
          </View>
          <View>
            <Text style={appStyle.text}>
              {"\n"}
              {body2}
            </Text>
          </View>
        </View>
        <View style={{borderBottomColor: 'white', borderBottomWidth: 2, marginVertical: 10}}/>
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
          <View style={{height: 28, justifyContent: 'center'}}>
            <Text style={{...appStyle.text, textAlign: 'center'}}>
              -Items-
            </Text>
            <TouchableHighlight style={{height: 28, width: 28, position:'absolute', right: 0}} 
              onPress={async() => {
                await Speech.stop()
                Speech.speak(body1)
              }}>
              <Image style={{height: 28, width: 28,}} source={require('../assets/images/Speaker.png')}/>
            </TouchableHighlight>
          </View>
          <View>
            <Text style={appStyle.text}>
              {"\n"}
              {body1}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

const body1 = 'Since you selected Normal Mode, please skip this section as you will not use any Item Cards'
const body2 = 'Randomly draw and distribute two item cards to each player. Everyone has the option to mulligan both their \
cards and redraw a new set. You cannot redraw just one card, it must be both.'