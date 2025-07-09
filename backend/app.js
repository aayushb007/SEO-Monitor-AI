require('dotenv').config();
const express = require('express');
const cors = require('cors');
const openaiService = require('./services/openai');
const pagespeedService = require('./services/pagespeed');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// SEO Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { html, url } = req.body;
    
    // Get PageSpeed insights
    const pagespeedData = await pagespeedService.getPageSpeedInsights(url);
    
    // Get AI suggestions
    const aiSuggestions = await openaiService.getSEOSuggestions(html);
    
    res.json({
      success: true,
      pagespeed: pagespeedData,
      suggestions: aiSuggestions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));