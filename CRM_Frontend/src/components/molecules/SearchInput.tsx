import { type InputHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className = "", onClear, value, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative ${className}`}
      >
        <motion.div
          animate={{
            scale: value ? 1.1 : 1,
            color: value ? "#4f46e5" : "#9ca3af",
          }}
          transition={{ type: "spring", damping: 20 }}
          style={{ transformOrigin: "center center" }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none"
        >
          <Search className="w-4 h-4" />
        </motion.div>
        <input
          ref={ref}
          className={`
            w-full pl-10 pr-10 py-2 text-sm text-slate-900 bg-white
            border border-slate-300 rounded-lg
            placeholder:text-slate-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            hover:border-slate-400
          `}
          value={value}
          {...props}
        />
        {value && onClear && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        )}
      </motion.div>
    );
  },
);

SearchInput.displayName = "SearchInput";
