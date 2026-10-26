/**
 * useFormValidation.js
 *
 * Generic form-handling & validation hook.
 *
 * Usage:
 *  const { values, errors, touched, handleChange, handleBlur,
 *          setFieldValue, setFieldError, validate, resetForm } =
 *    useFormValidation(initialValues, validationRules);
 *
 * validationRules: { [fieldName]: (value, allValues) => errorString | "" }
 */

import { useCallback, useState } from 'react';

/**
 * @template T
 * @param {T} initialValues
 * @param {{ [K in keyof T]?: (value: T[K], all: T) => string }} rules
 */
export function useFormValidation(initialValues, rules = {}) {
  const [values,  setValues]  = useState(initialValues);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});

  /* ── Run a single field's rule ─────────────────────────── */
  const runRule = useCallback((name, value, allValues) => {
    const rule = rules[name];
    if (!rule) return '';
    return rule(value, allValues) || '';
  }, [rules]);

  /* ── onChange handler ──────────────────────────────────── */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const next = type === 'checkbox' ? checked : value;

    setValues((prev) => {
      const updated = { ...prev, [name]: next };
      // live-validate only after the field has been touched
      setErrors((errs) => ({
        ...errs,
        [name]: runRule(name, next, updated),
      }));
      return updated;
    });
  }, [runRule]);

  /* ── onBlur handler – marks field as touched & validates ─ */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((errs) => ({
      ...errs,
      [name]: runRule(name, values[name], values),
    }));
  }, [runRule, values]);

  /* ── Programmatically set a single field value ────────── */
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => {
      const updated = { ...prev, [name]: value };
      setErrors((errs) => ({
        ...errs,
        [name]: touched[name] ? runRule(name, value, updated) : errs[name] || '',
      }));
      return updated;
    });
  }, [runRule, touched]);

  /* ── Programmatically set an error ───────────────────── */
  const setFieldError = useCallback((name, msg) => {
    setErrors((prev) => ({ ...prev, [name]: msg }));
  }, []);

  /* ── Full-form validation (returns true if valid) ──────── */
  const validate = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    const allTouched = {};

    Object.keys(rules).forEach((name) => {
      const msg = runRule(name, values[name], values);
      newErrors[name] = msg;
      allTouched[name] = true;
      if (msg) isValid = false;
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    setTouched((prev) => ({ ...prev, ...allTouched }));
    return isValid;
  }, [rules, runRule, values]);

  /* ── Reset form to initial state ─────────────────────── */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    validate,
    resetForm,
    /** Convenience: is there at least one visible error? */
    hasErrors: Object.values(errors).some(Boolean),
  };
}
