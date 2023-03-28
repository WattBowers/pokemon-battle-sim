import './css/combatText.css'

const CombatText = ({ text, dispatch, combatStep }) => {
    
    
    return(
        <p className="combatText" onClick={() => dispatch({ type: 'setCombatStep', payload: combatStep + 1 })}>{text}</p>
    )
    
}

export default CombatText