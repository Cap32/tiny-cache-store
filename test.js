import Cache from './tiny-cache-store';
import delay from 'delay';

describe('cache', () => {
	test('get', () => {
		const cache = new Cache();
		expect(cache.get('foo')).toBe(undefined);
	});

	test('get/set', () => {
		const cache = new Cache();
		cache.set('foo', 'bar');
		expect(cache.get('foo')).toBe('bar');
	});

	test('has', () => {
		const cache = new Cache();
		cache.set('foo', 'bar');
		expect(cache.has('foo')).toBe(true);
	});

	test('delete', () => {
		const cache = new Cache();
		cache.set('foo', 'bar');
		expect(cache.delete('foo')).toBe(true);
		expect(cache.has('foo')).toBe(false);
	});

	test('delete returns false', () => {
		const cache = new Cache();
		expect(cache.delete('foo')).toBe(false);
	});

	test('maxAge', async () => {
		const cache = new Cache();
		cache.set('foo', 'bar', { maxAge: 1 });
		await delay(500);
		expect(cache.has('foo')).toBe(true);
	});

	test('maxAge expired', async () => {
		const cache = new Cache();
		cache.set('foo', 'bar', { maxAge: 1 });
		await delay(2000);
		expect(cache.has('foo')).toBe(false);
	});

	test('size', () => {
		const cache = new Cache();
		cache.set('foo', 1);
		cache.set('bar', 1);
		cache.set('baz', 1);
		cache.set('baz', 1);
		expect(cache.size()).toBe(3);
	});

	test('size with maxAges', async () => {
		const cache = new Cache();
		cache.set('foo', 1, { maxAge: 2 });
		cache.set('bar', 1, { maxAge: 3 });
		cache.set('baz', 1, { maxAge: 1 });
		await delay(2500);
		expect(cache.size()).toBe(1);
	});

	test('size with maxAges expired', async () => {
		const cache = new Cache();
		cache.set('foo', 1, { maxAge: 1 });
		cache.set('bar', 1, { maxAge: 1 });
		cache.set('baz', 1, { maxAge: 1 });
		await delay(2000);
		expect(cache.size()).toBe(0);
	});

	test('max option', () => {
		const cache = new Cache({ max: 2 });
		cache.set('foo', 1);
		cache.set('bar', 1);
		cache.set('baz', 1);
		expect(cache.size()).toBe(2);
	});

	test('lru', () => {
		const cache = new Cache({ max: 2 });
		cache.set('foo', 1);
		cache.set('bar', 1);
		cache.set('baz', 1);
		expect(cache.has('foo')).toBe(false);
	});

	test('clear', () => {
		const cache = new Cache();
		cache.set('foo', 1);
		cache.set('bar', 1);
		cache.clear();
		expect(cache.size()).toBe(0);
	});
});
