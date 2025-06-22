/**
 * Deeply clones any JavaScript value, handling:
 * - primitives
 * - Date, RegExp
 * - Map, Set
 * - Array
 * - functions (by reference)
 * - objects (preserving prototype & property descriptors, including getters/setters)
 * - circular references
 *
 * @param {*} obj        - The value to clone.
 * @param {WeakMap} [hash] - Internal map tracking already-cloned objects.
 * @returns {*} A deep clone of `obj`.
 */
function deepCloneObject(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (typeof obj === "function") {
    return obj;
  }

  if (hash.has(obj)) {
    return hash.get(obj);
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (obj instanceof RegExp) {
    const re = new RegExp(obj.source, obj.flags);
    re.lastIndex = obj.lastIndex;
    return re;
  }
  if (obj instanceof Map) {
    const result = new Map();
    hash.set(obj, result);
    obj.forEach((v, k) => {
      result.set(deepCloneObject(k, hash), deepCloneObject(v, hash));
    });
    return result;
  }
  if (obj instanceof Set) {
    const result = new Set();
    hash.set(obj, result);
    obj.forEach((v) => {
      result.add(deepCloneObject(v, hash));
    });
    return result;
  }
  if (Array.isArray(obj)) {
    const arr = [];
    hash.set(obj, arr);
    obj.forEach((v, i) => {
      arr[i] = deepCloneObject(v, hash);
    });
    return arr;
  }

  const proto = Object.getPrototypeOf(obj);
  const clone = Object.create(proto);
  hash.set(obj, clone);

  Reflect.ownKeys(obj).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(obj, key);

    if (desc.get || desc.set) {
      Object.defineProperty(clone, key, {
        configurable: desc.configurable,
        enumerable: desc.enumerable,
        get: desc.get,
        set: desc.set,
      });
    } else {
      Object.defineProperty(clone, key, {
        configurable: desc.configurable,
        enumerable: desc.enumerable,
        writable: desc.writable,
        value: deepCloneObject(desc.value, hash),
      });
    }
  });

  return clone;
}

// Simple nested object
const orig = {
  num: 42,
  str: "hello",
  date: new Date("2025-06-22"),
  regex: /abc/g,
  arr: [1, { nested: "x" }],
  map: new Map([["k", { deep: true }]]),
  set: new Set([1, 2, 3]),
};
orig.self = orig; 

const copy = deepCloneObject(orig);
console.log(copy !== orig); // true
console.log(copy.date instanceof Date); // true
console.log(copy.regex instanceof RegExp); // true
console.log(copy.arr[1] !== orig.arr[1]); // true
console.log(copy.map.get("k") !== orig.map.get("k")); // true
console.log(copy.self === copy); // true

// Preserves getters/setters & prototype
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  get magnitude() {
    return Math.hypot(this.x, this.y);
  }
}
const p = new Point(3, 4);
const pClone = deepCloneObject(p);
console.log(pClone instanceof Point); // true
console.log(pClone.magnitude === 5); // true


function fn() {
  return "hi";
}
const o = { fn };
const o2 = deepCloneObject(o);
console.log(o2.fn === fn); // true
