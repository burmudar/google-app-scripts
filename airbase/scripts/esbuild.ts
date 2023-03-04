import { existsSync } from 'fs';
import path from 'path';

import * as esbuild from 'esbuild';
import { rm } from 'shelljs';

import { GasPlugin } from 'esbuild-gas-plugin';

const DIST_PATH = path.resolve(__dirname, '..', 'dist');

async function build(): Promise<void> {
  if (existsSync(DIST_PATH)) {
    rm('-rf', DIST_PATH);
  }

  await esbuild.build({
    entryPoints: [path.resolve(__dirname, '..', 'src', 'global.ts')],
    globalName: "airbase",
    target: 'ES2018',
    bundle: true,
    plugins: [GasPlugin],
    outfile: "dist/index.js",
  });
}

if (require.main == module) {
  build().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}
