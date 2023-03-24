import './css/battleConsole.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Pokemon } from './classes';
import { hpCalc, statCalc } from './statCalc';
import MoveButton from './MoveButton'
import { attack, checkIfHpIsZero } from './attack';



const BattleConsole = () => {

    const attackClicked = (move) => {
        //this is the users attack
        const userAttack = attack(computerPokemon, userPokemon, move)
        setComputerHp(checkIfHpIsZero(computerHp, userAttack[0]))
        //the computer will pick a random move and then attack back
        const computerAttack = attack(userPokemon, computerPokemon, computerPokemon.moveArr[Math.floor(Math.random() * 3)])
        setUserHp(checkIfHpIsZero(userHp, computerAttack[0]))
    }

    const idArr = [1, 4, 7]
    const [pokemon, setPokemon] = useState([])
    const [userPokemon, setUserPokemon] = useState({})
    const [computerPokemon, setComputerPokemon] = useState({})

    const [userHp, setUserHp] = useState(0);
    const [computerHp, setComputerHp] = useState(0);

    useEffect(() => {
        idArr.forEach(id => {
            axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
                .then(({ data }) => {
                    setPokemon(pokemon => [...pokemon, new Pokemon(data.name, data.types, data.stats, data.sprites.front_default, data.sprites.back_default, data.moves)])
            })
        })
    }, [])

    useEffect(() => {
        setComputerPokemon(pokemon[Math.floor(Math.random() * 3)]);
    }, [pokemon])

    useEffect(() => {
        if(Object.keys(userPokemon).length !== 0 && userPokemon.statsUpdated === false) {
            
            //setting the users Hp
            
            const hp = hpCalc(userPokemon.stats[0].base_stat)
            setUserHp(hp);
            const statsArr = []
            
            //looping through the rest of the stats and setting them to state 
            for(let i = 1; i < userPokemon.stats.length; i ++) {
                statsArr.push(statCalc(userPokemon.stats[i].base_stat))
            }
            //adding hp stat to beginning of array
            statsArr.unshift(hp)
            //setting state to new stats
            console.log(pokemon, statsArr)
            const modifiedUserPokemon = { ...userPokemon, stats: statsArr, statsUpdated: true}
            setUserPokemon(modifiedUserPokemon);

        }
        
    }, [userPokemon])

    useEffect(() => {
        if(computerPokemon &&  Object.keys(computerPokemon).length !== 0 && computerPokemon.statsUpdated === false) {
            //setting the users Hp
            const hp = hpCalc(computerPokemon.stats[0].base_stat)
            setComputerHp(hp)
            const statsArr = []
            
            //looping through the rest of the stats and setting them to state 
            for(let i = 1; i < computerPokemon.stats.length; i ++) {
                statsArr.push(statCalc(computerPokemon.stats[i].base_stat))
            }
            //adding hp stat to beginning of array
            statsArr.unshift(hp)
            //setting state to new stats
            const modifiedComputerPokemon = { ...computerPokemon, stats: statsArr, statsUpdated: true}
            setComputerPokemon(modifiedComputerPokemon);
        }
    }, [computerPokemon])


    
    if (pokemon.length > 0) {
        if(Object.keys(userPokemon).length === 0) {
           return(
                <>
                    {pokemon.map(pokemon => {   
                        return(
                            <main>
                                <p>Choose a pokemon</p>
                                <button onClick={() => setUserPokemon(pokemon)}>{pokemon.name}</button>
                            </main>
                        )
                    })}
                </> 
            )
            
        } else {
            return(
                <div className='centeredPokes'>
                    <figure><img src={computerPokemon.frontSprite} alt="" /></figure>
                    <p>Health: {computerHp}</p>
                    <figure><img src={userPokemon.backSprite} alt="" /></figure>
                    <p>Health: {userHp}</p>
                    {userPokemon.moveArr?.map(move => {
                        return <MoveButton idToAttack={attackClicked} move={move} />
                    })}
                </div>
            )
        }

    }
}

export default BattleConsole