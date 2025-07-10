// document.addEventListener('DOMContentLoaded', () => {
//   chrome.storage.local.get(['seoData'], ({ seoData }) => {
//     const container = document.getElementById('analysis-result');
    
//     if (!seoData) {
//       container.innerHTML = '<p>No analysis data found. Refresh the page and click the extension again.</p>';
//       return;
//     }

//     // Transform AI text into structured JSON
//     const analysis = parseAITextToStructuredData(seoData.suggestions);
    
//     // Generate interactive UI
//     container.innerHTML = generateInteractiveUI(analysis);
    
//     // Add toggle functionality
//     document.querySelectorAll('.category').forEach(item => {
//       item.addEventListener('click', () => {
//         const details = item.nextElementSibling;
//         details.style.display = details.style.display === 'block' ? 'none' : 'block';
//         const icon = item.querySelector('.expand-icon');
//         icon.textContent = details.style.display === 'block' ? '▼' : '▶';
//       });
//     });
//   });
// });

// // Parse AI text response into structured data
// function parseAITextToStructuredData(aiText) {
//   // Example regex parsing (adjust based on your AI's output format)
//   const categories = aiText.split(/\*\d+\.\s+/).slice(1);
  
//   return categories.map(cat => {
//     const [name, ...contentParts] = cat.split(':');
//     const content = contentParts.join(':').trim();
//     const severityMatch = content.match(/Severity:\s*(High|Medium|Low)/i);
    
//     return {
//       name: name.trim(),
//       content: content,
//       severity: severityMatch ? severityMatch[1] : 'Medium'
//     };
//   });
// }

// // Generate interactive HTML
// function generateInteractiveUI(analysis) {
//   return analysis.map(item => `
//     <div class="category">
//       ${item.name} 
//       <span class="severity-${item.severity.toLowerCase()}">
//         (${item.severity})
//       </span>
//       <span class="expand-icon">▶</span>
//     </div>
//     <div class="details">
//       ${item.content.replace(/\n/g, '<br>')}
//     </div>
//   `).join('');
// }

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