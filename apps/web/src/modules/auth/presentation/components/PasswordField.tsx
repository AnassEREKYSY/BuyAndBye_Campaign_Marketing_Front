import React, { useState } from 'react';
import styles from './PasswordField.module.css';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  placeholder = 'Password',
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.fieldContainer}>
      <label htmlFor="password" className={styles.label}>
        Password
      </label>
      <div className={styles.inputWrapper}>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? 'password-error' : undefined}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={styles.toggleButton}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          disabled={disabled}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <span id="password-error" className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
