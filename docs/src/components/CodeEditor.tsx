import React, { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorState } from '@codemirror/state';
import styles from './CodeEditor.module.css';

interface CodeEditorProps {
  initialCode: string;
  onRun: (code: string) => void;
  onReset: () => void;
  loading: boolean;
  sdkReady: boolean;
}

/**
 * Starlight applies global styles (line-height, box-sizing, margins on
 * `pre`, `code`, etc.) that break CodeMirror's internal measurements,
 * causing cursor misalignment and weird spacing.
 *
 * We fix this with an EditorView.theme that resets the critical
 * properties on CodeMirror's own selectors, ensuring its cursor/text
 * measurements stay correct regardless of the host page's CSS.
 */
const starlightResetTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
  },
  '.cm-content': {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Menlo', 'Consolas', monospace",
    lineHeight: '1.5',
    padding: '8px 0',
  },
  '.cm-line': {
    padding: '0 12px 0 4px',
    lineHeight: '1.5',
  },
  '.cm-gutters': {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Menlo', 'Consolas', monospace",
    fontSize: '14px',
    lineHeight: '1.5',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
  '&.cm-focused': {
    outline: 'none',
  },
});

export default function CodeEditor({
  initialCode,
  onRun,
  onReset,
  loading,
  sdkReady,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [modified, setModified] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        basicSetup,
        javascript(),
        oneDark,
        starlightResetTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setModified(update.state.doc.toString() !== initialCode);
          }
        }),
        EditorState.tabSize.of(2),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;
    return () => view.destroy();
  }, [initialCode]);

  const handleRun = () => {
    if (viewRef.current) {
      onRun(viewRef.current.state.doc.toString());
    }
  };

  const handleReset = () => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: initialCode,
        },
      });
      setModified(false);
      onReset();
    }
  };

  return (
    <div className={styles.container}>
      <div ref={editorRef} />
      <div className={styles.toolbar}>
        <button
          className={`${styles.button} ${styles.runButton}`}
          onClick={handleRun}
          disabled={loading || !sdkReady}
        >
          {loading ? 'Running...' : !sdkReady ? 'Loading SDK...' : 'Run'}
        </button>
        {modified && (
          <button
            className={`${styles.button} ${styles.resetButton}`}
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
