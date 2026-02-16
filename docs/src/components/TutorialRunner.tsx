import React, { useState, useCallback, useRef } from 'react';
import { useDashSDK } from './DashSDKProvider';
import CodeEditor from './CodeEditor';
import OutputPanel, { type LogEntry } from './OutputPanel';

interface TutorialRunnerProps {
  code: string;
  timeout?: number;
}

function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(
        value,
        (_key, v) => (typeof v === 'bigint' ? `${v}n` : v),
        2,
      );
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export default function TutorialRunner({ code, timeout = 30000 }: TutorialRunnerProps) {
  const { sdk, loading: sdkLoading, error: sdkError } = useDashSDK();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const runCode = useCallback(
    async (codeToRun: string) => {
      if (!sdk) return;

      // Reset state
      setLogs([]);
      setResult(null);
      setError(null);
      setRunning(true);

      // Abort controller for timeout
      const abort = new AbortController();
      abortRef.current = abort;

      // Console proxy that streams logs to state
      const consoleProxy = {
        log: (...args: unknown[]) => {
          const entry: LogEntry = {
            level: 'log',
            args: args.map(formatValue),
            timestamp: Date.now(),
          };
          setLogs((prev) => [...prev, entry]);
        },
        error: (...args: unknown[]) => {
          const entry: LogEntry = {
            level: 'error',
            args: args.map(formatValue),
            timestamp: Date.now(),
          };
          setLogs((prev) => [...prev, entry]);
        },
        warn: (...args: unknown[]) => {
          const entry: LogEntry = {
            level: 'warn',
            args: args.map(formatValue),
            timestamp: Date.now(),
          };
          setLogs((prev) => [...prev, entry]);
        },
        info: (...args: unknown[]) => {
          const entry: LogEntry = {
            level: 'info',
            args: args.map(formatValue),
            timestamp: Date.now(),
          };
          setLogs((prev) => [...prev, entry]);
        },
      };

      try {
        // Import the SDK module so user code can destructure from it
        const dashModule = await import('@dashevo/evo-sdk');

        // Build the execution function
        // User code gets: `dash` (the full SDK module), `sdk` (connected instance),
        // `console` (proxy that captures output)
        const fn = new Function(
          'dash',
          'sdk',
          'console',
          `return (async () => {\n${codeToRun}\n})();`,
        );

        // Race execution against timeout
        const resultValue = await Promise.race([
          fn(dashModule, sdk, consoleProxy),
          new Promise((_, reject) => {
            const timer = setTimeout(
              () => reject(new Error(`Execution timed out after ${timeout / 1000}s`)),
              timeout,
            );
            abort.signal.addEventListener('abort', () => clearTimeout(timer));
          }),
        ]);

        if (resultValue !== undefined) {
          setResult(formatValue(resultValue));
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setRunning(false);
        abortRef.current = null;
      }
    },
    [sdk, timeout],
  );

  const handleReset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setLogs([]);
    setResult(null);
    setError(null);
    setRunning(false);
  }, []);

  if (sdkError) {
    return (
      <div style={{ color: 'var(--sl-color-red)', padding: '0.75rem', fontSize: '0.875rem' }}>
        SDK failed to load: {sdkError}
      </div>
    );
  }

  return (
    <div className="not-content">
      <CodeEditor
        initialCode={code}
        onRun={runCode}
        onReset={handleReset}
        loading={running}
        sdkReady={!sdkLoading && !!sdk}
      />
      <OutputPanel logs={logs} result={result} error={error} loading={running} />
    </div>
  );
}
