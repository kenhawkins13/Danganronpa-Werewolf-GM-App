export type RoleCount = {roles:string[], count:number}
export type PlayerButtonStyle = {disabled: boolean, textColor:string, backgroundColor:string, borderColor:string, underlayColor:string}
export type PlayerInfo = {
  playerIndex:number,
  name:string,
  role:string,
  side:string,
  alive:boolean,
  useAbility:string,
  useItem:string,
  playerButtonStyle:PlayerButtonStyle
}
export type GameContextType = {
  mode:string,
  playerCount:number,
  killsLeft:number,
  roleCounts:RoleCount[],
  playersInfo:PlayerInfo[],
  dayNumber:number,
  blackenedAttack:number,
  alterEgoAlive:boolean,
  monomiExploded:boolean,
  monomiProtect:number,
  vicePlayed:boolean,
  tieVoteCount:number,
  winnerSide:string,
  backgroundMusic:any
}