import { useState, useEffect } from 'react';
import './App.css';

const GRID_SIZE = 10;
const TOTAL_NUMBERS = 100;

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function generateGrid() {
  const numbers = shuffleArray([...Array(TOTAL_NUMBERS).keys()]);
  const grid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    grid.push(numbers.slice(i * GRID_SIZE, (i + 1) * GRID_SIZE));
  }
  return grid;
}

function App() {
  const [grid, setGrid] = useState(generateGrid());
  const [currentNumber, setCurrentNumber] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timer, setTimer] = useState(300); // default 5 minutes
  const [initialTime, setInitialTime] = useState(300);

  useEffect(() => {
    if (timer > 0 && startTime) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !endTime) {
      setEndTime(Date.now());
    }
  }, [timer, startTime, endTime]);

  const handleCellClick = (number) => {
    if (number !== currentNumber || endTime) return;

    if (currentNumber === 0 && !startTime) {
      setStartTime(Date.now());
    }

    setCurrentNumber(prev => prev + 1);

    if (number === TOTAL_NUMBERS - 1) {
      setEndTime(Date.now());
    }
  };

  const handleReset = () => {
    setGrid(generateGrid());
    setCurrentNumber(0);
    setStartTime(null);
    setEndTime(null);
    setTimer(initialTime);
  };

  const handleTimeChange = (e) => {
    const minutes = parseInt(e.target.value);
    const seconds = minutes * 60;
    setInitialTime(seconds);
    setTimer(seconds);
    setStartTime(null);
    setEndTime(null);
    setCurrentNumber(0);
    setGrid(generateGrid());
  };

  return (
    <div className="App" style={{ maxWidth: '100vw', overflowX: 'auto' }}>
      <h2>Concentration Grid</h2>
      <p>Start from 0, click numbers in ascending order as fast as you can.</p>
      <label>
        Set Timer:
        <select onChange={handleTimeChange} value={initialTime / 60}>
          <option value={1}>1 Minute</option>
          <option value={3}>3 Minutes</option>
          <option value={5}>5 Minutes</option>
        </select>
      </label>
      <p>Time Left: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</p>
      <button onClick={handleReset}>Reset</button>
      <div className="grid">
        {grid.map((row, i) => (
          <div key={i} className="row">
            {row.map((number, j) => (
              <button
                key={j}
                className={`cell ${number < currentNumber ? 'clicked' : ''}`}
                onClick={() => handleCellClick(number)}
                disabled={number !== currentNumber || !!endTime}
              >
                {number}
              </button>
            ))}
          </div>
        ))}
      </div>
      {endTime && (
        <div className="result">
          <h2>Time's Up!</h2>
          <p>You clicked {currentNumber} number{currentNumber !== 1 ? 's' : ''} in order.</p>
        </div>
      )}
    </div>
  );
}

export default App;

