const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const carRoutes = require('./routes/car');

const app = express();

app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/car', carRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
