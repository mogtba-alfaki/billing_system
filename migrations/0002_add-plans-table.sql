-- Migration number: 0002 	 2024-10-16T20:30:24.675Z
create table plans (
    id serial primary key,
    name varchar(255) not null,
    billing_cycle varchar(255) not null,
    price numeric not null,
    status varchar(255) not null,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);