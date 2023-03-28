import axios from 'axios';

class Pokemon {
    constructor (name, type, stats, frontSprite, backSprite, moves) {
        this.name = name;
        this.type = type;
        this.stats = stats;
        this.frontSprite = frontSprite
        this.backSprite = backSprite
        this.statsUpdated = false
        this.moveArr = this.moves(name, moves)
    }
    moves = (name, moves) => {
        //loop through desired moves and grab the data about each one.
        //this code block comes from https://stackoverflow.com/questions/56532652/axios-get-then-in-a-for-loop
        if(name === 'squirtle') {
            
            
            const moveArr = [4, 11, 32, 34]
            let moveData = []
            let promises = []

            moveArr.forEach(move => {
                promises.push(
                    axios.get(moves[move].move.url)
                        .then(({ data }) => {
                            moveData.push([data.name, data.power, data.type.name, data.damage_class.name])
                        })
                )
            })

            Promise.all(promises)
            
            return moveData
            
        } else if(name === 'charmander') {
            const moveArr = [1, 3, 15, 17]
            let moveData = []
            let promises = []

            moveArr.forEach(move => {
                promises.push(
                    axios.get(moves[move].move.url)
                        .then(({ data }) => {
                            moveData.push([data.name, data.power, data.type.name, data.damage_class.name])
                        })
                )
            })

            Promise.all(promises)
            
            return moveData

        } else {
            const moveArr = [4, 5, 15, 66]
            let moveData = []
            let promises = []

            moveArr.forEach(move => {
                promises.push(
                    axios.get(moves[move].move.url)
                        .then(({ data }) => {
                            moveData.push([data.name, data.power, data.type.name, data.damage_class.name])
                        })
                )
            })

            Promise.all(promises)
            
            return moveData
        }
    }
}



export { Pokemon }