import { RoleCount } from "../types/types"

export function calculateRoles(Mode: string, PlayerCount:number):RoleCount[] {
  let roleCount
  switch (Mode) {
    case 'normal':
      roleCount = normal
      break
    case 'extreme':
      roleCount = extreme
      break
    case 'maniax':
      roleCount = maniaxWithoutMonomi
      break
  }
  
  return (
    [
      {roles: ["Alter Ego"], count: roleCount.alterEgo[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Spotless"], count: roleCount.spotless[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Monomi"], count: roleCount.monomi[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Despair Disease Patient"], count: roleCount.despairDiseasePatient[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Future Foundation"], count: roleCount.futureFoundation[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Blackened"], count: roleCount.blackened[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Zakemono"], count: roleCount.zakemono[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Traitor"], count: roleCount.traitor[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Remnants of Despair"], count: roleCount.remnantsOfDespair[PlayerCount as keyof fourThruSixteen]},
      {roles: ["Ultimate Despair"], count: roleCount.ultimateDespair[PlayerCount as keyof fourThruSixteen]},
      {roles: roleCount.randomRoles[PlayerCount as keyof fourThruSixteen].roles, count: roleCount.randomRoles[PlayerCount as keyof fourThruSixteen].number},
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

The “~” means the left number is guaranteed and the right number is possibly added to the game. For 
example, in a four player Extreme Mode game, shuffle one Spotless and the Despair Disease Patient card,
draw one and discard the other without looking, then add the drawn card (without looking) with the Alter
Ego, one Spotless, and the Blackened card. Randomly distribute these four Role Cards to each player.
*/

const normal = {
  alterEgo: {4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1},
  spotless: {4:2, 5:3, 6:3, 7:4, 8:5, 9:5, 10:6, 11:7, 12:7, 13:8, 14:9, 15:9, 16:10},
  monomi: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  despairDiseasePatient: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  futureFoundation: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  blackened: {4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1},
  zakemono: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  traitor: {4:0, 5:0, 6:1, 7:1, 8:1, 9:1, 10:2, 11:2, 12:2, 13:3, 14:3, 15:3, 16:4},
  remnantsOfDespair: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  ultimateDespair: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  randomRoles: {
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

const extreme = {
  alterEgo: {4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1},
  spotless: {4:1, 5:2, 6:3, 7:3, 8:3, 9:4, 10:5, 11:5, 12:6, 13:6, 14:7, 15:8, 16:8},
  monomi: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  despairDiseasePatient: {4:0, 5:0, 6:1, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  futureFoundation: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  blackened: {4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1},
  zakemono: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  traitor: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:1, 11:1, 12:1, 13:2, 14:2, 15:2, 16:3},
  remnantsOfDespair: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  ultimateDespair: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  randomRoles: {
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
}

/*
MANIAX MODE (with Monomi)
  # of Players            |  4   5   6   7   8   9   10  11  12  13  14  15  16 
  -----------------------------------------------------------------------------
  Alter Ego               |  1   1   1   1   1   1   1   1   1   1   1   1   1 
  Spotless                | 1~2 2~3 2~3  2   3  3~4  3  3~4 4~5 4~5 5~6 6~7 6~7
  Monomi                  |  -   -   -  0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1
  Despair Disease Patient | 0~1 0~1 0~1  -   -   -   -   -   -   -   -   -   -
  Future Foundation       |  -   -   -  0~1 0~1 0~1  1   1   1   1   1   1   1
  Blackened               |  1   1   1   1   1   1   1   1   1   1   1   1   1 
  Zakemono                | 0~1 0~1 0~1  -   -   -   -   -   -   -   -   -   -
  Traitor                 |  -   -   -  0~1 0~1 0~1 1~2 1~2 1~2 2~3 2~3 2~3 3~4
  Remnants of Despair     |  -   -   -  0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1
  Ultimate Despair        |  -   -   -  0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1
  # of Kills              |  1   1   1   2   2   2   3   3   3   4   4   4   5
*/

const maniaxWithMonomi = {
  alterEgo: {4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1},
  spotless: {4:1, 5:2, 6:2, 7:2, 8:3, 9:3, 10:3, 11:3, 12:4, 13:4, 14:5, 15:6, 16:6},
  monomi: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  despairDiseasePatient: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  futureFoundation: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1},
  blackened: {4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1},
  zakemono: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  traitor: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:1, 11:1, 12:1, 13:2, 14:2, 15:2, 16:3},
  remnantsOfDespair: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  ultimateDespair: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  randomRoles: {
    4:{number: 1, roles: ["Spotless", "Despair Disease Patient", "Zakemono"]},
    5:{number: 1, roles: ["Spotless", "Despair Disease Patient", "Zakemono"]},
    6:{number: 2, roles: ["Spotless", "Despair Disease Patient", "Zakemono"]},
    7:{number: 3, roles: ["Future Foundation", "Monomi", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    8:{number: 3, roles: ["Future Foundation", "Monomi", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    9:{number: 4, roles: ["Spotless", "Future Foundation", "Monomi", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    10:{number: 3, roles: ["Monomi", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    11:{number: 4, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    12:{number: 4, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    13:{number: 4, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    14:{number: 4, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    15:{number: 4, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    16:{number: 4, roles: ["Spotless", "Monomi", "Traitor", "Ultimate Despair", "Remnants of Despair"]}
  }
}

/*
MANIAX MODE (without Monomi)
  # of Players            |  4   5   6   7   8   9   10  11  12  13  14  15  16 
  -----------------------------------------------------------------------------
  Alter Ego               |  1   1   1   1   1   1   1   1   1   1   1   1   1 
  Spotless                | 1~2 2~3 2~3  2   3  3~4  4  4~5 5~6 5~6 6~7 7~8 7~8
  Monomi                  |  -   -   -   -   -   -   -   -   -   -   -   -   -
  Despair Disease Patient | 0~1 0~1 0~1  -   -   -   -   -   -   -   -   -   -
  Future Foundation       |  -   -   -   1   1   1   1   1   1   1   1   1   1
  Blackened               |  1   1   1   1   1   1   1   1   1   1   1   1   1
  Zakemono                | 0~1 0~1 0~1  -   -   -   -   -   -   -   -   -   -
  Traitor                 |  -   -   -  0~1 0~1 0~1 1~2 1~2 1~2 2~3 2~3 2~3 3~4
  Remnants of Despair     |  -   -   -  0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1
  Ultimate Despair        |  -   -   -  0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1 0~1
  # of Kills              |  1   1   1   2   2   2   3   3   3   4   4   4   5
*/

const maniaxWithoutMonomi = {
  alterEgo: {4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1},
  spotless: {4:1, 5:2, 6:2, 7:2, 8:3, 9:3, 10:4, 11:4, 12:5, 13:5, 14:6, 15:7, 16:7},
  monomi: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  despairDiseasePatient: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  futureFoundation: {4:0, 5:0, 6:0, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1},
  blackened: {4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1},
  zakemono: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  traitor: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:1, 11:1, 12:1, 13:2, 14:2, 15:2, 16:3},
  remnantsOfDespair: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  ultimateDespair: {4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0},
  randomRoles: {
    4:{number: 1, roles: ["Spotless", "Despair Disease Patient", "Zakemono"]},
    5:{number: 1, roles: ["Spotless", "Despair Disease Patient", "Zakemono"]},
    6:{number: 2, roles: ["Spotless", "Despair Disease Patient", "Zakemono"]},
    7:{number: 2, roles: ["Traitor", "Ultimate Despair", "Remnants of Despair"]},
    8:{number: 2, roles: ["Traitor", "Ultimate Despair", "Remnants of Despair"]},
    9:{number: 3, roles: ["Spotless", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    10:{number: 2, roles: ["Traitor", "Ultimate Despair", "Remnants of Despair"]},
    11:{number: 3, roles: ["Spotless", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    12:{number: 3, roles: ["Spotless", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    13:{number: 3, roles: ["Spotless", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    14:{number: 3, roles: ["Spotless", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    15:{number: 3, roles: ["Spotless", "Traitor", "Ultimate Despair", "Remnants of Despair"]},
    16:{number: 3, roles: ["Spotless", "Traitor", "Ultimate Despair", "Remnants of Despair"]}
  }
}

type fourThruSixteen = {4:number, 5:number, 6:number, 7:number, 8:number, 9:number, 10:number,
  11:number, 12:number, 13:number, 14:number, 15:number, 16:number}