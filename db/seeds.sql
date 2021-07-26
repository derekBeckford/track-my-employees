INSERT INTO department (department_name)
VALUES(
    "Sales", 
    "Engineering",
    "Finance",
    "Legal",
    "Marketing"
)

INSERT INTO roles (title, salary, department_id)
VALUES(
    ("Salesperson", 80000, 1),
    ("Lead Engineer", 120000, 2),
    ("Engineer", 100000, 2),
    ("Accountant", 120000, 3)
    ("Lawyer", 250000, 4),
    ("CEO", 300000, 5)
)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES (
    ("Moe", "Mint", 2, 4),
    ("Derek", "Smith", 3, 1),
    ("Jan", "McSam", 4, 4),
    ("Ellie", "Goulding", 6, null)
    ("Max", "Treats", 5, 4);
    ("Glen", "Jones", 1, 4)
)