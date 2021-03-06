/*global XMLHttpRequest */
var junc = (function () {
    'use strict';

    var MARKER = '@junc',
        targets = [],
        // functions
        xhr,
        uncomment;

    xhr = function (url, callback) {
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.onreadystatechange = function (ev) {
            // on load complete
            if (req.readyState === 4) {
                if (req.staus === 200) {
                    callback(req.responseText);
                } else if (url.match(/^file:\/\//) && req.status === 0) {
                    // for local test
                    callback(req.responseText);
                } else {
                    // TODO
                }
            }
        };
        req.send(null);
    };

    uncomment = function (src) {
        var result = '',
            blockCommentStack = [],
            lineCommentFlag = false,
            quoteStr = null,
            markedFlag = false,
            markedIndexes = [],
            // vars within loop
            i = 0,
            len = src.length,
            c,
            //
            targetIndexes;

        while (i < len) {
            c = src[i];

            if (!quoteStr && !lineCommentFlag) {
                if (c === '*' && src[i + 1]  === '/' && blockCommentStack.length > 0) {
                    if (markedFlag && blockCommentStack.length === 1) {
                        markedFlag = false;
                        markedIndexes[markedIndexes.length - 1].end = i;
                    } else {
                        markedIndexes.pop();
                    }
                    blockCommentStack.pop();
                    i = i + 2;
                    continue;
                }
                if (c === '/' && src[i + 1]  === '*') {
                    if (blockCommentStack.length === 0) {
                        markedIndexes.push({start: i});
                    }
                    blockCommentStack.push(i);
                    i = i + 2;
                    continue;
                }
            }

            if (!quoteStr && blockCommentStack.length === 0) {
                if (lineCommentFlag) {
                    if (c === '\n') {
                        lineCommentFlag = false;
                        i = i + 1;
                        continue;
                    }
                } else {
                    if (c === '/' && src[i + 1]  === '/') {
                        lineCommentFlag = true;
                        i = i + 2;
                        continue;
                    }
                }
            }

            if (!lineCommentFlag && blockCommentStack.length === 0) {
                if (quoteStr === '\'') {
                    if (c === '\'' && src[i - 1] !== '\\') {
                        quoteStr = null;
                    }
                    i = i + 1;
                    continue;
                } else if (quoteStr === '"') {
                    if (c === '"' && src[i - 1] !== '\\') {
                        quoteStr = null;
                    }
                    i = i + 1;
                    continue;
                } else {
                    if (c === '\'') {
                        quoteStr = '\'';
                    } else if (c === '"') {
                        quoteStr = '"';
                    }
                    i = i + 1;
                    continue;
                }
            }

            if (blockCommentStack.length === 1) {
                if (MARKER.split('').every(function (ch, j) { return ch === src[i + j]; })) {
                    if (src[i + MARKER.length].match(/\s/)) {
                        markedFlag = true;
                    }
                }
            }

            i = i + 1;
        }

        if (typeof Object.create === 'function') {
            targetIndexes = Object.create(null);
        } else {
            targetIndexes = {};
        }
        markedIndexes.forEach(function (index) {
            targetIndexes[index.start] = true;
            targetIndexes[index.start + 1] = true;
            targetIndexes[index.start + 2] = true;
            targetIndexes[index.end] = true;
            targetIndexes[index.end + 1] = true;
        });

        src.split('').forEach(function (c, i) {
            if (!targetIndexes[i]) {
                result += c;
            }
        });

        return result.replace(new RegExp('\\s*' + MARKER + '\\s*'), '');
    };

    return {
        version: function () {
            return '0.1';
        },

        add: function (url) {
            targets.push(url);
        },

        exec: function () {
            var len = targets.length,
                xhrRecursivery;
            xhrRecursivery = function (index) {
                var target;
                if (index >= len) {
                    return;
                }
                target = targets[index];
                xhr(target, function (src) {
                    eval(uncomment(src));
                    xhrRecursivery(index + 1);
                });
            };
            xhrRecursivery(0);
        },

        __uncomment: function (src) {
            return uncomment(src);
        }
    };
}());