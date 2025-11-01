const Block = ({ meets, letter, time }) => {
    return (
        <div className="block">
            <p className="blockMeets">{meets}</p>
            <p>{letter}</p>
            <p className="blockTime">{time}</p>
        </div>
    )
}

export default Block;