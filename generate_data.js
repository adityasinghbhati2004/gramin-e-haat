const fs = require('fs');

const stateArts = [
  { state: 'Andhra Pradesh', art: 'Kalamkari Painting', category: 'Art & Paintings', keyword: 'kalamkari' },
  { state: 'Andhra Pradesh', art: 'Kondapalli Wooden Toy', category: 'Handicrafts', keyword: 'wooden,toy' },
  { state: 'Arunachal Pradesh', art: 'Bamboo Basket', category: 'Handicrafts', keyword: 'bamboo,basket' },
  { state: 'Assam', art: 'Muga Silk Saree', category: 'Handloom', keyword: 'silk,saree' },
  { state: 'Bihar', art: 'Madhubani Canvas', category: 'Art & Paintings', keyword: 'madhubani' },
  { state: 'Chhattisgarh', art: 'Dhokra Metal Figurine', category: 'Artifacts', keyword: 'bronze,metal' },
  { state: 'Goa', art: 'Seashell Decor', category: 'Decor', keyword: 'seashell,decor' },
  { state: 'Gujarat', art: 'Bandhani Dupatta', category: 'Dresses', keyword: 'bandhani' },
  { state: 'Gujarat', art: 'Kutch Mirror Work Wall Hanging', category: 'Decor', keyword: 'mirror,embroidery' },
  { state: 'Haryana', art: 'Surahi Earthen Pot', category: 'Pottery', keyword: 'pottery,clay' },
  { state: 'Himachal Pradesh', art: 'Kullu Woolen Shawl', category: 'Handloom', keyword: 'shawl,wool' },
  { state: 'Jharkhand', art: 'Paitkar Scroll Painting', category: 'Art & Paintings', keyword: 'scroll,painting' },
  { state: 'Karnataka', art: 'Sandalwood Carved Elephant', category: 'Artifacts', keyword: 'sandalwood,carving' },
  { state: 'Karnataka', art: 'Mysore Silk Saree', category: 'Handloom', keyword: 'silk,saree' },
  { state: 'Kerala', art: 'Kathakali Wooden Mask', category: 'Artifacts', keyword: 'mask,wood' },
  { state: 'Kerala', art: 'Coir Floor Mat', category: 'Decor', keyword: 'coir,mat' },
  { state: 'Madhya Pradesh', art: 'Gond Tribal Painting', category: 'Art & Paintings', keyword: 'tribal,painting' },
  { state: 'Madhya Pradesh', art: 'Chanderi Silk Suit', category: 'Dresses', keyword: 'silk,dress' },
  { state: 'Maharashtra', art: 'Warli Art Canvas', category: 'Art & Paintings', keyword: 'warli' },
  { state: 'Maharashtra', art: 'Paithani Saree', category: 'Handloom', keyword: 'paithani,saree' },
  { state: 'Manipur', art: 'Longpi Black Pottery Bowl', category: 'Pottery', keyword: 'black,pottery' },
  { state: 'Meghalaya', art: 'Cane Sitting Chair', category: 'Handicrafts', keyword: 'cane,chair' },
  { state: 'Mizoram', art: 'Puan Traditional Fabric', category: 'Handloom', keyword: 'woven,fabric' },
  { state: 'Nagaland', art: 'Naga Beaded Necklace', category: 'Jewelry', keyword: 'bead,necklace' },
  { state: 'Odisha', art: 'Pattachitra Art', category: 'Art & Paintings', keyword: 'pattachitra' },
  { state: 'Odisha', art: 'Silver Filigree Earrings', category: 'Jewelry', keyword: 'silver,earrings' },
  { state: 'Punjab', art: 'Phulkari Embroidered Suit', category: 'Dresses', keyword: 'phulkari' },
  { state: 'Rajasthan', art: 'Blue Pottery Vase', category: 'Pottery', keyword: 'blue,pottery' },
  { state: 'Rajasthan', art: 'Meenakari Jhumka', category: 'Jewelry', keyword: 'jhumka,jewelry' },
  { state: 'Rajasthan', art: 'Block Print Kurti', category: 'Dresses', keyword: 'blockprint,kurti' },
  { state: 'Sikkim', art: 'Thangka Buddhist Painting', category: 'Art & Paintings', keyword: 'thangka' },
  { state: 'Tamil Nadu', art: 'Tanjore Painting', category: 'Art & Paintings', keyword: 'tanjore,painting' },
  { state: 'Tamil Nadu', art: 'Kanjeevaram Silk Saree', category: 'Handloom', keyword: 'kanjeevaram' },
  { state: 'Telangana', art: 'Pochampally Ikat Fabric', category: 'Handloom', keyword: 'ikat,fabric' },
  { state: 'Tripura', art: 'Bamboo Table Lamp', category: 'Decor', keyword: 'bamboo,lamp' },
  { state: 'Uttar Pradesh', art: 'Chikankari Kurta', category: 'Dresses', keyword: 'chikankari' },
  { state: 'Uttar Pradesh', art: 'Moradabad Brass Vase', category: 'Artifacts', keyword: 'brass,vase' },
  { state: 'Uttar Pradesh', art: 'Banarasi Silk Lehenga', category: 'Dresses', keyword: 'banarasi,lehenga' },
  { state: 'Uttarakhand', art: 'Aipan Folk Art', category: 'Art & Paintings', keyword: 'folk,art' },
  { state: 'West Bengal', art: 'Bankura Terracotta Horse', category: 'Pottery', keyword: 'terracotta,horse' },
  { state: 'West Bengal', art: 'Kantha Stitch Saree', category: 'Handloom', keyword: 'kantha,saree' },
  { state: 'Jammu & Kashmir', art: 'Pashmina Shawl', category: 'Handloom', keyword: 'pashmina' },
  { state: 'Jammu & Kashmir', art: 'Papier Mache Box', category: 'Handicrafts', keyword: 'papier,mache' }
];

const booleanOptions = [true, false];

const generateProducts = () => {
  let sql = 'INSERT INTO products (name, description, price, category, image_url, is_trending, source_platform, product_url) VALUES \n';
  const values = [];

  let globalId = 1;
  const uniqueNames = new Set();

  // Generate around 200 diverse unique products based on states
  while(values.length < 200) {
    const item = stateArts[Math.floor(Math.random() * stateArts.length)];
    const idSuffix = Math.floor(Math.random() * 900) + 100; // to prevent exact duplicate names
    
    // Create a unique name
    const adjectives = ['Authentic', 'Handcrafted', 'Premium', 'Traditional', 'Royal', 'Rural', 'Classic', 'Exclusive'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const name = `${adj} ${item.art} from ${item.state} ${idSuffix}`;
    
    if (uniqueNames.has(name)) continue;
    uniqueNames.add(name);

    const description = `Directly sourced from the local artisans of ${item.state}. This ${item.art.toLowerCase()} represents the true essence of Indian rural craftsmanship.`;
    const price = Math.floor(Math.random() * 5000) + 499;
    
    const imageUrl = `https://loremflickr.com/500/500/${item.keyword}?lock=${globalId}`;
    const trending = booleanOptions[Math.floor(Math.random() * booleanOptions.length)];
    
    // source_platform and product_url are null/empty since we removed affiliations
    values.push(`('${name}', '${description}', ${price}, '${item.category}', '${imageUrl}', ${trending}, '', '')`);
    globalId++;
  }

  sql += values.join(',\n') + ';';
  fs.writeFileSync('backend/src/main/resources/data.sql', sql);
  console.log('data.sql generated successfully with ' + values.length + ' unique Indian state products.');
};

generateProducts();
