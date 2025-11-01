const Block = ({ letter, time }) => {
    return (
        <div className="block">
            <p>{letter}</p>
            <p>{time}</p>
        </div>
    )
}

export default Block;