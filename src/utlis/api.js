import AsyncStorage from '@react-native-async-storage/async-storage';


// const BASE_URL = "http://10.245.239.143:5000/api";
const BASE_URL = "http://172.20.10.6:5000/api";

const apiRequest = async (
    endpoint,
    method = 'GET',
    body = null,
    isFormData = false
) => {

    const url = `${BASE_URL}${endpoint}`;
    const headers = {};

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const token = await AsyncStorage.getItem('token');

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
        ...(body && {
            body: isFormData ? body : JSON.stringify(body)
        })
    };

    try {

        const response = await fetch(url, config);

        const text = await response.text();

        // console.log('URL =>', url);
        // console.log('STATUS =>', response.status);
        // console.log('BODY =>', text);

        const data = JSON.parse(text); // ✅ text ko parse karo

        // LOGIN endpoint pe session expire wala logic mat chalao
        const isLoginApi = endpoint.includes('/auth/login');

        // 401 => sirf protected APIs ke liye
        if (response.status === 401 && !isLoginApi) {

            await AsyncStorage.multiRemove([
                'token',
                'role',
                'name',
            ]);

            throw new Error("Session expired. Please login again.");
        }

        // 403
        if (response.status === 403) {
            throw new Error(data.message || "You don't have permission to perform this action.");
        }

        // baki errors
        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;

    } catch (error) {
        throw error;
    }
};

export const api = {

    get: (path) => apiRequest(path, 'GET'),

    post: (path, body) => apiRequest(path, 'POST', body),

    put: (path, body) => apiRequest(path, 'PUT', body),

    delete: (path) => apiRequest(path, 'DELETE'),

    postFormData: (path, formData) =>
        apiRequest(path, 'POST', formData, true),

    putFormData: (path, formData) =>
        apiRequest(path, 'PUT', formData, true),
};

export const formatToYYYYMMDD = (value) => {
    if (!value) return '';

    // If already Date object
    if (value instanceof Date) {
        return value.toISOString().split('T')[0];
    }

    // Try direct parse (YYYY-MM-DD etc.)
    const date = new Date(value);

    if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
    }

    // Manual parsing for "26 June 1997"
    const parts = value.split(' ');
    if (parts.length === 3) {
        const day = parts[0];
        const monthName = parts[1];
        const year = parts[2];

        const months = {
            January: 1, February: 2, March: 3, April: 4,
            May: 5, June: 6, July: 7, August: 8,
            September: 9, October: 10, November: 11, December: 12
        };

        const month = months[monthName];

        if (!month) return '';

        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    return '';
};