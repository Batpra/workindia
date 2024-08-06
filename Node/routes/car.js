const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();
const JWT_SECRET = 'usersecret';

// Add New Car
router.post('/create', async (req, res) => {
    const { category, model, number_plate, current_city, rent_per_hr, rent_history } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Cars (category, model, number_plate, current_city, rent_per_hr, rent_history) VALUES (?, ?, ?, ?, ?, ?)',
            [category, model, number_plate, current_city, rent_per_hr, JSON.stringify(rent_history)]
        );
        res.status(200).json({ message: 'Car added successfully', car_id: result.insertId });
    } catch (err) {
        res.status(500).json({ status: 'Error adding car' });
    }
});

// Get Available Rides
router.get('/get-rides', async (req, res) => {
    const { origin, destination, category, required_hours } = req.query;
    try {
        const [cars] = await db.query(
            'SELECT car_id, category, model, number_plate, current_city, rent_per_hr FROM Cars WHERE is_rented = 0 AND category = ? AND current_city = ?',
            [category, origin]
        );

        const response = cars.map(car => ({
            car_id: car.car_id,
            category: car.category,
            model: car.model,
            number_plate: car.number_plate,
            current_city: car.current_city,
            rent_per_hr: car.rent_per_hr,
            total_payable_amt: car.rent_per_hr * required_hours
        }));

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ status: 'Error fetching rides' });
    }
});

// Rent a Car
router.post('/rent', async (req, res) => {
    const { car_id, origin, destination, hours_requirement } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user_id = decoded.user_id;

        const [car] = await db.query('SELECT rent_per_hr FROM Cars WHERE car_id = ?', [car_id]);
        if (car.length === 0) {
            return res.status(400).json({ status: 'No car is available at the moment' });
        }

        const total_payable_amt = car[0].rent_per_hr * hours_requirement;
        const [result] = await db.query(
            'INSERT INTO Rents (user_id, car_id, origin, destination, hours_requirement, total_payable_amt) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, car_id, origin, destination, hours_requirement, total_payable_amt]
        );

        res.status(200).json({ status: 'Car rented successfully', rent_id: result.insertId, total_payable_amt });
    } catch (err) {
        res.status(401).json({ status: 'Unauthorized' });
    }
});

// Update Rent History (Admin Access Only)
router.post('/update-rent-history', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { car_id, ride_details } = req.body;

    try {
        // Validate admin token here (assuming same secret for simplicity)
        const decoded = jwt.verify(token, JWT_SECRET);
        // Check if user is admin (simple check, improve as needed)
        const user_id = decoded.user_id;
        
        const [car] = await db.query('SELECT rent_history FROM Cars WHERE car_id = ?', [car_id]);
        if (car.length === 0) {
            return res.status(400).json({ status: 'Car not found' });
        }

        const rent_history = JSON.parse(car[0].rent_history);
        rent_history.push(ride_details);

        await db.query(
            'UPDATE Cars SET rent_history = ? WHERE car_id = ?',
            [JSON.stringify(rent_history), car_id]
        );

        res.status(200).json({ status: 'Car\'s rent history updated successfully' });
    } catch (err) {
        res.status(401).json({ status: 'Unauthorized' });
    }
});

module.exports = router;