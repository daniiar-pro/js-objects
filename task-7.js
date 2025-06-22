/**
 * validateObject
 * @param {Object} obj    - The object to validate.
 * @param {Object} schema - Validation schema. Keys are property names; values are rule objects:
 *   {
 *     type:        'string' | 'number' | 'boolean' | 'object' | 'array',
 *     required?:   boolean,          // defaults to false
 *     min?:        number,           // for numbers
 *     max?:        number,           // for numbers
 *     pattern?:    RegExp,           // for strings
 *     validate?:   (value) => bool   // custom validator
 *   }
 * @returns {boolean} true if obj satisfies schema; false otherwise.
 */
function validateObject(obj, schema) {
  if (typeof obj !== "object" || obj === null) return false;
  if (typeof schema !== "object" || schema === null) {
    throw new Error("Schema must be an object");
  }

  for (const [key, rules] of Object.entries(schema)) {
    const value = obj[key];
    const hasValue = obj.hasOwnProperty(key);

    if (rules.required && !hasValue) return false;
    if (!rules.required && !hasValue) continue;

    const actualType = Array.isArray(value) ? "array" : typeof value;
    if (rules.type && actualType !== rules.type) {
      return false;
    }

    if (rules.type === "number") {
      if (typeof rules.min === "number" && value < rules.min) return false;
      if (typeof rules.max === "number" && value > rules.max) return false;
    }

    if (rules.type === "string" && rules.pattern instanceof RegExp) {
      if (!rules.pattern.test(value)) return false;
    }

    if (typeof rules.validate === "function") {
      if (!rules.validate(value)) return false;
    }
  }

  return true;
}

// person Schema
const personSchema = {
  firstName: { type: "string", required: true },
  lastName: { type: "string", required: true },
  age: { type: "number", required: true, min: 0, max: 120 },
  email: {
    type: "string",
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  tags: {
    type: "array",
    required: false,
    validate: (arr) => arr.every((tag) => typeof tag === "string"),
  },
};

//  A valid object:
const john = {
  firstName: "John",
  lastName: "Doe",
  age: 30,
  email: "john.doe@example.com",
  tags: ["friend", "colleague"],
};
console.log(validateObject(john, personSchema));
// → true

// Missing required property:
const noLastName = { firstName: "J", age: 25, email: "j@x.com" };
console.log(validateObject(noLastName, personSchema));
// → false (lastName is required)

//  Wrong type:
const wrongAge = { firstName: "A", lastName: "B", age: "30", email: "a@b.com" };
console.log(validateObject(wrongAge, personSchema));
// → false (age must be number)

// Number out of range:
const tooOld = {
  firstName: "Elder",
  lastName: "One",
  age: 130,
  email: "e@o.com",
};
console.log(validateObject(tooOld, personSchema));
// → false (age > max)

// Invalid email:
const badEmail = {
  firstName: "Foo",
  lastName: "Bar",
  age: 40,
  email: "not-an-email",
};
console.log(validateObject(badEmail, personSchema));
// → false (pattern test fails)

//  Array custom validator fails:
const badTags = {
  firstName: "X",
  lastName: "Y",
  age: 20,
  email: "x@y.com",
  tags: [1, 2],
};
console.log(validateObject(badTags, personSchema));
// → false (each tag must be string)
