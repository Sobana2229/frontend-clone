import React, { useState } from 'react';

function SimpleCalculator() {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState(null);
    const [operation, setOperation] = useState(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const inputNumber = (num) => {
        if (waitingForOperand) {
            setDisplay(String(num));
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? String(num) : display + num);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
        } else if (display.indexOf('.') === -1) {
            setDisplay(display + '.');
        }
    };

    const clear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(false);
    };

    const performOperation = (nextOperation) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operation) {
            const currentValue = previousValue || 0;
            const newValue = calculate(currentValue, inputValue, operation);

            setDisplay(String(newValue));
            setPreviousValue(newValue);
        }

        setWaitingForOperand(true);
        setOperation(nextOperation);
    };

    const calculate = (firstValue, secondValue, operation) => {
        switch (operation) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '×':
                return firstValue * secondValue;
            case '÷':
                return firstValue / secondValue;
            case '=':
                return secondValue;
            default:
                return secondValue;
        }
    };

    return (
        <div className="grid grid-cols-4 gap-1 p-1 bg-gray-900 rounded-lg w-[300px] mx-auto">
            {/* Display */}
            <div className="col-span-4 p-4 text-3xl text-right bg-gray-800 text-white rounded mb-2">
                {display}
            </div>

            {/* Row 1 */}
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                onClick={clear}
            >
                C
            </button>
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                onClick={() => performOperation('÷')}
            >
                ÷
            </button>
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                onClick={() => performOperation('×')}
            >
                ×
            </button>
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                onClick={() => performOperation('-')}
            >
                -
            </button>

            {/* Row 2 */}
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => inputNumber(7)}
            >
                7
            </button>
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => inputNumber(8)}
            >
                8
            </button>
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => inputNumber(9)}
            >
                9
            </button>
            <button 
                className="row-span-2 p-4 text-lg border-none cursor-pointer bg-orange-500 text-white rounded hover:bg-orange-400 transition-colors"
                onClick={() => performOperation('+')}
            >
                +
            </button>

            {/* Row 3 */}
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => inputNumber(4)}
            >
                4
            </button>
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => inputNumber(5)}
            >
                5
            </button>
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => inputNumber(6)}
            >
                6
            </button>

            {/* Row 4 */}
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => inputNumber(1)}
            >
                1
            </button>
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => inputNumber(2)}
            >
                2
            </button>
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => inputNumber(3)}
            >
                3
            </button>
            <button 
                className="row-span-2 p-4 text-lg border-none cursor-pointer bg-cyan-500 text-white rounded hover:bg-cyan-400 transition-colors"
                onClick={() => performOperation('=')}
            >
                =
            </button>

            {/* Row 5 */}
            <button 
                className="col-span-2 p-4 text-lg border-none cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => inputNumber(0)}
            >
                0
            </button>
            <button 
                className="p-4 text-lg border-none cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={inputDecimal}
            >
                .
            </button>
        </div>
    );
}

export default SimpleCalculator;