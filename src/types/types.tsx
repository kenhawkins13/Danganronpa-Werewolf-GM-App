export type RoleCount = {roles:string[], count:number}
export type PlayerInfo = {
  playerIndex:number,
  name:string,
  role:string,
  side:string,
  alive:boolean,
  backgroundColor:string,
  borderColor:string,
  useAbility:string,
  useItem:string
}
export type GameContextType = {
  mode:string,
  playerCount:number,
  killsLeft:number,
  roleCounts:RoleCount[],
  playersInfo:PlayerInfo[],
  dayNumber:number,
  stage:string,
  blackenedAttack:number,
  alterEgoAlive:boolean,
  monomiExploded:boolean,
  monomiProtect:number,
  vicePlayed:boolean,
  currentPlayerIndex:number // TODO: remove
}