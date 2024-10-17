-- Migration number: 0004 	 2024-10-17T18:16:47.130Z
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    payment_status VARCHAR(255) NOT NULL,
    payment_date DATE,

    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp,
    foreign key (customer_id) references customers(id)
);