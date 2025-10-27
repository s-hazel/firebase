import "./TV.css"
import { useState, useEffect } from "react"
import Block from "./Block"
import wmo from "./wmoCodes.json"

const TV = () => {
    const date = new Date()

    const [time, setTime] = useState(new Date().toLocaleTimeString([], { timeStyle: "short" }))

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { timeStyle: "short" }))
            setTimeRemaining()
            setProgress()
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    })

    const [weatherTemp, setWeatherTemp] = useState(0)
    const [weatherHi, setWeatherHi] = useState(0)
    const [weatherLo, setWeatherLo] = useState(0)
    const [weatherDesc, setWeatherDesc] = useState("")

    const [menuToday, setMenuToday] = useState(["https://cdn.pixabay.com/photo/2017/07/18/03/47/picnic-2514668_960_720.jpg", "No lunch today"])

    const [announcements, setAnnouncements] = useState({ data: [] })

    useEffect(() => {
        const weather = async () => {
            try {
                const weather_url = "https://api.open-meteo.com/v1/forecast?latitude=42.4584&longitude=-71.0662&daily=temperature_2m_max,temperature_2m_min,weather_code&current=temperature_2m&timezone=America%2FNew_York&forecast_days=1&temperature_unit=fahrenheit"
                const res = await fetch(weather_url)
                const weatherData = await res.json()
                setWeatherTemp(Math.round(weatherData["current"]["temperature_2m"]))
                setWeatherHi(Math.round(weatherData["daily"]["temperature_2m_max"][0]))
                setWeatherLo(Math.round(weatherData["daily"]["temperature_2m_min"][0]))
                setWeatherDesc(wmo[weatherData["daily"]["weather_code"][0]].description)
            } catch (err) {
                console.log(err)
            }
        }

        weather()

        const fetchLunch = async () => {
            try {
                // const proxyUrl = "https://corsproxy.io/?"
                const targetUrl = "https://melroseschools.api.nutrislice.com/menu/api/weeks/school/melrose/menu-type/breakfast/2025/10/17/"
                // const res = await fetch(proxyUrl + encodeURIComponent(targetUrl))

                const dateToday = date.toISOString().split("T")[0]

                const res = await fetch(`/api/menu?date=${dateToday}`)
                const data = await res.json()
                console.log(data)
                const loop = data["days"]

                let today = {}
                for (const day of loop) {
                    if (day["date"] === dateToday) {
                        today = day["menu_items"]
                        break
                    }
                }

                for (const item of today) {
                    if (item["position"] === 1) {
                        setMenuToday([item["food"]["image_url"], item["food"]["name"]])
                        return
                    }
                }
                setMenuToday(["https://cdn.pixabay.com/photo/2020/05/11/06/35/kitchen-utensils-5156691_1280.jpg", "No lunch today"])
            } catch (error) {
                console.log(error)
                setMenuToday(["https://cdn.pixabay.com/photo/2020/05/11/06/35/kitchen-utensils-5156691_1280.jpg", "No lunch today"])
            }
        }

        fetchLunch()

        const fetchAnn = async () => {
            try {
                const res = await fetch("/api/announcements")
                const data = await res.json()
                setAnnouncements(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchAnn()

        const fetchSchedule = async () => {
            try {
                const res = await fetch("/api/aspen")
                const data = await res.json()
                console.log(data.times)
                setSchedule(data.times)
            } catch (error) {
                console.log(error)
            }
        }

        // fetchSchedule()
    }, [])

    const [currentAnn, setCurrentAnn] = useState(0)

    useEffect(() => {
        const annInterval = setInterval(() => {
            setCurrentAnn(prev => {
                if (prev < announcements?.data.length - 1) {
                    return prev + 1
                } else {
                    return 0
                }
            })
        }, 10000)

        return () => {
            clearInterval(annInterval)
        }
    }, [announcements?.data.length])


    const [percentComplete, setPercentComplete] = useState("0%")

    const setProgress = () => {
        var r = document.querySelector(":root")
        r.style.setProperty('--progress-bar', '0%')

        let now = new Date()

        // Set the start and end times
        let startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 15)
        let endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 41)

        if (now >= startTime && now <= endTime) {
            let duration = endTime - startTime

            let elapsed = now - startTime

            let percentage = (elapsed / duration) * 100

            // Update the width of the progress bar
            r.style.setProperty('--progress-bar', percentage + "%")
            setPercentComplete(Math.floor(percentage) + "%")
        } else if (now >= endTime) {
            r.style.setProperty('--progress-bar', '100%')
            setPercentComplete("100%")
        } else {
            r.style.setProperty('--progress-bar', '0%')
        }
    }

    const [remaining, setRemaining] = useState("0h 0m")

    const setTimeRemaining = () => {
        let now = new Date()

        let time1441 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 41)

        let difference = time1441 - now

        if (difference > 0) {
            let hours = Math.floor(difference / 1000 / 60 / 60)
            difference -= hours * 1000 * 60 * 60
            let minutes = Math.floor(difference / 1000 / 60)

            setRemaining(hours + "h " + minutes + "m")
        }
    }

    const fiveDays = [
        ["1", "2", "3", "4", "5", "6"],
        ["CREW", "A", "B", "C", "D", "E"],
        ["G", "F", "E", "D", "C", "B"],
        ["A", "B", "C", "F", "G", "FLEX"],
        ["G", "F", "E", "D", "B", "A"],
        ["A", "C", "D", "E", "F", "G"],
        ["1", "2", "3", "4", "5", "6"]
    ]

    const [schedule, setSchedule] = useState(fiveDays[date.getDay()])

    return (
        <div className="tv">
            <div className="head">
                <img src="./main-logo.jpeg" alt="" className="schoolLogo" />
                <div className="today">
                    <p className="day">{date.toLocaleDateString("default", { weekday: "long" })},</p>
                    <p className="monthDate">{date.toLocaleDateString("default", { month: "long" }) + " " + date.getDate()}</p>
                </div>
                <p className="time">{time}</p>
            </div>
            <div className="divide">
                <div className="widgets">
                    <div className="stats">
                        <div className="timeLeft">
                            <p className="countdown">{remaining}</p>
                            <p className="remaining">Remaining</p>
                        </div>
                        <div className="percentComplete">
                            <p className="percent">{percentComplete}</p>
                            <p className="complete">Complete</p>
                        </div>
                    </div>
                    <div className="weather">
                        {/* <img src="https://cdn.pixabay.com/photo/2017/12/28/17/41/summer-3045780_1280.jpg" alt="" className="weatherImage" /> */}
                        {/* <img src="https://cdn.pixabay.com/photo/2021/05/10/14/48/rain-6243559_1280.jpg" alt="" className="weatherImage" /> */}
                        <img src="https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740" alt="" className="weatherImage" />

                        <div className="weatherData">
                            <div className="mainWeather">
                                <p className="temp">{weatherTemp}<span className="degrees"> °F</span></p>

                                <p className="weatherDesc">{weatherDesc}</p>
                            </div>
                            <div className="extraWeather">
                                <p className="precipitation">Hi {weatherHi} / Lo {weatherLo}</p>
                            </div>
                        </div>
                    </div>
                    <div className="lunch">
                        <img src={menuToday[0]} alt="" className="lunchPicture" />
                        <div className="lunchText">
                            <p className="lunchStatic">Lunch</p>
                            <p className="meal">{menuToday[1]}</p>
                        </div>
                    </div>
                </div>
                <div className="schedAnn">
                    <div className="schedule">
                        <div className="blocks">
                            {schedule.map(text => (
                                <Block key={text} content={text} />
                            ))}
                        </div>
                        <div className="progressOutline">
                            <div className="progress"></div>
                        </div>
                    </div>
                    <div className="annTag">
                        <p className="annStatic">Announcements</p>
                        <p className="annFraction">
                            {announcements?.data.length > 0
                                ? `${currentAnn + 1}/${announcements.data.length}`
                                : "0/0"
                            }
                        </p>
                    </div>
                    <div className="announcement">
                        {announcements.data.length > 0 ? (
                            <div className="fullAnn">
                                <div className="annText">
                                    <p className="annOrganization">
                                        {announcements.data[currentAnn]?.organization}
                                    </p>
                                    <p className="annBody">
                                        {announcements.data[currentAnn]?.body}
                                    </p>
                                    <p className="annContact">
                                        Contact {announcements.data[currentAnn]?.email} for more information.
                                    </p>
                                </div>
                                {announcements.data[currentAnn].cost && (
                                    <div className="cost">
                                        <img src="./coin.svg" alt="" className="coin" />
                                        <p className="annCost">{announcements.data[currentAnn]?.cost}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="caughtUp">All caught up!</div>
                        )
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TV;