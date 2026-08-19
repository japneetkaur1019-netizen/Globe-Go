// Activity recommendation templates with rich metadata and Lucide icon keys.

export const CATEGORY_META = {
  adventure: { iconName: 'Compass', label: 'Adventure' },
  culture: { iconName: 'Landmark', label: 'Culture' },
  nature: { iconName: 'Trees', label: 'Nature' },
  food: { iconName: 'Utensils', label: 'Food & Dining' },
  shopping: { iconName: 'ShoppingBag', label: 'Shopping' },
  relax: { iconName: 'Sparkles', label: 'Relaxation' },
  luxury: { iconName: 'Crown', label: 'Luxury' },
};

function city(dest, i = 0) {
  return dest.cities[i % dest.cities.length];
}

const BUILDERS = {
  adventure: (dest) => [
    { name: `Scenic Mountain Trail Trek in ${city(dest)}`, desc: 'A curated half-day hike with a certified alpine guide.', duration: '4 Hours', rating: 4.9, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
    { name: `Water Sports & Kayak Tour in ${city(dest, 1)}`, desc: 'Paddle through crystal waterways and coastal caves.', duration: '3 Hours', rating: 4.8, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80' },
    { name: 'Off-Road 4x4 Wilderness Tour', desc: 'Explore rugged terrain and panoramic viewpoints with a private driver.', duration: '5 Hours', rating: 4.9, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80' },
  ],
  culture: (dest) => [
    { name: `Historic Heritage Walk of ${city(dest)}`, desc: 'An expert-led storytelling journey through iconic architectural treasures.', duration: '3 Hours', rating: 4.9, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80' },
    { name: 'National Museum & Royal Art Gallery VIP Access', desc: 'Skip-the-line private entry to world-class historical masterpieces.', duration: '2.5 Hours', rating: 4.8, image: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=600&q=80' },
    { name: 'Traditional Music & Theatre Evening', desc: 'Authentic cultural performance celebrating regional arts and history.', duration: '2 Hours', rating: 4.7, image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80' },
  ],
  nature: (dest) => [
    { name: `National Park & Alpine Vista Tour near ${city(dest)}`, desc: 'Pristine natural landscapes with unmatched golden-hour photo stops.', duration: '5 Hours', rating: 4.9, image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80' },
    { name: 'Botanical Gardens & Ecological Sanctuary', desc: 'A serene stroll through world-renowned flora and tranquil waterways.', duration: '2 Hours', rating: 4.8, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80' },
    { name: 'Panoramic Sunrise Summit Lookout', desc: 'Watch the sunrise break across mountain ranges or ocean horizons.', duration: '2.5 Hours', rating: 4.9, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
  ],
  food: (dest) => [
    { name: `Street Food & Night Market Safari in ${city(dest)}`, desc: 'Sample the region’s highest-rated dishes with a local culinary insider.', duration: '3.5 Hours', rating: 5.0, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80' },
    { name: 'Master Chef Artisan Cooking Class', desc: 'Learn authentic regional techniques using fresh market ingredients.', duration: '4 Hours', rating: 4.9, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80' },
    { name: 'Sommelier Wine & Gourmet Tasting', desc: 'Guided pairings of vintage selections with regional cheeses and delicacies.', duration: '2 Hours', rating: 4.8, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },
  ],
  shopping: (dest) => [
    { name: `${city(dest)} Premier Fashion Boulevard Tour`, desc: 'Curated retail route covering flagship ateliers and vintage boutiques.', duration: '3 Hours', rating: 4.7, image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd302?auto=format&fit=crop&w=600&q=80' },
    { name: 'Artisan & Antique Heritage Market', desc: 'Unique handcrafted ceramics, textiles and collectible souvenirs.', duration: '2.5 Hours', rating: 4.8, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80' },
    { name: 'Tax-Free Luxury Department Store Experience', desc: 'Personal shopping concierge with VIP lounge access.', duration: '2 Hours', rating: 4.9, image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80' },
  ],
  relax: (dest) => [
    { name: `Luxury Thermal Spa & Hydrotherapy in ${city(dest)}`, desc: 'Rejuvenate with organic herbal therapies and thermal mineral baths.', duration: '3 Hours', rating: 4.9, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' },
    { name: 'Private Sunset Catamaran Cruise', desc: 'Sail along coastal vistas with champagne and canapés at golden hour.', duration: '2.5 Hours', rating: 5.0, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80' },
    { name: 'Beachfront Cabana & Wellness Day', desc: 'A serene day of sun, sea breezes, fresh coconut water and gentle yoga.', duration: '4 Hours', rating: 4.8, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  ],
  luxury: (dest) => [
    { name: `Private Chauffeured VIP Day Tour in ${city(dest)}`, desc: 'Tailored luxury itinerary in a premium executive vehicle with guide.', duration: '6 Hours', rating: 5.0, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
    { name: 'Michelin Star Chef’s Table Experience', desc: 'Multi-course tasting menu with private kitchen tour and master sommelier.', duration: '3 Hours', rating: 5.0, image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Helicopter Aerial Skyline Flight', desc: 'Breathtaking bird’s-eye perspective of the city landmarks and coast.', duration: '45 Mins', rating: 5.0, image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=600&q=80' },
  ],
};

export function getActivitiesForStyles(dest, styles = []) {
  const chosen = styles.length ? styles : dest.styles.slice(0, 3);
  const unique = [...new Set(chosen)].filter((s) => BUILDERS[s]);
  const finalStyles = unique.length ? unique : ['culture', 'nature', 'food'];
  return finalStyles.slice(0, 5).map((style) => ({
    category: style,
    iconName: CATEGORY_META[style]?.iconName || 'Compass',
    label: CATEGORY_META[style]?.label || style,
    items: BUILDERS[style](dest),
  }));
}

export function getMoreActivities(dest, existingStyles = []) {
  const remaining = Object.keys(BUILDERS).filter((s) => !existingStyles.includes(s));
  const pick = remaining.length ? remaining : Object.keys(BUILDERS);
  return pick.slice(0, 2).map((style) => ({
    category: style,
    iconName: CATEGORY_META[style]?.iconName || 'Compass',
    label: CATEGORY_META[style]?.label || style,
    items: BUILDERS[style](dest),
  }));
}
