import { useState } from 'react';

// Reusable controlled form: draft values, blur validation, submit validation and focus.
export function useForm(initialValues, validate, onValid) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }
  function handleBlur(event) {
    const { name } = event.target;
    setErrors((current) => ({ ...current, [name]: validate(values)[name] }));
  }
  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) event.currentTarget.elements.namedItem(first)?.focus();
    else onValid(values);
  }
  return { values, errors, handleChange, handleBlur, handleSubmit };
}
