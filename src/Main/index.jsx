import React, { Component } from 'react'
import _ from 'lodash'

import Board from '../Board'

import './Main.css'

class Main extends Component {
    constructor (props) {
        super(props)

        this.state = {
            //numbers: [1, 2, 3, 4, 5, 6, 7, 8, 0]
            start: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            goal: [0, 1, 2, 3, 4, 5, 6, 7, 8],

            fullPath: [],
            initStart: [],
            initGoal: [],
        }
    }

    componentDidMount () {

    }
    handleAction = (type) => {
        switch(type){
            case "Solve":
                if(this.state.initStart.length<9 || this.state.initGoal.length<9){
                    alert("Vui lòng nhập đầy đủ")
                    break;
                }
                const fullPath = this.aStar(this.state.start, this.state.goal)
                this.setState({
                    fullPath: fullPath
                })
                break;
            case "Start":
                if(this.state.initStart.length<9){
                    alert("Vui lòng nhập Start");
                    break;
                }
                this.setState({
                    start: this.state.initStart
                })
                alert("Nhập start thành công")
                break;
            case "Goal":
                if(this.state.initGoal.length<9){
                    alert("Vui lòng nhập Start");
                    break;
                }
                this.setState({
                    goal: this.state.initGoal
                })
                alert("Nhập goal thành công")

                break;
            default:
                break;
        }
    }

    /**
     * A* algorithm implementation, returns full path
     * from starting position to goal position
     *
     * @param {[Number]} start position of numbers
     * @param {[Number]} goal position of numbers
     * @returns {[[Number]]} array of numbers array
     */
    aStar (start, goal) {
        const closedSet = []

        const openSet = [start]

        const fScores = {}
        const gScores = {}

        gScores[start] = 0
        fScores[start] = this.getHeuristic(start, goal)
        const cameFrom = {}

        while (openSet.length > 0) {
            const current = this.getLowestFscore(openSet, fScores)

            if (this.isEqual(current, goal)) {
                const fullPath = this.reconstructPath(cameFrom, current)

                return fullPath
            }

            // remove current position from open set
            _.remove(openSet, (position) => this.isEqual(position, current))

            // add current position to closed set
            closedSet.push(current)

            const neighbors = this.getNeighbors(current)

            for (let neighbor of neighbors) {
                if (this.isInSet(closedSet, neighbor)) {
                    continue
                }

                const tentativeGscore = gScores[current] + 1 // distance between current and neighbor position is equal to 1

                if (!this.isInSet(openSet, neighbor)) {
                    openSet.push(neighbor)
                } else if (tentativeGscore >= gScores[neighbor]) {
                    continue
                }

                cameFrom[neighbor] = current
                gScores[neighbor] = tentativeGscore
                fScores[neighbor] = gScores[neighbor] + this.getHeuristic(neighbor, goal)
            }
        }
    }

    /**
     * Get position with lowest fScore
     *
     * @param {[[Number]]} openSet array of open positions
     * @param {[Number]} fScores array of fscores
     * @returns {[Number]}
     */
    getLowestFscore (openSet, fScores) {
        let minFscore = openSet[0]
        let minScore = fScores[minFscore]

        openSet.forEach(item => {
            if (fScores[item] < minScore) {
                minScore = fScores[item]
                minFscore = item
            }
        })

        return JSON.parse("[" + minFscore + "]")
    }

    /**
     * Compare if two positions are equal
     *
     * @param {[Number]} current position of numbers
     * @param {[Number]} goal position of numbers
     * @returns {Boolean}
     */
    isEqual (current, goal) {
        return current.toString() === goal.toString()
    }

    /**
     * Get neighbor positions of current position
     *
     * @param {[Number]} current position of numbers
     * @returns {[[Number]]}
     */
    getNeighbors (current) {
        const positions = []
        const ind = current.findIndex(item => item === 0)

        if (ind >= 3) {
            const topNeighbour = [...current]

            topNeighbour[ind - 3] = current[ind]
            topNeighbour[ind] = current[ind - 3]

            positions.push(topNeighbour)
        }

        if (ind <= 5) {
            const bottomNeighbour = [...current]

            bottomNeighbour[ind + 3] = current[ind]
            bottomNeighbour[ind] = current[ind + 3]

            positions.push(bottomNeighbour)
        }

        if (![0, 3, 6].includes(ind)) {
            const leftNeighbour = [...current]

            leftNeighbour[ind - 1] = current[ind]
            leftNeighbour[ind] = current[ind - 1]

            positions.push(leftNeighbour)
        }

        if (![2, 5, 8].includes(ind)) {
            const rightNeighbour = [...current]

            rightNeighbour[ind + 1] = current[ind]
            rightNeighbour[ind] = current[ind + 1]

            positions.push(rightNeighbour)
        }

        return positions
    }

    /**
     * Check if position is in set(open or closed) already
     *
     * @param {[[Number]]} set array of numbers position
     * @param {[Number]} neighbor position of numbers
     * @returns {Boolean}
     */
    isInSet (set, neighbor) {
        return !!set.find(position => this.isEqual(position, neighbor))
    }

    /**
     * Get heuristic cost
     *
     * @param {[Number]} current position of numbers
     * @param {[Number]} goal position of numbers
     * @returns {Number}
     */
    getHeuristic (current, goal) {
        let count = 0

        for (let i = 0; i < current.length; i++) {
            if (current[i] !== 0 && current[i] !== goal[i]) {
                count++
            }
        }

        return count
    }

    /**
     * Get successfull path from full path covered
     *
     * @param {Object} cameFrom full path covered
     * @param {[Number]} current goal position
     * @returns {[[Number]]}
     */
    reconstructPath (cameFrom, current) {
        const totalPath = [current]

        while (Object.keys(cameFrom).includes(current.toString())) {
            current = cameFrom[current]

            totalPath.push(current)
        }

        return _.reverse(totalPath)
    }

    render () {
        const draw = this.state.fullPath.map(item => <Board key={item} numbers={item} isDisabled={true}/>)

        return (
            <div className="main">
                <div className="main-init">
                    <Board
                        numbers={this.state.start}
                        initState={this.state.initStart}/>
                    <div className="main-actions">
                        <button className="action" onClick={()=>{this.handleAction("Start")}}>Nhập Start</button>
                        <button className="action" onClick={()=>{this.handleAction("Goal")}}>Nhập Goal</button>
                        <button className="action" onClick={()=>{this.handleAction("Solve")}}>Giải</button>
                    </div>
                    <Board
                        numbers={this.state.goal}
                        initState={this.state.initGoal} />
                </div>
                <div className="main-solve">
                    {draw}
                </div>
            </div>
        )
    }
}

export default Main
