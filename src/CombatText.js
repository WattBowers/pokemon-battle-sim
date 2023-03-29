import './css/index.css';

const CombatText = ({ text, dispatch, combatStep }) => {
    
    
    return(
        <button className="combatText" onClick={() => dispatch({ type: 'setCombatStep', payload: combatStep + 1 })}>{text}</button>
    )
    
}

export default CombatText