'use client';

import { forwardRef, useState, ChangeEvent } from 'react';
import { FormInput, FormInputProps } from './FormInput';
import { formatPhone } from '@/lib/validation/sanitizer';

export interface PhoneInputProps extends Omit<FormInputProps, 'onChange'> {
  onChange?: (value: string) => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const formatted = formatPhone(rawValue);

      setDisplayValue(formatted);

      if (onChange) {
        onChange(formatted);
      }
    };

    return (
      <FormInput
        ref={ref}
        type="tel"
        placeholder="(32) 99999-9999"
        maxLength={15}
        value={displayValue}
        onChange={handleChange}
        helperText="Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX"
        {...props}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
