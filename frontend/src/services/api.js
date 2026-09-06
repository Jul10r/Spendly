const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AUTH_URL = `${BASE_URL}/auth`
const TX_URL = `${BASE_URL}/transactions`


const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const signup = async (data) => {
    const response = await fetch(`${AUTH_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    return await response.json();
}

export const login = async (data) => {
    const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    return await response.json();
}

export const getSummary = async () => {
    const response = await fetch(`${TX_URL}/summary`, { headers: getAuthHeader() })
    return await response.json();
}

export const getTransactions = async (type) => {
    const url = type ? `${TX_URL}?type=${type}` : TX_URL;
    const response = await fetch(url, { headers: getAuthHeader() });
    return await response.json();
}

export const createTransaction = async (data) => {
    const response = await fetch(TX_URL, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data)
    });

    return await response.json();
}

export const deleteTransaction = async (id) => {
    const response = await fetch(`${TX_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });

    return await response.json();
}

export const updateTransaction = async (id, data) => {
    const response = await fetch(`${TX_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(data)
    });

    return await response.json()
};

export const verifyEmail = async (data) => {
    const response = await fetch(`${AUTH_URL}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
};

export const resendCode = async (data) => {
    const response = await fetch(`${AUTH_URL}/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
};

export const forgotPassword = async (data) => {
    const response = await fetch(`${AUTH_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
};

export const resetPassword = async (data) => {
    const response = await fetch(`${AUTH_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
};