import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { createRsbuild } from '@rsbuild/core';
import { pluginEslint } from '../../src';
import { proxyConsole } from '../helper';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const eslintPath = require.resolve('eslint');

test('should throw error when exist ESLint errors', async () => {
  const { logs, restore } = proxyConsole();

  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      plugins: [
        pluginEslint({
          eslintPluginOptions: {
            cwd: __dirname,
            eslintPath,
          },
        }),
      ],
    },
  });
  await expect(rsbuild.build()).rejects.toThrowError('build failed');

  expect(
    logs.find((log) => log.includes(`'undefinedVar' is not defined`)),
  ).toBeTruthy();

  restore();
});
