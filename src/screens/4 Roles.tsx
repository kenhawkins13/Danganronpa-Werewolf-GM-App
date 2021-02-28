import React, { useContext, useEffect } from 'react'
import { View, Text, ImageBackground, Image, TouchableHighlight } from 'react-native'
import NavigationBar from '../components/NavigationBar'
import RoleCards from '../components/RoleCards'
import { GameContextType } from '../types/types'
import { appStyle } from '../styles/styles'
import { GameContext } from '../../AppContext'
import { useIsFocused } from '@react-navigation/native'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as Speech from 'expo-speech'
import { Audio } from 'expo-av'
import { daytimeCalmMusic } from '../assets/music/music'
import { colors } from '../styles/colors'

let isMusicPlaying = false
const updateMusicStatus = playbackStatus => { isMusicPlaying = playbackStatus.isPlaying }

export default function RolesScreen() {
  
  const isFocused = useIsFocused()
  useEffect(() => { if (isFocused) {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    if (!isMusicPlaying) { playMusic() }    
  }}, [isFocused])

  const gameContext = useContext(GameContext)
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1, padding: '2.5%'}} source={require('../assets/background/Setup.png')}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Image style={{flex: 1, resizeMode: 'contain', marginTop: '10%'}} source={require('../assets/images/Monokuma.png')}/>
        </View>
        <View style={{ flex: 8 }}>
          <View style={{...appStyle.frame, flex: 1, padding: '5%', margin: '2.5%'}}>
            <View>
              <View style={{height: 28, justifyContent: 'center'}}>
                <Text style={{...appStyle.text, textAlign: 'center'}}>
                  -Characters and Roles-
                </Text>
                <TouchableHighlight style={{height: 28, width: 28, position:'absolute', right: 0}} 
                  onPress={async() => {
                    if (await Speech.isSpeakingAsync() === true) {
                      await Speech.stop()
                    } else {
                      Speech.speak(speech1(gameContext.mode))
                    }
                  }}>
                  <Image style={{height: 28, width: 28,}} source={require('../assets/images/Speaker.png')}/>
                </TouchableHighlight>
              </View>
              <View>
                <Text style={{...appStyle.text}}>
                  {"\n"}
                  {body1(gameContext.mode)}
                </Text>
              </View>
            </View>
            <View style={{borderBottomColor: colors.white, borderBottomWidth: 2, marginVertical: 10}}/>
            <View style={{flex: 4}}>
              {DisplayNormalRoles(gameContext)}
            </View>
            <View style={{flex: 3}}>
              {DisplaySpecialRoles(gameContext)}
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar previousPage='IntroductionScreen' nextPage='ItemsScreen'onPrevious={() => {
            isMusicPlaying = false
            gameContext.backgroundMusic.unloadAsync()
            Speech.stop()
            return true
          }} onNext={() => {
            Speech.stop()
            return true
          }}/>
        </View>
      </ImageBackground>
    </View>
  )
  
  async function playMusic() {
    const randomNum = Math.floor(Math.random() * 5)
    const { sound } = await Audio.Sound.createAsync(daytimeCalmMusic[randomNum], {}, updateMusicStatus)
    gameContext.backgroundMusic = sound
    await gameContext.backgroundMusic.setVolumeAsync(.1)
    await gameContext.backgroundMusic.playAsync()
    await gameContext.backgroundMusic.setIsLoopingAsync(false)
    gameContext.backgroundMusic.setOnPlaybackStatusUpdate(async (playbackStatus:any) => {
      if (playbackStatus.didJustFinish) { await playMusic() }
    })
  }
}

function DisplayNormalRoles(gameContext:GameContextType) {
  const normalRoles = gameContext.roleCounts.filter((roleCount) => roleCount.roles.length === 1 && roleCount.count !== 0)
  if (normalRoles.length === 3) {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginVertical: '2.5%'}}>
        <View style={{flex: 1}}/>
          <View style={{flex: 2}}>
            <View style={{flex: 3, width: '100%'}}>
              <RoleCards key={normalRoles[0].roles[0]} role={normalRoles[0].roles[0]} />
            </View>
            <View style={{flex: 1}}>
              <Text style={{...appStyle.text, textAlign: 'center' }}>{normalRoles[0].count}X</Text>
            </View>
          </View>
          <View style={{flex: 2}}>
            <View style={{flex: 3, width: '100%'}}>
              <RoleCards key={normalRoles[1].roles[0]} role={normalRoles[1].roles[0]} />
            </View>
            <View style={{flex: 1}}>
              <Text style={{ ...appStyle.text, textAlign: 'center' }}>{normalRoles[1].count}X</Text>
            </View>
          </View>
          <View style={{flex: 2}}>
            <View style={{flex: 3, width: '100%'}}>
              <RoleCards key={normalRoles[2].roles[0]} role={normalRoles[2].roles[0]} />
            </View>
            <View style={{flex: 1}}>
              <Text style={{ ...appStyle.text, textAlign: 'center' }}>{normalRoles[2].count}X</Text>
            </View>
          </View>
        <View style={{flex: 1}}/>
      </View>
    )
  } else if (normalRoles.length === 4) {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginVertical: '2.5%'}}>
        <View style={{flex: 1}}>
          <View style={{flex: 3, width: '100%'}}>
            <RoleCards key={normalRoles[0].roles[0]} role={normalRoles[0].roles[0]} />
          </View>
          <View style={{flex: 1}}>
            <Text style={{ ...appStyle.text, textAlign: 'center' }}>{normalRoles[0].count}X</Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <View style={{flex: 3, width: '100%'}}>
            <RoleCards key={normalRoles[1].roles[0]} role={normalRoles[1].roles[0]} />
          </View>
          <View style={{flex: 1}}>
            <Text style={{ ...appStyle.text, textAlign: 'center' }}>{normalRoles[1].count}X</Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <View style={{flex: 3, width: '100%'}}>
            <RoleCards key={normalRoles[2].roles[0]} role={normalRoles[2].roles[0]} />
          </View>
          <View style={{flex: 1}}>
            <Text style={{ ...appStyle.text, textAlign: 'center' }}>{normalRoles[2].count}X</Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <View style={{flex: 3, width: '100%'}}>
            <RoleCards key={normalRoles[3].roles[0]} role={normalRoles[3].roles[0]}/>
          </View>
          <View style={{flex: 1}}>
            <Text style={{ ...appStyle.text, textAlign: 'center' }}>{normalRoles[3].count}X</Text>
          </View>
        </View>
      </View>
    )
  }
}

function DisplaySpecialRoles(gameContext:GameContextType) {
  const specialRoles = gameContext.roleCounts.find((roleCount) => roleCount.roles.length > 1)
  if (specialRoles) {
    if (specialRoles.roles.length === 2) {
      return (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginVertical: '2.5%'}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}/>
            <View style={{flex: 1, justifyContent: 'center', height: '100%'}}>
              <Text style={{ ...appStyle.text, textAlign: 'center' }}>Draw {specialRoles.count}</Text>
            </View>
            <View style={{flex: 1}}>
              <RoleCards key={specialRoles.roles[0]} role={specialRoles.roles[0]}/>
            </View>
            <View style={{flex: 1}}>
              <RoleCards key={specialRoles.roles[1]} role={specialRoles.roles[1]}/>
            </View>
            <View style={{flex: 1}}/>
          </View>
        </View>
      )
    } else if (specialRoles.roles.length === 3) {
      return (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginVertical: '2.5%'}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}/>
            <View style={{flex: 2, justifyContent: 'center', height: '100%'}}>
              <Text style={{ ...appStyle.text, textAlign: 'center' }}>Draw {specialRoles.count}</Text>
            </View>
            <View style={{flex: 2}}>
              <RoleCards key={specialRoles.roles[0]} role={specialRoles.roles[0]}/>
            </View>
            <View style={{flex: 2}}>
              <RoleCards key={specialRoles.roles[1]} role={specialRoles.roles[1]}/>
            </View>
            <View style={{flex: 2}}>
              <RoleCards key={specialRoles.roles[2]} role={specialRoles.roles[2]}/>
            </View>
            <View style={{flex: 1}}/>
          </View>
        </View>
      )
    } else if (specialRoles.roles.length === 4) {
      return (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginVertical: '2.5%'}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, justifyContent: 'center', height: '100%'}}>
              <Text style={{...appStyle.text, textAlign: 'center'}}>Draw {specialRoles.count}</Text>
            </View>
            <View style={{flex: 1}}>
              <RoleCards key={specialRoles.roles[0]} role={specialRoles.roles[0]}/>
            </View>
            <View style={{flex: 1}}>
              <RoleCards key={specialRoles.roles[1]} role={specialRoles.roles[1]}/>
            </View>
            <View style={{flex: 1}}>
              <RoleCards key={specialRoles.roles[2]} role={specialRoles.roles[2]}/>
            </View>
            <View style={{flex: 1}}>
              <RoleCards key={specialRoles.roles[3]} role={specialRoles.roles[3]}/>
            </View>
          </View>
        </View>
      )
    }
  } else {
    return (<></>)
  }
}
  
const body1 = (gameMode:string) => `Prepare one character card for each player then have everyone introduce their character's name, \
gender, ultimate title, ${(extraText(gameMode))} and quotes.

Shuffle the role cards shown in the chart below and secretly distribute one role card to each player.`
const speech1 = (gameMode:string) => `Prepare one character card for each player then have everyone introduce their character's name, gender, ultimate title, \
${(extraText(gameMode))} and quotes. Shuffle the role cards shown in the chart below and secretly distribute one role card to each player.`

const extraText = (Mode:string) => {
  if (Mode === 'normal') {
    return ''
  } else if (Mode === 'extreme') {
    return ' character ability,'
  }
}