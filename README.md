# tiny-cache-store

[![Build Status](https://travis-ci.org/Cap32/tiny-cache-store.svg?branch=master)](https://travis-ci.org/Cap32/tiny-cache-store)
[![Coverage Status](https://coveralls.io/repos/github/Cap32/tiny-cache-store/badge.svg?branch=master)](https://coveralls.io/github/Cap32/tiny-cache-store?branch=master)
[![License](https://img.shields.io/badge/license-MIT_License-brightgreen.svg?style=flat)](https://github.com/Cap32/tiny-cache-store/blob/master/LICENSE.md)

[WIP] Tiny cache store for Node.js and browser

**NOTE: Usage may change before v1.0 released**

## Features

- Tiny (less than 1kb after gzip)
- High performance
- Support TTL and LRU
- Support promise

## Installation

```bash
npm install tiny-cache-store
```

## Usage

```js
import TinyCache from "tiny-cache-store";

const cache = new TinyCache();
cache.set("foo", "bar");
cache.get("foo"); // => 'bar'
cache.size(); // => 1
cache.has("foo"); // => true
cache.delete("foo"); // => true
cache.set("foo", "bar", { maxAge: 60 }); // ttl 1 minute
cache.clear();
```

#### LRU

```js
import TinyCache from "tiny-cache-store";

const cache = new TinyCache({ max: 10 });
for (let i = 0; i < 100; i++) {
  cache.set(i, i);
}
cache.size(); // => 10
```

## Contributing

Contributions welcome! See the [Contributing Guide](/CONTRIBUTING.md)

## License

MIT
