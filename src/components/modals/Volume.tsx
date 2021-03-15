import React, { useContext, useState } from "react"
import { Modal, View, Text, TouchableHighlight } from "react-native"
import { modalStyles } from "../../styles/styles"
import Slider from '@react-native-community/slider'
import { colors } from "../../styles/colors"
import { GameContext, MUSIC_VOLUME_DEFAULT } from "../../../AppContext"
import { Audio } from "expo-av"
import SpeakerButton from '../SpeakerButton'
import { micCheckSpeech } from "../../data/Speeches"

export default function VolumeModal({visible, setVisible, sound}:Props) {
  const gameContext = useContext(GameContext)
  const [musicVolumeScale, setMusicVolumeScale] = useState((gameContext.musicVolume / (2 * MUSIC_VOLUME_DEFAULT)) * 10)
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View>
            <Text style={{...modalStyles.modalText}}>
              Volume Settings
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{...modalStyles.modalText}}>
              Music: {musicVolumeScale}
            </Text>
            <Slider
              style={{width: 100, height: 25, alignSelf: 'center'}}
              value={musicVolumeScale}
              minimumValue={0}
              maximumValue={10}
              step={1}
              onValueChange={async (value) => {
                gameContext.musicVolume = MUSIC_VOLUME_DEFAULT * value / 10 * 2
                await sound.setVolumeAsync(gameContext.musicVolume)
                setMusicVolumeScale(value)
              }}
              thumbTintColor={colors.black}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#000000"
            />
            <SpeakerButton speech={micCheckSpeech} color={colors.black}/>
          </View>
          <TouchableHighlight
            style={{...modalStyles.button}}
            onPress={() => { setVisible(!visible) }}>
            <Text style={modalStyles.textStyle}>OK</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  )
}

type Props = {visible:boolean, setVisible:React.Dispatch<any>, sound:Audio.Sound}
