# sheettojson-api

Official Node.js SDK for the **SheetToJSON** RapidAPI.
Turn any Google Spreadsheet into a secure, blazing-fast REST API with built-in S3 caching and smart querying. No complex OAuth setup required.

## Installation

```bash
npm install sheettojson-api

```

## Prerequisites

1. Get your API key from [RapidAPI](https://rapidapi.com/BaptistePignol/api/sheettojson-api).
2. Share your target Google Spreadsheet with **Editor** rights to the service account email provided on the RapidAPI documentation page.

## Initialization

Import the SDK and initialize it with your RapidAPI key.

```javascript
import { SheetToJSON } from 'sheettojson-api';

const db = new SheetToJSON('YOUR_RAPIDAPI_KEY');
const SPREADSHEET_ID = '1BxiMVs0XRA5nFMdkvBdBZjgmZ_xyz123'; // Found in your Google Sheet URL
const SHEET_NAME = 'Products'; // The exact name of the tab

```

## Usage Examples

### 1. Register your Spreadsheet

You must link a spreadsheet to your RapidAPI account once before using the CRUD operations.

```javascript
async function registerSheet() {
    try {
        const response = await db.register(SPREADSHEET_ID);
        console.log(response.message);
    } catch (error) {
        console.error(error.message);
    }
}

```

### 2. Read and Filter Data (GET)

Retrieve rows with built-in pagination, sorting, and advanced filtering. This endpoint is served from a high-speed cache.

```javascript
async function fetchData() {
    try {
        const response = await db.get(SPREADSHEET_ID, SHEET_NAME, {
            limit: 10,           // Max 1000, default 100
            page: 1,             
            price: 'gt:50',      // Advanced filter: Price Greater Than 50
            category: 'lk:tech', // Advanced filter: Category Contains (Like) "tech"
            sort: 'price:desc'   // Sort by price descending
        });

        console.log(`Found ${response.meta.returned_rows} rows.`);
        console.log(response.data);
    } catch (error) {
        console.error(error.message);
    }
}

```

### 3. Insert Data (POST)

Add new rows to the bottom of your sheet. You can pass a single object or an array for batch insertion.

```javascript
async function insertData() {
    try {
        const newProducts = [
            { id: 105, name: "Wireless Mouse", price: 25.99, stock: 150 },
            { id: 106, name: "Mechanical Keyboard", price: 89.00, stock: 40 }
        ];

        const response = await db.insert(SPREADSHEET_ID, SHEET_NAME, newProducts);
        console.log(response.message); // "2 row(s) successfully inserted."
    } catch (error) {
        console.error(error.message);
    }
}

```

### 4. Update Data (PATCH)

Update specific fields of an existing row. Provide the column name (`lookupKey`) and the value (`lookupValue`) to find the exact row to update.

```javascript
async function updateData() {
    try {
        // Find the row where 'id' equals 105, and update its price and stock
        const response = await db.update(SPREADSHEET_ID, SHEET_NAME, 'id', 105, {
            price: 19.99,
            stock: 140
        });

        console.log(response.updated_data);
    } catch (error) {
        console.error(error.message);
    }
}

```

### 5. Delete Data (DELETE)

Delete a row from your sheet using the lookup system.

```javascript
async function deleteData() {
    try {
        // Find and delete the row where 'id' equals 105
        const response = await db.delete(SPREADSHEET_ID, SHEET_NAME, 'id', 105);
        console.log(response.message);
    } catch (error) {
        console.error(error.message);
    }
}

```

## TypeScript Support

This package is written with full TypeScript support. You can pass your own interfaces to the generic methods for perfect autocompletion (IntelliSense) in your IDE.

```typescript
import { SheetToJSON } from 'sheettojson-api';

const db = new SheetToJSON('YOUR_RAPIDAPI_KEY');

// Define your sheet structure
interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
}

async function getProducts() {
    // Pass the interface to the get method
    const response = await db.get<Product>(SPREADSHEET_ID, SHEET_NAME);
    
    response.data.forEach(product => {
        // Fully typed!
        console.log(product.name, product.price); 
    });
}

```

## License

MIT

---