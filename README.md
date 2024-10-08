**Commission Fee Calculator**

**Overview**

The Commission Fee Calculator calculates commission fees for cash-in and cash-out operations using dynamic API configurations. It handles both natural and legal persons, and supports cash-in and cash-out operations. The supported currency is EUR.

**Note**: All references to third-party services or systems, including the endpoints from which the commission fee configurations are fetched, have been generalized to comply with guidelines. No specific service names are used in the codebase, documentation, or configuration.

**Commission Fees**

- Cash-in operations:
  - Commission fee: 0.03% of the total amount, but no more than 5.00 EUR.
- Cash-out operations:

  - Natural persons:
    - Commission fee: 0.3% of the cash-out amount.
    - 1000 EUR per week is free of charge. Commission applies only to amounts exceeding 1000 EUR.
  - Legal persons:
    - Commission fee: 0.3% of the amount, but not less than 0.50 EUR per operation.

- Rounding: All commission fees are rounded up to the nearest cent.

**Dependencies**

- Node.js
- TypeScript and related tools
- ESLint for code linting
- Prettier for code formatting
- Jest for unit testing

**How to Run the System**

1. Install dependencies:
   Make sure to install the required dependencies by running:

   ```bash
   yarn install
   ```

2. Create the `.env` file:
   Before running the application, create a `.env` file at the root of your project and define the `API_BASE_URL` environment variable that holds the base URL for the commission fee API.

   Example `.env` file:

   ```
   API_BASE_URL=https://example.com/api
   ```

3. Run the commission fee calculator:
   Use the following command to run the system with an input JSON file:

   ```bash
   yarn start <path-to-input-json>
   ```

   Example:

   ```bash
   yarn start ./input.json
   ```

   This will read the input JSON file, calculate the commission fees, and output the results to the console.

**Running with a Mocked File**

To run the system with a mocked input file, follow these steps:

1. Ensure `.env` is set up correctly with the `API_BASE_URL`.

2. Run the mock command:
   ```bash
   yarn start:mock
   ```
   This command uses the `input.json` file in the root directory to simulate a real input file.

**How to Run Tests**

You can run the system's unit tests using the following commands:

- Run all tests:

  ```bash
  yarn test
  ```

- Run tests in watch mode:

  ```bash
  yarn test:watch
  ```

- Run tests with coverage:
  ```bash
  yarn test:coverage
  ```

**Pre-commit Hooks**

To maintain code quality, pre-commit hooks using Husky and `lint-staged` ensure that ESLint, Prettier, and TypeScript checks run before every commit.

**Running Prettier, ESLint, and TypeScript Checks Manually**

- Format code with Prettier:

  ```bash
  yarn format:fix
  ```

- Run ESLint for linting:

  ```bash
  yarn lint
  ```

- Run TypeScript type checks:
  ```bash
  yarn type-check
  ```

**Code Functionality Breakdown**

The system is modular and designed for maintainability and extensibility. Below is a brief explanation of key parts of the code:

**API Configuration**

The system fetches commission fee configurations dynamically from the API. Cash-in configurations are fetched from the `commissionFeesConfigApi.cashInUrl` endpoint. Cash-out configurations are fetched for both natural persons (`cashOutNaturalUrl`) and legal persons (`cashOutJuridicalUrl`).

**Rounding**

Commission fees are rounded up to the nearest cent. For example, 0.023 EUR is rounded to 0.03 EUR.

**Extensibility**

The system is designed to be extensible. You can add new commission rules or modify existing ones without rewriting the core system logic. Functions and modules are well-structured for easy enhancement.

**Testing**

Unit tests cover key areas such as fee calculations, config fetching, and error handling. Jest is used to ensure that all critical parts are tested.

**Input Data Format**

Input data is provided in a JSON file. Each entry represents an operation with the following structure:

```json
{
  "date": "2016-01-05",
  "user_id": 1,
  "user_type": "natural",
  "type": "cash_in",
  "operation": {
    "amount": 200,
    "currency": "EUR"
  }
}
```

- **date**: The date of the operation in `Y-m-d` format.
- **user_id**: The user ID (integer).
- **user_type**: Can be either `natural` (natural person) or `juridical` (legal person).
- **type**: The operation type, either `cash_in` or `cash_out`.
- **operation**: Contains the `amount` (number) and `currency` (`EUR`).

**Output**

The program outputs the calculated commission fees for each operation, one per line, without specifying the currency.
