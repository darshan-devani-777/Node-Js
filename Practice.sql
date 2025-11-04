Create database employee_management;
Use employee_management;

CREATE TABLE employee(
employee_id serial primary key,
first_name varchar(255) unique not null,
last_name varchar (255) not null,
age int ,
gender varchar (255)
);

CREATE TABLE employee_salary(
employee_id int primary key,
salary int not null,
foreign key (employee_id) references employee(employee_id)
);

INSERT INTO employee(first_name, last_name, age, gender)
VALUES('John', 'Doe', 30, 'Male'),
('Jane', 'Smith', 25, 'Female'),
('Jim', 'Beam', 40, 'Male');

INSERT INTO employee_salary(employee_id, salary)
VALUES(1, 50000),
(2, 60000),
(3, 70000);

SELECT * FROM employee;
SELECT * FROM employee_salary;

SELECT 
    tablename, 
    indexname, 
    indexdef 
FROM 
    pg_indexes 
WHERE 
    tablename = 'employee';

-- Index
CREATE INDEX idx_age
ON employee(age);

EXPLAIN SELECT * FROM employee
WHERE age = 60;

DROP INDEX IF EXISTS idx_age;	

-- Max()
SELECT first_name, last_name, age
FROM employee
WHERE age = (SELECT MAX(age) FROM employee);

-- Count()
SELECT COUNT(*)
FROM employee
WHERE age > 40;

SELECT CURRENT_DATE;
SELECT CURRENT_TIME;
SELECT CURRENT_TIME(2);

CREATE TABLE log (
    log_id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    created_at TIME DEFAULT CURRENT_TIME,
    created_on DATE DEFAULT CURRENT_DATE
);
INSERT INTO log( message )
VALUES('Testing the CURRENT_TIME function');

SELECT * FROM log;

SELECT NOW();
SELECT EXTRACT(YEAR FROM TIMESTAMP '2020-12-31 13:30:15');
SELECT EXTRACT(QUARTER FROM TIMESTAMP '2020-12-31 13:30:15');
SELECT EXTRACT(MONTH FROM TIMESTAMP '2020-12-31 13:30:15');
SELECT CONCAT ('Geeks', 'for', 'geeks');
SELECT FORMAT('Hello, %s', 'Geeks!!');
SELECT UPPER('geeksforgeeks');
SELECT LOWER('GEEKSFORGEEKS');
SELECT CAST ('100' AS INTEGER);
SELECT '100'::INTEGER; -- ::cast operator
SELECT REGEXP_MATCHES('ABC', '^(A)(..)$', 'g');
SELECT REGEXP_REPLACE('Hello World', '(.*) (.*)', '\2, \1');
SELECT REGEXP_REPLACE('ABC12345xyz', '[[:alpha:]]', '', 'g');
SELECT REPLACE('Hello World', 'World', 'PostgreSQL') AS replaced_string;

-- If Statement
SELECT 
    employee_id,
    salary,
    IF(salary > 75000, 'High',
        IF(salary BETWEEN 70000 AND 75000, 'Medium', 'Low')
    ) AS salary_category
FROM employee_salary;

-- Case Statement
SELECT 
    employee_id,
    salary,
    CASE 
        WHEN salary > 75000 THEN 'High'
        WHEN salary BETWEEN 70000 AND 75000 THEN 'Medium'
        ELSE 'Low'
    END AS salary_category
FROM employee_salary;

-- Loop 
do $$
declare
  n integer:= 6;
  cnt integer := 1 ;  
begin
loop  
 exit when cnt = n ;
 raise notice '%', cnt;  
 cnt := cnt + 1 ;  
end loop;  
end; $$;

-- For Loop
DO $$
BEGIN
    FOR cnt IN 1..10 LOOP
        RAISE NOTICE 'cnt: %', cnt;
    END LOOP;
END; $$

-- Exit Statement
DO $$
DECLARE
  n INTEGER := 8;
  cnt INTEGER := 1;  
BEGIN
  LOOP  
    EXIT WHEN cnt > 5;
    RAISE NOTICE '%', cnt;  
    cnt := cnt + 1;  
  END LOOP;  
END $$;

-- Continue Statement
do
$$
declare
  cnt int = 0;
begin
 loop
 -- increment of cnt
    cnt = cnt + 1;
 -- exit the loop if cnt > 10
 exit when cnt > 10;
 -- skip the iteration if cnt is an odd number
 continue when mod(cnt,2) = 1;
 -- print out the cnt
 raise notice '%', cnt;
 end loop;
end;
$$;

-- Transactions
BEGIN;
    UPDATE employee_salary
        SET salary = salary - 5000
        WHERE 
        employee_id = 1;   

    SELECT employee_id, first_name, salary
        FROM employee_salary;
    UPDATE employee_salary
        SET salary = salary + 5000
        WHERE 
        employee_id = 2;
COMMIT;

SELECT employee_id, first_name, salary
    FROM employee_salary;

-- Rollback
BEGIN;
    DELETE FROM employee_salary
        WHERE 
        employee_id = 1;     
    SELECT employee_id, first_name, salary
        FROM employee_salary;      
ROLLBACK;
SELECT employee_id, first_name, salary
    FROM employee_salary;

-- Create Procedure
create or replace procedure transfer(
   sender int,
   receiver int, 
   amount dec
)
language plpgsql    
as $$
begin
    -- subtracting the amount from the sender's account 
    update employee_salary 
    set salary = salary - amount 
    where employee_id = sender;

    -- adding the amount to the receiver's account
    update employee_salary 
    set salary = salary + amount 
    where employee_id = receiver;

    commit;
end;$$;

call transfer(2, 1, 10000);

-- Roles & Permissions
SELECT rolname FROM pg_roles;

-- Create Role
CREATE ROLE Hello
LOGIN 
PASSWORD 'mypassword1';

-- Create Superuser Role
CREATE ROLE Admin
SUPERUSER 
LOGIN 
PASSWORD 'mypassword1';

-- Create Database Role
CREATE ROLE dba 
CREATEDB 
LOGIN 
PASSWORD 'Abcd1234';

-- Create Validity Role
CREATE ROLE QQQ WITH
LOGIN
PASSWORD 'securePass1'
VALID UNTIL '2030-01-01';

-- Create Connection Limit Role
CREATE ROLE WWW
LOGIN
PASSWORD 'securePass1'
CONNECTION LIMIT 1000;

-- Alter Role
ALTER ROLE Admin SUPERUSER;

-- Drop Role
Drop ROLE Admin;

-- Grant Role Permission
GRANT privilege_list | ALL 
ON  table_name
TO  role_name;

-- Revoke Role Permission
REVOKE privilege | ALL
ON TABLE tbl_name 
FROM role_name;

select * from pg_user;

ALTER TABLE players OWNER TO admin;

select * from players;

INSERT INTO players(first_name, last_name, email, phone)
VALUES('raju', 'kumar', 'raju.kumar@geeksforgeeks.org', '408-111-2222');

GRANT ALL
ON  players
TO  admin;

REVOKE ALL
ON TABLE players
FROM admin;

SELECT current_user;

CREATE ROLE admin WITH LOGIN SUPERUSER PASSWORD 'admin@123';
ALTER ROLE postgres WITH LOGIN;
ALTER ROLE admin WITH SUPERUSER;
SELECT current_user, session_user;

SELECT rolname, rolsuper, rolcanlogin 
FROM pg_roles 
WHERE rolname = 'admin';







