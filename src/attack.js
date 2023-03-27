import { damageCalc } from "./damageCalc";
import { typeMatchup } from "./typeMatrix";

const checkMatchup = (moveType, defensiveType) => {
    if (typeMatchup[moveType][defensiveType] === 2) {
        return [typeMatchup[moveType][defensiveType], 'super effective']
    } else if (typeMatchup[moveType][defensiveType] === 1) {
        return [typeMatchup[moveType][defensiveType], 'normal hit']
    } else {
        return [typeMatchup[moveType][defensiveType], 'not very effective']
    }
    
}

export const attack = (defender, attacker, move) => {
    //check and see if the move is a physical move or a special move
    console.log(move)
    if(move[3] === 'physical') {
        //check how effective the move is against the opponent
        const damageArr = damageCalc(move[1], defender.stats[2], attacker.stats[1])
        const typeEffectiveness = checkMatchup(move[2], defender.type[0].type.name)
        return [Math.round(damageArr[0] * typeEffectiveness[0]), damageArr[1], typeEffectiveness[1], move[0]]
    } else if(move[3] === 'special') {
        //same as before just using the special stats instead of the physical ones. 
        
        const damageArr = damageCalc(move[1], defender.stats[4], attacker.stats[3])
        const typeEffectiveness = checkMatchup(move[2], defender.type[0].type.name)
        return [Math.round(damageArr[0] * typeEffectiveness[0]), damageArr[1], typeEffectiveness[1], move[0]]
    }
}


export const checkIfHpIsZero = (currentHp, damage) => {
    if((currentHp - damage) > 0) {
        return Math.round(currentHp - damage)
    } else {
        return 0;
    }
}

export const compareSpeed = (userPokemon, computerPokemon) => {
    //if the users pokemon is faster it goes first
    if(userPokemon.stats[5] > computerPokemon.stats[5]) {
        return ['user', 'computer'];
    //if the computers pokemon is faster it goes first
    } else if(userPokemon.stats[5] < computerPokemon.stats[5]) {
        return ['computer', 'user'];
    //if equal it is a random which one goes first each turn
    } else if (userPokemon.stats[5] === computerPokemon.stats[5]) {
        const roll = Math.floor(Math.random() * 2) + 1
        if (roll === 1) {
            return ['user', 'computer'];
        } else {
            return ['computer', 'user'];
        }
    }
}