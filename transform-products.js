/**
 * Transform scraped products JSON to MedusaJS-compatible format
 * 
 * This script reads scraped_products.json and outputs:
 * - medusa-products.json: Products in MedusaJS format
 * - medusa-categories.json: Category hierarchy in MedusaJS format
 */

const fs = require('fs');
const path = require('path');

// Category hierarchy based on the handoff documentation
const categoryHierarchy = [
  // Top-level categories
  { name: "Hair Products", handle: "hair-products", parent: null },
  { name: "Personal hygiene", handle: "personal-hygiene", parent: null },
  { name: "Fruits and Vegetables", handle: "fruits-and-vegetables", parent: null },
  { name: "Meat and Poultry", handle: "meat-and-poultry", parent: null },
  { name: "Fish and Seafood", handle: "fish-and-seafood", parent: null },
  { name: "Sauces and Spices", handle: "sauces-and-spices", parent: null },
  { name: "Canned Food and Oil", handle: "canned-food-and-oil", parent: null },
  { name: "Bakery", handle: "bakery", parent: null },
  { name: "Cereals", handle: "cereals", parent: null },
  { name: "Provisions", handle: "provisions", parent: null },
  { name: "Drinks", handle: "drinks", parent: null },
  { name: "Dairy and Eggs", handle: "dairy-and-eggs", parent: null },
  { name: "Packets", handle: "packets", parent: null },
  { name: "Condiments", handle: "condiments", parent: null },
  { name: "Grains", handle: "grains", parent: null },
  { name: "Swallows", handle: "swallows", parent: null },
  { name: "Uncategorized", handle: "uncategorized", parent: null },
  
  // Hair Products children
  { name: "Hair Oil", handle: "hair-oil", parent: "Hair Products" },
  { name: "Hair Cream", handle: "hair-cream", parent: "Hair Products" },
  { name: "Hair Conditioner", handle: "hair-conditioner", parent: "Hair Products" },
  { name: "Relaxer", handle: "relaxer", parent: "Hair Products" },
  { name: "Hair gel", handle: "hair-gel", parent: "Hair Products" },
  { name: "Hair", handle: "hair", parent: "Hair Products" },
  { name: "Shampoo", handle: "shampoo", parent: "Personal hygiene" },
  
  // Personal hygiene children
  { name: "Body Oils", handle: "body-oils", parent: "Personal hygiene" },
  { name: "Lotions and Creams", handle: "lotions-and-creams", parent: "Personal hygiene" },
  { name: "Soaps", handle: "soaps", parent: "Personal hygiene" },
  
  // Fruits and Vegetables children
  { name: "Vegetables", handle: "vegetables", parent: "Fruits and Vegetables" },
  { name: "Fruits", handle: "fruits", parent: "Fruits and Vegetables" },
  { name: "Leaves", handle: "leaves", parent: "Fruits and Vegetables" },
  
  // Meat and Poultry children
  { name: "Fresh meat", handle: "fresh-meat", parent: "Meat and Poultry" },
  { name: "Chicken", handle: "chicken", parent: "Meat and Poultry" },
  
  // Fish and Seafood children
  { name: "Dry Fish", handle: "dry-fish", parent: "Fish and Seafood" },
  { name: "Dry Prawns", handle: "dry-prawns", parent: "Fish and Seafood" },
  { name: "Fresh Prawns", handle: "fresh-prawns", parent: "Fish and Seafood" },
  { name: "Frozen Foods", handle: "frozen-foods", parent: "Fish and Seafood" },
  
  // Sauces and Spices children
  { name: "Sauces", handle: "sauces", parent: "Sauces and Spices" },
  { name: "Soup Spices", handle: "soup-spices", parent: "Sauces and Spices" },
  { name: "Tomato paste", handle: "tomato-paste", parent: "Sauces and Spices" },
  
  // Canned Food and Oil children
  { name: "Oils and vinegar", handle: "oils-and-vinegar", parent: "Canned Food and Oil" },
  
  // Bakery children
  { name: "Snacks", handle: "snacks", parent: "Bakery" },
  { name: "Sweets and Chips", handle: "sweets-and-chips", parent: "Bakery" },
  
  // Provisions children
  { name: "Nuts", handle: "nuts", parent: "Provisions" },
  { name: "Sweets", handle: "sweets", parent: "Provisions" },
  
  // Drinks children
  { name: "Herbal Drinks", handle: "herbal-drinks", parent: "Drinks" },
  { name: "Soft Drinks and Juice", handle: "soft-drinks-and-juice", parent: "Drinks" },
];

function transformProducts() {
  console.log('🔄 Reading scraped products...');
  const scrapedPath = path.join(__dirname, 'scraped_products.json');
  const scrapedProducts = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
  
  console.log(`✅ Loaded ${scrapedProducts.length} products`);

  const transformedProducts = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  scrapedProducts.forEach((product, index) => {
    try {
      // Validate required fields
      if (!product.name || !product.handle) {
        throw new Error(`Missing required fields (name or handle)`);
      }

      // MedusaJS v2 uses decimal prices (dollars), not cents
      // Keep prices as-is (no multiplication by 100)
      const regularPrice = typeof product.regular_price === 'number'
        ? product.regular_price
        : (product.regular_price ? parseFloat(product.regular_price) : 0);
      
      const salePrice = product.sale_price
        ? (typeof product.sale_price === 'number'
            ? product.sale_price
            : parseFloat(product.sale_price))
        : null;
      
      const currentPrice = typeof product.current_price === 'number'
        ? product.current_price
        : (product.current_price ? parseFloat(product.current_price) : regularPrice);

      // Validate prices
      if (currentPrice <= 0) {
        throw new Error(`Invalid price: ${currentPrice}`);
      }

      // Clean up categories (remove duplicates)
      const uniqueCategories = [...new Set(product.categories)];

      // Validate categories exist in hierarchy
      const validCategories = uniqueCategories.filter(catName => {
        const exists = categoryHierarchy.some(c => c.name === catName);
        if (!exists) {
          console.warn(`⚠️  Product "${product.name}": Unknown category "${catName}"`);
        }
        return exists;
      });

      if (validCategories.length === 0) {
        validCategories.push("Uncategorized");
      }

      const transformedProduct = {
        // Basic info
        title: product.name.trim(),
        handle: product.handle.toLowerCase().trim(),
        description: product.description?.trim() || "",
        
        // Categories (will be resolved to IDs in seed script)
        category_names: validCategories,
        
        // Pricing (in dollars, not cents - MedusaJS v2 format)
        regular_price: regularPrice,
        sale_price: salePrice,
        current_price: currentPrice,
        
        // Images
        image_url: product.image_url || null,
        image_path: product.image_path || null,
        
        // Inventory
        sku: product.sku || product.handle.toUpperCase(),
        in_stock: product.in_stock !== false, // default to true
        
        // Metadata
        original_url: product.url,
      };

      transformedProducts.push(transformedProduct);
      successCount++;

    } catch (error) {
      errorCount++;
      errors.push({
        index,
        product_name: product.name || 'Unknown',
        handle: product.handle || 'Unknown',
        error: error.message,
      });
      console.error(`❌ Error transforming product #${index + 1} (${product.name}): ${error.message}`);
    }
  });

  // Write transformed products
  const productsOutputPath = path.join(__dirname, 'medusa-products.json');
  fs.writeFileSync(
    productsOutputPath, 
    JSON.stringify(transformedProducts, null, 2),
    'utf-8'
  );

  // Write categories
  const categoriesOutputPath = path.join(__dirname, 'medusa-categories.json');
  fs.writeFileSync(
    categoriesOutputPath,
    JSON.stringify(categoryHierarchy, null, 2),
    'utf-8'
  );

  // Write error log if any
  if (errors.length > 0) {
    const errorsOutputPath = path.join(__dirname, 'transformation-errors.json');
    fs.writeFileSync(
      errorsOutputPath,
      JSON.stringify(errors, null, 2),
      'utf-8'
    );
    console.log(`\n⚠️  ${errors.length} errors written to transformation-errors.json`);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TRANSFORMATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully transformed: ${successCount} products`);
  console.log(`❌ Failed to transform: ${errorCount} products`);
  console.log(`📁 Output files:`);
  console.log(`   - ${productsOutputPath}`);
  console.log(`   - ${categoriesOutputPath}`);
  console.log('='.repeat(60));

  return {
    success: errorCount === 0,
    totalProducts: scrapedProducts.length,
    successCount,
    errorCount,
    transformedProducts,
    errors,
  };
}

// Run transformation
if (require.main === module) {
  try {
    const result = transformProducts();
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

module.exports = { transformProducts, categoryHierarchy };
