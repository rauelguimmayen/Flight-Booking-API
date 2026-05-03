const express = require('express');
const router = express.Router();

const DEALS = [
  { city: 'Tokyo', country: 'Japan', code: 'NRT', from: 'JFK', price: 689, originalPrice: 949, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', tag: 'Popular', expires: '3 days' },
  { city: 'Paris', country: 'France', code: 'CDG', from: 'JFK', price: 449, originalPrice: 599, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', tag: 'Hot Deal', expires: '1 day' },
  { city: 'Dubai', country: 'UAE', code: 'DXB', from: 'LHR', price: 529, originalPrice: 729, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', tag: 'Flash Sale', expires: '6 hours' },
  { city: 'New York', country: 'USA', code: 'JFK', from: 'LAX', price: 299, originalPrice: 399, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', tag: 'Best Value', expires: '5 days' },
  { city: 'Bali', country: 'Indonesia', code: 'DPS', from: 'SYD', price: 599, originalPrice: 849, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', tag: 'Trending', expires: '2 days' },
  { city: 'Sydney', country: 'Australia', code: 'SYD', from: 'SIN', price: 799, originalPrice: 1099, img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80', tag: 'Limited', expires: '4 days' },
  { city: 'Barcelona', country: 'Spain', code: 'BCN', from: 'LHR', price: 219, originalPrice: 349, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80', tag: 'Weekend Deal', expires: '2 days' },
  { city: 'Singapore', country: 'Singapore', code: 'SIN', from: 'NRT', price: 399, originalPrice: 589, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', tag: 'Popular', expires: '7 days' },
];

router.get('/', (req, res) => {
  const dealsWithSavings = DEALS.map(d => ({
    ...d,
    savings: Math.round(((d.originalPrice - d.price) / d.originalPrice) * 100)
  }));
  res.render('pages/deals', { title: 'Flight Deals – SkyRoam', deals: dealsWithSavings });
});

module.exports = router;
