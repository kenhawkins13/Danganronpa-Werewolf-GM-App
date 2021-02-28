import { PlayerInfo } from "../types/types"
import { colors } from "./colors"

export function enablePlayerButton(playerInfo:PlayerInfo) {
  playerInfo.playerButtonStyle.disabled = false
  playerInfo.playerButtonStyle.textColor = colors.white
  playerInfo.playerButtonStyle.backgroundColor = colors.blackTransparent
  playerInfo.playerButtonStyle.underlayColor = colors.blackTransparent
  playerInfo.playerButtonStyle.borderColor = colors.white
}

export function disablePlayerButton(playerInfo:PlayerInfo) {
  playerInfo.playerButtonStyle.disabled = true
  playerInfo.playerButtonStyle.textColor = colors.darkGrey
  playerInfo.playerButtonStyle.backgroundColor = colors.greyTransparent
  playerInfo.playerButtonStyle.borderColor = colors.white
}