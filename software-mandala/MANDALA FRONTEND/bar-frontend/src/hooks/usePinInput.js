import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Custom hook to manage logic for multi-digit PIN inputs.
 * @param {number} length - Number of digits required.
 * @param {function} onComplete - Callback when all digits are filled.
 */
export const usePinInput = (length = 4, onComplete) => {
    const [values, setValues] = useState(Array(length).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = useCallback((index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newValues = [...values];
        newValues[index] = value.slice(-1); // Only take the last digit
        setValues(newValues);

        // Move to next input if value is entered
        if (value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }

        // Auto submit if complete
        const fullPin = newValues.join("");
        if (fullPin.length === length && onComplete) {
            // Small delay for visual feedback of the last digit
            setTimeout(() => onComplete(fullPin), 300);
        }
    }, [values, length, onComplete]);

    const handleKeyDown = useCallback((index, e) => {
        if (e.key === "Backspace" && !values[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }, [values]);

    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, length);
        if (/^\d+$/.test(pastedData)) {
            const digits = pastedData.split("");
            const newValues = [...values];
            digits.forEach((digit, i) => {
                if (i < length) newValues[i] = digit;
            });
            setValues(newValues);
            
            if (digits.length === length && onComplete) {
                setTimeout(() => onComplete(pastedData), 300);
            } else if (digits.length < length) {
                inputRefs.current[digits.length].focus();
            }
        }
    }, [values, length, onComplete]);

    const isComplete = values.every(digit => digit !== "");

    return {
        values,
        inputRefs,
        handleChange,
        handleKeyDown,
        handlePaste,
        isComplete,
        fullPin: values.join("")
    };
};
