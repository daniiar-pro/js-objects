export const user = (() => {
  const state = {
    firstName: "Daniiar",
    lastName: "Abdraiymov",
    age: 30,
    email: "daniiar@gmail.com",
    address: {},
  };

  const exposedState = {};

  Object.defineProperties(exposedState, {
    firstName: {
      get() {
        return state.firstName;
      },
      enumerable: true,
      configurable: false,
    },
    lastName: {
      get() {
        return state.lastName;
      },
      enumerable: true,
      configurable: false,
    },
    age: {
      get() {
        return state.age;
      },
      enumerable: true,
      configurable: false,
    },
    email: {
      get() {
        return state.email;
      },
      enumerable: true,
      configurable: false,
    },

    address: {
      value: state.address,
      writable: false,
      enumerable: false,
      configurable: false,
    },

    updateInfo: {
      value(newInfo = {}) {
        for (const [key, value] of Object.entries(newInfo)) {
          if (key in state && key !== "address") {
            state[key] = value;
          }
        }
      },
      writable: false,
      enumerable: false,
      configurable: false,
    },
  });
  return exposedState;
})();

// console.log(user.firstName); // Daniiar
// user.firstName = "Ilya"
// console.log(user.firstName); // Still Daniiar

// user.updateInfo({firstName: "Andrej", age: 40});
// console.log(user.firstName); // Andrej
// console.log(user.age); // 40

// console.log(user.address); // {}
// delete user.address; // Fails to delete
// console.log(user.address); // {} again