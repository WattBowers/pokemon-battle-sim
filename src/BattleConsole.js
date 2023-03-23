import './css/battleConsole.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Pokemon } from './classes';
import { hpCalc } from './hpCalc';

const BattleConsole = () => {

    const idArr = [1, 4, 7, 8, 10, 50]
    const [pokemon, setPokemon] = useState([])
    const [userPokemon, setUserPokemon] = useState({})
    const [computerPokemon, setComputerPokemon] = useState({})
    const [userHp, setUserHp] = useState (0);
    const [computerHp, setComputerHp] = useState (0);

    useEffect(() => {
        idArr.forEach(id => {
            axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
                .then(({ data }) => {
                    setPokemon(pokemon => [...pokemon, new Pokemon(data.name, data.types, data.stats, data.sprites.front_default, data.sprites.back_default)])
            })
        })
    }, [])

    useEffect(() => {
        setComputerPokemon(pokemon[Math.floor(Math.random() * 3)]);
    }, [pokemon])

    useEffect(() => {
        if(Object.keys(userPokemon).length !== 0) {
            setUserHp(hpCalc(userPokemon.stats[0].base_stat))
        }
        
    }, [userPokemon])

    useEffect(() => {
        
        if(computerPokemon &&  Object.keys(computerPokemon).length !== 0) {
            setComputerHp(hpCalc(computerPokemon.stats[0].base_stat))
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
                </div>
            )
        }

    }
}

export default BattleConsole