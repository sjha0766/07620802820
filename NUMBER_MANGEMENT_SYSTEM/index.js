const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'Invalid URL format. Please provide valid "uri" query parameters.' });
    }

    const promises = urls.map(url => axios.get(url, { timeout: 500 }));

    const responses = await Promise.allSettled(promises);

    const numbers = [];
    for (const response of responses) {
      if (response.status === 'fulfilled' && response.value.data && Array.isArray(response.value.data.numbers)) {
        numbers.push(...response.value.data.numbers);
      }
    }

    const mergedNumbers = Array.from(new Set(numbers)).sort((a, b) => a - b);

    res.json({ numbers: mergedNumbers });
  
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});