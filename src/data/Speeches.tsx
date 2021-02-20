export const nightTimeSpeech = {
  schoolAnnouncement1: "Mm, ahem, this is a school announcement. It is now 10 p.m. As such, it is officially nighttime. \
  Okay then. Sweet dreams, everyone! Good night, sleep tight, don't let the bed bugs bite. Everyone go to sleep.",
  schoolAnnouncement2: "It is now nighttime.",
  schoolAnnouncement3: "Would anyone like to use an ability or item? Click on the player and enter any investigative abilities or items.",
  everyoneSleep1: "Everyone go to sleep. The curfew is now in effect.",
  everyoneSleep2: "Everyone should now be asleep.",
  traitors1: "Traitors, wake up.",
  traitors2: "On the screen, the traitors are revealed in grey and the blackened in pink.",
  traitors3: "Traitors, go back to sleep.",
  monomi1: "Moenoemi, wake up.",
  monomi2: "You have the option to protect someone. You have 15 seconds to decide.",
  monomi3: "Moenoemi, go back to sleep.",
  alterEgo1: "Alter ego, wake up.",
  alterEgo2: "Investigate whether a player is on the side of hope or despair.",
  alterEgo3: "Alter ego, go back to sleep.",
  blackened1: "Blackened, wake up.",
  blackened2: "Choose a player to attack. The victim will only lose an item card.",
  blackened3: "Choose a player to attack.",
  blackened4: "Oh no, vice was played this morning so the Blackened can't go murdering tonight. What a shame.",
  blackened5: "U pu pu pu. Blackened, go back to sleep.",
  kyokoKirigiri: "Investigate whether a player is on the side of hope or despair.",
  yasuhiroHagakure1: 'Investigate whether a player is the despair disease patient.',
  yasuhiroHagakure2: 'Investigate whether a player is Moenoemi.',
  glasses: "Investigate whether a player is on the side of hope or despair.",
  someonesGraduationAlbum: "Investigate whether a player is a traitor.",
  silentReceiver: "Investigate whether a player is a spotless.",
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
    monomi1: "Did Moenoemi get in the way of the murder last night? ",
    monomi2: "Yes, " + name2 + " exploded and died to protect " + name1 + ".",
    monomi3: "Good riddance, I hated Moenoemi anyways.",
    monomi4: "Of course not. Moenoemi is as useless as she is ugly.",
    victim1: name1 + ", discard one Item card.",
    victim2: name1 + ", would you like to use an ability or item to prevent your death?",
    playersAbilities: "Would anybody like to use an ability to protect " + name1 + "?",
    giveItems: name2 + " and " + name3 + ", would either of you like to give an item to " + name1 + "?",
    victim3: name1 + ", would you like to use a gifted item to save yourself?",
    bodyDiscovery1: "U pu pu pu. " + name1 + " has been killed.",
    bodyDiscovery2: "Buah hahaha! " + name1 + " is dead. They were the Alter Ego.",
    bodyDiscovery3: "Unbelievable, " + name1 + ". You managed to get yourself killed. You are the worst Blackened ever.",
    abilityOrItem: "Would anybody like to use an ability or item before moving on to day time?",
    amuletOfTakejin: name1 + ", did you play the item card, Amulet of Takayjin?",
    vice: "Was the item card, Vice, played?"
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
    vote1: "Three. Two. One. Vote!",
    vote2: "Who received the most votes?",
    execution1: "Let's give it everything we've got! IIIIIT'S PUNISHMENT TIME!",
    execution2: name + " has been executed.",
    winnerDeclaration1: name + " was the Blackened.",
    winnerDeclaration2: name + " was the Ultimate Despair.",
    winnerDeclaration3: name + " was not the Blackened.",
    killsLeft1: "Buah hahaha. " + name + " was the Alter Ego. The game continues and the Blackened needs " + 
      killsLeft  + " more " + killOrKills(killsLeft!) + "to win.",
    killsLeft2: "U pu pu pu. " + name + " was not the Blackened player. The game continues and the Blackened needs " + killsLeft  + 
    " more " + killOrKills(killsLeft!) + "to win."
  }
}

const killOrKills = (num:number) => num === 1 ? "kill" : "kills"
