import "./Resources.css"

const Resources = () => {
    return (
        <>
            <h1>Resources</h1>
            <hr />
            <ul>
                <li>Github Repository</li>
                <ul>
                    <li>
                        <a href="https://github.com/omist123/OLC-TV">https://github.com/omist123/OLC-TV</a>
                    </li>
                </ul>
                <li>Lunch Menu</li>
                <ul>
                    <li><a href="https://melroseschools.nutrislice.com/menu/melrose/breakfast/2025-02-06">https://melroseschools.nutrislice.com/menu/melrose/breakfast/2025-02-06</a></li>
                    <li>API Endpoint: <a href="https://mhs-school-lunch.onrender.com/lunch">https://mhs-school-lunch.onrender.com/lunch</a></li>
                </ul>
                <li>Weather</li>
                <ul>
                    <li>Open Weather Map API (1,000 calls/day free): <a href="https://openweathermap.org/current">https://openweathermap.org/current</a></li>
                    <li>API Endpoint: <a href="https://openweathermap.org/current">https://openweathermap.org/current</a></li>
                </ul>
                <li>Announcements</li>
                <ul>
                    <li><a href="https://aspen-api.herocc.com/api/v1/ma-melrose/announcements">https://aspen-api.herocc.com/api/v1/ma-melrose/announcements</a></li>
                </ul>
            </ul>
            <p>Note: Please use 24-hour time on the Schedule in the format of hh:mm-hh:mm</p>
            <h2 className="v-pad">Questions?</h2>
            <p>Email Sam: <a href="mailto:samuel.haseltine@melroseschools.com">samuel.haseltine@melroseschools.com</a></p>
            <p>This website is mobile-friendly! Try it on your phone.</p>
            <p>Authentication and Realtime Database are products of Google's Firebase. Send an inquiry to request another username/password for authentication.</p>
        </>
    )
}

export default Resources