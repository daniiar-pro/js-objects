/**
 * Recursively clones an object or array and makes all its own properties
 * read-only (writable: false) and non-configurable, preserving enumerability.
 * @param {*} obj  - The value to make immutable.
 * @returns {*} A deep clone of obj with all properties locked down.
 */
function createImmutableObject(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  const clone = Array.isArray(obj) ? [] : {};
  Reflect.ownKeys(obj).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(obj, key);
    const value = desc.value;
    const immValue = createImmutableObject(value);

    Object.defineProperty(clone, key, {
      value: immValue,
      writable: false,
      enumerable: desc.enumerable,
      configurable: false,
    });
  });

  return clone;
}

const person = {
  firstName: "Daniiar",
  lastName: "Abdraiymov",
  age: 30,
  email: "daniiar@example.com",
  address: { street: "123 Main St", city: "Bishkek" },
};

const immutablePerson = createImmutableObject(person);

console.log(immutablePerson.firstName); // "Daniiar"

immutablePerson.firstName = "Ilya";
console.log(immutablePerson.firstName); // still "Daniiar"

console.log(immutablePerson.address.city); // "Bishkek"
immutablePerson.address.city = "Osh";
console.log(immutablePerson.address.city); // still "Bishkek"

immutablePerson.newProp = 42;
console.log(immutablePerson.newProp); // undefined

delete immutablePerson.age;
console.log(immutablePerson.age); // 30
