import React from "react"
import { GameContextType } from "./src/types/types"

export const GameContext = React.createContext({} as GameContextType)

// Fraction to reduce music volume because the music is fairly loud compared to the text-to-voice volume
export const MUSIC_VOLUME_DEFAULT = .1