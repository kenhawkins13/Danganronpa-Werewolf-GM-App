export const nightTimeSpeech = {
  schoolAnnouncement1: "Mm, ahem, this is a school announcement. It is now 10 p.m. As such, it is officially nighttime. \
  Okay then. Sweet dreams, everyone! Good night, sleep tight, don't let the bed bugs bite. Everyone go to sleep.",
  schoolAnnouncement2: "It is now nighttime.",
  schoolAnnouncement3: "Would anyone like to use an ability or item? Click on the player and enter any investigative abilities or items.",
  everyoneSleep1: "Everyone go to sleep.",
  everyoneSleep2: "Everyone should now be asleep.",
  traitors1: "Traitors, wake up.",
  traitors2: "On the screen, I will reveal all the traitors in grey and the blackened in pink.",
  traitors3: "Traitors, go back to sleep.",
  monomi1: "Moenoemi, wake up.",
  monomi2: "Click the player you would like to protect. You do not have to protect somebody. \
  I will automatically move on in 15 seconds.",
  monomi3: "Moenoemi, go back to sleep.",
  alterEgo1: "Alter ego, wake up.",
  alterEgo2: "Click the player you would like to investigate.",
  alterEgo3: "Alter ego, go back to sleep.",
  blackened1: "Blackened, wake up.",
  blackened2: "Click the player you would like to attack. The victim will only lose an item card.",
  blackened3: "Click the player you would like to attack.",
  blackened4: "Since vice was played this morning, the Blackened will not attack anyone tonight.",
  blackened5: "U pu pu pu. Blackened, go back to sleep.",
  kyokoKirigiri: "Click the player you would like to investigate whether they are on the side of hope or despair.",
  yasuhiroHagakure1: 'Click the player you would like to investigate whether they are the despair disease patient or not the despair disease patient',
  yasuhiroHagakure2: 'Click the player you would like to investigate whether they are Moenoemi or not Moenoemi',
  glasses: "Click the player you would like to investigate whether they are on the side of hope or despair.",
  someonesGraduationAlbum: "Click the player you would like to investigate whether they are a traitor or not a traitor.",
  silentReceiver: "Click the player you would like to investigate whether they are a spotless or not a spotless.",
}

export const goodMorningSpeech = (dayNumber:number) => {
  const days = ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight", "ninth"]
  if (dayNumber < 10) {
    return "Good morning, everyone! It is the morning of the " + days[dayNumber] + " day. Get ready to greet another beee-yutiful day"
  } else {
    return "Good morning, everyone! What day is it today? I lost count. Does it mattter anyways? Get ready to greet another beee-yutiful day"
  }
}

export const morningTimeSpeech = (name1?:string, name2?:string, name3?:string) => {
  return {
    announceAttack: name1 + ", was attacked by the Blackened last night.",
    monomi1: "Did Moenoemi protect" + name1 + " last night? ",
    monomi2: "Yes, she did. " + name2 + " explodes and dies to protect " + name1,
    monomi3: "No, she did not.",
    victim1: name1 + ", discard one Item card.",
    victim2: name1 + ", would you like to use an ability or item to prevent your death?",
    playersAbilities: "Would anybody like to use an ability to protect " + name1 + "?",
    giveItems: name2 + " and " + name3 + ", would either of you like to give an item to " + name1 + "?",
    bodyDiscovery1: name1 + " has been killed.",
    bodyDiscovery2: "U pu pu pu. " + name1 + " was the Alter Ego.",
    bodyDiscovery3: "How disappointing. " + name1 + " was the Blackened",
    abilityOrItem: "Would anybody like to use an ability or item before moving on to day time?"
  }
}

export const dayTimeSpeech = (name?:string, killsLeft?:number) => {
  return {
    daySpeech1: "It is the day time. A body has been discovered! Now then, after a certain amount of time has passed, \
      the class trial will begin!",
    daySpeech2: "It is the day time.",
    abilityOrItem: "Would anybody like to use an ability or item?",
    discussion: "Discussion starts now.",
    abilityOrItemTrial: "Would anybody like to use an ability or item before voting?",
    trial: "Up next is the voting segment where each player points to who they think is the Blackened. \
      Click Continue when everyone is ready to vote.",
    vote: "Three. Two. One. Vote!",
    execution: name + " has received the most votes and has been executed.",
    killsLeft1: "U pu pu pu. " + name + " was the Alter Ego. The game continues and the Blackened needs " + 
    killsLeft  + " more " + killOrKills(killsLeft!) + "to win.",
    killsLeft2: name + " was not the Blackened player. The game continues and the Blackened needs " + killsLeft  + " more " 
      + killOrKills(killsLeft!) + "to win."
  }
}

const killOrKills = (num:number) => num === 1 ? "kill" : "kills"
