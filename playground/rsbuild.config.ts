import { defineConfig } from '@rsbuild/core';
import { pluginEslint } from '../src';

export default defineConfig({
  plugins: [pluginEslint()],
});
