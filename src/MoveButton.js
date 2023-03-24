const MoveButton = ({ move, idToAttack }) => {
    
    return (
        <button onClick={() => idToAttack(move)}>{move[0]}</button>
    )
}

export default MoveButton