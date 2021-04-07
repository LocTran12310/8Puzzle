import React from 'react'

import './Tile.css'

function Tile (props) {
    const { number } = props
    if(props.isDisabled){
        if (number === 0) {
            return <div className="tile tile--empty"></div>
        }

        return (
            <div className="tile">
                {number}
            </div>
        )
    }
    return (
        <div className="tile">
            <input className="tile-input" type="tel" data-key={props.id} maxLength="1"
                onChange={(event)=>{props.initState[props.id]= parseInt(event.target.value)}}
            ></input>
        </div>
    )
}

export default Tile
