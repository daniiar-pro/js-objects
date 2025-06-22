const product = {
  name: "Laptop",
};

Object.defineProperties(product, {
  price: {
    value: 1000,
    writable: false,
    enumerable: false,
    configurable: false,
  },
  quantity: {
    value: 5,
    writable: false,
    enumerable: false,
    configurable: false,
  },
});

function getTotalPrice(product) {
  const priceDescriptor = Object.getOwnPropertyDescriptor(product, "price");
  const quantityDescriptor = Object.getOwnPropertyDescriptor(
    product,
    "quantity"
  );

  if (!priceDescriptor || !quantityDescriptor) {
    throw new Error(
      `Both price and quantity must be provided on the product properties!`
    );
  }

  return priceDescriptor.value * quantityDescriptor.value;
}

function deleteNonConfigurable(obj, prop) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);

  if (!descriptor) return true;

  if (!descriptor.configurable) {
    throw new Error(`Cannot delete ${prop}: property is non-configurable`);
  }
  return delete obj[prop];
}

console.log(getTotalPrice(product)); // 5000
console.log(Object.keys(product)); // ['name'] only, price and quantity are non-enumerable

// deleteNonConfigurable(product, 'price'); // Cannot delete price: property is non-configurable

// console.log(deleteNonConfigurable(product, "name")); // true, name is configurable by default
// console.log(product.name); // undefined, it has already been deleted
