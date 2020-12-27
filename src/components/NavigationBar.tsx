import { useNavigation } from "@react-navigation/native"
import React from "react"
import { TouchableHighlight, View, Text } from "react-native"
import { pinkTransparent } from "../styles/colors"
import { appStyle } from "../styles/styles"

export default function NavigationBar({previousPage, nextPage, onPrevious, onNext}: Props) {
  const navigation = useNavigation()
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableHighlight style={{...appStyle.frame, width: 150, height: 50, alignItems: 'center', justifyContent: 'center'}} 
            onPress={() => { onButton(navigation, previousPage, onPrevious) }}>
            <Text style={appStyle.text}>PREVIOUS</Text>
          </TouchableHighlight>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {nextButton(navigation, nextPage, onNext)}
        </View>
      </View>
    )
}

function nextButton(navigation:any, nextPage:string, onNext?:() => boolean) {
  if (nextPage === 'NightTimeScreen') {
    return (
      <TouchableHighlight style={{...appStyle.frame, width: 150, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: pinkTransparent}} 
        onPress={() => onButton(navigation, nextPage, onNext)}>
        <Text style={appStyle.text}>START</Text>
      </TouchableHighlight>
    )    
  } else {
    return (
      <TouchableHighlight style={{...appStyle.frame, width: 150, height: 50, alignItems: 'center', justifyContent: 'center'}} 
        onPress={() => onButton(navigation, nextPage, onNext)}>
        <Text style={appStyle.text}>NEXT</Text>
      </TouchableHighlight>
    )
  }
}

function onButton(navigation: any, page: string, onButton?: () => boolean) {
  if (onButton) {
    if (onButton()) {
      navigation.navigate(page)
    }
  } else {
    navigation.navigate(page)
  }
}

type Props = { previousPage: string, nextPage: string, onPrevious?: () => boolean, onNext?: () => boolean }
