const bankAccount = {
  _balance: 1000,

  get formattedBalance() {
    return `$${this._balance}`;
  },

  get balance() {
    return this._balance;
  },
  set balance(amount) {
    if (typeof amount !== "number" || isNaN(amount)) {
      throw new Error("Balance must be a valid number");
    }
    this._balance = amount;
  },

  transfer(targetAccount, amount) {
    if (
      !targetAccount ||
      typeof targetAccount.balance !== "number" ||
      typeof amount !== "number"
    ) {
      throw new Error(
        "transfer expects (targetAccount, amount) where amount is a number"
      );
    }
    if (amount <= 0) {
      throw new Error("Transfer amount must be positive");
    }
    if (this.balance < amount) {
      throw new Error("Insufficient funds");
    }

    this.balance -= amount;
    targetAccount.balance += amount;
  },
};

const ikoBank = Object.create(bankAccount);
const santanderBank = Object.create(bankAccount);

// console.log(ikoBank.formattedBalance); // $1000
// console.log(santanderBank.formattedBalance); // $1000

ikoBank.transfer(santanderBank, 400);
console.log(ikoBank.balance); // 600
console.log(santanderBank.balance); // 1400

// ikoBank.balance = "hi" // Error: Balance must be a valid number

// ikoBank.transfer(santanderBank, 9000) //Error: Insufficient funds
