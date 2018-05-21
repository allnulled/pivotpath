/**
 *
 * # pivotpath
 *
 * ![](https://img.shields.io/badge/pivotpath-v1.0.2-green.svg) ![](https://img.shields.io/badge/tests-passing-green.svg) ![](https://img.shields.io/badge/stable-95%25-green.svg)
 *
 * Node.js module to easily create composed paths. It can:
 *
 *   · Generate new paths (as strings).
 *
 *   · Import modules from new paths (as `require(~)` would normally do).
 *
 *   · Call to pure functional modules from new paths (as `require(~)(~)` would normally do).
 *
 *   · Generate functions that call to pure functional modules from new paths. This is useful for 
 * ExpressJS middlewares or controllers, for example, as they can be imported directly by a string,
 * while this module takes care of generating and passing the proper parameters. See the examples to
 * easily catch the idea.
 *
 * ## 1. Installation
 *
 * `~$ npm install --save pivotpath`
 *
 */