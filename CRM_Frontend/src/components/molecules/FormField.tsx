import { type InputHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { Input } from "../atoms/Input";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, id, className, ...props }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className={`w-full ${className}`}
      >
        <label
          htmlFor={fieldId}
          className="block mb-1.5 text-sm font-medium text-slate-700"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <Input
          ref={ref}
          id={fieldId}
          error={error}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1 text-xs text-red-500 font-medium"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  },
);

FormField.displayName = "FormField";
