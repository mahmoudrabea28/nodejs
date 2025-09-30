import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const javaBaseUrl = `${process.env.JAVA_API_URL}/api`;
const javaAuthUrl = `${process.env.JAVA_API_URL}/auth`;

/**
 * Login function.
 * @param model 
 * @param credentials 
 * @returns 
 */
export async function login(model: string, credentials: Record<string, any>): Promise<any> {
    try {
        const response: AxiosResponse = await axios.post(`${javaAuthUrl}/${model}`, credentials);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
}

/**
 * Get the certification spectific model.
 * @param model 
 * @param token 
 * @returns 
 */
export async function getCertification(model: string, token: string): Promise<any> {
    try {
        const response: AxiosResponse = await axios.get(`${javaBaseUrl}/${model}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
}

/**
 * Fetch a member by model and ID.
 * @param fmodel 
 * @param smodel 
 * @param id 
 * @param token 
 * @returns 
 */
export async function getMember(fmodel: string, smodel: string, id: string, token: string): Promise<any> {
    try {
        const response: AxiosResponse = await axios.get(`${javaBaseUrl}/${fmodel}/${smodel}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
}

/**
 * Fetch the current user.
 * @param fmodel 
 * @param smodel 
 * @param token 
 * @returns 
 */
export async function getCurrentUser(fmodel: string, smodel: string, token: string): Promise<any> {
    try {
        const response: AxiosResponse = await axios.get(`${javaBaseUrl}/${fmodel}/${smodel}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
}

/**
 * Update account specific records.
 * @param fmodel 
 * @param smodel 
 * @param data 
 * @param token 
 * @returns 
 */
export async function updateAccount(fmodel: string,smodel: string, data: any, token: string): Promise<any> {
    try {
        const response: AxiosResponse = await axios.put(`${javaBaseUrl}/${fmodel}/`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
}

//
// Global CRUD functions.
// These function are the fallback when no other function is speified.
//

/**
 * Create a new record for all models.
 * @param model 
 * @param data 
 * @param token 
 * @returns 
 */
export async function create(model: string, data: any, token: string): Promise<any> {
    console.log('model: ', model);
    try {
        const response: AxiosResponse = await axios.post(`${javaBaseUrl}/${model}/`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.log('error: ', error);
        throw error.response?.data || error.message;
    }
}

/**
 * Read (Fetch) by ID for all models.
 * @param model 
 * @param id 
 * @param token 
 * @returns 
 */
export async function getById(model: string, id: string, token: string): Promise<any> {
    try {
        const response: AxiosResponse = await axios.get(`${javaBaseUrl}/${model}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
}

/**
 * Read (Fetch) all records including all models.
 * @param model 
 * @param token 
 * @returns 
 */
export async function getAll(model: string, token: string): Promise<any> {
    try {
        const response: AxiosResponse = await axios.get(`${javaBaseUrl}/${model}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
}

/**
 * Update a record.
 * @param model 
 * @param id 
 * @param data 
 * @param token 
 * @returns 
 */
export async function update(model: string, id: string, data: any, token: string): Promise<any> {
    try {
        const response: AxiosResponse = await axios.put(`${javaBaseUrl}/${model}/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
}

/**
 * Delete a record for all models.
 * @param model 
 * @param id 
 * @param token 
 * @returns 
 */
export async function remove(model: string, id: string, token: string): Promise<any> {
    try {
        const response: AxiosResponse = await axios.delete(`${javaBaseUrl}/${model}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { message: 'Item deleted successfully', data: response.data };
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
}

// Export all functions as a default object.
export default {
    login, // Login function to authenticate a user and retrieve an access token
    getCurrentUser, // Fetch the current user's data
    getMember, // Fetch a member 
    updateAccount,// Update account-specific records
    getAll,  // Fetch all records of a specified model
    getById,// Fetch a specific record by ID for a given model 
    create,// Create a new record in a specified model
    update, // Update an existing record in a specified model
    remove,  // Delete a record in a specified model
};
