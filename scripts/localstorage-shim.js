#!/usr/bin/env node
/**
 * Provide a Node-safe localStorage implementation before Jest boots.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const localStorageDir = path.join(projectRoot, '.test-temp', 'localstorage');
fs.mkdirSync(localStorageDir, { recursive: true });
const localStorageFile = path.join(localStorageDir, 'localstorage.json');

let store = {};
try {
	const contents = fs.readFileSync(localStorageFile, 'utf8');
	store = contents ? JSON.parse(contents) : {};
} catch {
	store = {};
}

const persist = () => {
	try {
		fs.writeFileSync(localStorageFile, JSON.stringify(store, null, 2));
	} catch {
		// Silently ignore persistence failures
	}
};

const storage = {
	get length() {
		return Object.keys(store).length;
	},
	key(index) {
		return Object.keys(store)[index] ?? null;
	},
	getItem(key) {
		return Object.prototype.hasOwnProperty.call(store, key)
			? store[key]
			: null;
	},
	setItem(key, value) {
		store[String(key)] = String(value);
		persist();
	},
	removeItem(key) {
		delete store[key];
		persist();
	},
	clear() {
		store = {};
		persist();
	},
};

Object.defineProperty(globalThis, 'localStorage', {
	configurable: true,
	enumerable: true,
	get: () => storage,
});

process.env.LOCAL_STORAGE_DIRECTORY = localStorageDir;
process.env.LOCAL_STORAGE_FILE = localStorageFile;
