import './css/battleConsole.css';
import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { Pokemon } from './classes';
import { hpCalc, statCalc } from './statCalc';
import MoveButton from './MoveButton';
import CombatText from './CombatText';
import { attack, checkIfHpIsZero, compareSpeed } from './attack';

const initialState = {
    pokemon: [],
    userPokemon: {},
    computerPokemon: {},
    currentAttack: [],
    firstInRound: true,
    userHp: 0,
    computerHp: 0,
    currentPokemon: '',
    userMove: [],
    combatText: '',
    combatStep: 0,
    setCurrentPokemon: ''
}

const reducer = (state, action) => {
    //debugger;
    switch(action.type) {
        case 'setPokemon':    
            return {...state, pokemon: [...state.pokemon, action.payload]}
            
        case 'setComputerPokemon':
            return{...state, computerPokemon: action.payload}

        case 'setUserPokemon':
            return {...state, userPokemon: action.payload}

        case 'setUserMove':
            return {...state, userMove: action.payload}

        case 'setCurrentAttack':
            return {...state, currentAttack: action.payload}

        case 'setStartOrEnd':
            return {...state, startOrEnd: action.payload}

        case 'setCombatStep':
            return {...state, combatStep: action.payload}
        
        case 'setUserHp':
            return {...state, userHp: action.payload}

        case 'setComputerHp':
            return {...state, computerHp: action.payload}
        
        case 'setCombatText':
                return {...state, combatText: action.payload}
        
        case 'firstInRound':
            return {...state, firstInRound: action.payload}
        
        case 'setCurrentPokemon':
            return {...state, currentPokemon: action.payload}
        
        default: 
            throw new Error('state updater received unknown function')
            
    }
}


const BattleConsole = () => {
    
    const attackClicked = (move) => {
        //debugger;
        dispatch({ type: 'setUserMove', payload: move })
        // decide which pokemon should go first. 
        const speedArr = compareSpeed(state.userPokemon, state.computerPokemon)
        //set the fastest pokemon to the first in the order
        if(speedArr[0] === 'user') {
            dispatch({ type: 'setCurrentPokemon', payload: 'user'})
            console.log(attack(state.computerPokemon, state.userPokemon, move))
            dispatch({ type: 'setCurrentAttack', payload: attack(state.computerPokemon, state.userPokemon, move)})
        } else {
            dispatch({ type: 'setCurrentPokemon', payload: 'computer'})
            console.log(attack(state.userPokemon, state.computerPokemon, state.computerPokemon.moveArr[Math.floor(Math.random() * 3)]))
            dispatch({type: 'setCurrentAttack', payload: attack(state.userPokemon, state.computerPokemon, state.computerPokemon.moveArr[Math.floor(Math.random() * 3)])})
        }

        dispatch({ type: 'setStartOrEnd', payload: 'start'})
        
        //set combat step to one. 
        dispatch({ type: 'setCombatStep', payload: 1})
        
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        const idArr = [1, 4, 7]
        idArr.forEach(id => {
            axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
                .then(({ data }) => {
                    dispatch({ type: 'setPokemon', payload: new Pokemon(data.name, data.types, data.stats, data.sprites.front_default, data.sprites.back_default, data.moves)})
            })
        })
    }, [])

    useEffect(() => {
        dispatch({ type: 'setComputerPokemon', payload: state.pokemon[Math.floor(Math.random() * 3)] });
    }, [state.pokemon])

    useEffect(() => {
        if(Object.keys(state.userPokemon).length !== 0 && state.userPokemon.statsUpdated === false) {
            
            //setting the users Hp
            console.log(hpCalc(state.userPokemon.stats[0].base_stat))
            const hp = hpCalc(state.userPokemon.stats[0].base_stat)
            dispatch({ type: 'setUserHp', payload: hp})
            const statsArr = []
            
            //looping through the rest of the stats and setting them to state 
            for(let i = 1; i < state.userPokemon.stats.length; i ++) {
                statsArr.push(statCalc(state.userPokemon.stats[i].base_stat))
            }
            //adding hp stat to beginning of array
            statsArr.unshift(hp)
            //setting state to new stats
            const modifiedUserPokemon = { ...state.userPokemon, stats: statsArr, statsUpdated: true}
            
            dispatch({ type: 'setUserPokemon', payload: modifiedUserPokemon });

        }
        
    }, [state.userPokemon])

    useEffect(() => {
        
        if(state.computerPokemon &&  Object.keys(state.computerPokemon).length !== 0 && state.computerPokemon.statsUpdated === false) {
            //setting the users Hp
            const hp = hpCalc(state.computerPokemon.stats[0].base_stat)
            dispatch({ type: 'setComputerHp', payload: hp });
            const statsArr = []
            
            //looping through the rest of the stats and setting them to state 
            for(let i = 1; i < state.computerPokemon.stats.length; i ++) {
                statsArr.push(statCalc(state.computerPokemon.stats[i].base_stat))
            }
            //adding hp stat to beginning of array
            statsArr.unshift(hp)
            //setting state to new stats
            const modifiedComputerPokemon = { ...state.computerPokemon, stats: statsArr, statsUpdated: true}
            dispatch({type:'setComputerPokemon', payload: modifiedComputerPokemon});
        }
    }, [state.computerPokemon])

    useEffect(() => {
        //make sure this doesn't run on page load. 
       //debugger;
        if(state.combatStep !== 0) {
            if(state.currentPokemon === 'user') {
                switch(state.combatStep) {
                    case 1: 
                        dispatch({ type: 'setCombatText', payload: `${state.userPokemon.name} used ${state.currentAttack[3]}!!!`})
                        break;
                    
                    case 2: 
                        if(state.currentAttack[2] === 'super effective') {
                            dispatch({ type: 'setCombatText', payload: `It's super effective!!!`})
                        } else if (state.currentAttack[2] === 'not very effective') {
                            dispatch({ type: 'setCombatText', payload: `It's not very effective`})
                        } else {
                            dispatch({ type: 'setCombatStep', payload: 3})
                        }
                        break;
                    
                    case 3: 
                        if(state.currentAttack[1] === true) {
                            dispatch({ type: 'setCombatText', payload: `Critical hit!!!`})
                        } else{
                            dispatch({ type: 'setCombatStep', payload: 4})
                        }
                        break;
                    case 4: 
                        dispatch({ type: 'setCombatText', payload: `${state.userPokemon.name} dealt ${Math.round(state.currentAttack[0])} to the opponents ${state.computerPokemon.name}`});
                        dispatch({ type: 'setUserHp', payload: checkIfHpIsZero(state.computerHp - state.currentAttack[0])})
                        break;
                    
                    case 5: 
                        if(state.startOrEnd === 'start') {
                            dispatch({ type: 'setCurrentAttack', payload: attack(state.userPokemon, state.computerPokemon, state.computerPokemon.moveArr[Math.floor(Math.random() * 3)])})
                            dispatch({ type: 'setCurrentPokemon', payload: 'computer'})
                            dispatch({ type: 'setStartOrEnd', payload: 'end'})
                            dispatch({ type: 'setCombatStep', payload: 1})
                        } else {
                            dispatch({ type: 'setCombatText', payload: ``})
                            dispatch({ type: 'setCurrentPokemon', payload: ''})
                            dispatch({ type: 'setCombatStep', payload: 0})
                        }
                        break;
                    
                    default: 
                        throw new Error('Unexpected value in text input')
                }
            } else if (state.currentPokemon === 'computer') {
                switch(state.combatStep) {
                    case 1: 
                        //setCombatText(`${computerPokemon.name} dealt ${Math.round(currentAttack[0])} to your ${userPokemon.name}`)
                        dispatch({ type: 'setCombatText', payload: `${state.computerPokemon.name} used ${state.currentAttack[3]}!!!`})
                        break;
                    case 2: 
                        if(state.currentAttack[2] === 'super effective') {
                            dispatch({ type: 'setCombatText', payload: `It's super effective`})
                        } else if (state.currentAttack[2] === 'not very effective') {
                            dispatch({ type: 'setCombatText', payload: `It's not very effective`})
                        } else {
                            dispatch({ type: 'setCombatStep', payload: 3});
                        }
                        break;
                    
                    case 3: 
                        if(state.currentAttack[1] === true) {
                            dispatch({ type: 'setCombatText', payload: `Critical hit!!!`})
                        } else{
                            dispatch({ type: 'setCombatStep', payload: 4})
                        }
                        break;
                        
                    case 4: 
                        dispatch({ type: 'setCombatText', payload: `${state.computerPokemon.name} dealt ${Math.round(state.currentAttack[0])} to your ${state.userPokemon.name}`});
                        dispatch({ type: 'setUserHp', payload: checkIfHpIsZero(state.userHp - state.currentAttack[0])})
                        break;

                    case 5: 
                        
                        if(state.startOrEnd === 'start') {
                            dispatch({ type: 'setCurrentAttack', payload: attack(state.computerPokemon, state.userPokemon, state.userMove)})
                            dispatch({ type: 'setCurrentPokemon', payload: 'user'})
                            dispatch({ type: 'setStartOrEnd', payload: 'end'})
                            dispatch({ type: 'setCombatStep', payload: 1})
                        } else {
                            dispatch({ type: 'setCombatText', payload: ``})
                            dispatch({ type: 'setCurrentPokemon', payload: ``})
                            dispatch({ type: 'setCombatStep', payload: 0})
                        }
                        break;
                    
                    default: 
                        break;
                }
            }    
        }        
    }, [state.combatStep, state.computerHp , state.computerPokemon , state.currentAttack, state.currentPokemon, state.startOrEnd, state.userHp, state.userMove, state.userPokemon,])


    //debugger;
    if (state.pokemon.length > 0) {
        if(Object.keys(state.userPokemon).length === 0) {
           return(
                <>
                    {state.pokemon.map(pokemon => {   
                        return(
                            <main>
                                <p>Choose a pokemon</p>
                                <button onClick={() => dispatch({ type: 'setUserPokemon', payload: pokemon})}>{pokemon.name}</button>
                            </main>
                        )
                    })}
                </> 
            )
            
        } else {
            return(
                <div className='centeredPokes'>
                    <figure><img src={state.computerPokemon.frontSprite} alt="" /></figure>
                    <p>Health: {state.computerHp}</p>
                    <figure><img src={state.userPokemon.backSprite} alt="" /></figure>
                    <p>Health: {state.userHp}</p>
                    {state.userPokemon.moveArr?.map(move => {
                        return <MoveButton idToAttack={attackClicked} move={move} />
                    })}
                    <CombatText combatStep={state.combatStep} dispatch={dispatch} text={state.combatText}/>
                </div>
            )
        }

    }
}

export default BattleConsole