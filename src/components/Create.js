import React, { useState } from "react";
import { getDatabase, ref, set, push } from "firebase/database";
import app from "../fb/fbConfig.js";

const Create = () => {
    const [group, setGroup] = useState("");
    const [body, setBody] = useState("");
    const [contact, setContact] = useState("");

    const db = getDatabase(app);

    const makePost = (e) => {
        e.preventDefault();
        e.currentTarget.reset()

        const announcementsRef = ref(db, "announcements");
        const newAnnouncementRef = push(announcementsRef); // Generates a unique ID

        set(newAnnouncementRef, {
            group: group,
            body: body,
            contact: contact
        });

        close()
    };

    const close = (e) => {
        // e.preventDefault();
        document.getElementById("popup").style.display = "none"
    };

    return (
        <div className="home">
            <div className="material-symbols-rounded close" onClick={close}>close</div>
            <h2>Create a Post</h2>
            <form onSubmit={makePost} className="new-post">
                <p>Post Type</p>
                <div className="slider">
                    <input type="radio" name="post-type" id="loop" defaultChecked />
                    <label for="loop" className="slider-label">
                        <span className="material-symbols-rounded">repeat</span>
                        Loop
                    </label>
                    <input type="radio" name="post-type" id="sticky" />
                    <label for="sticky" className="slider-label">
                        <span className="material-symbols-rounded">location_on</span>
                        Pin
                    </label>
                    <input type="radio" name="post-type" id="banner" />
                    <label for="banner" className="slider-label">
                        <span className="material-symbols-rounded">warning</span>
                        Banner
                    </label>
                </div>
                <input
                    type="text"
                    id="add-group"
                    className="add-group"
                    placeholder="Club/Sport/Group"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    required
                />
                <textarea
                    id="add-body"
                    className="add-body"
                    placeholder="Announcement"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                ></textarea>
                <input
                    type="text"
                    id="add-contact"
                    className="add-contact"
                    placeholder="Contact Email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                />
                <button className="submit-post" type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Create;
