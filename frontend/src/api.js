export const API_BASE = 'http://localhost:8080/api';

export const fetchProducts = async (search = '') => {
    const res = await fetch(`${API_BASE}/products${search ? '?search=' + search : ''}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};
