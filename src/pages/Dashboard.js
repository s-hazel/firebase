import "./Dashboard.css"

const Banner = () => {
    return (
        <div className="banner">
            <div className="cover"></div>
            <img src="flag-orpheus-left.svg" alt="" className="orpheus" />
        </div>
    )
}

const Dashboard = () => {
    return (
        <>
            <h1>Welcome</h1>
            <hr />
            <p>MHS Info TV</p>
            <p>v2.0</p>
            <h2 className="v-pad">Quick Actions</h2>
            <div className="quick-actions">
                <a href="/tv" className="launch">
                    Launch
                    <span className="material-symbols-rounded">rocket_launch</span>
                </a>
                <a href="mailto:samuel.haseltine@melroseschools.com" target="_blank" className="help">
                    <span className="material-symbols-rounded">mail</span>
                    Get Help
                </a>
            </div>
        </>
    )
}

export default Dashboard
export { Banner }