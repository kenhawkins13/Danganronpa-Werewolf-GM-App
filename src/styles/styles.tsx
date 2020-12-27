import { StyleSheet } from "react-native"
import { blackTransparent } from "./colors";

export const appStyle = StyleSheet.create({  
  frame: {
    borderWidth: 3, borderColor: 'white', borderRadius: 20, backgroundColor: blackTransparent
  },
  text: {
    color: 'white', fontFamily: 'goodbyeDespair', fontSize: 16
  }
})

export const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    backgroundColor: "white",
    borderColor: 'black',
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
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 20,
    width: 100,
    margin: 10,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontFamily: 'goodbyeDespair',
    fontSize: 18,
    textAlign: "center"
  },
  modalText: {
    color: 'black',
    fontFamily: 'goodbyeDespair',
    fontSize: 18,
    margin: 10,
    textAlign: 'center'
  },
  modalTextInput: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    borderColor: 'black',
    borderBottomWidth: 1,
    width: 125
  }
});