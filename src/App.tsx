
import { useCallback, useState } from "react";
import useWindowSize from "./hooks/UseWindowSize";
import useFetch from "./hooks/useFetch";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";
import useClickOutside from "./hooks/useClickOutside";
import useOnlineStatus from "./hooks/useOnlineStatus";
import useInterval from "./hooks/useInterval";
import useForm from "./hooks/useForm";

interface User {
    id: number;
    firstName: string;
    email: string;
}

export default function App() {
    const { width, height } = useWindowSize();
    const { data, loading, error } =
        useFetch<User>("https://dummyjson.com/users/1");

    const [isOpen, toggleOpen] = useToggle(false);
    const [count, setCount] = useState(0);
    const previousCount = usePrevious(count);
    const isOnline = useOnlineStatus();

    const closeMenu = useCallback(() => {
        toggleOpen();
    }, [toggleOpen]);

    const menuRef = useClickOutside<HTMLDivElement>(() => {
        if (isOpen) closeMenu();
    });

    const interval = useInterval(() => {
        setCount(prev => prev + 1);
    }, 1000);

    const form = useForm(
        { username: "", email: "" },
        values => {
            const errors: { username?: string; email?: string } = {};

            if (values.username.trim().length < 3) {
                errors.username = "Мінімум 3 символи";
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = "Некоректний email";
            }

            return errors;
        },
        values => alert(JSON.stringify(values))
    );

    return (
        <main>
            <h1>Custom Hooks</h1>

            <section>
                <h2>useWindowSize</h2>
                <p>Width: {width}px</p>
                <p>Height: {height}px</p>
            </section>

            <section>
                <h2>useFetch</h2>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {data && (
                    <p>{data.firstName} — {data.email}</p>
                )}
            </section>

            <section>
                <h2>useToggle</h2>
                <button onClick={toggleOpen}>
                    {isOpen ? "Close" : "Open"}
                </button>

                {isOpen && (
                    <div ref={menuRef}>
                        <p>Click out of this block to close it</p>
                    </div>
                )}
            </section>

            <section>
                <h2>usePrevious</h2>
                <p>Current value: {count}</p>
                <p>Prev value: {previousCount ?? "Don`t exist"}</p>
                <button onClick={() => setCount(prev => prev + 1)}>
                    Increase
                </button>
            </section>

            <section>
                <h2>useOnlineStatus</h2>
                <p>{isOnline ? "Online" : "No internet connection"}</p>
            </section>

            <section>
                <h2>useInterval</h2>
                <p>Counter: {count}</p>
                <button onClick={interval.stop}>Pause</button>
                <button onClick={interval.start}>Continue</button>
                <button onClick={interval.toggle}>Toggle</button>
            </section>

            <section>
                <h2>useForm</h2>

                <form onSubmit={form.handleSubmit}>
                    <input
                        placeholder="Username"
                        value={form.values.username}
                        onChange={e =>
                            form.handleChange("username", e.target.value)
                        }
                    />
                    {form.errors.username && (
                        <p>{form.errors.username}</p>
                    )}

                    <input
                        placeholder="Email"
                        value={form.values.email}
                        onChange={e =>
                            form.handleChange("email", e.target.value)
                        }
                    />
                    {form.errors.email && (
                        <p>{form.errors.email}</p>
                    )}

                    <button type="submit">Send</button>
                    <button type="button" onClick={form.reset}>
                        Cancel
                    </button>
                </form>
            </section>
        </main>
    );
}
