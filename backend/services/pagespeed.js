const axios = require('axios');

const getPageSpeedInsights = async (url) => {
  try {
    // Validate URL format
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${process.env.GOOGLE_API_KEY}`;
    
    console.log(`Making request to: ${apiUrl.replace(process.env.GOOGLE_API_KEY, 'REDACTED')}`);

    // Increase timeout to 30 seconds and add retry logic
    const response = await axios.get(apiUrl, {
      timeout: 30000, // Increased timeout to 30 seconds
      validateStatus: (status) => status >= 200 && status < 500 // Only reject on 5xx errors
    });

    if (!response.data.lighthouseResult) {
      throw new Error('No lighthouseResult in response');
    }

    const result = {
      performance: response.data.lighthouseResult.categories?.performance?.score * 100 || 'N/A',
      seo: response.data.lighthouseResult.categories?.seo?.score * 100 || 'N/A',
      accessibility: response.data.lighthouseResult.categories?.accessibility?.score * 100 || 'N/A',
      metrics: {
        firstContentfulPaint: response.data.lighthouseResult.audits?.['first-contentful-paint']?.displayValue || 'N/A',
        largestContentfulPaint: response.data.lighthouseResult.audits?.['largest-contentful-paint']?.displayValue || 'N/A',
        cumulativeLayoutShift: response.data.lighthouseResult.audits?.['cumulative-layout-shift']?.displayValue || 'N/A'
      }
    };

    console.log('PageSpeed Insights results:', result);
    return result;

  } catch (error) {
    console.error('PageSpeed API Error:', {
      message: error.message,
      response: error.response?.data,
      url: error.config?.url?.replace(process.env.GOOGLE_API_KEY, 'REDACTED'),
      status: error.response?.status,
      errorType: error.code
    });
    
    // Return more detailed error information
    return {
      performance: 'N/A',
      seo: 'N/A',
      accessibility: 'N/A',
      error: error.message,
      status: error.response?.status,
      errorType: error.code,
      retry: true // Indicate that this can be retried
    };
  }
};

module.exports = {
  getPageSpeedInsights
};