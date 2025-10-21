import React, { useState, useEffect } from "react"; // Import React
import DateEditor from "../components/DateEditor";
import "./Schedule.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'; // Needed potentially for more complex date checks if required
import weekday from 'dayjs/plugin/weekday'; // Needed for setting day of the week
import isoWeek from 'dayjs/plugin/isoWeek'; // Useful for week calculations
import { getDatabase, ref, onValue, remove } from "firebase/database";
import app from "../fb/fbConfig.js";

dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(isoWeek);

const Schedule = () => {

    var times = [];

    for (var i = 8; i < 24; i++) {
        if (i === 0) {
            times.push(<p className='hour' key={i}>12am</p>);
        } else if (i < 12) {
            times.push(<p className='hour' key={i}>{i}am</p>);
        } else if (i === 12) {
            times.push(<p className='hour' key={i}>12pm</p>);
        } else {
            times.push(<p className='hour' key={i}>{i - 12}pm</p>);
        }
    }

    function timeToMinutes(t) {
        const [h, m] = t.split(":").map(Number);
        return (h * 60 + m) * 2; // Always treat as 24-hour time; multiply by 2 here
    }


    function rangeToPosition(start, end) {
        const scheduleStart = timeToMinutes("08:00"); // in px already
        const top = timeToMinutes(start) - scheduleStart;
        const height = timeToMinutes(end) - timeToMinutes(start);

        return { top, height };
    }




    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [schedit, setSchedit] = useState([]);
    const [edit_type, setEditType] = useState(null)
    const [weekSchedule, setWeekSchedule] = useState([])

    useEffect(() => {
        const db = getDatabase(app);
        const scheduleRef = ref(db, "schedule");

        // Listen for changes in the "announcements" node
        onValue(scheduleRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert the data into an array of announcements
                const scheduleArray = Object.keys(data).map((key) => ({
                    id: key,  // The unique key for each announcement
                    ...data[key]  // Spread the content of the announcement
                }));
                setSchedit(scheduleArray);
            } else {
                setSchedit([])
            }
        });


    }, []);

    const handleDelete = (id) => {
        const db = getDatabase(app);
        const scheduleRef = ref(db, `schedule/${id}`);

        remove(scheduleRef)
            .catch((error) => {
                console.error("Error deleting announcement:", error);
            });
    };

    const saved = () => {
        toast.success("Saved!")
    }

    const runCase = (type) => {
        if (type === "noon") {
            setEditType("Noon Dismissal")
            setSelectedSchedule(noon_dismissal)
            toast.info("Scheduling for next Friday", {
                autoClose: 4000
            })
        } else if (type === "early") {
            setEditType("Early Release")
            setSelectedSchedule(early_release)
            toast.info("The next Wednesday and Friday (including today) are selected.", {
                autoClose: 4000
            })
        } else if (type === "exams") {
            setEditType("Exams")
            setSelectedSchedule(exams)
        }
    }

    var bells = ["8:15-9:17", "9:20-10:17", "10:20-11:17", "11:19-12:41", "12:44-13:41", "13:44-14:41"]
    var schedule = [
        ["CREW", "A", "B", "C", "D", "E"],
        ["G", "F", "E", "D", "C", "B"],
        ["A", "B", "C", "F", "G", "FLEX"],
        ["G", "F", "E", "D", "B", "A"],
        ["A", "C", "D", "E", "F", "G"]
    ]

    const early_release = [
        [
            5,
            ["8:15-8:57", "9:00-9:37", "9:40-10:17", "10:20-10:57", "11:00-11:37", "11:40-12:17", "12:17-12:41"],
            ["A", "C", "D", "E", "F", "G", "Lunch Block & Dismissal"]
        ]
    ]
    const noon_dismissal = [
        [
            5,
            ["8:15-8:50", "8:53-9:23", "9:26-9:56", "9:59-10:29", "10:32-11:02", "11:05-11:35", "11:38 - 12:00"],
            ["A", "C", "D", "E", "F", "G", "Grab and Go Lunch"]
        ]
    ]
    const exam_bells = ["8:15-8:30", "8:30-10:00", "10:00-10:45", "10:45-11:00", "11:00-12:30", "12:30-13:15"]
    const exams = [
        [
            1,
            exam_bells,
            ["FLEX", "", "Extended Time", "FLEX", "", "Extended Time"]
        ],
        [
            2,
            exam_bells,
            ["FLEX", "", "Extended Time", "FLEX", "", "Extended Time"]
        ],
        [
            3,
            exam_bells,
            ["FLEX", "", "Extended Time", "FLEX", "", "Extended Time"]
        ],
        [
            4,
            exam_bells,
            ["FLEX", "", "Extended Time", "FLEX", "", "Extended Time"]
        ]
    ]

    function getThisWeekDates() {
        const weekDates = [];

        for (let i = 1; i <= 5; i++) {
            weekDates.push(dayjs().day(i).date()); // Monday = 1, Sunday = 7
        }

        return weekDates;
    }

    function getThisWeekDateStrings() {
        const today = dayjs().weekday(1); // Get current date

        const weekDates = [];

        for (let i = 0; i < 5; i++) {
            weekDates.push(today.add(i, 'day').format('YYYY-MM-DD'));
        }

        return weekDates;
    }

    const weekdays = getThisWeekDates();

    // weekdays.forEach(function (date) {
    //     console.log(date.date()); // ISO string like '2025-04-04T15:35:21-04:00'
    // });
    const day_names = ["Mon", "Tue", "Wed", "Thu", "Fri"]

    useEffect(() => {
        // ---> Calculate weekdays INSIDE the effect <---
        const currentWeekdays = getThisWeekDateStrings();
        console.log("Processing schedule for weekdays:", currentWeekdays); // Add this log to verify!
        // console.log("Using Schedit Data:", schedit); // Keep for debugging if needed

        const processedSchedule = currentWeekdays.map((dateStr, dayIndex) => {
            let daySchedule = null;
            let isSpecial = false;
            let foundMatch = false;

            for (const special of schedit) {
                let timesArray = null;
                let blocksArray = null;
                let identifierInfo = ""; // For logging

                // Reset these for each special entry check
                timesArray = null;
                blocksArray = null;
                identifierInfo = "";

                // CASE 1: dates IS an Array
                if (special.dates && Array.isArray(special.dates)) {
                    const dateMatchIndex = special.dates.findIndex(d => d === dateStr); // Comparing against correct dateStr now
                    // Only proceed if date IS found (index is not -1)
                    if (dateMatchIndex !== -1) {
                        identifierInfo = `array index ${dateMatchIndex}`;
                        // Try accessing times/blocks using the index
                        if (special.times && typeof special.times === 'object' && special.times[dateMatchIndex] !== undefined) {
                            timesArray = special.times[dateMatchIndex];
                        }
                        if (special.blocks && typeof special.blocks === 'object' && special.blocks[dateMatchIndex] !== undefined) {
                            blocksArray = special.blocks[dateMatchIndex];
                        }
                    } else {
                        identifierInfo = `array index ${dateMatchIndex}`; // Store -1 for logging context if needed
                    }
                }
                // CASE 2: dates IS an Object
                else if (special.dates && typeof special.dates === 'object') {
                    let dateMatchKey = null;
                    for (const key in special.dates) {
                        if (special.dates.hasOwnProperty(key) && special.dates[key] === dateStr) {
                            dateMatchKey = key;
                            break;
                        }
                    }
                    // Only proceed if date IS found (key is not null)
                    if (dateMatchKey !== null) {
                        identifierInfo = `object key ${dateMatchKey}`;
                        // Access times/blocks using the string key
                        if (special.times && typeof special.times === 'object' && special.times[dateMatchKey] !== undefined) {
                            timesArray = special.times[dateMatchKey];
                        }
                        if (special.blocks && typeof special.blocks === 'object' && special.blocks[dateMatchKey] !== undefined) {
                            blocksArray = special.blocks[dateMatchKey];
                        }
                    } else {
                        identifierInfo = `object key null`; // Store null for logging context if needed
                    }
                }


                // --- Common Validation Logic ---
                // Check if date was potentially found (identifier exists and isn't indicating 'not found')
                const wasDateFound = identifierInfo && !identifierInfo.includes("-1") && !identifierInfo.includes("null");

                if (wasDateFound) {
                    // Now check if times/blocks were successfully retrieved AND are arrays
                    if (timesArray !== null && blocksArray !== null && Array.isArray(timesArray) && Array.isArray(blocksArray)) {
                        daySchedule = { bells: timesArray, blocks: blocksArray };
                        isSpecial = true;
                        foundMatch = true;
                        console.log(`Using SPECIAL schedule for ${dateStr} from entry ${special.id} (matched via ${identifierInfo})`);
                        break; // Exit inner loop (over schedit)
                    } else {
                        // Date was found, but times/blocks retrieval or validation failed
                        console.warn(`Data consistency/retrieval issue for date ${dateStr} in entry ${special.id}. Matched via ${identifierInfo}. Retrieved times (${timesArray === null ? 'null' : typeof timesArray})/blocks (${blocksArray === null ? 'null' : typeof blocksArray}) are not valid arrays or couldn't be retrieved.`, { times: timesArray, blocks: blocksArray });
                    }
                }
                // No need for an 'else' here, if date wasn't found, we just continue to the next 'special' entry or finish the loop.

            } // End loop through schedit entries

            // If no special schedule was found after checking all entries
            if (!foundMatch) {
                // console.log(`Using DEFAULT schedule for ${dateStr}`); // Optional debug
                if (dayIndex < schedule.length) {
                    daySchedule = {
                        bells: bells,
                        blocks: schedule[dayIndex]
                    };
                } else {
                    console.warn(`Day index ${dayIndex} out of bounds for normal schedule array.`);
                    daySchedule = { bells: [], blocks: [] };
                }
            }

            if (!daySchedule) {
                console.error(`Failed to determine any schedule for ${dateStr}`);
                daySchedule = { bells: [], blocks: [] };
            }

            return { date: dateStr, isSpecial, ...daySchedule };
        });

        setWeekSchedule(processedSchedule);
        // Dependency array remains correct - runs when schedit changes.
    }, [schedit]);


    return (
        <>
            <h1>Schedule</h1>
            <hr />
            <div className="overflow">
                <div className="expanded">
                    <div className="times">
                        <div className="filler-clock"><span className="material-symbols-rounded">schedule</span></div>
                        {times}
                    </div>
                    <div className="flex">
                        <table className="schedule">
                            <tbody>
                                <tr>
                                    {day_names.map((day, index) => (
                                        <td className="t-weekday">{day} {weekdays[index]}</td>
                                    ))}
                                </tr>

                            </tbody>
                        </table>
                        <div className="events">
                            {weekSchedule.map((dayData, dayIndex) => {
                                // dayIndex is 0 for Mon, 1 for Tue, etc.
                                // dayData contains { date, isSpecial, bells, blocks }

                                // Ensure bells and blocks are arrays before mapping
                                const dayBells = Array.isArray(dayData.bells) ? dayData.bells : [];
                                const dayBlocks = Array.isArray(dayData.blocks) ? dayData.blocks : [];


                                return dayBells.map((range, blockIndex) => {
                                    // Make sure range is a string before splitting
                                    if (typeof range !== 'string' || !range.includes('-')) {
                                        console.warn(`Invalid time range format for day ${dayData.date}, index ${blockIndex}:`, range);
                                        return null; // Skip rendering this block
                                    }
                                    const [start, end] = range.split("-");
                                    const { top, height } = rangeToPosition(start, end);
                                    const blockName = dayBlocks[blockIndex] ?? ""; // Use block name or empty string

                                    // Ensure height is positive before rendering
                                    if (height <= 0) {
                                        // Optionally log or handle blocks with zero/negative duration
                                        // console.log(`Skipping block with zero/negative height: ${blockName} at ${range}`);
                                        return null;
                                    }


                                    return (
                                        <div
                                            key={`${dayData.date}-${blockIndex}`} // Unique key
                                            className={`event ${dayData.isSpecial ? 'special-event' : 'normal-event'}`} // Add class for styling special days
                                            style={{
                                                position: "absolute",
                                                top: `${top}px`,
                                                left: `${dayIndex * 20}%`, // Position horizontally based on day index
                                                height: `${height}px`,
                                                width: "20%", // Column width
                                                borderRadius: "6px",
                                                padding: "4px",
                                            }}
                                            title={`${blockName} (${range.trim()})`} // Tooltip on hover
                                        >
                                            <p className="event_class">{blockName}</p>
                                            {/* Optionally display time inside */}
                                            {/* <p className="event_time">{range.trim()}</p> */}
                                        </div>
                                    );
                                });
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className="editor">
                <h2><span className="material-symbols-rounded">edit</span> Edit</h2>
                <hr />
                <div className="special-cases">
                    <button className="case" onClick={() => runCase("early")}>
                        <span className="material-symbols-rounded">
                            notifications_active
                        </span>
                        Early Release
                    </button>
                    <button className="case" onClick={() => runCase("noon")}>
                        <span className="material-symbols-rounded">
                            wb_twilight
                        </span>
                        Noon Dismissal
                    </button>
                    <button className="case" onClick={() => runCase("exams")}>
                        <span className="material-symbols-rounded">
                            school
                        </span>
                        Exams
                    </button>
                    {/* <button className="case" onClick={() => runCase("create")}>
                        <span className="material-symbols-rounded">
                            add
                        </span>
                        Create
                    </button> */}
                </div>
                {selectedSchedule && (
                    <> {/* Use a React Fragment to group elements without adding a DOM node */}
                        {selectedSchedule.map((schedule, index) => (
                            <DateEditor key={index} sched={schedule} type={edit_type} />
                        ))}
                    </>
                )}
            </div >
            <div className="editor">
                <h2><span className="material-symbols-rounded">
                    event_upcoming
                </span>
                    Scheduled Changes</h2>
                <hr />
                <table className="t-changes">
                    <>
                        <colgroup>
                            <col style={{ width: "40%" }} />
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "40%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Type</th>
                                <th>YYYY-MM-DD</th>
                                <th>Cancel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedit.map((sched) => (
                                <tr>
                                    <td data-label="User">{sched.user}</td>
                                    <td data-label="Type">{sched.type}</td>
                                    <td data-label="Date">{sched.dates.join(", ")}</td>
                                    <td data-label="Cancel"><button><span className="material-symbols-rounded trash-can" onClick={() => handleDelete(sched.id)}>delete</span></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                </table>
            </div>
            <ToastContainer position="top-right" autoClose={2000} transition={Slide} />
        </>
    )
}

export default Schedule