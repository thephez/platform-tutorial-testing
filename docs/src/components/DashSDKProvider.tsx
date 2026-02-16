import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface SDKState {
  sdk: any | null;
  loading: boolean;
  error: string | null;
}

const DashSDKContext = createContext<SDKState>({
  sdk: null,
  loading: true,
  error: null,
});

export function useDashSDK() {
  return useContext(DashSDKContext);
}

// Singleton: module-level promise ensures a single SDK import + connect
let sdkPromise: Promise<any> | null = null;

function getSDK(): Promise<any> {
  if (!sdkPromise) {
    sdkPromise = (async () => {
      const mod = await import('@dashevo/evo-sdk');
      const { EvoSDK } = mod;
      const sdk = EvoSDK.testnetTrusted();
      await sdk.connect();
      return sdk;
    })();
  }
  return sdkPromise;
}

export default function DashSDKProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SDKState>({
    sdk: null,
    loading: true,
    error: null,
  });
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    getSDK()
      .then((sdk) => setState({ sdk, loading: false, error: null }))
      .catch((err) =>
        setState({
          sdk: null,
          loading: false,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
  }, []);

  return (
    <DashSDKContext.Provider value={state}>
      {children}
    </DashSDKContext.Provider>
  );
}
