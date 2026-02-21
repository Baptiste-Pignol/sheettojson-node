/**
 * SheetToJSON Official Node.js SDK
 */
export class SheetToJSON {
    /**
     * @param {string} apiKey - Your RapidAPI Key
     */
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("A RapidAPI key is required to initialize SheetToJSON.");
        }
        this.apiKey = apiKey;
        this.host = "sheettojson-api.p.rapidapi.com";
        this.baseURL = `https://${this.host}/v1`;
    }

    // --- HELPER INTERNE ---
    async _request(endpoint, method = 'GET', body = null, params = {}) {
        const url = new URL(`${this.baseURL}${endpoint}`);
        
        // Ajout propre des query parameters (filtres, pagination, etc.)
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });

        const headers = {
            'x-rapidapi-host': this.host,
            'x-rapidapi-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(url.toString(), options);
        const data = await response.json();

        // Gestion propre des erreurs pour le développeur
        if (!response.ok) {
            const errorMsg = data.message || `HTTP Error ${response.status}`;
            throw new Error(`SheetToJSON API Error: ${errorMsg} (Code: ${data.code || response.status})`);
        }

        return data;
    }

    // --- MÉTHODES PUBLIQUES ---

    /**
     * 1. Register a spreadsheet to your RapidAPI account
     */
    async register(spreadsheetId) {
        if (!spreadsheetId) throw new Error("spreadsheetId is required.");
        return this._request('/register', 'POST', { spreadsheetId });
    }

    /**
     * 2. Read data with advanced filtering and pagination
     */
    async get(spreadsheetId, sheetName, filters = {}) {
        if (!spreadsheetId || !sheetName) throw new Error("spreadsheetId and sheetName are required.");
        return this._request(`/${spreadsheetId}/${sheetName}`, 'GET', null, filters);
    }

    /**
     * 3. Insert new rows (Single object or Array of objects)
     */
    async insert(spreadsheetId, sheetName, data) {
        if (!spreadsheetId || !sheetName) throw new Error("spreadsheetId and sheetName are required.");
        if (!data) throw new Error("Data to insert is required.");
        return this._request(`/${spreadsheetId}/${sheetName}`, 'POST', data);
    }

    /**
     * 4. Update an existing row
     */
    async update(spreadsheetId, sheetName, lookupKey, lookupValue, updates) {
        if (!spreadsheetId || !sheetName || !lookupKey || lookupValue === undefined) {
            throw new Error("spreadsheetId, sheetName, lookupKey, and lookupValue are required.");
        }
        return this._request(`/${spreadsheetId}/${sheetName}`, 'PATCH', updates, { 
            lookup_key: lookupKey, 
            lookup_value: lookupValue 
        });
    }

    /**
     * 5. Delete a row
     */
    async delete(spreadsheetId, sheetName, lookupKey, lookupValue) {
        if (!spreadsheetId || !sheetName || !lookupKey || lookupValue === undefined) {
            throw new Error("spreadsheetId, sheetName, lookupKey, and lookupValue are required.");
        }
        return this._request(`/${spreadsheetId}/${sheetName}`, 'DELETE', null, { 
            lookup_key: lookupKey, 
            lookup_value: lookupValue 
        });
    }
}