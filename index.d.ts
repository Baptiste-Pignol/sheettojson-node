// --- Interfaces pour les réponses de l'API ---

export interface MetaData {
    total_rows: number;
    returned_rows: number;
    page: number;
    total_pages: number;
    limit: number;
    source?: string;
    cached_at?: string;
}

export interface GetResponse<T = any> {
    meta: MetaData;
    data: T[];
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    spreadsheetId?: string;
}

export interface InsertResponse {
    success: boolean;
    message: string;
    inserted_count: number;
}

export interface UpdateResponse<T = any> {
    success: boolean;
    message: string;
    updated_data: T;
}

export interface DeleteResponse {
    success: boolean;
    message: string;
    deleted_lookup: {
        key: string;
        value: string | number;
    };
}

export interface GetFilters {
    limit?: number;
    page?: number;
    sort?: string;
    // Permet d'ajouter n'importe quel filtre dynamique (ex: price: 'gt:50')
    [key: string]: any; 
}

// --- Déclaration de la Classe Principale ---

export class SheetToJSON {
    /**
     * Initialize the SDK with your RapidAPI Key
     * @param apiKey Your X-RapidAPI-Key
     */
    constructor(apiKey: string);

    /**
     * Register a Google Spreadsheet to your RapidAPI account
     */
    register(spreadsheetId: string): Promise<RegisterResponse>;

    /**
     * Read rows from your sheet with optional filtering and pagination
     * @template T The interface representing your row data structure
     */
    get<T = any>(
        spreadsheetId: string, 
        sheetName: string, 
        filters?: GetFilters
    ): Promise<GetResponse<T>>;

    /**
     * Insert one or multiple rows
     * @template T The interface representing your row data structure
     */
    insert<T = any>(
        spreadsheetId: string, 
        sheetName: string, 
        data: T | T[]
    ): Promise<InsertResponse>;

    /**
     * Update specific fields of an existing row
     * @template T The interface representing your row data structure
     */
    update<T = any>(
        spreadsheetId: string, 
        sheetName: string, 
        lookupKey: string, 
        lookupValue: string | number, 
        updates: Partial<T>
    ): Promise<UpdateResponse<T>>;

    /**
     * Delete a row
     */
    delete(
        spreadsheetId: string, 
        sheetName: string, 
        lookupKey: string, 
        lookupValue: string | number
    ): Promise<DeleteResponse>;
}