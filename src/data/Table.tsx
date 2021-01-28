import { RoleCount } from "../types/types"

export function calculateRoles(Mode: string, PlayerCount:number):RoleCount[] {
  const alterEgoCount = Mode == 'normal' ? alterEgoNormal : alterEgoExtreme
  const blackenedCount = Mode == 'normal' ? blackenedNormal : blackenedExtreme
  const spotlessCount = Mode == 'normal' ? spotlessNormal : spotlessExtreme
  const despairDiseasePatientCount = Mode == 'normal' ? emptyList : despairDiseasePatientExtreme
  const traitorCount = Mode == 'normal' ? traitorNormal : traitorExtreme
  const monomiCount = Mode == 'normal' ? emptyList : monomiExtreme
  const ultimateDespairCount = Mode == 'normal' ? emptyList : ultimateDespairExtreme
  const randomRolesCount  = Mode == 'normal' ? randomRolesNormal : randomRolesExtreme
  return (
    [
      {roles: ["Alter Ego"], count: alterEgoCount[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Blackened"], count: blackenedCount[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Spotless"], count: spotlessCount[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Despair Disease Patient"], count: despairDiseasePatientCount[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Traitor"], count: traitorCount[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Monomi"], count: monomiCount[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Ultimate Despair"], count: ultimateDespairCount[PlayerCount as keyof fourThruSixteen]},
      {roles: randomRolesCount[PlayerCount as keyof fourThruSixteen].roles, count: randomRolesCount[PlayerCount as keyof fourThruSixteen].number},
    ]

  )
}

export function roleInPlay(roleCounts:RoleCount[], role:string):boolean {
  const roleCount = roleCounts.find((value) => { return areEqual(value.roles, [role]) })!
  if (roleCount.count > 0) {
    return true
  }
  const randomRoles = roleCounts[roleCounts.length - 1]
  if (randomRoles.roles.includes(role)) {
    return true
  }
  return false
}

function areEqual(array1: any[], array2: any[]):boolean {
  if (JSON.stringify(array1) === JSON.stringify(array2)) {
    return true
  } else {
    return false
  }
}

const kills = {4:1, 5:1, 6:1, 7:2, 8:2, 9:2, 10:3, 11:3, 12:3, 13:4, 14:4, 15:4, 16:5}
export function requiredKills(PlayerCount:number) {
  return kills[PlayerCount as keyof fourThruSixteen]
}

/*
NORMAL MODE
  # of Players |  4   5   6   7   8   9   10  11  12  13  14  15  16 
  ------------------------------------------------------------------
  Alter Ego    |  1   1   1   1   1   1   1   1   1   1   1   1   1 
  Spotless     |  2   3   3   4   5  5~6  6   7  7~8  8   9  9~10 10
  Blackened    |  1   1   1   1   1   1   1   1   1   1   1   1   1 
  Traitor      |  -   -   1   1   1  1~2  2   2  2~3  3   3  3~4  4
  # of Kills   |  1   1   1   2   2   2   3   3   3   4   4   4   5
*/
const alterEgoNormal = {4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1}
const spotlessNormal = {4:2, 5:3, 6:3, 7:4, 8:5, 9:5, 10:6, 11:7, 12:7, 13:8, 14:9, 15:9, 16:10}
const blackenedNormal = {4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1}
const traitorNormal = {4:0, 5:0, 6:1, 7:1, 8:1, 9:1, 10:2, 11:2, 12:2, 13:3, 14:3, 15:3, 16:4}
const emptyList = {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0}
/*
The “~” means the left number is guaranteed and the right number is possibly added to the game. For 
example, in a four player Extreme Mode game, shuffle one Spotless and the Despair Disease Patient card,
draw one and discard the other without looking, then add the drawn card (without looking) with the Alter
Ego, one Spotless, and the Blackened card. Randomly distribute these four Role Cards to each player.
*/
const randomRolesNormal = {
  4:{number: 0, roles: []},
  5:{number: 0, roles: []},
  6:{number: 0, roles: []},
  7:{number: 0, roles: []},
  8:{number: 0, roles: []},
  9:{number: 1, roles: ["Spotless","Traitor"]},
  10:{number: 0, roles: []},
  11:{number: 0, roles: []},
  12:{number: 1, roles: ["Spotless","Traitor"]},
  13:{number: 0, roles: []},
  14:{number: 0, roles: []},
  15:{number: 1, roles: ["Spotless","Traitor"]},
  16:{number: 0, roles: []}
}

/*
EXTREME MODE
  # of Players            |  4   5   6   7   8   9   10  11  12  13  14  15  16 
  -----------------------------------------------------------------------------
  Alter Ego               |  1   1   1   1   1   1   1   1   1   1   1   1   1 
  Spotless                | 1~2 2~3  3   3  3~4 4~5  5  5~6 6~7 6~7 7~8 8~9 8~9
  Monomi                  |  -   -   -  0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1
  Despair Disease Patient | 0~1 0~1  1   -   -   -   -   -   -   -   -   -   -
  Blackened               |  1   1   1   1   1   1   1   1   1   1   1   1   1 
  Traitor                 |  -   -   -  0~1 0~1 0~1 1~2 1~2 1~2 2~3 2~3 2~3 3~4
  UltimateDespair         |  -   -   -  0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1
  # of Kills              |  1   1   1   2   2   2   3   3   3   4   4   4   5
*/
const alterEgoExtreme = {4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1}
const spotlessExtreme = {4:1, 5:2, 6:3, 7:3, 8:3, 9:4, 10:5, 11:5, 12:6, 13:6, 14:7, 15:8, 16:8}
const monomiExtreme = {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0}
const despairDiseasePatientExtreme = {4:0, 5:0, 6:1, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0}
const blackenedExtreme = {4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1}
const traitorExtreme = {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:1, 11:1, 12:1, 13:2, 14:2, 15:2, 16:3}
const ultimateDespairExtreme = {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0}
/*
The “~” means the left number is guaranteed and the right number is possibly added to the game. For 
example, in a four player Extreme Mode game, shuffle one Spotless and the Despair Disease Patient card,
draw one and discard the other without looking, then add the drawn card (without looking) with the Alter
Ego, one Spotless, and the Blackened card. Randomly distribute these four Role Cards to each player.
*/
const randomRolesExtreme = {
  4:{number: 1, roles: ["Spotless", "Despair Disease Patient"]},
  5:{number: 1, roles: ["Spotless", "Despair Disease Patient"]},
  6:{number: 0, roles: []},
  7:{number: 2, roles: ["Monomi", "Traitor", "Ultimate Despair"]},
  8:{number: 3, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair"]},
  9:{number: 3, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair"]},
  10:{number: 2, roles: ["Monomi", "Traitor", "Ultimate Despair"]},
  11:{number: 3, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair"]},
  12:{number: 3, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair"]},
  13:{number: 3, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair"]},
  14:{number: 3, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair"]},
  15:{number: 3, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair"]},
  16:{number: 3, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair"]}
}

type fourThruSixteen = {4:number, 5:number, 6:number, 7:number, 8:number, 9:number, 10:number,
  11:number, 12:number, 13:number, 14:number, 15:number, 16:number}