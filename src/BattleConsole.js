import './css/index.css';
import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { Pokemon } from './functions/classes';
import { hpCalc, statCalc } from './functions/statCalc';
import MoveButton from './MoveButton';
import CombatText from './CombatText';
import { attack, checkIfHpIsZero, compareSpeed } from './functions/attack';

const initialState = {
    pokemon: [],
    userPokemon: {},
    computerPokemon: {},
    currentAttack: [],
    userHp: 0,
    computerHp: 0,
    currentPokemon: '',
    userMove: [],
    combatText: '',
    combatStep: 0,
    setCurrentPokemon: '',
    tryAgainButton: false,
    renderChooseYourStarterButtons: true,
    maxHp: []
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
        
        case 'setCurrentPokemon':
            return {...state, currentPokemon: action.payload}

        case 'setTryAgainButton':
            return {...state, tryAgainButton: action.payload}

        case 'setRenderChooseYourStarterButtons':
            return {...state, renderChooseYourStarterButtons: action.payload}

        case 'setComputerMaxHp':
            return {...state, maxHp: [...state.maxHp, action.payload]}

        case 'setUserMaxHp':
            return {...state, maxHp: [...state.maxHp, action.payload]}            

        case 'reset':
            return initialState
            
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
            
            dispatch({ type: 'setCurrentAttack', payload: attack(state.computerPokemon, state.userPokemon, move)})
        } else {
            dispatch({ type: 'setCurrentPokemon', payload: 'computer'})
            
            dispatch({type: 'setCurrentAttack', payload: attack(state.userPokemon, state.computerPokemon, state.computerPokemon.moveArr[Math.floor(Math.random() * 3)])})
        }

        dispatch({ type: 'setStartOrEnd', payload: 'start'})
        
        //set combat step to one. 
        dispatch({ type: 'setCombatStep', payload: 1})
        
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if(state.pokemon.length === 0) {
            const idArr = [1, 4, 7]
            idArr.forEach(id => {
                axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
                    .then(({ data }) => {
                        dispatch({ type: 'setPokemon', payload: new Pokemon(data.name, data.types, data.stats, data.sprites.front_default, data.sprites.back_default,   data.moves)})
            })
        })
    }
        
    }, [state.pokemon])

    useEffect(() => {
        dispatch({ type: 'setComputerPokemon', payload: state.pokemon[Math.floor(Math.random() * 3)] });
    }, [state.pokemon])

    useEffect(() => {
        if(Object.keys(state.userPokemon).length !== 0 && state.userPokemon.statsUpdated === false) {
            
            //setting the users Hp
            
            const hp = hpCalc(state.userPokemon.stats[0].base_stat)
            dispatch({ type: 'setUserHp', payload: hp})
            dispatch({ type: 'setUserMaxHp', payload: hp });
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
            dispatch({ type: 'setComputerMaxHp', payload: hp });
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
                        dispatch({ type: 'setCombatText', payload: `${state.userPokemon.name} used ${state.currentAttack[3]}!!! ➔`})
                        break;
                    
                    case 2: 
                        if(state.currentAttack[2] === 'super effective') {
                            dispatch({ type: 'setCombatText', payload: `It's super effective!!! ➔`})
                        } else if (state.currentAttack[2] === 'not very effective') {
                            dispatch({ type: 'setCombatText', payload: `It's not very effective ➔`})
                        } else {
                            dispatch({ type: 'setCombatStep', payload: 3})
                        }
                        break;
                    
                    case 3: 
                        if(state.currentAttack[1] === true) {
                            dispatch({ type: 'setCombatText', payload: `Critical hit!!! ➔`})
                        } else{
                            dispatch({ type: 'setCombatStep', payload: 4})
                        }
                        break;
                    case 4: 
                        
                        dispatch({ type: 'setCombatText', payload: `${state.userPokemon.name} dealt ${Math.round(state.currentAttack[0])} to the opponents ${state.computerPokemon.name} ➔`});
                        dispatch({ type: 'setComputerHp', payload: checkIfHpIsZero(state.computerHp, state.currentAttack[0])})
                        break;
                    
                    case 5: 
                        if(state.computerHp === 0) {
                            dispatch({ type: 'setCombatStep', payload: 6})
                            break;
                        }
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

                    case 6: 
                        dispatch({ type: 'setCombatText', payload: `Congratulations, you've won ➔`})
                        break;
                    
                    case 7: 
                        dispatch({ type: 'setCombatText', payload: ``})
                        dispatch({ type: 'setCombatStep', payload: 8})
                        dispatch({ type: 'setTryAgainButton', payload: true })
                        break; 
                    
                    default: 
                        break;
                }
            } else if (state.currentPokemon === 'computer') {
                switch(state.combatStep) {
                    case 1: 
                        //setCombatText(`${computerPokemon.name} dealt ${Math.round(currentAttack[0])} to your ${userPokemon.name}`)
                        dispatch({ type: 'setCombatText', payload: `${state.computerPokemon.name} used ${state.currentAttack[3]}!!! ➔`})
                        break;
                    case 2: 
                        if(state.currentAttack[2] === 'super effective') {
                            dispatch({ type: 'setCombatText', payload: `It's super effective ➔`})
                        } else if (state.currentAttack[2] === 'not very effective') {
                            dispatch({ type: 'setCombatText', payload: `It's not very effective ➔`})
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
                        dispatch({ type: 'setCombatText', payload: `${state.computerPokemon.name} dealt ${Math.round(state.currentAttack[0])} to your ${state.userPokemon.name} ➔`});
                        dispatch({ type: 'setUserHp', payload: checkIfHpIsZero(state.userHp, state.currentAttack[0])})
                        
                        break;

                    case 5: 
                        if(state.userHp === 0) {
                            dispatch({ type: 'setCombatStep', payload: 6})
                            break;
                        }
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
                    
                    case 6: 
                        dispatch({ type: 'setCombatText', payload: `Sorry, you've lost ➔`})
                        break;
                    
                    case 7: 
                        dispatch({ type: 'setCombatText', payload: ``})
                        dispatch({ type: 'setCombatStep', payload: 8})
                        dispatch({ type: 'setTryAgainButton', payload: true })
                        break; 

                    default: 
                        break;
                }
            }    
        }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.combatStep])
    
    return (
        <main className='wrapper'>
            {state.renderChooseYourStarterButtons  ? 
                <section className='pokemonSelectFlex'>
                    <p>Choose a pokemon</p>
                    <div className='pokemonButtonFlex'>
                        {state.pokemon.map(pokemon => {   
                            return(
                                <div  key={pokemon.name}>
                                    <button className='selectBtn' onClick={() => {
                                        dispatch({ type: 'setUserPokemon', payload: pokemon});
                                        dispatch({ type: 'setRenderChooseYourStarterButtons', payload: false })

                                    }}>{pokemon.name}</button>
                                    <figure>
                                        <img src={pokemon.frontSprite} alt="pokemon sprite" />
                                    </figure>
                                </div>
                            )
                        })}
                    </div>  
                </section>
                
             : 
                <section className='centeredPokes'>
                    <div className='computerPoke'>
                        <figure><img src={state.computerPokemon.frontSprite} alt="pokemon front sprite" /></figure>
                        <p>Health: {state.computerHp} / {state.maxHp[0]}</p>
                    </div>
                    <div className='userPoke'>
                        <p>Health: {state.userHp} / {state.maxHp[1]}</p>
                        <figure><img src={state.userPokemon.backSprite} alt="pokemon back sprite" /></figure>
                    </div>
                    <CombatText combatStep={state.combatStep} dispatch={dispatch} text={state.combatText}/>
                    <div className='buttonFlex'>
                        {state.userPokemon.moveArr?.map(move => {
                            return <MoveButton combatStep={state.combatStep} key={move[0]} idToAttack={attackClicked} move={move} />
                        })}
                    </div>
                    {state.tryAgainButton 
                        ? <button className='btn' onClick={() => dispatch({ type: 'reset' })}>Try again??</button>
                        : null
                    }
                </section>
            }
        </main>
        
    )
}

export default BattleConsole