import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { createRsbuild } from '@rsbuild/core';
import { pluginEslint } from '../../src';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const eslintPath = require.resolve('eslint');

test('should throw error when exist ESLint errors', async () => {
  let lintMessage = '';

  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      plugins: [
        pluginEslint({
          eslintPluginOptions: {
            configType: 'eslintrc',
            cwd: __dirname,
            eslintPath,
            formatter: (results) => {
              lintMessage = results
                .flatMap((result) =>
                  result.messages.map((message) => message.message),
                )
                .join('\n');
              return lintMessage;
            },
          },
        }),
      ],
    },
  });
  await expect(rsbuild.build()).rejects.toThrowError();

  expect(lintMessage).toContain(`'undefinedVar' is not defined`);
});

test('should not throw error when the file is excluded', async () => {
  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      plugins: [
        pluginEslint({
          eslintPluginOptions: {
            configType: 'eslintrc',
            cwd: __dirname,
            eslintPath,
            exclude: ['node_modules', './src/index.js'],
          },
        }),
      ],
    },
  });
  await expect(rsbuild.build()).resolves.toBeTruthy();
});

test('should not throw error when the ESLint plugin is not enabled', async () => {
  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      plugins: [
        pluginEslint({
          enable: false,
          eslintPluginOptions: {
            configType: 'eslintrc',
            cwd: __dirname,
            eslintPath,
          },
        }),
      ],
    },
  });

  await expect(rsbuild.build()).resolves.toBeTruthy();
});
