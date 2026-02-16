import React from 'react';
import {
  Sandpack,
} from '@codesandbox/sandpack-react';

const files = {
  '/index.js': {
    code: `// Lightweight click-to-run example for docs PoC\n// Mirrors a read-only style tutorial flow\n\nconst main = async () => {\n  const status = {\n    network: 'testnet',\n    platform: 'reachable',\n    timestamp: new Date().toISOString(),\n  };\n\n  console.log('Checking network connection...');\n  await new Promise((resolve) => setTimeout(resolve, 300));\n  console.log('Result:', status);\n};\n\nmain();\n`,
  },
};

export default function TutorialRunner() {
  return (
    <Sandpack
      template="node"
      files={files}
      options={{
        showLineNumbers: true,
        showTabs: false,
        showNavigator: false,
        editorHeight: 420,
        wrapContent: true,
      }}
    />
  );
}
