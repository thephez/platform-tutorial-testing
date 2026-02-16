import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home() {
  return (
    <Layout title="Interactive Docs PoC" description="Docusaurus and StackBlitz PoC">
      <main style={{ padding: '2rem' }}>
        <h1>Docusaurus + StackBlitz PoC</h1>
        <p>
          This proof of concept shows how Evo-SDK tutorials can be presented as docs with
          click-to-run examples.
        </p>
        <p>
          <Link to="/docs/evo-sdk-read-only-example">Open the runnable tutorial example</Link>
        </p>
      </main>
    </Layout>
  );
}
