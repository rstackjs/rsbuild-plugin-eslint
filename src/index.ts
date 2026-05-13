import path from 'node:path';
import type { RsbuildPlugin } from '@rsbuild/core';
import type ESLintPlugin from 'eslint-rspack-plugin';

type ESLintPluginOptions = ConstructorParameters<typeof ESLintPlugin>[0];

export type PluginEslintOptions = {
  /**
   * Whether to enable ESLint checking.
   * @default true
   */
  enable?: boolean;
  /**
   * To modify the options of `eslint-rspack-plugin`.
   * @see https://github.com/rstackjs/eslint-rspack-plugin
   */
  eslintPluginOptions?: ESLintPluginOptions;
  /**
   * Control which environments to run ESLint on.
   * - `false` or `undefined`: Only run on the first environment (default)
   * - `true` or `'all'`: Run on all environments
   * - `string[]`: Run on specific environments by name (e.g., ['web', 'node'])
   * @default false
   */
  environments?: 'all' | boolean | string[];
};

export const PLUGIN_ESLINT_NAME = 'rsbuild:eslint';

export const pluginEslint = (
  options: PluginEslintOptions = {},
): RsbuildPlugin => ({
  name: PLUGIN_ESLINT_NAME,

  setup(api) {
    const {
      enable = true,
      eslintPluginOptions,
      environments = false,
    } = options;

    if (!enable) {
      return;
    }

    api.modifyBundlerChain(async (chain, { environment }) => {
      const { distPath } = environment;

      const shouldRun = () => {
        if (Array.isArray(environments)) {
          return environments.includes(environment.name);
        }

        if (environments === true || environments === 'all') return true;
        // If there is multiple environment, only apply eslint plugin to the first target
        // to avoid multiple eslint running at the same time
        return environment.index === 0;
      };

      if (!shouldRun()) {
        return;
      }

      const { default: ESLintPlugin } = await import('eslint-rspack-plugin');

      const defaultOptions = {
        extensions: ['js', 'jsx', 'mjs', 'cjs', 'ts', 'tsx', 'mts', 'cts'],
        exclude: [
          'node_modules',
          path.relative(api.context.rootPath, distPath),
        ],
      };

      chain.plugin('eslint').use(ESLintPlugin, [
        {
          ...defaultOptions,
          ...eslintPluginOptions,
        },
      ]);
    });
  },
});
