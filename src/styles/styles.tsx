import { StyleSheet } from "react-native"
import { colors } from "./colors";

export const appStyle = StyleSheet.create({  
  frame: {
    borderWidth: 3, borderColor: colors.white, borderRadius: 20, backgroundColor: colors.blackTransparent
  },
  text: {
    color: colors.white, fontFamily: 'goodbyeDespair', fontSize: 16
  }
})

export const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 3,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  button: {
    backgroundColor: colors.blackLessTransparent,
    borderRadius: 20,
    minHeight: 28,
    width: 100,
    margin: 10,
    padding: 10,
    elevation: 2,
    justifyContent: 'center'
  },
  textStyle: {
    color: colors.white,
    fontFamily: 'goodbyeDespair',
    fontSize: 18,
    textAlign: 'center'
  },
  modalText: {
    color: colors.black,
    fontFamily: 'goodbyeDespair',
    fontSize: 18,
    margin: 10,
    textAlign: 'center'
  },
  modalTextInput: {
    textAlign: 'center',
    color: colors.black,
    fontSize: 16,
    borderColor: colors.black,
    borderBottomWidth: 1,
    width: 125
  }
});