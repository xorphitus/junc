var junc = (function() {
    var MARKER = '@junc';

    var targets = [];

    var xhr = function(url, callback) {
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.onreadystatechange = function(ev) {
            // on load complete
            if (req.readyState === 4) {
                if (req.staus === 200) {
                    callback(req.responseText);
                } else {
                    // TODO
                }
            }
        };
        req.send(null);
    };

    var uncomment = function(src) {
        var result = '';

        var blockCommentStack = [];
        var lineCommentFlag = false;
        var quoteStr = null;
        var markedFlag = false;
        var markedIndexes = [];

        var i = 0, len = src.length;
        while (i < len) {
            var c = src[i];

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
                        i++;
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
                    if (c === '\'' && str[i - 1] !== '\\') {
                        quoteStr = null;
                    }
                    i++;
                    continue;
                } else if (quoteStr === '"') {
                    if (c === '"' && str[i - 1] !== '\\') {
                        quoteStr = null;
                    }
                    i++;
                    continue;
                } else {
                    if (c === '\'') {
                        quoteStr = '\'';
                    } else if (c === '"') {
                        quoteStr = '"';
                    }
                    i++;
                    continue;
                }
            }

            if (blockCommentStack.length === 1) {
                if (MARKER.split('').every(function(ch, j) {return ch === src[i + j];})) {
                    if (src[i + MARKER.length].match(/\s/)) {
                        markedFlag = true;
                    }
                }
            }

            i++;
        }

        // TODO
        var hoge;
        if (typeof Object.create === 'function') {
            hoge = Object.create(null);
        } else {
            hoge = {};
        }
        markedIndexes.forEach(function(index) {
            hoge[index.start] = true;
            hoge[index.start + 1] = true;
            hoge[index.start + 2] = true;
            hoge[index.end] = true;
            hoge[index.end + 1] = true;
        });

        src.split('').forEach(function(c, i) {
            if (!hoge[i]) {
                result += c;
            }
        });

        return result.replace(new RegExp('\\s+' + MARKER + '\\s+'), '');
    };

    return {
        version: function() {
            return '0.1';
        },

        add: function(url) {
            targets.push(url);
        },

        exec: function() {
            var len = targets.length;
            var xhrRecursivery = function(index) {
                var target;
                if (index >= len) {
                    return;
                }
                target = targets[index];
                xhr(url, function(src) {
                    eval(uncomment(src));
                    xhrRecursivery(index + 1);
                });
            };
            xhrRecursivery(0);
        },

        _uncomment: function(src) {
            return uncomment(src);
        }
    };
})();
