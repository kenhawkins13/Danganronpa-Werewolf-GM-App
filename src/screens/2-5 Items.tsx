import React, { useContext } from 'react'
import { View, Text, Image, ImageBackground, } from 'react-native'
import { GameContext } from '../../AppContext'
import NavigationBar from '../components/NavigationBar'
import { appStyle } from '../styles/styles'
import * as Speech from 'expo-speech'
import { colors } from '../styles/colors'
import SpeakerButton from '../components/SpeakerButton'
import { backgrounds } from '../assets/backgrounds/backgrounds'
import { items } from '../assets/ItemCards/items'
import { images } from '../assets/images/images'

export default function ItemsScreen({setScreen}:Props) {
  const gameContext = useContext(GameContext)
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1, padding: '2.5%'}} source={backgrounds.main}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Image style={{flex: 1, resizeMode: 'contain', marginTop: '10%'}} source={images.monokuma}/>
        </View>
        <View style={{ flex: 8 }}>
          {getBody(gameContext.mode)}
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar onNext={() => {
            Speech.stop()
            setScreen('DirectionScreen')
          }} onPrevious={() => {
            Speech.stop()
            setScreen('RolesScreen')
          }}/>
        </View>
      </ImageBackground>
    </View>
  )
}

type Props = {setScreen:React.Dispatch<any>}

function getBody(mode:string) {
  if (mode !== 'normal') {
    return (
      <View style={{...appStyle.frame, flex: 1, padding: '5%', margin: '2.5%'}}>
        <View style={{left: '100%', top: '2.5%', position: 'absolute'}}>
          <SpeakerButton speech={body2}/>
        </View>
        <View>
          <Text style={{...appStyle.text, textAlign: 'center'}}>
            -Items-
          </Text>
          <Text style={appStyle.text}>
            {"\n"}
            {body2}
          </Text>
        </View>
        <View style={{borderBottomColor: colors.white, borderBottomWidth: 2, marginVertical: 10}}/>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <View style={{flex: 1, margin: '5%'}}>
              <Image style={{flex: 1, resizeMode: 'contain', alignSelf: 'center'}} source={images.greenCheck}/>
            </View>
            <View style={{flex: 3}}>
              <Text style={{...appStyle.text, alignSelf: 'center', margin: '1%'}}>Redraw 2</Text>
              <View style={{flex: 1, flexDirection: 'row', margin: '5%'}}>
                <Image style={{ flex: 1, resizeMode: 'contain', height: '100%', alignSelf: 'center' }} source={items.alterBall}/>
                <Image style={{ flex: 1, resizeMode: 'contain', height: '100%', alignSelf: 'center' }} source={items.alterBall}/>
              </View>
            </View>
            <View style={{flex: 3}}>
            <Text style={{...appStyle.text, alignSelf: 'center', margin: '1%'}}>Redraw None</Text>
              <View style={{flex: 1, flexDirection: 'row', margin: '5%'}}>
                <Image style={{ flex: 1, resizeMode: 'contain', height: '100%', alignSelf: 'center' }} source={items.reverse}/>
                <Image style={{ flex: 1, resizeMode: 'contain', height: '100%', alignSelf: 'center' }} source={items.reverse}/>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={{flex: 1, margin: '5%'}}>
                <Image style={{flex: 1, resizeMode: 'contain', alignSelf: 'center'}} source={images.redX}/>
              </View>
              <View style={{flex: 3}}>
                <Text style={{...appStyle.text, alignSelf: 'center', margin: '1%'}}>Redraw 1</Text>
                <View style={{flex: 1, flexDirection: 'row', margin: '5%'}}>
                  <Image style={{ flex: 1, resizeMode: 'contain', height: '100%', alignSelf: 'center' }} source={items.alterBall}/>
                  <Image style={{ flex: 1, resizeMode: 'contain', height: '100%', alignSelf: 'center' }} source={items.reverse}/>
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
        <View style={{left: '100%', top: '2.5%', position: 'absolute'}}>
          <SpeakerButton speech={body1}/>
        </View>
        <View>
          <Text style={{...appStyle.text, textAlign: 'center'}}>
            -Items-
          </Text>
          <Text style={appStyle.text}>
            {"\n"}
            {body1}
          </Text>
        </View>
      </View>
    )
  }
}

const body1 = 'Since you selected Normal Mode, please skip this section as you will not use any Item Cards'
const body2 = 'Randomly draw and distribute two item cards to each player. Everyone has the option to mulligan both their \
cards and redraw a new set. You cannot redraw just one card, it must be both.'