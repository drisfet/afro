import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * Seed script for Howt Foods - imports transformed product data
 * Run: npm run seed
 */
export default async function seedHowtFoodsData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["au"];

  logger.info("🏪 Seeding Howt Foods store data...");
  
  // ============================================================================
  // STEP 1: Store Configuration
  // ============================================================================
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "aud",
            is_default: true,
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  
  logger.info("✅ Store configured with AUD currency");

  // ============================================================================
  // STEP 2: Region Setup
  // ============================================================================
  logger.info("🌏 Seeding region data...");
  const regionModuleService = container.resolve(Modules.REGION);
  let region;
  
  // Check if Australia region already exists
  const existingRegions = await regionModuleService.listRegions({
    name: "Australia",
  });
  
  if (existingRegions.length > 0) {
    region = existingRegions[0];
    logger.info("✅ Australia region already exists - skipping creation");
  } else {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Australia",
            currency_code: "aud",
            countries,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = regionResult[0];
    logger.info("✅ Australia region created");
  }

  // ============================================================================
  // STEP 3: Tax Regions
  // ============================================================================
  logger.info("💰 Seeding tax regions...");
  try {
    await createTaxRegionsWorkflow(container).run({
      input: countries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
    logger.info("✅ Tax regions configured");
  } catch (error) {
    // Tax regions might already exist - this is okay
    logger.info("✅ Tax regions already exist - skipping creation");
  }

  // ============================================================================
  // STEP 4: Stock Location
  // ============================================================================
  logger.info("📦 Seeding stock location...");
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
  let stockLocation;
  
  // Check if stock location already exists
  const existingLocations = await stockLocationModuleService.listStockLocations({
    name: "Howt Foods Warehouse",
  });
  
  if (existingLocations.length > 0) {
    stockLocation = existingLocations[0];
    logger.info("✅ Stock location already exists - skipping creation");
  } else {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "Howt Foods Warehouse",
            address: {
              city: "Sydney",
              country_code: "AU",
              address_1: "123 Warehouse St",
            },
          },
        ],
      },
    });
    stockLocation = stockLocationResult[0];
    logger.info("✅ Stock location created");
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });
  
  logger.info("✅ Stock location created");

  // ============================================================================
  // STEP 5: Fulfillment & Shipping
  // ============================================================================
  logger.info("🚚 Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  // Check if fulfillment set already exists (could be from original seed or our script)
  let existingFulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({
    name: "Australian Warehouse delivery",
  });
  
  if (existingFulfillmentSets.length === 0) {
    existingFulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({
      name: "Australia Delivery",
    });
  }
  
  let fulfillmentSet;
  if (existingFulfillmentSets.length > 0) {
    fulfillmentSet = existingFulfillmentSets[0];
    logger.info("✅ Fulfillment set already exists - skipping creation");
  } else {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Australia Delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Australia",
          geo_zones: [
            {
              country_code: "au",
              type: "country",
            },
          ],
        },
      ],
    });
    logger.info("✅ Fulfillment set created");
  }

  // Link stock location to fulfillment set (may already exist)
  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    });
    logger.info("✅ Stock location linked to fulfillment set");
  } catch (error) {
    logger.info("✅ Stock location already linked to fulfillment set");
  }

  // Create shipping options (may already exist from original seed)
  try {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Ships in 2-3 business days",
            code: "standard",
          },
          prices: [
            {
              currency_code: "aud",
              amount: 1000, // $10 AUD
            },
            {
              region_id: region.id,
              amount: 1000,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
        {
          name: "Express Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Express",
            description: "Ships next business day",
            code: "express",
          },
          prices: [
            {
              currency_code: "aud",
              amount: 2000, // $20 AUD
            },
            {
              region_id: region.id,
              amount: 2000,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    });
    logger.info("✅ Shipping options created");
  } catch (error) {
    logger.info("✅ Shipping options already exist - skipping creation");
  }

  try {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: stockLocation.id,
        add: [defaultSalesChannel[0].id],
      },
    });
  } catch (error) {
    // Link may already exist
    logger.info("✅ Sales channel already linked to stock location");
  }

  // ============================================================================
  // STEP 6: Publishable API Key
  // ============================================================================
  logger.info("🔑 Seeding API key...");
  
  const apiKeyModuleService = container.resolve(Modules.API_KEY);
  let publishableApiKey;
  
  // Check for existing API keys
  const existingApiKeys = await apiKeyModuleService.listApiKeys({
    type: "publishable",
  });
  
  if (existingApiKeys.length > 0) {
    publishableApiKey = existingApiKeys[0];
    logger.info("✅ API key already exists - skipping creation");
  } else {
    const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
      container
    ).run({
      input: {
        api_keys: [
          {
            title: "Howt Foods Storefront",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });
    publishableApiKey = publishableApiKeyResult[0];
    logger.info("✅ API key created");
  }

  try {
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableApiKey.id,
        add: [defaultSalesChannel[0].id],
      },
    });
  } catch (error) {
    // Link may already exist
    logger.info("✅ Sales channel already linked to API key");
  }

  // ============================================================================
  // STEP 7: Load Transformed Product Data
  // ============================================================================
  logger.info("📚 Loading transformed product data...");
  
  const fs = await import("fs/promises");
  const path = await import("path");
  
  const categoriesPath = path.join(process.cwd(), "..", "medusa-categories.json");
  const productsPath = path.join(process.cwd(), "..", "medusa-products.json");
  
  let categoryHierarchy: any[];
  let transformedProducts: any[];
  
  try {
    categoryHierarchy = JSON.parse(await fs.readFile(categoriesPath, "utf-8"));
    transformedProducts = JSON.parse(await fs.readFile(productsPath, "utf-8"));
    logger.info(`✅ Loaded ${categoryHierarchy.length} categories and ${transformedProducts.length} products`);
  } catch (error) {
    logger.error("❌ Failed to load transformed data files!");
    logger.error("Please run: node transform-products.js");
    throw error;
  }

  // ============================================================================
  // STEP 7.5: Delete ALL Existing Categories and Products
  // ============================================================================
  logger.info("🧹 Removing all existing categories and products...");
  
  const productCategoryModuleService = container.resolve(Modules.PRODUCT);
  
  // Delete all products first
  const allExistingProducts = await productCategoryModuleService.listProducts({}, { take: 10000 });
  
  if (allExistingProducts.length > 0) {
    logger.info(`Found ${allExistingProducts.length} existing products to remove...`);
    
    try {
      const productIds = allExistingProducts.map(p => p.id);
      await productCategoryModuleService.softDeleteProducts(productIds);
      logger.info(`✅ Removed ${allExistingProducts.length} products`);
    } catch (error) {
      logger.warn(`⚠️  Error removing products: ${error.message}`);
    }
  }
  
  // Delete all categories (children first, then parents)
  const allExistingCategories = await productCategoryModuleService.listProductCategories({}, { take: 10000 });
  
  if (allExistingCategories.length > 0) {
    logger.info(`Found ${allExistingCategories.length} existing categories to remove...`);
    
    // Separate parent and child categories
    const childCategories = allExistingCategories.filter(c => c.parent_category_id);
    const parentCategories = allExistingCategories.filter(c => !c.parent_category_id);
    
    // Delete child categories first
    if (childCategories.length > 0) {
      try {
        const childIds = childCategories.map(c => c.id);
        await productCategoryModuleService.softDeleteProductCategories(childIds);
        logger.info(`✅ Removed ${childCategories.length} child categories`);
      } catch (error) {
        logger.warn(`⚠️  Error removing child categories: ${error.message}`);
      }
    }
    
    // Then delete parent categories
    if (parentCategories.length > 0) {
      try {
        const parentIds = parentCategories.map(c => c.id);
        await productCategoryModuleService.softDeleteProductCategories(parentIds);
        logger.info(`✅ Removed ${parentCategories.length} parent categories`);
      } catch (error) {
        logger.warn(`⚠️  Error removing parent categories: ${error.message}`);
      }
    }
  }
  
  if (allExistingProducts.length === 0 && allExistingCategories.length === 0) {
    logger.info(`✅ No existing data found`);
  }

  // ============================================================================
  // STEP 8: Create Product Categories
  // ============================================================================
  logger.info("📂 Creating product categories...");
  
  const categoryMap = new Map<string, any>();
  
  // Create parent categories first
  const parentCategories = categoryHierarchy.filter((c) => !c.parent);
  logger.info(`Creating ${parentCategories.length} parent categories...`);
  
  const { result: parentCategoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: parentCategories.map((c) => ({
        name: c.name,
        handle: c.handle,
        is_active: true,
      })),
    },
  });
  
  parentCategoryResult.forEach((cat: any) => {
    categoryMap.set(cat.name, cat);
  });
  
  logger.info(`✅ Created ${parentCategoryResult.length} parent categories`);

  // Create child categories with parent references
  const childCategories = categoryHierarchy.filter((c) => c.parent);
  logger.info(`Creating ${childCategories.length} child categories...`);
  
  let childCategoryCount = 0;
  for (const childCat of childCategories) {
    const parentCat = categoryMap.get(childCat.parent);
    if (parentCat) {
      try {
        const { result } = await createProductCategoriesWorkflow(container).run({
          input: {
            product_categories: [
              {
                name: childCat.name,
                handle: childCat.handle,
                is_active: true,
                parent_category_id: parentCat.id,
              },
            ],
          },
        });
        categoryMap.set(childCat.name, result[0]);
        childCategoryCount++;
      } catch (error) {
        logger.warn(`⚠️  Failed to create category "${childCat.name}": ${error.message}`);
      }
    } else {
      logger.warn(`⚠️  Parent category "${childCat.parent}" not found for "${childCat.name}"`);
    }
  }
  
  logger.info(`✅ Created ${childCategoryCount} child categories`);
  logger.info(`📊 Total categories: ${categoryMap.size}`);

  // ============================================================================
  // STEP 9: Create Products
  // ============================================================================
  logger.info("🛍️  Creating products...");
  
  const productsToCreate: any[] = [];
  const skippedProducts: any[] = [];
  
  for (const product of transformedProducts) {
    try {
      // Resolve category names to IDs
      const categoryIds = product.category_names
        .map((catName: string) => {
          const cat = categoryMap.get(catName);
          if (!cat) {
            logger.warn(`⚠️  Category "${catName}" not found for product "${product.title}"`);
          }
          return cat ? cat.id : null;
        })
        .filter((id: string | null) => id !== null);

      if (categoryIds.length === 0) {
        logger.warn(`⚠️  No valid categories for product "${product.title}", skipping...`);
        skippedProducts.push({ title: product.title, reason: "No valid categories" });
        continue;
      }

      productsToCreate.push({
        title: product.title,
        handle: product.handle,
        description: product.description,
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile.id,
        category_ids: categoryIds,
        // Add thumbnail and images - MedusaJS expects image URLs
        thumbnail: product.image_url || undefined,
        images: product.image_url ? [{ url: product.image_url }] : [],
        // Simple product with default option
        options: [
          {
            title: "Default",
            values: ["Standard"],
          },
        ],
        variants: [
          {
            title: "Default",
            sku: product.sku,
            // Disable inventory management for unlimited stock
            manage_inventory: false,
            allow_backorder: true,
            options: {
              Default: "Standard",
            },
            prices: [
              {
                amount: product.current_price,
                currency_code: "aud",
              },
            ],
          },
        ],
        sales_channels: [
          {
            id: defaultSalesChannel[0].id,
          },
        ],
        metadata: {
          original_url: product.original_url,
          has_sale_price: product.sale_price !== null,
          regular_price: product.regular_price,
          sale_price: product.sale_price,
        },
      });
    } catch (error) {
      logger.error(`❌ Error preparing product "${product.title}": ${error.message}`);
      skippedProducts.push({ title: product.title, reason: error.message });
    }
  }

  // Batch create products
  const batchSize = 50;
  const totalBatches = Math.ceil(productsToCreate.length / batchSize);
  let createdCount = 0;
  let failedCount = 0;
  
  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, productsToCreate.length);
    const batch = productsToCreate.slice(start, end);
    
    logger.info(`Creating batch ${i + 1}/${totalBatches} (products ${start + 1}-${end})...`);
    
    try {
      await createProductsWorkflow(container).run({
        input: {
          products: batch,
        },
      });
      createdCount += batch.length;
      logger.info(`✅ Batch ${i + 1} complete`);
    } catch (error) {
      logger.error(`❌ Batch ${i + 1} failed: ${error.message}`);
      failedCount += batch.length;
    }
  }
  
  logger.info("✅ Product creation complete");
  logger.info(`📊 Successfully created: ${createdCount} products`);
  if (failedCount > 0) {
    logger.warn(`⚠️  Failed to create: ${failedCount} products`);
  }
  if (skippedProducts.length > 0) {
    logger.warn(`⚠️  Skipped: ${skippedProducts.length} products`);
  }

  // ============================================================================
  // STEP 10: Set Inventory Levels (Optional - Set High for "Unlimited")
  // ============================================================================
  logger.info("📦 Setting inventory levels to high quantities (simulating unlimited)...");

  try {
    const { data: inventoryItems } = await query.graph({
      entity: "inventory_item",
      fields: ["id"],
    });

    if (inventoryItems && inventoryItems.length > 0) {
      const inventoryLevels = inventoryItems.map((item: any) => ({
        location_id: stockLocation.id,
        stocked_quantity: 999999, // Very high number to simulate unlimited
        inventory_item_id: item.id,
      }));

      await createInventoryLevelsWorkflow(container).run({
        input: {
          inventory_levels: inventoryLevels,
        },
      });

      logger.info(`✅ Set inventory for ${inventoryLevels.length} items`);
    } else {
      logger.info("ℹ️  No inventory items found (products may have inventory management disabled)");
    }
  } catch (error) {
    logger.warn(`⚠️  Could not set inventory levels: ${error.message}`);
    logger.info("ℹ️  This is expected if inventory management is disabled for variants");
  }

  // ============================================================================
  // FINAL SUMMARY
  // ============================================================================
  logger.info("\n" + "=".repeat(70));
  logger.info("🎉 SEEDING COMPLETE - HOWT FOODS");
  logger.info("=".repeat(70));
  logger.info(`✅ Categories: ${categoryMap.size}`);
  logger.info(`✅ Products: ${createdCount}`);
  logger.info(`ℹ️  Inventory: Disabled (unlimited stock enabled)`);
  logger.info(`🌏 Region: Australia (AUD)`);
  logger.info(`🔑 API Key: ${publishableApiKey.id}`);
  logger.info("=".repeat(70));
  
  if (skippedProducts.length > 0) {
    logger.warn("\n⚠️  Some products were skipped. Check logs above for details.");
  }
}
