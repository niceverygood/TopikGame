import { motion } from 'framer-motion';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'option';
  children: ReactNode;
  isSelected?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  children,
  isSelected,
  isCorrect,
  isIncorrect,
  fullWidth,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClass = variant === 'primary' 
    ? 'btn-primary' 
    : variant === 'secondary' 
    ? 'btn-secondary' 
    : 'btn-option';

  const stateClass = isCorrect 
    ? 'correct' 
    : isIncorrect 
    ? 'incorrect' 
    : isSelected 
    ? 'selected' 
    : '';

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`${baseClass} ${stateClass} ${fullWidth ? 'w-full' : ''} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
