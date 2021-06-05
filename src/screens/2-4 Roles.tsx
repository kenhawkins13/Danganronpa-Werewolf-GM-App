import React, { useContext, useState } from 'react'
import { View, Text, ImageBackground, Image, TouchableHighlight } from 'react-native'
import NavigationBar from '../components/NavigationBar'
import RoleCards from '../components/RoleCards'
import { GameContextType } from '../types/types'
import { appStyle } from '../styles/styles'
import { GameContext } from '../../AppContext'
import * as Speech from 'expo-speech'
import { colors } from '../styles/colors'
import SpeakerButton from '../components/SpeakerButton'
import { backgrounds } from '../assets/backgrounds/backgrounds'
import { images } from '../assets/images/images'
import CustomizeRolesModal from '../components/modals/CustomizeRoles'

export default function RolesScreen({setScreen}:Props) {
  const gameContext = useContext(GameContext)
  const [customizeRolesModalVisible, setCustomizeRolesModalVisible] = useState(false)

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={{flex: 1, padding: '2.5%'}} source={backgrounds.main}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Image style={{flex: 1, resizeMode: 'contain', marginTop: '10%'}} source={images.monokuma}/>
        </View>
        <View style={{ flex: 8 }}>
          <View style={{...appStyle.frame, flex: 1, padding: '5%', margin: '2.5%'}}>
            <View style={{left: '100%', top: '2.5%', position: 'absolute'}}>
              <SpeakerButton speech={speech}/>
            </View>
            <View>
              <Text style={{...appStyle.text, textAlign: 'center'}}>
                -Roles-
              </Text>
              <Text style={{...appStyle.text}}>
                {"\n"}
                {body}
              </Text>
            </View>
            <View style={{borderBottomColor: colors.white, borderBottomWidth: 2, marginVertical: 10}}/>
            <View style={{flex: 1}}>
              {DisplayGuaranteedRoles(gameContext)}
            </View>
            <View style={{flex: 1}}>
              {DisplayRandomRoles(gameContext)}
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableHighlight style={{...appStyle.frame, padding: 5, alignItems: 'center', justifyContent: 'center'}} 
                onPress={async () => { setCustomizeRolesModalVisible(true) }}>
                <Text style={appStyle.text}>Customize</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationBar onPrevious={() => {
            Speech.stop()
            setScreen('CharactersScreen')
          }} onNext={() => {
            Speech.stop()
            setScreen('ItemsScreen')
          }}/>
        </View>
      </ImageBackground>
      <CustomizeRolesModal visible={customizeRolesModalVisible} setVisible={setCustomizeRolesModalVisible}/>
    </View>
  )
}

type Props = {setScreen:React.Dispatch<any>}

function DisplayGuaranteedRoles(gameContext:GameContextType) {
  const guaranteedRoles = gameContext.roleCountAll.filter((roleCount) => roleCount.roles.length === 1 && roleCount.count !== 0)
  if (guaranteedRoles.length === 3) {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginVertical: '2.5%'}}>
        <View style={{flex: 1}}/>
        <View style={{flex: 2}}>
          <View style={{flex: 23, marginHorizontal: '5%'}}>
            <RoleCards key={guaranteedRoles[0].roles[0]} role={guaranteedRoles[0].roles[0]} />
          </View>
          <View style={{flex: 1}}/>
          <View>
            <Text style={{...appStyle.text, textAlign: 'center' }}>{guaranteedRoles[0].count}X</Text>
          </View>
          <View style={{flex: 2}}/>
        </View>
        <View style={{flex: 2}}>
          <View style={{flex: 23, marginHorizontal: '5%'}}>
            <RoleCards key={guaranteedRoles[1].roles[0]} role={guaranteedRoles[1].roles[0]} />
          </View>
          <View style={{flex: 1}}/>
          <View>
            <Text style={{...appStyle.text, textAlign: 'center' }}>{guaranteedRoles[1].count}X</Text>
          </View>
          <View style={{flex: 2}}/>
        </View>
        <View style={{flex: 2}}>
          <View style={{flex: 23, marginHorizontal: '5%'}}>
            <RoleCards key={guaranteedRoles[2].roles[0]} role={guaranteedRoles[2].roles[0]} />
          </View>
          <View style={{flex: 1}}/>
          <View>
            <Text style={{...appStyle.text, textAlign: 'center' }}>{guaranteedRoles[2].count}X</Text>
          </View>
          <View style={{flex: 2}}/>
        </View>
        <View style={{flex: 1}}/>
      </View>
    )
  } else if (guaranteedRoles.length === 4) {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginVertical: '2.5%'}}>
        <View style={{flex: 1}}>
          <View style={{flex: 25, marginHorizontal: '5%'}}>
            <RoleCards key={guaranteedRoles[0].roles[0]} role={guaranteedRoles[0].roles[0]}/>
          </View>
          <View style={{flex: 1}}/>
          <View>
            <Text style={{...appStyle.text, textAlign: 'center' }}>{guaranteedRoles[0].count}X</Text>
          </View>
          <View style={{flex: 2}}/>
        </View>
        <View style={{flex: 1}}>
          <View style={{flex: 25, marginHorizontal: '5%'}}>
            <RoleCards key={guaranteedRoles[1].roles[0]} role={guaranteedRoles[1].roles[0]}/>
          </View>
          <View style={{flex: 1}}/>
          <View>
            <Text style={{...appStyle.text, textAlign: 'center' }}>{guaranteedRoles[1].count}X</Text>
          </View>
          <View style={{flex: 2}}/>
        </View>
        <View style={{flex: 1}}>
          <View style={{flex: 25, marginHorizontal: '5%'}}>
            <RoleCards key={guaranteedRoles[2].roles[0]} role={guaranteedRoles[2].roles[0]}/>
          </View>
          <View style={{flex: 1}}/>
          <View>
            <Text style={{...appStyle.text, textAlign: 'center' }}>{guaranteedRoles[2].count}X</Text>
          </View>
          <View style={{flex: 2}}/>
        </View>
        <View style={{flex: 1}}>
          <View style={{flex: 25, marginHorizontal: '5%'}}>
            <RoleCards key={guaranteedRoles[3].roles[0]} role={guaranteedRoles[3].roles[0]}/>
          </View>
          <View style={{flex: 1}}/>
          <View>
            <Text style={{ ...appStyle.text, textAlign: 'center' }}>{guaranteedRoles[3].count}X</Text>
          </View>
          <View style={{flex: 2}}/>
        </View>
      </View>
    )
  } else if (guaranteedRoles.length === 5) {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginVertical: '2.5%'}}>
        <View style={{flex: 2}}>
          <View style={{flex: 15, marginHorizontal: '5%'}}>
            <RoleCards key={guaranteedRoles[0].roles[0]} role={guaranteedRoles[0].roles[0]} />
          </View>
          <View style={{flex: 1}}/>
          <View>
            <Text style={{...appStyle.text, textAlign: 'center'}}>{guaranteedRoles[0].count}X</Text>
          </View>
          <View style={{flex: 5}}/>
        </View>
        <View style={{flex: 2}}>
          <View style={{flex: 15, marginHorizontal: '5%'}}>
            <RoleCards key={guaranteedRoles[1].roles[0]} role={guaranteedRoles[1].roles[0]} />
          </View>
          <View style={{flex: 1}}/>
          <View>
            <Text style={{...appStyle.text, textAlign: 'center'}}>{guaranteedRoles[1].count}X</Text>
          </View>
          <View style={{flex: 5}}/>
        </View>
        <View style={{flex: 2}}>
          <View style={{flex: 15, marginHorizontal: '5%'}}>
            <RoleCards key={guaranteedRoles[2].roles[0]} role={guaranteedRoles[2].roles[0]} />
          </View>
          <View style={{flex: 1}}/>
          <View>
            <Text style={{...appStyle.text, textAlign: 'center'}}>{guaranteedRoles[2].count}X</Text>
          </View>
          <View style={{flex: 5}}/>
        </View>
        <View style={{flex: 2}}>
          <View style={{flex: 15, marginHorizontal: '5%'}}>
            <RoleCards key={guaranteedRoles[3].roles[0]} role={guaranteedRoles[3].roles[0]} />
          </View>
          <View style={{flex: 1}}/>
          <View>
            <Text style={{...appStyle.text, textAlign: 'center'}}>{guaranteedRoles[3].count}X</Text>
          </View>
          <View style={{flex: 5}}/>
        </View>
        <View style={{flex: 2}}>
          <View style={{flex: 15, marginHorizontal: '5%'}}>
            <RoleCards key={guaranteedRoles[4].roles[0]} role={guaranteedRoles[4].roles[0]} />
          </View>
          <View style={{flex: 1}}/>
          <View>
            <Text style={{...appStyle.text, textAlign: 'center'}}>{guaranteedRoles[4].count}X</Text>
          </View>
          <View style={{flex: 5}}/>
        </View>
      </View>
    )
  }
}

function DisplayRandomRoles(gameContext:GameContextType) {
  const randomRoles = gameContext.roleCountAll.find((roleCount) => roleCount.roles.length > 1)
  if (randomRoles) {
    if (randomRoles.roles.length === 2) {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 16, flexDirection: 'row', alignItems: 'center', marginVertical: '2.5%'}}>
            <View style={{flex: 1}}/>
            <View style={{flex: 1, marginHorizontal: '2.5%'}}>
              <RoleCards key={randomRoles.roles[0]} role={randomRoles.roles[0]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '2.5%'}}>
              <RoleCards key={randomRoles.roles[1]} role={randomRoles.roles[1]}/>
            </View>
            <View style={{flex: 1}}/>
          </View>
          <View>
            <Text style={{ ...appStyle.text, textAlign: 'center' }}>Draw {randomRoles.count}</Text>
          </View>
          <View style={{flex: 1}}/>
        </View>
      )
    } else if (randomRoles.roles.length === 3) {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 22, flexDirection: 'row', alignItems: 'center', marginVertical: '2.5%'}}>
            <View style={{flex: 1}}/>
            <View style={{flex: 2, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[0]} role={randomRoles.roles[0]}/>
            </View>
            <View style={{flex: 2, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[1]} role={randomRoles.roles[1]}/>
            </View>
            <View style={{flex: 2, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[2]} role={randomRoles.roles[2]}/>
            </View>
            <View style={{flex: 1}}/>
          </View>
          <View>
            <Text style={{ ...appStyle.text, textAlign: 'center' }}>Draw {randomRoles.count}</Text>
          </View>
          <View style={{flex: 1}}/>
        </View>
      )
    } else if (randomRoles.roles.length === 4) {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 12, flexDirection: 'row', alignItems: 'center', marginVertical: '1%'}}>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[0]} role={randomRoles.roles[0]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[1]} role={randomRoles.roles[1]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[2]} role={randomRoles.roles[2]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[3]} role={randomRoles.roles[3]}/>
            </View>
          </View>
          <View>
            <Text style={{ ...appStyle.text, textAlign: 'center' }}>Draw {randomRoles.count}</Text>
          </View>
          <View style={{flex: 1}}/>
        </View>
      )
    } else if (randomRoles.roles.length === 5) {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 5, flexDirection: 'row', alignItems: 'center', marginVertical: '1%'}}>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[0]} role={randomRoles.roles[0]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[1]} role={randomRoles.roles[1]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[2]} role={randomRoles.roles[2]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[3]} role={randomRoles.roles[3]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[4]} role={randomRoles.roles[4]}/>
            </View>
          </View>
          <View>
            <Text style={{ ...appStyle.text, textAlign: 'center' }}>Draw {randomRoles.count}</Text>
          </View>
          <View style={{flex: 1}}/>
        </View>
      )
    }else if (randomRoles.roles.length === 6) {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 3, flexDirection: 'row', alignItems: 'center', marginVertical: '1%'}}>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[0]} role={randomRoles.roles[0]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[1]} role={randomRoles.roles[1]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[2]} role={randomRoles.roles[2]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[3]} role={randomRoles.roles[3]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[4]} role={randomRoles.roles[4]}/>
            </View>
            <View style={{flex: 1, marginHorizontal: '1%'}}>
              <RoleCards key={randomRoles.roles[5]} role={randomRoles.roles[5]}/>
            </View>
          </View>
          <View>
            <Text style={{ ...appStyle.text, textAlign: 'center' }}>Draw {randomRoles.count}</Text>
          </View>
          <View style={{flex: 1}}/>
        </View>
      )
    }
  } else {
    return (<></>)
  }
}
  
const body = `Shuffle the role cards shown in the chart below and secretly distribute one role card to each player.`
const speech = `Shuffle the role cards shown in the chart below and secretly distribute one role card to each player.`