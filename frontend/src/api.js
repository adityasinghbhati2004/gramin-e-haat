export const API_BASE = 'https://gramin-e-haat.onrender.com/api';

export const fetchProducts = async (search = '') => {
    const res = await fetch(`${API_BASE}/products${search ? '?search=' + search : ''}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const loginUser = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
};

export const signupUser = async (user) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if (!res.ok) throw new Error('Signup failed');
    return res.json();
};

export const createOrder = async (orderData) => {
    const res = await fetch(`${API_BASE}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Checkout failed');
    return res.json();
};
