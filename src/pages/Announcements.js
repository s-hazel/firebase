import "./Announcements.css"
import Post from "../components/Post.js"
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../fb/fbConfig.js";
import Create from "../components/Create.js";

const Home = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const db = getDatabase(app);
        const announcementsRef = ref(db, "announcements");

        // Listen for changes in the "announcements" node
        onValue(announcementsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert the data into an array of announcements
                const announcementsArray = Object.keys(data).map((key) => ({
                    id: key,  // The unique key for each announcement
                    ...data[key]  // Spread the content of the announcement
                }));
                setAnnouncements(announcementsArray);
            } else {
                setAnnouncements([])
            }
        });


    }, []);

    const create = () => {
        document.getElementById("popup").style.display = "flex"
    }

    return (
        <>
            <h1 className="b-pad">Active Posts</h1>
            <div className="add" onClick={create}>
                <span className="material-symbols-rounded">add</span>
            </div>
            <div className="posts">
                {announcements.length > 0 ? (
                    announcements.map((ann) => (
                        <Post id={ann.id} group={ann.group} body={ann.body} contact={ann.contact} />
                    ))
                ) : (
                    <p>No announcements yet. Be the first!</p>
                )}
            </div>

            <div id="popup" className="popup">
                <Create />
            </div>

        </>
    )
}

export default Home