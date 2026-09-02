import { define } from 'rstack';
import { pluginEslint } from '../src/index.ts';

define.app({
  plugins: [pluginEslint()],
});
