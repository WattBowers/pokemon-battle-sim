const crit = () => {
    const roll = Math.floor(Math.random() * 24)

    if (roll === 23) {
        return [2, true]
    } else {
        return [1, false]
    }
}

export const damageCalc = (attackStrength, defendingPokemon, attackingPokemon) => {
    // the calculation for the damage comes from https://bulbapedia.bulbagarden.net/wiki/Damage
    let critArr = crit()

    return [(((((((2*5*critArr[0])/5) + 2) * attackStrength * (attackingPokemon/defendingPokemon))/50) + 2) * ((Math.random() * .15) + .85)), critArr[1]]

}
