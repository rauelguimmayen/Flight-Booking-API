const express = require('express');
const router = express.Router();

const destinations = [
  { city: 'Tokyo', country: 'Japan', price: 689, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', tag: 'Popular' },
  { city: 'Paris', country: 'France', price: 449, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', tag: 'Hot Deal' },
  { city: 'Dubai', country: 'UAE', price: 529, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', tag: '' },
  { city: 'New York', country: 'USA', price: 299, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', tag: 'Best Value' },
  { city: 'Bali', country: 'Indonesia', price: 599, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', tag: '' },
  { city: 'Sydney', country: 'Australia', price: 799, img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80', tag: '' },
];

router.get('/', (req, res) => {
  res.render('pages/home', { title: 'SkyRoam – Fly Anywhere, Pay Less', destinations });
});

module.exports = router;
