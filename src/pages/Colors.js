import "./Colors.css"
import ColorPicker from "react-pick-color"
import Swatches from "../components/Swatches"
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update, push } from "firebase/database";
import app from "../fb/fbConfig.js";

const Colors = () => {
    const [color, setColor] = useState('#ff0000');

    const db = getDatabase(app);
    const colorsRef = ref(db, "colors");

    useEffect(() => {
        // Listen for changes in the "colors" node
        onValue(colorsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert the data into an array of announcements
                // const colorsArray = Object.keys(data).map((key) => ({
                //     id: key,  // The unique key for each announcement
                //     ...data[key]  // Spread the content of the announcement
                // }));
                console.log(data["monthly"])
                data["monthly"].map((colorset, index) => {
                    let swatches = document.getElementById("swatches-" + index)
                    Array.from(swatches.getElementsByClassName("swatch")).forEach((swatch, index) => {
                        swatch.style.backgroundColor = colorset[index]
                        swatch.value = colorset[index]
                        swatch.innerHTML = ""
                    })
                })
            } else {
            }
        });

    }, []);

    const postColors = async (sendColors) => {
        const colorsObject = Object.fromEntries(sendColors.map((monthColors, index) => [index, monthColors]));
        try {
            const colorsRef = ref(db, "colors/monthly");
            await update(colorsRef, colorsObject);
    
            console.log("Data successfully written!");
        } catch (error) {
            console.error("Error writing to database:", error);
        }
    };

    var allColors = []
    const save = () => {
        // let response = window.confirm("This action cannot be undone. Are you sure you want to proceed?")
            allColors = []
            for (var i = 0; i < 12; i++) {
                let swatches = document.getElementById("swatches-" + i)
                let sub_array = []
                Array.from(swatches.getElementsByClassName("swatch")).forEach((color) => {
                    if (color.value === undefined) {
                        sub_array.push("#000")
                    } else {
                        sub_array.push(color.value)
                    }
                })
                allColors.push(sub_array)
            }
            // console.log(allColors)
            postColors(allColors)
    }

    return (
        <>
            <h1>Colors</h1>
            <hr />
            <p>Choose a color then click on a slot to change it. Changes will not be uploaded until you press save at the bottom of this page. Saving cannot be undone.</p>
            <p>Try <a href="https://supercolorpalette.com" target="_blank">supercolorpalette.com</a> for color scheme ideas. Generate 6 colors instead of the default 5. Export it as a list to easily import the colors below.</p>
            <ColorPicker
                color={color}
                hideAlpha={true}
                onChange={color => setColor(color.hex)}
                className="picker"
                theme={{
                    boxShadow: '0',
                    width: '30%'
                }}
            />
            <p className="month">January</p>
            <Swatches id="swatches-0" selected={color} />
            <p className="month">February</p>
            <Swatches id="swatches-1" selected={color} />
            <p className="month">March</p>
            <Swatches id="swatches-2" selected={color} />
            <p className="month">April</p>
            <Swatches id="swatches-3" selected={color} />
            <p className="month">May</p>
            <Swatches id="swatches-4" selected={color} />
            <p className="month">June</p>
            <Swatches id="swatches-5" selected={color} />
            <p className="month">July</p>
            <Swatches id="swatches-6" selected={color} />
            <p className="month">August</p>
            <Swatches id="swatches-7" selected={color} />
            <p className="month">September</p>
            <Swatches id="swatches-8" selected={color} />
            <p className="month">October</p>
            <Swatches id="swatches-9" selected={color} />
            <p className="month">November</p>
            <Swatches id="swatches-10" selected={color} />
            <p className="month">December</p>
            <Swatches id="swatches-11" selected={color} />

            <button className="save" onClick={save}>Save</button>
        </>
    )
}

export default Colors