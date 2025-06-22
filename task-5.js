import  { user }  from "./task-1.js";

/**
 * Wraps an object in a Proxy that calls `callback(prop, action, [value])`
 * whenever a property is read (“get”) or written (“set”).
 * @param {Object}  obj       - The target object to observe.
 * @param {Function} callback - Called as callback(propName, action, value?)
 *                              where action is "get" or "set".
 * @returns {Proxy}           - A proxy mirroring `obj`.
 */
function observeObject(obj, callback) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      callback(prop, "get");
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      callback(prop, "set", value);
      return Reflect.set(target, prop, value, receiver);
    },
  });
}

const logger = (prop, action, value) => {
  if (action === "get") {
    console.log(`→ [get] ${String(prop)}`);
  } else {
    console.log(`→ [set] ${String(prop)} =`, value);
  }
};



const observedPerson = observeObject(user, logger);

console.log(observedPerson.firstName);
// Console:
//   → [get] firstName
//   Daniiar

observedPerson.updateInfo({ firstName: "Ilya", age: 32 });
// Console:
//   → [get] updateInfo    (accessing the method)
//   → [set] firstName = Ilya
//   → [set] age = 32

console.log(observedPerson.firstName);
// Console:
//   → [get] firstName
//   Daniiar

observedPerson.age = 40;
// Console:
//   → [set] age = 40
console.log(observedPerson.age);
// Console:
//   → [get] age
//   32   (unchanged, because it’s non-writable)

console.log(observedPerson.address);
// Console:
//   → [get] address
//   {}

observedPerson.newProp = "hello";
// Console:
//   → [set] newProp = hello
console.log(observedPerson.newProp);
// Console:
//   → [get] newProp
//   hello
