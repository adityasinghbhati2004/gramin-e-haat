export const API_BASE = import.meta.env.VITE_API_BASE || '/api';
console.log('API_BASE is:', API_BASE);
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

export const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
        return imageUrl;
    }
    const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    const url = `${API_ORIGIN}${normalizedPath}`;
    return url;
};

const getErrorMessage = async (res, fallback) => {
    try {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const data = await res.json();
            return typeof data === 'string' ? data : (data.message || fallback);
        }
        const text = await res.text();
        return text || fallback;
    } catch {
        return fallback;
    }
};

const handleResponse = async (res, fallback) => {
    if (res.ok) return res.json();
    const message = await getErrorMessage(res, fallback);
    throw new Error(`${message} (Status: ${res.status})`);
};

export const fetchProducts = async (search = '') => {
    const url = `${API_BASE}/products${search ? '?search=' + search : ''}`;
    console.log('Fetching products from:', url);
    const res = await fetch(url);
    return handleResponse(res, 'Failed to fetch products');
};

export const fetchProductById = async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse(res, 'Failed to fetch product');
};

export const fetchSellerProducts = async (sellerId) => {
    const res = await fetch(`${API_BASE}/products/seller/${sellerId}`);
    return handleResponse(res, 'Failed to fetch seller products');
};

export const createProduct = async (product) => {
    const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    return handleResponse(res, 'Failed to create product');
};

export const updateProduct = async (id, product) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    return handleResponse(res, 'Failed to update product');
};

export const uploadProductImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/products/upload-image`, {
        method: 'POST',
        body: formData
    });
    return handleResponse(res, 'Failed to upload image');
};

export const uploadGovId = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/auth/upload-gov-id`, {
        method: 'POST',
        body: formData
    });
    return handleResponse(res, 'Failed to upload Government ID');
};

export const createRazorpayOrder = async (amount) => {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
    });
    return handleResponse(res, 'Failed to initiate Razorpay payment');
};

export const fetchRazorpayKey = async () => {
    const res = await fetch(`${API_BASE}/payments/key`);
    if (res.ok) {
        const data = await res.json();
        return data.key;
    }
    throw new Error('Failed to fetch Razorpay key');
};

export const loginUser = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return handleResponse(res, 'Login failed');
};

export const signupUser = async (user) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    return handleResponse(res, 'Signup failed');
};

export const createOrder = async (orderData) => {
    const res = await fetch(`${API_BASE}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    return handleResponse(res, 'Checkout failed');
};

export const fetchUserOrders = async (userId) => {
    const res = await fetch(`${API_BASE}/orders/user/${userId}`);
    return handleResponse(res, 'Failed to fetch orders');
};

export const fetchSellerOrders = async (sellerId) => {
    const res = await fetch(`${API_BASE}/orders/seller/${sellerId}`);
    return handleResponse(res, 'Failed to fetch seller orders');
};

export const fetchProductReviews = async (productId) => {
    const res = await fetch(`${API_BASE}/reviews/product/${productId}`);
    return handleResponse(res, 'Failed to fetch reviews');
};

export const createReview = async (review) => {
    const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    });
    return handleResponse(res, 'Failed to submit review');
};

export const createComplaint = async (complaint) => {
    const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaint)
    });
    return handleResponse(res, 'Failed to submit complaint');
};

export const fetchComplaints = async () => {
    const res = await fetch(`${API_BASE}/complaints`);
    return handleResponse(res, 'Failed to fetch complaints');
};

export const fetchAdminUsers = async () => {
    const res = await fetch(`${API_BASE}/admin/users`);
    return handleResponse(res, 'Failed to fetch users');
};

export const fetchAdminRoles = async () => {
    const res = await fetch(`${API_BASE}/admin/roles`);
    return handleResponse(res, 'Failed to fetch roles');
};

export const updateAdminUser = async (id, updates) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    return handleResponse(res, 'Failed to update user');
};

export const fetchAdminOrders = async () => {
    const res = await fetch(`${API_BASE}/admin/orders`);
    return handleResponse(res, 'Failed to fetch orders');
};

export const fetchAdminSummary = async () => {
    const res = await fetch(`${API_BASE}/admin/summary`);
    return handleResponse(res, 'Failed to fetch summary');
};
