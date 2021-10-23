// "Mike" is a misspelling of "mic" as it is misspelled in the game.
export const micCheckSpeech = "Ahem, Ahem! Testing, testing! Mike check, one two! This is a test of the school broadcast system!"

export const nightTimeSpeech = (killsLeft?:number, name?:string) => {
  return {
    schoolAnnouncement1: "Mm, ahem, this is a school announcement. It is now 10 p.m. As such, it is officially nighttime. \
    Okay then. Sweet dreams, everyone! Good night, sleep tight, don't let the bed bugs bite. Everyone, close your eyes and go to sleep.",
    schoolAnnouncement2: "It is now nighttime.",
    schoolAnnouncement3: "Would anyone like to use an ability or item? Select your player and enter any investigative abilities or items.",
    schoolAnnouncement4: "Would anyone like to use an ability or item?",
    schoolAnnouncement5: "Everyone go to sleep. The curfew is now in effect.",
    schoolAnnouncement6: "It is now nighttime. Everyone go to sleep. The curfew is now in effect.",
    schoolAnnouncement7: "Everyone should now be asleep.",
    traitors1: "Traitors, wake up.",
    traitors2: "The Traitors are highlighted in grey and the Blackened is highlighted in pink.",
    traitors3: "Traitors, go back to sleep.",
    monomi1: "Mownohmi, wake up.",
    monomi2: "You have the option to protect someone. You have 15 seconds to decide.",
    monomi3: "Mownohmi, go back to sleep.",
    alterEgo1: "Alter ego, wake up.",
    alterEgo2: "Investigate whether a player is on the side of Hope or Despair.",
    alterEgo3: "Alter ego, go back to sleep.",
    alterEgo4: name + " played Easter Egg last night so Alter Ego does not get to investigate tonight. A hahahaha!",
    blackened1: "Blackened, wake up.",
    blackened2: "You need to kill " + killsLeft + " " + personOrPeople(killsLeft!) + " and survive through " + killsLeft + " " +
      trialOrTrials(killsLeft!) + "  to win.",
    blackened3: "Now select a player. That player will lose one item card. Note, this is not a Blackened attack",
    blackened4: "Choose a player to attack.",
    blackened5: "Oh no, vice was played this morning so the Blackened can't go murdering tonight. What a shame.",
    blackened6: "Blackened, go back to sleep.",
    blackened7: "U pu pu pu. Blackened, go back to sleep.",
    kyokoKirigiri: "Investigate whether a player is on the side of Hope or Despair.",
    kyokoKirigiriManiax: "Investigate whether a player is one of the Maniax roles.",
    nekomaruNidaiManiax: "Select a player to escort.",
    yasuhiroHagakure1: 'Investigate whether a player is the Despair Disease Patient.',
    yasuhiroHagakure2: 'Investigate whether a player is Mownohmi.',
    glasses: "Investigate whether a player is on the side of Hope or Despair.",
    someonesGraduationAlbum: "Investigate whether a player is a Traitor.",
    silentReceiver: "Investigate whether a player is a Spotless.",
    emperorsThong: "Investigate whether a player is Ultimate Despair.",
    secretsOfOmoplata: "Investigate whether there is a Remnant of Despair in the group."
  }
}

export const goodMorningSpeech = (dayNumber:number) => {
  const days = ["zeroth", "first", "second", "third", "fourth"]
  if (dayNumber === 1) {
    return "Good morning, everyone! It is the morning of the " + days[dayNumber] + " day. Get ready to greet another beee-yutiful day"
  } else if (dayNumber < 5) {
    return "Good morning, everyone! It is the morning of the " + days[dayNumber] + " day."
  } else {
    return "Good morning, everyone! What day is it today? I lost count. Does it mattter anyways?"
  }
}

export const morningTimeSpeech = (name1?:string, name2?:string, name3?:string) => {
  return {
    remnantFound: "Last night, Alter Ego uncovered that " + name1 + " was a Remnant of Despair! Farewell, my obedient servant.",
    announceAttack1: name1 + " was picked last night.",
    announceAttack2: name1 + " was attacked by the Blackened last night.",
    monomi1: "Did Mownohmi get in the way of the murder last night? ",
    monomi2: "Yes, " + name2 + " exploded and died to protect " + name1 + ".",
    monomi3: "Good riddance, I hated Mownohmi anyways.",
    monomi4: "Of course not. Mownohmi is as useless as she is ugly.",
    monomi5: "Nope.",
    nekomaruNidaiManiax1: "Did " + name1 + " escort the victim last night?",
    nekomaruNidaiManiax2: "Yes! After staying up all night to accompany the victim, " + name1 + " falls asleep for the rest of the day.",
    nekomaruNidaiManiax3: "Nope. " + name1 + " was probably taking a shit instead.",
    victim1: name1 + ", discard one Item card.",
    victim2: name1 + ", would you like to use an ability or item to prevent your death? If yes, please declare the ability or item now.",
    playersAbilities: "Would anybody like to use an ability to protect " + name1 + "? If yes, please declare the ability now.",
    giveItems: name2 + " and " + name3 + ", would either of you like to give an item to " + name1 + "? If yes, please give the item now.",
    victim3: name1 + ", would you like to use a gifted item to save yourself? If yes, please declare the item now.",
    bodyDiscovery1: "U pu pu pu pu. " + name1 + " has been killed.",
    bodyDiscovery2: "Buah hahaha! " + name1 + " is dead. They were the Alter Ego.",
    bodyDiscovery3: "Unbelievable, " + name1 + ". You managed to get yourself killed. You are the worst Blackened ever.",
    bodyDiscovery4: name1 + " was Future Foundation and gets to pick three players to receive an item card. I know which 3 players \
    I would pick. Know what I mean?",
    abilityOrItem: "Would anybody like to use an ability or item before moving on to day time?",
    amuletOfTakejin: name1 + ", did you play the item card, Amulet of Takayjin?",
    vice: "Was the item card, Vice, played?"
  }
}

export const dayTimeSpeech = (name?:string, killsLeft?:number) => {
  return {
    daySpeech1: "It is the day time.",
    daySpeech2: "It is the day time. A body has been discovered! Now then, after a certain amount of time has passed, \
      the class trial will begin!",
    abilityOrItem: "Would anybody like to use an ability or item?",
    discussion: " minute discussion starts now.",
    abilityOrItemBeforeTrial: "Would anybody like to use an ability or item before voting?",
    trial1: "Up next is the voting segment where each player points to who they think is the Blackened. \
      Click Continue when everyone is ready to vote.",
    trial2: "Click Continue when everyone is ready to vote.",
    vote1: "Three. Two. One. Vote!",
    vote2: "Who received the most votes?",
    tie1: "Looks like we're gonna need another class trial between just the tied players",
    tie2: "Another tie? Alright, I'm gonna give you guys one more class trial but if it's a tie again, I'm gonna to give the victory \
    to the Despair side.",
    tie3: "A promise is a promise. Despair wins.",
    execution1: "Let's give it everything we've got! IIIIIT'S PUNISHMENT TIME!",
    execution2: name + " has been executed.",
    winnerDeclaration1: name + " was the Blackened.",
    winnerDeclaration2: name + " was the Ultimate Despair.",
    winnerDeclaration3: name + " was not the Blackened.",
    revealRole1: "Buah hahaha. " + name + " was the Alter Ego.",
    revealRole2: name + " was Future Foundation and gets to pick three players to receive an item card. I know which 3 players \
    I would pick. Know what I mean?",
    revealRole3: "U pu pu pu. " + name + " was not the Blackened player.",
    killsLeft: "The fun continues and the Blackened needs " + killsLeft  + " more " + killOrKills(killsLeft!) + " to win.",
    abilityOrItemAfterTrial: "Would anybody like to use an ability or item before moving on to nighttime?"
  }
}

const killOrKills = (num:number) => num === 1 ? "kill" : "kills"
const personOrPeople = (num:number) => num === 1 ? "person" : "people"
const trialOrTrials = (num:number) => num === 1 ? "trial" : "trials"
