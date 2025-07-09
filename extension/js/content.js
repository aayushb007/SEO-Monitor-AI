const pageHTML = document.documentElement.outerHTML;
const pageUrl = window.location.href;
const CHUNK_SIZE = 100000; // 100KB chunks

console.log('Content script initialized');
console.log('Page URL:', pageUrl);
console.log('HTML length:', pageHTML.length);

const chunks = [];
for (let i = 0; i < pageHTML.length; i += CHUNK_SIZE) {
  chunks.push(pageHTML.slice(i, i + CHUNK_SIZE));
}



const sendNextChunk = (index = 0) => {
  if (index >= chunks.length) {
    console.log('All chunks sent');
    return;
  }
  
  const chunkData = {
    chunk: chunks[index],
    url: pageUrl,
    totalChunks: chunks.length,
    currentChunk: index
  };
  
  console.log(`Sending chunk ${index + 1}/${chunks.length}`);
  
  chrome.runtime.sendMessage({
    type: "ANALYZE_SEO_CHUNK",
    data: chunkData
  }, (response) => {
    console.log(`Chunk ${index + 1} sent`, response);
    sendNextChunk(index + 1);
  });
};

sendNextChunk();