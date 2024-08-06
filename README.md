# workindia
Steps to Run
Create a new Folder separately
Open VS Code
Open the Folder you just created
Open the terminal
npm init -y
npm install express mysql2 jsonwebtoken bcryptjs body-parser
TO Run the App -> node app.js
 
Copy paste everything from my file to your file
Create the folders structure yourself
Postman Request
http://localhost:3000/api/user/signup goto body make json
{
    "username": "prabhave",
    "password": "pwd123",
    "email": "pra@gmail.com"
}
This is for MySQL -
CREATE DATABASE ZoomCar;

USE ZoomCar;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Cars (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    number_plate VARCHAR(255) NOT NULL UNIQUE,
    current_city VARCHAR(255) NOT NULL,
    rent_per_hr DECIMAL(10, 2) NOT NULL,
    rent_history JSON
);

CREATE TABLE Rents (
    rent_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    car_id INT,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    hours_requirement INT NOT NULL,
    total_payable_amt DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (car_id) REFERENCES Cars(car_id)
);
Rest of the requests :-
http://localhost:3000/api/user/login
{
    "username": "prabhave",
    "password": "pwd123"
}
http://localhost:3000/api/car/create
{
    "category": "SUV",
    "model": "BMW",
    "number_plate": "KA123",
    "current_city": "Chennai",
    "rent_per_hr": "100",
    "rent_history": "First time"
}
This is Get ->
http://localhost:3000/api/car/get-rides?origin=Chennai&destination=Banglore&category=SUV&required_hours=10
These are Post again
http://localhost:3000/api/car/rent
{
    "car_id": "1",
    "origin": "Chennai",
    "destination": "Banglore",
    "hours_requirement": "10"
}
iN THE HEADERS PART YOU NEED TO ADD A NEW HEADER
Authorization: Token unfonforibr
That "unfonforibr" you will get from the login response
