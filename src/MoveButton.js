import './css/moveButton.css'


const MoveButton = ({ move, idToAttack, combatStep }) => {
    
    return (
        <button disabled={combatStep !== 0} className="btn" onClick={() => idToAttack(move)}>{move[0]}</button>
    )
}

export default MoveButton