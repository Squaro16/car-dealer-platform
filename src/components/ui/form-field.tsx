"use client";

// Generic form field wrapper with validation states for inputs and selects.

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FormFieldProps {
  label?: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "textarea" | "select";
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  success?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  description?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  autoComplete?: string;
  loading?: boolean;
  showPasswordToggle?: boolean;
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  required,
  disabled,
  readOnly,
  className,
  description,
  options,
  rows = 3,
  min,
  max,
  step,
  pattern,
  autoComplete,
  loading,
  showPasswordToggle,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
  };

  const handleSelectChange = (newValue: string) => {
    onChange?.(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  const displayError = touched && error;
  const displaySuccess = success && !error;

  const inputProps = {
    id: name,
    name,
    placeholder,
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    disabled: disabled || loading,
    readOnly,
    "aria-invalid": displayError ? true : undefined,
    "aria-describedby": description || displayError ? `${name}-description` : undefined,
    autoComplete,
    min,
    max,
    step,
    pattern,
    className: cn(
      "transition-colors",
      displayError && "border-destructive focus-visible:ring-destructive",
      displaySuccess && "border-green-500 focus-visible:ring-green-500",
      loading && "opacity-50 cursor-not-allowed"
    ),
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "text-sm font-medium",
            required && "after:content-['*'] after:ml-1 after:text-destructive",
            disabled && "text-muted-foreground"
          )}
        >
          {label}
        </Label>
      )}

      <div className="relative">
        {type === "textarea" ? (
          <Textarea
            {...inputProps}
            rows={rows}
          />
        ) : type === "select" ? (
          <Select
            value={value as string}
            onValueChange={handleSelectChange}
            disabled={disabled || loading}
          >
            <SelectTrigger
              className={cn(
                displayError && "border-destructive focus:ring-destructive",
                displaySuccess && "border-green-500 focus:ring-green-500",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="relative">
            <Input
              {...inputProps}
              type={
                type === "password" && showPasswordToggle && showPassword
                  ? "text"
                  : type
              }
            />
            {type === "password" && showPasswordToggle && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                disabled={disabled || loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        )}

        {/* Status Icons */}
        {displayError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
        )}
        {displaySuccess && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
          </div>
        )}
      </div>

      {/* Description */}
      {description && !displayError && (
        <p
          id={`${name}-description`}
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}

      {/* Error Message */}
      {displayError && (
        <p
          id={`${name}-description`}
          className="text-sm text-destructive flex items-center gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      {/* Success Message */}
      {displaySuccess && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Looks good!
        </p>
      )}
    </div>
  );
}
