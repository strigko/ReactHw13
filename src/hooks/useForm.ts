import { useState } from "react";

type FormErrors<T> = Partial<Record<keyof T, string>>;

export default function useForm<T extends Record<string, string>>(
    initialValues: T,
    validate: (values: T) => FormErrors<T>,
    onSubmit: (values: T) => void
) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors<T>>({});

    function handleChange(name: keyof T, value: string) {
        const updatedValues = { ...values, [name]: value };
        setValues(updatedValues);
        setErrors(validate(updatedValues));
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            onSubmit(values);
        }
    }

    function reset() {
        setValues(initialValues);
        setErrors({});
    }

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        reset
    };
}
