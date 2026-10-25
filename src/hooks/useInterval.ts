import { useEffect, useRef, useState } from "react";

export default function useInterval(
    callback: () => void,
    delay: number
) {
    const savedCallback = useRef(callback);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!isRunning) return;

        const id = setInterval(() => {
            savedCallback.current();
        }, delay);

        return () => clearInterval(id);
    }, [delay, isRunning]);

    function start() {
        setIsRunning(true);
    }

    function stop() {
        setIsRunning(false);
    }

    function toggle() {
        setIsRunning(prev => !prev);
    }

    return { start, stop, toggle, isRunning };
}
