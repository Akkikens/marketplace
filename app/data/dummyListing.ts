// File: app/data/dummyListings.js

export const dummyListings = Array.from({ length: 100 }, (_, index) => ({
    id: `${index + 1}`,
    name: `Item ${index + 1}`,
    price: (Math.random() * 100).toFixed(2),
    description: `This is a description for Item ${index + 1}.`,
    location: `${Math.floor(Math.random() * 5) + 1} mile${Math.floor(Math.random() * 5) + 1 > 1 ? 's' : ''} away`,
    image: `https://picsum.photos/200/300?random=${index + 1}`, // URL for a random image
  }));
  