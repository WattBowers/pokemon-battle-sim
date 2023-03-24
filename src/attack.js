import { damageCalc } from "./damageCalc";
import { typeMatchup } from "./typeMatrix";

const checkMatchup = (moveType, defensiveType) => {
    return typeMatchup[moveType][defensiveType]
}

export const attack = (defender, attacker, move) => {
    //check and see if the move is a physical move or a special move
    if(move[3] === 'physical') {
        //check how effective the move is against the opponent
        
        
        
        const damageArr = damageCalc(move[1], defender.stats[2], attacker.stats[1])
        console.log(damageArr[0] * checkMatchup(move[2], defender.type[0].type.name))
        return [damageArr[0] * checkMatchup(move[2], defender.type[0].type.name), damageArr[1]]
    } else if(move[3] === 'special') {
        //same as before just using the special stats instead of the physical ones. 
        const damageArr = damageCalc(move[1], defender.stats[4].base_stat, attacker.stats[3].base_stat)
        return [damageArr[0] * checkMatchup(move[2], defender.type[0].type.name), damageArr[1]]
    }
}


export const checkIfHpIsZero = (currentHp, damage) => {
    if((currentHp - damage) > 0) {
        return Math.round(currentHp - damage)
    } else {
        return 0;
    }
}
