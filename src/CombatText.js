const CombatText = ({ text, dispatch, combatStep }) => {
    
    
    return(
        <p onClick={() => dispatch({ type: 'setCombatStep', payload: combatStep + 1 })}>{text}</p>
    )
    
}

export default CombatText