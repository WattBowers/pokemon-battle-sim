import './css/battleConsole.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Pokemon } from './classes';

const BattleConsole = () => {

    const idArr = [1, 4, 7]
    const [pokemon, setPokemon] = useState([])

    useEffect(() => {
        
        idArr.forEach(id => {
            axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
                .then(({ data }) => {
                    console.log(data)
                    setPokemon(pokemon => [...pokemon, new Pokemon(data.name, data.types, data.stats, data.sprites.front_default, data.sprites.back_default) ])
            })
        })
        
    }, [])

    //If i pass this data down as props it wont rerender and continue adding to the state.
    return (
    
    <main>
        <div className="battleConsole">
            <p>{pokemon[0].name}</p>
        </div>
    </main>
) 

}

export default BattleConsole