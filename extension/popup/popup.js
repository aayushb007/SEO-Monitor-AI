document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup loaded');
  
  const loader = document.querySelector('.loader');
  const resultsDiv = document.getElementById('results');
  
  // Show loading state initially
  loader.style.display = 'block';
  resultsDiv.style.display = 'none';
  
  chrome.storage.local.get(['seoData'], (result) => {
    console.log('Storage result:', result);
    
    // Hide loading state
    loader.style.display = 'none';
    resultsDiv.style.display = 'block';
    
    if (result.seoData) {
      if (result.seoData.error) {
        // Show error message
        resultsDiv.innerHTML = `
          <div class="error-message">
            <p>Analysis Error:</p>
            <p>${result.seoData.error}</p>
            <p>Try refreshing the page and clicking the extension icon again.</p>
          </div>
        `;
        return;
      }
      
      console.log('SEO data:', result.seoData);
      
      resultsDiv.innerHTML = `
        <div class="analysis-results">
          <div class="scores-section">
            <h2>Performance Scores</h2>
            <div class="score-grid">
              <div class="score-item">
                <span class="score-label">Performance</span>
                <div class="score-value">${result.seoData.pagespeed?.performance || 'N/A'}%</div>
              </div>
              <div class="score-item">
                <span class="score-label">SEO</span>
                <div class="score-value">${result.seoData.pagespeed?.seo || 'N/A'}%</div>
              </div>
            </div>
          </div>

          <div class="suggestions-section">
            <h2>Suggestions</h2>
            <div class="suggestions">
              ${result.seoData.suggestions || 'No suggestions available'}
            </div>
          </div>
        </div>
      `;
    } else {
      resultsDiv.innerHTML = `
        <div class="analysis-results">
          <div class="scores-section">
            <h2>Performance Scores</h2>
            <div class="score-grid">
              <div class="score-item">
                <span class="score-label">Performance</span>
                <div class="score-value">${'N/A'}%</div>
              </div>
              <div class="score-item">
                <span class="score-label">SEO</span>
                <div class="score-value">${ 'N/A'}%</div>
              </div>
            </div>
          </div>

          <div class="suggestions-section">
            <h2>Suggestions</h2>
            <div class="suggestions">
              ${ 'No suggestions available'}
            </div>
          </div>
        </div>
      `;
    }
  });
});