/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/* eslint-env node */

import {createPlugin} from 'fusion-core';
import type {FusionPlugin} from 'fusion-core';
import {HttpHandlerToken} from './tokens.js';
import type {DepsType, ServiceType} from './types.js';

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      handler: HttpHandlerToken,
    },

    middleware: deps => {
      const {handler} = deps;
      return (ctx, next) => {
        if (ctx.body) {
          return next();
        }
        return new Promise((resolve, reject) => {
          const {req, res} = ctx;
          const listener = () => {
            ctx.respond = false;
            return next().then(resolve);
          };
          res.on('end', listener);
          handler(req, res, () => {
            // Express mutates the req object to make this property non-writable.
            // We need to make it writable because other plugins (like koa-helmet) will set it
            Object.defineProperty(req, 'secure', {
              value: req.secure,
              writable: true,
            });
            res.removeListener('end', listener);
            return next()
              .then(resolve)
              .catch(reject);
          });
        });
      };
    },
  });

export default ((plugin: any): FusionPlugin<DepsType, ServiceType>);
