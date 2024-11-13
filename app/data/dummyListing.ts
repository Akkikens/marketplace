// File: app/data/dummyListings.js or dummyListings.ts

// Array of themes for the items
const themes = ['Electronics', 'Furniture', 'Books', 'Clothing', 'Toys'];

// Utility function to generate random email addresses
const generateRandomEmail = (index: number) => `seller${index + 1}@clarku.edu`;

// Utility function to generate random names
const generateRandomName = (index: number) => `Seller ${index + 1}`;

export const dummyListings = Array.from({ length: 100 }, (_, index: number) => {
  const theme = themes[index % themes.length]; // Cycle through themes

  return {
    id: `${index + 1}`,
    name: `${theme} Item ${index + 1}`, // Themed item names
    price: (Math.random() * 100).toFixed(2),
    description: `This is a description for ${theme.toLowerCase()} item ${index + 1}.`,
    location: `${Math.floor(Math.random() * 5) + 1} mile${Math.floor(Math.random() * 5) + 1 > 1 ? 's' : ''} away`,
    image: `https://picsum.photos/200/300?random=${index + 1}`, // Use Lorem Picsum for random images
    email: generateRandomEmail(index), // Add random email
    sellerName: generateRandomName(index), // Add random seller name
  };
});
