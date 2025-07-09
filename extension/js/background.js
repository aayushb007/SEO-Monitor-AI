// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === "ANALYZE_SEO") {
//     fetch('http://localhost:3000/api/analyze', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(request.data)
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
      
//       // Store results and notify popup
//       chrome.storage.local.set({ seoData: data });
//       chrome.action.setBadgeText({ text: "!" });
//     })
//     .catch(error => {
//       console.log(error);
      
//       console.error('API error:', error);
//     });
//   }
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received", request);
  if (request.type === "ANALYZE_SEO") {
    fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.data)
    })
    .then(response => response.json())
    .then(data => {
      console.log("API response:",data);
      // Store results and notify popup
      chrome.storage.local.set({ seoData: data });
      chrome.action.setBadgeText({ text: "!" });
    })
    .catch(error => {
      console.error('API error:', error);
    });
  }
});

// Store for chunks
let htmlChunks = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ANALYZE_SEO_CHUNK") {
    const { url, chunk, totalChunks, currentChunk } = request.data;
    
    // Initialize chunks storage if it doesn't exist
    if (!htmlChunks[url]) {
      htmlChunks[url] = Array(totalChunks).fill(null);
    }
    
    // Store the chunk
    htmlChunks[url][currentChunk] = chunk;
    
    // Check if we have all chunks
    if (htmlChunks[url].every(chunk => chunk !== null)) {
      // Combine all chunks
      const fullHTML = htmlChunks[url].join('');
      
      // Make API call with complete HTML
      fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, html: fullHTML })
      })
      .then(response => response.json())
      .then(data => {
        console.log("API response:", data);
        
        // If we got an error and it's retryable, retry once
        if (data.error && data.retry) {
          console.log('Retrying PageSpeed Insights...');
          return fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url, html: fullHTML })
          }).then(response => response.json());
        }
        
        // Store results and notify popup
        chrome.storage.local.set({ seoData: data });
        chrome.action.setBadgeText({ text: "!" });
        
        // Clean up chunks
        delete htmlChunks[url];
      })
      .catch(error => {
        console.error('API error:', error);
        // Clean up chunks on error
        delete htmlChunks[url];
      });
    }
    
    sendResponse({ status: 'received', currentChunk });
  }
});

// // Add logging function
// const log = (message, data) => {
//   console.log(`[${new Date().toISOString()}] ${message}`, data);
// };

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   log("Message received", request);
  
//   if (request.type === "ANALYZE_SEO_CHUNK") {
//     try {
//       const { chunk, url, currentChunk, totalChunks: chunks } = request.data;
      
//       if (!url || !chunk || chunks === undefined || currentChunk === undefined) {
//         throw new Error("Invalid message data format");
//       }
      
//       log(`Processing chunk ${currentChunk + 1}/${chunks} for URL: ${url}`);
      
//       if (!htmlChunks[url]) {
//         htmlChunks[url] = [];
//         totalChunks = chunks;
//         log(`Starting new chunk sequence for URL: ${url}, total chunks: ${chunks}`);
//       }
      
//       htmlChunks[url][currentChunk] = chunk;
//       log(`Stored chunk ${currentChunk + 1}/${chunks} for URL: ${url}`);
      
//       // When all chunks received
//       if (htmlChunks[url].length === totalChunks) {
//         const completeHTML = htmlChunks[url].join('');
//         log(`All chunks received for URL: ${url}. Total length: ${completeHTML.length}`);
        
//         // Verify we have all chunks
//         if (completeHTML.length === 0) {
//           throw new Error("Received empty HTML after joining chunks");
//         }
        
//         log("Sending API request with data:", {
//           url: url,
//           htmlLength: completeHTML.length
//         });
        
//         fetch('http://localhost:3000/api/analyze', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             html: completeHTML,
//             url
//           })
//         })
//         .then(response => {
//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then(data => {
//           log('API response received:', data);
          
//           if (!data || (typeof data !== 'object')) {
//             throw new Error('Invalid API response format');
//           }
          
//           chrome.storage.local.set({ seoData: data }, () => {
//             log('Data stored in storage');
//             chrome.action.setBadgeText({ text: "!" });
//           });
//         })
//         .catch(error => {
//           log('Error in API request:', error);
//           const errorData = { error: error.message };
//           chrome.storage.local.set({ seoData: errorData }, () => {
//             log('Error stored in storage');
//           });
//         });
        
//         // Clean up
//         delete htmlChunks[url];
//       }
      
//       sendResponse({ success: true });
//     } catch (error) {
//       log('Error processing message:', error);
//       sendResponse({ error: error.message });
//     }
//   } else {
//     log('Unknown message type:', request.type);
//     sendResponse({ error: 'Unknown message type' });
//   }
// });