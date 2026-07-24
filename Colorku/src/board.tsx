import { useState } from 'react'
import type { Puzzle, Difficulty } from './types'
import { COLORS } from './colors'

interface CellProps {
    value: number;
    isGiven: boolean;
    isSelected: boolean;
    isNeighbor: boolean;
    isMatch: boolean;
    onClick: () => void;
}

interface PaletteProps {
    onSelectColor: (colorNum: number) => void
}

export function Palette({ onSelectColor }: PaletteProps) {
    return (
        <div className='palette'>
            {Object.entries(COLORS).map(([key, color]) => (
            <div
                key={key}
                className='paletteswatch'
                style={{ backgroundColor: color }}
                onClick={() => onSelectColor(Number(key))}
            />
            ))}
            <div
                className='paletteswatch clear-button'
                style={{ backgroundColor: 'white' }}
                onClick={() => onSelectColor(0)}
            >
              × 
            </div> 
        </div>
    )
}

export function Cell({ value, isGiven: _isGiven, isSelected, isNeighbor, isMatch, onClick} : CellProps) {
    return (
        <div className={`cell ${isSelected ? 'selected' : ''} ${isNeighbor ? 'neighbor' : ''} ${isMatch ? 'match' : ''}`} onClick={onClick}>
        {value !== 0 && (
        <div className='swatch' style={{ backgroundColor: COLORS[value] }}/> )}
        </div> 
    )
}


export function Board({ puzzle, date, difficulty, onBack }: { puzzle : Puzzle; date: string, difficulty: Difficulty, onBack: () => void }) {
    const [board, setBoard] = useState<number[][]>(() => {
        const saved = localStorage.getItem(`colorku-progress-${difficulty}`)
        if (saved === null) return puzzle.given

        const parsed = JSON.parse(saved)
        if (parsed.date !== date) return puzzle.given

        return parsed.board
    })

    const [selected, setSelected] = useState<{ row: number; col: number} | null>(null)

    function placeValue(colorNum: number) {
        if (selected === null) return
        if (puzzle.given[selected.row][selected.col] !== 0) return
        const newBoard = board.map((row, rowNum) => {
            if (rowNum !== selected.row) return row
            return row.map((cellValue, colNum) => {
                if (colNum !== selected.col) return cellValue
                return colorNum
            })
        })
        setBoard(newBoard)
        localStorage.setItem(`colorku-progress-${difficulty}`, JSON.stringify({ date: date, board: newBoard }))
    }

    function clearAll() {
        setBoard(puzzle.given)
        localStorage.setItem(`colorku-progress-${difficulty}`, JSON.stringify({ date: date, board: puzzle.given }))
    }

    return (
        <div className='page'>
            <div className='header-buttons'>
                <button className='back-button' onClick={onBack}>Back</button>
                <button className='reset-button' onClick={clearAll}>Reset</button>
            </div>
            <div className='game' >
                <div className='board'>
                    {board.map((row, rowIdx) =>  (
                        <div key = {rowIdx} className='row'>
                            {row.map((value, colIdx) => (
                                <Cell
                                    key={colIdx}
                                    value={value}
                                    isGiven={puzzle.given[rowIdx][colIdx] !== 0}
                                    isSelected={(selected?.row === rowIdx) && (selected?.col === colIdx)}
                                    isNeighbor={
                                        (selected !== null) && (
                                            rowIdx === selected.row || colIdx === selected.col || 
                                            ((Math.floor(rowIdx / 3) === Math.floor(selected.row / 3)) && (Math.floor(colIdx / 3) === Math.floor(selected.col / 3))) &&
                                            !((rowIdx === selected.row) && (colIdx === selected.col))
                                        )
                                    }
                                    isMatch={
                                        (selected !== null) && (value !== 0) && (board[selected.row][selected.col] ===  value)
                                    }
                                    onClick={() => {setSelected({ row: rowIdx, col: colIdx })}
                                    }
                                />
                            ))}
                        </div>
                    ))}
                <div className='gridlines' />
                </div>
                <Palette onSelectColor={placeValue} />
            </div>
        </div>
        
    )
}