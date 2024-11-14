// File: app/data/dummyListings.ts

// Array of themes to create varied item names
const themes = ['Vintage', 'Modern', 'Eco-Friendly', 'Minimalist', 'Rustic'];

// Function to generate a random email based on the index
const generateRandomEmail = (index: number) => {
  const emailProviders = ['clarku.edu', 'example.com', 'email.com'];
  const provider = emailProviders[index % emailProviders.length];
  return `user${index + 1}@${provider}`;
};

// Function to generate a random seller name based on the index
const generateRandomName = (index: number) => {
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Evan', 'Fiona', 'George', 'Hannah', 'Ian', 'Julia'];
  return names[index % names.length];
};

// Generate 100 dummy listings with themes, random prices, emails, and names
export const dummyListings = Array.from({ length: 100 }, (_, index: number) => {
  const theme = themes[index % themes.length]; // Cycle through themes

  return {
    id: `${index + 1}`,
    name: `${theme} Item ${index + 1}`, // Themed item names
    price: `$${(Math.random() * 100).toFixed(2)}`, // Price in dollars
    description: `This is a description for ${theme.toLowerCase()} item ${index + 1}.`,
    location: `${Math.floor(Math.random() * 5) + 1} mile${Math.floor(Math.random() * 5) + 1 > 1 ? 's' : ''} away`,
    image: `https://picsum.photos/200/300?random=${index + 1}`, // Use Lorem Picsum for random images
    email: generateRandomEmail(index), // Add random email
    sellerName: generateRandomName(index), // Add random seller name
  };
});
