import React from 'react';
import styles from './OutputPanel.module.css';

export interface LogEntry {
  level: 'log' | 'error' | 'warn' | 'info';
  args: string[];
  timestamp: number;
}

interface OutputPanelProps {
  logs: LogEntry[];
  result: string | null;
  error: string | null;
  loading: boolean;
}

const LEVEL_PREFIX: Record<string, string> = {
  warn: '\u26a0 ',
  error: '\u2717 ',
  info: '\u2139 ',
};

export default function OutputPanel({ logs, result, error, loading }: OutputPanelProps) {
  if (!loading && logs.length === 0 && !result && !error) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Output</span>
        {loading && <span className={styles.spinner}>Running...</span>}
      </div>
      <div className={styles.content}>
        {logs.map((entry, i) => (
          <div
            key={i}
            className={`${styles.logLine} ${entry.level !== 'log' ? styles[entry.level] : ''}`}
          >
            {entry.level !== 'log' && (
              <span className={styles.prefix}>{LEVEL_PREFIX[entry.level]}</span>
            )}
            {entry.args.join(' ')}
          </div>
        ))}
        {result && (
          <div className={styles.returnValue}>
            <span className={styles.prefix}>{'\u2190'}</span>
            {result}
          </div>
        )}
        {error && (
          <div className={styles.errorBlock}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
