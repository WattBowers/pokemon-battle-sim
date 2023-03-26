const CombatText = ({ text, setCombatStep, combatStep }) => {
    
    
    return(
        <p onClick={() => setCombatStep(combatStep + 1)}>{text}</p>
    )
    
}

export default CombatText