import './css/battleConsole.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Pokemon } from './classes';
import { hpCalc, statCalc } from './statCalc';
import MoveButton from './MoveButton';
import CombatText from './CombatText';
import { attack, checkIfHpIsZero, compareSpeed } from './attack';



const BattleConsole = () => {

    const attackClicked = (move) => {

        setUserMove(move)
        // decide which pokemon should go first. 
        const speedArr = compareSpeed(userPokemon, computerPokemon)
        //set the fastest pokemon to the first in the order
        if(speedArr[0] === 'user') {
            setCurrentPokemon('user')
            setCurrentAttack(attack(computerPokemon, userPokemon, move))
        } else {
            setCurrentPokemon('computer')
            setCurrentAttack(attack(userPokemon, computerPokemon, computerPokemon.moveArr[Math.floor(Math.random() * 3)]))
        }

        setStartOrEnd('start');
        
        //set combat step to one. 
        
        setCombatStep(1);
    }

    const idArr = [1, 4, 7]
    const [pokemon, setPokemon] = useState([]);
    const [userPokemon, setUserPokemon] = useState({});
    const [computerPokemon, setComputerPokemon] = useState({});

    const [currentAttack, setCurrentAttack] = useState();
    const [startOrEnd, setStartOrEnd] = useState('start')

    const [userHp, setUserHp] = useState(0);
    const [computerHp, setComputerHp] = useState(0);

    const [currentPokemon, setCurrentPokemon] = useState('');
    const [userMove, setUserMove] = useState([]);

    const [combatText, setCombatText] = useState('');
    const [combatStep, setCombatStep] = useState(0);

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

    useEffect(() => {
        //make sure this doesn't run on page load. 
       console.log(currentAttack)
        if(combatStep !== 0) {
            if(currentPokemon === 'user') {
                switch(combatStep) {
                    case 1: 
                        setCombatText(`${userPokemon.name} used ${currentAttack[3]}!!!`);
                        break;
                    
                    case 2: 
                        if(currentAttack[2] === 'super effective') {
                            setCombatText(`It's super effective`);
                        } else if (currentAttack[2] === 'not very effective') {
                            setCombatText(`It's not very effective`);
                        } else {
                            setCombatStep(3);
                        }
                        break;
                    
                    case 3: 
                        if(currentAttack[1] === true) {
                            setCombatText(`critical hit!!!`);
                        } else{
                            setCombatStep(4)
                        }
                        break;
                    case 4: 
                        setCombatText(`${userPokemon.name} dealt ${Math.round(currentAttack[0])} to the opponents ${computerPokemon.name}`);
                        setComputerHp(checkIfHpIsZero(computerHp - currentAttack[0]))
                        break;
                    
                    case 5: 
                        if(startOrEnd === 'start') {
                            setCurrentAttack(attack(userPokemon, computerPokemon, computerPokemon.moveArr[Math.floor(Math.random() * 3)]));
                            setCurrentPokemon('computer');
                            setStartOrEnd('end');
                            setCombatStep(1)
                        } else {
                            setCombatText('');
                            setCurrentPokemon('');
                            setCombatStep(0)
                        }
                        break;
                    
                    default: 
                        throw new Error('Unexpected value in text input')
                }
            } else if (currentPokemon === 'computer') {
                switch(combatStep) {
                    case 1: 
                        //setCombatText(`${computerPokemon.name} dealt ${Math.round(currentAttack[0])} to your ${userPokemon.name}`)
                        setCombatText(`${computerPokemon.name} used ${currentAttack[3]}!!!`);
                        break;
                    case 2: 
                        if(currentAttack[2] === 'super effective') {
                            setCombatText(`It's super effective`);
                        } else if (currentAttack[2] === 'not very effective') {
                            setCombatText(`It's not very effective`);
                        } else {
                            setCombatStep(3);
                        }
                        break;
                    
                    case 3: 
                        if(currentAttack[1] === true) {
                            setCombatText(`critical hit!!!`);
                        } else{
                            setCombatStep(4)
                        }
                        break;
                        
                    case 4: 
                        setCombatText(`${computerPokemon.name} dealt ${Math.round(currentAttack[0])} to your ${userPokemon.name}`);
                        setUserHp(checkIfHpIsZero(userHp - currentAttack[0]))
                        break;

                    case 5: 
                        
                        if(startOrEnd === 'start') {
                            setCurrentAttack(attack(computerPokemon, userPokemon, userMove));
                            setCurrentPokemon('user');
                            setStartOrEnd('end');
                            setCombatStep(1)
                        } else {
                            setCombatText('');
                            setCurrentPokemon('');
                            setCombatStep(0)
                        }
                        break;
                    
                    default: 
                        throw new Error('Unexpected value in text input');
                }
            }    
        }        
    }, [combatStep])


    
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
                    <CombatText combatStep={combatStep} setCombatStep={setCombatStep} text={combatText}/>
                </div>
            )
        }

    }
}

export default BattleConsole