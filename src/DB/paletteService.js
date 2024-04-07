const baseURL = 'http://localhost:3000/palettes';

export const fetchPalettes = async () => {
  try {
    const response = await fetch(baseURL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const palettes = await response.json();
    return palettes;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};