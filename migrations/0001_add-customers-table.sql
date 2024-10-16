-- Migration number: 0001 	 2024-10-16T20:16:00.911Z
create table customers (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255) not null,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);