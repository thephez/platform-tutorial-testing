import React from 'react';
import DashSDKProvider from './DashSDKProvider';
import TutorialRunner from './TutorialRunner';

interface TutorialProps {
  code: string;
  timeout?: number;
}

/**
 * Top-level component for use in MDX pages.
 * Wraps TutorialRunner with the SDK provider.
 *
 * Usage in MDX:
 *   <Tutorial code={myCode} client:visible />
 */
export default function Tutorial({ code, timeout }: TutorialProps) {
  return (
    <DashSDKProvider>
      <TutorialRunner code={code} timeout={timeout} />
    </DashSDKProvider>
  );
}
