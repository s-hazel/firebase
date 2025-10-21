import { useState } from "react"

const Swatches = ({selected, id}) => {
    const [importBox, showImport] = useState(false)

    const fillColor = (ev) => {
        ev.currentTarget.style.backgroundColor = selected
        ev.currentTarget.value = selected
        ev.currentTarget.innerHTML = ""
    }

    const uploadImport = () => {
        var swatches = document.getElementById(id)
        var list_import = document.getElementById(id + "-list")
        var imports = list_import.value.split("\n")
        if (imports.length === 6) {
            showImport(false)
            Array.from(swatches.getElementsByClassName("swatch")).forEach((swatch, index) => {
                swatch.style.backgroundColor = imports[index]
                swatch.value = imports[index]
                swatch.innerHTML = ""
            })
        } else {
            list_import.value = ""
            list_import.placeholder = "Error: Enter 6 HEX codes separated by a new line."
            list_import.style.borderColor = "var(--melrose-red)"
        }

        return false;
    }

    return (
        <>
            <div className="swatches" id={id}>
                <div className="swatch" onClick={fillColor}>
                    1
                </div>
                <div className="swatch" onClick={fillColor}>
                    2
                </div>
                <div className="swatch" onClick={fillColor}>
                    3
                </div>
                <div className="swatch" onClick={fillColor}>
                    4
                </div>
                <div className="swatch" onClick={fillColor}>
                    5
                </div>
                <div className="swatch" onClick={fillColor}>
                    6
                </div>
                <div className="import" onClick={() => showImport(true)}>
                    <span className="material-symbols-rounded">upload</span>
                </div>
            </div>
            {
                importBox &&
                <div className="color-list">
                    <textarea name="" id={id + "-list"} placeholder="Paste Here" className="list-import"></textarea>
                    <button type="submit" className="list-submit" onClick={uploadImport}>Submit</button>
                </div>
            }
        </>
    )
}

export default Swatches;