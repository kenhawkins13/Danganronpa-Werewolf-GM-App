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
  customizeRolesMode:string,
  roleCountAll:RoleCount[],
  playersInfo:PlayerInfo[],
  dayNumber:number,
  killsLeft:number,
  blackenedAttack:number,
  alterEgoAlive:boolean,
  monomiExploded:boolean,
  monomiProtect:number,
  remnantsOfDespairFound:boolean,
  nekomaruNidaiEscort:number,
  nekomaruNidaiIndex:number,
  vicePlayed:boolean,
  easterEggIndex:number
  tieVoteCount:number,
  winnerSide:string,
  backgroundMusic:any,
  musicVolume:number
}