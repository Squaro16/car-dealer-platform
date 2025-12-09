import { useState, useCallback, useEffect } from "react";
import { z } from "zod";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  min?: number;
  max?: number;
}

export interface FormField {
  value: any;
  error: string | null;
  touched: boolean;
  validating: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

export interface UseFormValidationOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  validationRules?: Record<keyof T, ValidationRule>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  validationRules = {} as Record<keyof T, ValidationRule>,
  validateOnChange = true,
  validateOnBlur = true,
  debounceMs = 300,
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string | null>>({} as Record<keyof T, string | null>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [validating, setValidating] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Initialize form state
  useEffect(() => {
    const initialErrors = {} as Record<keyof T, string | null>;
    const initialTouched = {} as Record<keyof T, boolean>;
    const initialValidating = {} as Record<keyof T, boolean>;

    Object.keys(initialValues).forEach((key) => {
      initialErrors[key as keyof T] = null;
      initialTouched[key as keyof T] = false;
      initialValidating[key as keyof T] = false;
    });

    setErrors(initialErrors);
    setTouched(initialTouched);
    setValidating(initialValidating);
  }, []);

  // Debounced validation
  const validateField = useCallback(async (field: keyof T, value: any) => {
    setValidating(prev => ({ ...prev, [field]: true }));

    try {
      let error: string | null = null;

      // Zod schema validation
      if (validationSchema) {
        try {
          const fieldSchema = (validationSchema as any).shape?.[field];
          if (fieldSchema) {
            fieldSchema.parse(value);
          }
        } catch (schemaError: any) {
          error = schemaError.errors?.[0]?.message || "Invalid value";
        }
      }

      // Custom validation rules
      if (!error && validationRules[field]) {
        const rule = validationRules[field];

        if (rule.required && (!value || value.toString().trim() === "")) {
          error = `${String(field).charAt(0).toUpperCase() + String(field).slice(1)} is required`;
        } else if (value) {
          if (rule.minLength && value.length < rule.minLength) {
            error = `Must be at least ${rule.minLength} characters`;
          }
          if (rule.maxLength && value.length > rule.maxLength) {
            error = `Must be no more than ${rule.maxLength} characters`;
          }
          if (rule.pattern && !rule.pattern.test(value)) {
            error = "Invalid format";
          }
          if (rule.min !== undefined && Number(value) < rule.min) {
            error = `Must be at least ${rule.min}`;
          }
          if (rule.max !== undefined && Number(value) > rule.max) {
            error = `Must be no more than ${rule.max}`;
          }
          if (rule.custom) {
            error = rule.custom(value);
          }
        }
      }

      setErrors(prev => ({ ...prev, [field]: error }));
    } catch (err) {
      console.error(`Validation error for ${String(field)}:`, err);
    } finally {
      setValidating(prev => ({ ...prev, [field]: false }));
    }
  }, [validationSchema, validationRules]);

  // Handle field change
  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));

    if (validateOnChange) {
      // Debounce validation
      const timeoutId = setTimeout(() => {
        validateField(field, value);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    }
  }, [validateOnChange, validateField, debounceMs]);

  // Handle field blur
  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (validateOnBlur) {
      validateField(field, values[field]);
    }
  }, [validateOnBlur, validateField, values]);

  // Validate all fields
  const validateAll = useCallback(async () => {
    const validationPromises = Object.keys(values).map(field =>
      validateField(field as keyof T, values[field as keyof T])
    );

    await Promise.all(validationPromises);

    // Mark all fields as touched
    setTouched(prev => {
      const newTouched = { ...prev };
      Object.keys(values).forEach(field => {
        newTouched[field as keyof T] = true;
      });
      return newTouched;
    });
  }, [values, validateField]);

  // Check if form is valid
  const isValid = Object.values(errors).every(error => error === null);

  // Check if form has been touched
  const isDirty = Object.values(touched).some(touched => touched);

  // Handle form submission
  const handleSubmit = useCallback(async (submitFn: (values: T) => Promise<void> | void) => {
    setIsSubmitting(true);
    setSubmitCount(prev => prev + 1);

    try {
      await validateAll();

      if (isValid) {
        await submitFn(values);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAll, isValid, values]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string | null>);
    setTouched({} as Record<keyof T, boolean>);
    setValidating({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
    setSubmitCount(0);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    validating,
    isValid,
    isDirty,
    isSubmitting,
    submitCount,
    handleChange,
    handleBlur,
    validateAll,
    handleSubmit,
    reset,
    setValues,
  };
}
