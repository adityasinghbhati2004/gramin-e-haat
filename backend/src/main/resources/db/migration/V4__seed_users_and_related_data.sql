INSERT INTO users (email, password, name, address, phone, role, seller_verified)
VALUES
('admin@graminehaat.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOeR9T7VDaRao7IhiHBpjz2uVH54camz2', 'Platform Admin', 'Delhi, India', '9999999999', 'ADMIN', TRUE),
('seller@graminehaat.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOeR9T7VDaRao7IhiHBpjz2uVH54camz2', 'Demo Seller', 'Jaipur, India', '8888888888', 'SELLER', TRUE),
('buyer@graminehaat.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOeR9T7VDaRao7IhiHBpjz2uVH54camz2', 'Demo Buyer', 'Bengaluru, India', '7777777777', 'BUYER', FALSE);

UPDATE products
SET seller_id = (SELECT id FROM users WHERE email = 'seller@graminehaat.com'),
    stock_quantity = 15
WHERE seller_id IS NULL;

INSERT INTO orders (user_id, total_amount, status, payment_method, order_date, shipping_address)
VALUES (
    (SELECT id FROM users WHERE email = 'buyer@graminehaat.com'),
    1349.00,
    'DELIVERED',
    'UPI',
    CURRENT_TIMESTAMP,
    'Demo Buyer Address, Bengaluru'
);

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES
(
    (SELECT MAX(id) FROM orders),
    (SELECT id FROM products WHERE name = 'Terracotta Clay Pot'),
    1,
    499.00
),
(
    (SELECT MAX(id) FROM orders),
    (SELECT id FROM products WHERE name = 'Woven Bamboo Basket'),
    1,
    850.00
);

INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
VALUES (
    (SELECT id FROM products WHERE name = 'Terracotta Clay Pot'),
    (SELECT id FROM users WHERE email = 'buyer@graminehaat.com'),
    5,
    'Great finish and authentic handcrafted quality.',
    CURRENT_TIMESTAMP
);

INSERT INTO complaints (user_id, order_id, subject, message, status, created_at)
VALUES (
    (SELECT id FROM users WHERE email = 'buyer@graminehaat.com'),
    (SELECT MAX(id) FROM orders),
    'Packaging feedback',
    'Product quality was good, but outer packaging was slightly damaged.',
    'OPEN',
    CURRENT_TIMESTAMP
);
