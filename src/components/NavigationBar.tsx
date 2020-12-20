import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Button, View } from "react-native"

export default function NavigationBar({previousPage, nextPage, callback}: Props) {
  const navigation = useNavigation()
    return (
      <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'grey'}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Button title='Previous' onPress={() => navigation.navigate(previousPage)}/>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Button title='Next' onPress={() => onNextButton(navigation, nextPage, callback)}/>
        </View>
      </View>
    )
}

function onNextButton(navigation: any, nextPage: string, callback?: () => boolean) {
  if (callback) {
    if (callback()) {
      navigation.navigate(nextPage)
    }
  } else {
    navigation.navigate(nextPage)
  }
}

type Props = { previousPage: string, nextPage: string, callback?: () => boolean }