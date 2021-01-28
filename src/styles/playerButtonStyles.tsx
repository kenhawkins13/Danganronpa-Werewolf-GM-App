import { PlayerInfo } from "../types/types"
import { blackTransparent, darkGrey, greyTransparent } from "./colors"

export function enablePlayerButton(playerInfo:PlayerInfo) {
  playerInfo.playerButtonStyle.disabled = false
  playerInfo.playerButtonStyle.textColor = 'white'
  playerInfo.playerButtonStyle.backgroundColor = blackTransparent
  playerInfo.playerButtonStyle.borderColor = 'white'
}

export function disablePlayerButton(playerInfo:PlayerInfo) {
  playerInfo.playerButtonStyle.disabled = true
  playerInfo.playerButtonStyle.textColor = darkGrey
  playerInfo.playerButtonStyle.backgroundColor = greyTransparent
  playerInfo.playerButtonStyle.borderColor = 'white'
}