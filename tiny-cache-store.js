function defaults(target, key, defaultValue) {
	target = target || {};
	var val = target[key];
	return val === undefined ? defaultValue : val;
}

function getIndexBy(arr, getBy) {
	var index = 0;
	var length = arr.length;
	for (; index < length; index++) {
		if (getBy(arr[index])) return index;
	}
	return -1;
}

function drop(arr, el) {
	var index = arr.indexOf(el);
	arr.splice(index, 1);
	return arr;
}

function stick(arr, el) {
	drop(arr, el).unshift(el);
}

function Indexes(max) {
	this._max = max;
	this._uniqId = 0;
	this._map = {};
	this._uses = [];
	this._expires = [];
}

Indexes.fn = Indexes.prototype;

Indexes.fn.set = function (key, maxAge) {
	var data = this._map[key];
	var id;
	if (data && data.id) {
		id = data.id;
		stick(this._uses, id);
	}
	else {
		id = ++this._uniqId;
		this._uses.unshift(id);
		if (this.size() > this._max) {
			// TODO: should delete key from dict?
			this._uses.pop();
		}
	}
	var nextData = { id: id };
	if (maxAge) {
		var expiresAt = Math.round(Date.now() / 1000 + maxAge);
		var index = getIndexBy(this._expires, function (exp) {
			return exp >= expiresAt;
		});
		if (index < 0) this._expires.push(expiresAt);
		else this._expires.splice(index, 0, expiresAt);
		nextData.expiresAt = expiresAt;
	}
	this._map[key] = nextData;
};

Indexes.fn.has = function (key) {
	var data = this._map[key];
	if (!data) return false;
	var id = data.id;
	var expiresAt = data.expiresAt;
	var isExpired = expiresAt && expiresAt * 1000 <= Date.now();
	if (isExpired) {
		this.delete(key);
		return false;
	}
	else {
		if (this._uses.indexOf(id) < 0) {
			this._map[key] = null;
			return false;
		}
		stick(this._uses, id);
		return true;
	}
};

Indexes.fn.delete = function (key) {
	var data = this._map[key];
	this._map[key] = null;
	drop(this._uses, data.id);
	drop(this._expires, data.expiresAt);
};

Indexes.fn.clear = function () {
	this._map = {};
	this._uses = [];
	this._expires = [];
};

Indexes.fn.size = function () {
	var length = this._uses.length;
	if (this._expires.length) {
		var now = Date.now() / 1000;
		var index = getIndexBy(this._expires, function (exp) {
			return exp > now;
		});
		var removed = [];
		if (index < 0) removed = this._expires.splice(0);
		else if (index > 0) removed = this._expires.splice(0, index);
		return length - removed.length;
	}
	return length;
};

function Cache(options) {
	options = options || {};
	var max = defaults(options, 'max', 10);

	this._store = {};
	this._indexes = new Indexes(max);
	this._get = defaults(options, 'onGet', this._onGet.bind(this));
	this._set = defaults(options, 'onSet', this._onSet.bind(this));
	this._del = defaults(options, 'onDel', this._onDel.bind(this));
	this._clear = defaults(options, 'onClear', this._onClear.bind(this));
}

Cache.fn = Cache.prototype;

Cache.fn._onGet = function (key) {
	return this._store[key];
};

Cache.fn._onSet = function (key, item) {
	return (this._store[key] = item);
};

Cache.fn._onDel = function (key) {
	return !(this._store[key] = undefined);
};

Cache.fn._onClear = function () {
	this._store = {};
};

Cache.fn._getIndexes = function () {
	return this._indexes;
};

Cache.fn.has = function (key) {
	var indexes = this._getIndexes();
	if (indexes.has(key)) return true;
	if (this._get(key)) this._del(key);
	return false;
};

Cache.fn.get = function (key) {
	if (!this.has(key)) return undefined;
	return this._get(key);
};

Cache.fn.set = function (key, value, options) {
	var maxAge = defaults(options, 'maxAge');
	var indexes = this._getIndexes();
	indexes.set(key, maxAge);
	this._set(key, value);
	return value;
};

Cache.fn.delete = function (key) {
	if (!this.has(key)) return false;
	var indexes = this._getIndexes();
	indexes.delete(key);
	return this._del(key);
};

Cache.fn.clear = function () {
	var indexes = this._getIndexes();
	indexes.clear();
	return this._clear();
};

Cache.fn.size = function () {
	var indexes = this._getIndexes();
	return indexes.size();
};

export default Cache;
