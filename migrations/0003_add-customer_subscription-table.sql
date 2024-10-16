-- Migration number: 0003 	 2024-10-16T20:31:40.198Z
create table customer_subscriptions (
    id serial primary key,
    customer_id serial not null,
    plan_id serial not null,
    name varchar(255) not null,
    billing_cycle varchar(255) not null,
    price numeric not null,
    status varchar(255) not null,
    
    start_date timestamp not null,
    end_date timestamp not null, 

    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp,

    foreign key (customer_id) references customers(id),
    foreign key (plan_id) references plans(id)
);