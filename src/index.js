'use strict';

const _ = require('lodash');
const qs = require('querystring');

/**
 * Builds a URL from tiny pieces.
 *
 * @param {object} opts
 * @param {string} opts.host The base host name
 * @param {string | string[]} [opts.path] The path
 * @param {number} [opts.port] The port to use. No port is specified by default.
 * @param {string | { [name: string]: string; }} [opts.query] The query-string as a string or as an object
 * @param {string} [opts.protocol] The protocol to use. ex. "http" or "https". Default: "https".
 * @param {boolean} [opts.secure] Whether to use https. Default: true.
 */
function buildUrl(opts) {
    const { host, path, port, query, protocol, secure = true } = opts;

    if (!protocol) {
        protocol = secure ? 'https' : 'http';
    }

    let baseUrl = `${protocol}://${host}`;

    if (port) {
        baseUrl = `${baseUrl}:${port}`;
    }

    const url = new URL(baseUrl);

    let _qs = query;
    if (_.isPlainObject(query)) {
        _qs = qs.stringify(query);
    }

    if (_.isString(path)) {
        url.pathname = normalizePathPart(path);
    } else if (_.isArray(path)) {
        url.pathname = path.map(normalizePathPart).join('');
    } else if (path) {
        throw new Error('path needs to be a string or an array');
    }

    if (_qs) {
        url.search = _qs;
    }

    return url.href;
}

function normalizePathPart(p) {
    if (_.isString(p) && p) {
        p = p.replace(/^\/?(.*?)\/?$/, '/$1');
    }

    return p;
}

module.exports = { buildUrl, normalizePathPart };
