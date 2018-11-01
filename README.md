# tiny-cache-store

Tiny cache store for Node.js and browser (only 884B after gzip)

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
