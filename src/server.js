// server.js

const express = require('express');
const axios = require('axios');// Import CORS middleware

const cors = require('cors');
const app = express();
app.use(cors()); 
const PORT = process.env.PORT || 5000;

app.get('/api/v1', async (req, res) => {
  try {
    const response = await axios.get('https://api.publicapis.org/entries');
    console.log('Called')
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching APIs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
