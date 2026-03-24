async function fetchSnowData() {
  const cacheKey = 'snowData';
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const cachedData = JSON.parse(cached);
    if (Date.now() - cachedData.timestamp < 3600000) {  // 1 hour cache
      snowData = cachedData.data;
      return;
    }
  }

  try {
    const response = await fetch('data/snow_data.json');
    if (!response.ok) throw new Error('Failed to load snow data');
    
    const freshData = await response.json();
    snowData = freshData.data || [];
    
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data: snowData
    }));
    
    console.log(`Loaded ${snowData.length} snow stations from JSON`);
  } catch (err) {
    console.error('Error loading snow_data.json:', err);
    // Fallback to dummy data if needed
    snowData = [];
  }
}
