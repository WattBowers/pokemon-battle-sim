const crit = () => {
    const roll = Math.floor(Math.random() * 24)

    if (roll === 23) {
        console.log('crit!!!')
        return 2
    } else {
        return 1
    }
}

const damageCalc = (attackStrength, defendingPokemon, attackingPokemon) => {
    // the calculation for the damage comes from https://bulbapedia.bulbagarden.net/wiki/Damage
    
    return (((((((2*100*crit())/5) + 2) * attackStrength * (attackingPokemon/defendingPokemon))/50) + 2) * ((Math.random() * .15) + .85))

}

damageCalc(40, 65, 100)