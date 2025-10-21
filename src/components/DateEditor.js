import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek'
import weekday from 'dayjs/plugin/weekday'
import app from "../fb/fbConfig.js";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const DateEditor = ({ sched, type }) => {
    const [u_email, setUserEmail] = useState("User")
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserEmail(user.email)
        }
    });

    const db = getDatabase(app);

    const makePost = (e) => {
        e.preventDefault();

        const scheduleRef = ref(db, "schedule");
        const newScheduleRef = push(scheduleRef); // Generates a unique ID

        var dates = []
        document.querySelectorAll("#date").forEach((date) => {
            dates.push(date.value)
        })
        console.log(dates)

        var times = []
        var sub_times = []
        document.querySelectorAll("#time").forEach((time, index) => {
            sub_times.push(time.value);

            // Check if the current subarray has reached the desired length
            if ((index + 1) % sched[1].length === 0) {
                times.push(sub_times);
                sub_times = []; // Start a new subarray
            }
        })
        console.log(times)

        var blocks = []
        var sub_blocks = []
        document.querySelectorAll("#block").forEach((block, index) => {
            sub_blocks.push(block.value);

            // Check if the current subarray has reached the desired length
            if ((index + 1) % sched[1].length === 0) {
                blocks.push(sub_blocks);
                sub_blocks = []; // Start a new subarray
            }
        })
        console.log(blocks)

        set(newScheduleRef, {
            user: u_email,
            type: type,
            dates: dates,
            times: times,
            blocks: blocks
        });

    };


    // useEffect(() => {
    //     const today = new Date().toISOString().split("T")[0];
    //     document.getElementById("date").setAttribute("min", today);
    // })

    // const handleTimeChange = (index, event) => {
    //     let newSched = { ...sched };
    //     newSched[1][index] = event.target.innerText;
    //     setSched(newSched);
    // };

    // const handleDayChange = (index, event) => {
    //     let newSched = { ...sched };
    //     newSched[2][index] = event.target.innerText;
    //     setSched(newSched);
    // };

    dayjs.extend(isoWeek)
    dayjs.extend(weekday)
    const getNext = () => {
        const today = dayjs();
        const todayIsoDay = today.isoWeekday(); // 1 = Monday, 7 = Sunday
        const schedIsoDay = parseInt(sched[0], 10); // Ensure it's a number

        let daysToAdd = schedIsoDay - todayIsoDay;

        if (daysToAdd <= 0) {
            daysToAdd += 7; // Always push to next week if today or earlier
        }

        return today.add(daysToAdd, 'day').format('YYYY-MM-DD');
    };


    const min_date = dayjs().format('YYYY-MM-DD');

    return (
        <div className="day-edit">
            <input type="date" id="date" className="date" defaultValue={getNext()} key={getNext()} min={min_date} />
            <table className="special-schedule">
                <tbody className="special-body">
                    <tr id="schedule-time" className="special-row">
                        {sched[1].map((time) => (
                            <td className="t-label">
                                <input type="text" defaultValue={time} key={time} id="time" className="t-input" />
                            </td>
                        ))}
                    </tr>
                    <tr id="schedule-day" className="special-row">
                        {sched[2].map((day) => (
                            <td className="t-content">
                                <input type="text" defaultValue={day} key={day} id="block" className="t-input"></input>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <button className="save" onClick={makePost}>Save</button>
        </div>
    )
}

export default DateEditor