import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'option';
  children: ReactNode;
  isSelected?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
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
  onClick,
  type = 'button',
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
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`${baseClass} ${stateClass} ${fullWidth ? 'w-full' : ''} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
