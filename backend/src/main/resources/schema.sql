-- Database Schema: PetPlatformDB
CREATE DATABASE IF NOT EXISTS PetPlatformDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE PetPlatformDB;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(30) DEFAULT 'CUSTOMER',
    address TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spas (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    owner_id VARCHAR(50),
    city VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    rating DOUBLE DEFAULT 5.0,
    review_count INT DEFAULT 0,
    open_time VARCHAR(50),
    image_url VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    pet_type VARCHAR(20) DEFAULT 'both',
    price DOUBLE NOT NULL,
    original_price DOUBLE,
    stock INT DEFAULT 0,
    image_url VARCHAR(255),
    description TEXT,
    brand VARCHAR(100),
    rating DOUBLE DEFAULT 5.0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'PENDING',
    total_amount DOUBLE NOT NULL,
    shipping_fee DOUBLE DEFAULT 0,
    discount_amount DOUBLE DEFAULT 0,
    receiver_name VARCHAR(150) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    receiver_address TEXT NOT NULL,
    receiver_note TEXT,
    payment_method VARCHAR(50) DEFAULT 'COD',
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    quantity INT NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    product_id VARCHAR(50),
    spa_id VARCHAR(50),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

