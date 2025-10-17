
import React, { useState } from 'react';

const CalcButton: React.FC<{
  onClick: (value: string) => void;
  value: string;
  className?: string;
  label?: string;
}> = ({ onClick, value, className = '', label }) => (
  <button
    onClick={() => onClick(value)}
    className={`bg-gray-700 hover:bg-gray-600 rounded-lg text-2xl font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  >
    {label || value}
  </button>
);

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handleInput = (value: string) => {
    if (display === 'Error') {
      setDisplay(value);
      setExpression(value);
      return;
    }

    if (display === '0' && value !== '.') {
      setDisplay(value);
      setExpression(value);
    } else {
      setDisplay(prev => prev + value);
      setExpression(prev => prev + value);
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    setDisplay(display + op);
    setExpression(expression + op);
  };
  
  const handleFunction = (func: string) => {
    if (display === 'Error') return;
    
    // Handle specific math constants
    if (func === 'Math.PI') {
      handleInput(String(Math.PI));
      return;
    }
    if (func === 'Math.E') {
      handleInput(String(Math.E));
      return;
    }

    if (display === '0' || display === '') {
        setDisplay(`${func}(`);
        setExpression(`${func}(`);
    } else {
        setDisplay(prev => prev + `${func}(`);
        setExpression(prev => prev + `${func}(`);
    }
  };
  
  const factorial = (n: number): number => {
      if (n < 0 || n % 1 !== 0) return NaN;
      if (n === 0) return 1;
      return n * factorial(n - 1);
  };

  const handleEquals = () => {
    if (display === 'Error') return;
    try {
      // Sanitize expression: allow numbers, operators, parens, Math functions.
      let sanitizedExpr = expression
        .replace(/\^/g, '**')
        .replace(/√/g, 'Math.sqrt')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan');

      // Factorial handling
      sanitizedExpr = sanitizedExpr.replace(/(\d+)!/g, (_, num) => `factorial(${num})`);

      // Check for invalid characters before evaluation
      if (/[^0-9\+\-\*\/\.\(\)\s\^eE\%Mathsqrtlog10tan!]/.test(sanitizedExpr)) {
        throw new Error("Invalid characters in expression");
      }
      
      const result = new Function('factorial', `return ${sanitizedExpr}`)(factorial);

      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid calculation");
      }

      setDisplay(String(result));
      setExpression(String(result));
    } catch (e) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const handleClear = () => {
    if (display.length > 1) {
      setDisplay(prev => prev.slice(0, -1));
      setExpression(prev => prev.slice(0, -1));
    } else {
      setDisplay('0');
      setExpression('');
    }
  };

  const handleAllClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const buttons = [
    { value: 'sin', label: 'sin', type: 'function', func: 'Math.sin' },
    { value: 'cos', label: 'cos', type: 'function', func: 'Math.cos' },
    { value: 'tan', label: 'tan', type: 'function', func: 'Math.tan' },
    { value: 'AC', type: 'clear', className: 'bg-red-600 hover:bg-red-700' },
    { value: 'C', type: 'clear-entry' },
    { value: 'log', label: 'log', type: 'function', func: 'Math.log10' },
    { value: 'ln', label: 'ln', type: 'function', func: 'Math.log' },
    { value: '^', label: 'xʸ', type: 'operator' },
    { value: '√', label: '√', type: 'function', func: 'Math.sqrt' },
    { value: '/', type: 'operator', className: 'bg-blue-600 hover:bg-blue-700' },
    { value: '7', type: 'number' },
    { value: '8', type: 'number' },
    { value: '9', type: 'number' },
    { value: 'π', type: 'function', func: 'Math.PI' },
    { value: '*', label: '×', type: 'operator', className: 'bg-blue-600 hover:bg-blue-700' },
    { value: '4', type: 'number' },
    { value: '5', type: 'number' },
    { value: '6', type: 'number' },
    { value: 'e', type: 'function', func: 'Math.E' },
    { value: '-', type: 'operator', className: 'bg-blue-600 hover:bg-blue-700' },
    { value: '1', type: 'number' },
    { value: '2', type: 'number' },
    { value: '3', type: 'number' },
    { value: '!', type: 'operator' },
    { value: '+', type: 'operator', className: 'bg-blue-600 hover:bg-blue-700' },
    { value: '(', type: 'operator' },
    { value: '0', type: 'number' },
    { value: ')', type: 'operator' },
    { value: '.', type: 'number' },
    { value: '=', type: 'equals', className: 'bg-green-600 hover:bg-green-700' },
  ];

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg max-w-md mx-auto">
      <div className="bg-gray-900 rounded-lg p-4 mb-4 text-right text-4xl font-mono break-all h-20 flex items-center justify-end">
        {display}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {buttons.map(btn => (
          <CalcButton
            key={btn.value}
            value={btn.value}
            label={btn.label}
            className={btn.className}
            onClick={() => {
              if (btn.type === 'number') handleInput(btn.value);
              else if (btn.type === 'operator') handleOperator(btn.value);
              else if (btn.type === 'function') handleFunction(btn.func || btn.value);
              else if (btn.type === 'equals') handleEquals();
              else if (btn.type === 'clear') handleAllClear();
              else if (btn.type === 'clear-entry') handleClear();
            }}
          />
        ))}
      </div>
    </div>
  );
};
