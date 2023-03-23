export const hpCalc = (base) => {
    //this calculation comes from https://pokemon.fandom.com/wiki/Statistics#Health_Points
    
    return (Math.floor((.01 * (2 * base) * 5)) + 5 + 10)
}