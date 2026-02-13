import React from 'react';
import styles from './AuthCard.module.css';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, title }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        {children}
      </div>
    </div>
  );
};
