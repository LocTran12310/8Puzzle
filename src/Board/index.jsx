import React, { Component } from 'react'
//import _ from 'lodash'

import Tile from '../Tile'

// import predefined positions, which takes small time to resolve
//import startingPositions from './positions'

import './Board.css'

class Board extends Component {
    constructor (props) {
        super(props)

        this.state = {

        }
    }

    render () {
        const numbers = this.props.numbers
        const tiles = numbers.map((item,index) =>
            <Tile key={index} id={index} number={item}
                isDisabled={this.props.isDisabled}
                initState={this.props.initState}
            />
        )

        return (
            <div className="board">
                {tiles}
            </div>
        )
    }
}

export default Board
