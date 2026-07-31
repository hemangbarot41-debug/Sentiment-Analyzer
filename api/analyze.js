// Serverless function for Vercel - Sentiment Analysis
// No external ML libraries needed, using simple heuristic-based sentiment analysis

const stopwords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have',
  'had', 'what', 'when', 'where', 'who', 'which', 'why', 'how'
]);

// Simple sentiment lexicons
const positiveWords = new Set([
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
  'best', 'awesome', 'perfect', 'love', 'happy', 'beautiful', 'brilliant',
  'outstanding', 'superb', 'pleasant', 'delightful', 'positive', 'glad',
  'content', 'joy', 'wonderful', 'nice', 'lovely', 'fine', 'good'
]);

const negativeWords = new Set([
  'bad', 'terrible', 'awful', 'horrible', 'worst', 'ugly', 'hate',
  'sad', 'unhappy', 'angry', 'furious', 'disgusting', 'pathetic',
  'awful', 'dreadful', 'unpleasant', 'nasty', 'poor', 'negative',
  'disappointing', 'useless', 'waste', 'terrible', 'weak'
]);

function analyzeText(text) {
  // Tokenization
  const tokens = text.toLowerCase().split(/\s+/);
  
  // Remove stop words
  const filtered = tokens.filter(word => {
    const cleanWord = word.replace(/[^a-z]/g, '');
    return cleanWord && !stopwords.has(cleanWord);
  });
  
  const cleanedText = filtered.join(' ');
  
  // Sentiment Analysis
  let positiveScore = 0;
  let negativeScore = 0;
  
  tokens.forEach(token => {
    const cleanToken = token.toLowerCase().replace(/[^a-z]/g, '');
    if (positiveWords.has(cleanToken)) {
      positiveScore++;
    }
    if (negativeWords.has(cleanToken)) {
      negativeScore++;
    }
  });
  
  let sentiment = 'Neutral';
  if (positiveScore > negativeScore) {
    sentiment = 'Positive';
  } else if (negativeScore > positiveScore) {
    sentiment = 'Negative';
  }
  
  return {
    sentiment,
    cleanedText,
    positiveScore,
    negativeScore
  };
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'POST') {
    const text = req.body && typeof req.body.text === 'string'
      ? req.body.text
      : '';
    
    if (!text.trim()) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }
    
    const result = analyzeText(text);
    res.status(200).json(result);
  } else if (req.method === 'GET') {
    res.status(200).json({ 
      message: 'Sentiment Analysis API',
      usage: 'Send a POST request with { text: "your text here" }'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
