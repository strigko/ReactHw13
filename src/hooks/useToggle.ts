import { useState } from "react";

export default function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);

    function toggle() {
        setValue(prev => !prev);
    }

    return [value, toggle, setValue] as const;
}
