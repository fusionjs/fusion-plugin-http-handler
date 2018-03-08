/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import test from 'tape-cup';
import browserPlugin from '../browser.js';

test('browser exports null', t => {
  t.equal(browserPlugin, null);
  t.end();
});
