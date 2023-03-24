export const hpCalc = (base) => {
    //this calculation comes from https://pokemon.fandom.com/wiki/Statistics#Health_Points
    
    return (Math.floor((.01 * (2 * base) * 5)) + 5 + 10)
}

export const statCalc = (base) => {
    // /(floor(0.01 x (2 x Base + IV + floor(0.25 x EV)) x Level) + 5) x Nature
    return(Math.floor(.01 * (2 * base) * 5) + 5)
}