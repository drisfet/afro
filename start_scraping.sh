#!/bin/bash
#
# Quick Start Script for HOWT Foods Web Scraping
# Run this to execute the entire scraping pipeline
#

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                              ║"
echo "║               HOWT FOODS WEB SCRAPING - QUICK START                          ║"
echo "║                                                                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed!"
    exit 1
fi

# Check if all-urls.txt exists
if [ ! -f "all-urls.txt" ]; then
    echo "❌ Error: all-urls.txt not found!"
    echo "   Please ensure the category URLs file exists."
    exit 1
fi

# Run the pipeline
echo "🚀 Starting scraping pipeline..."
echo ""

python3 run_scraping_pipeline.py

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Scraping completed successfully!"
    echo ""
    echo "📂 Check these directories for results:"
    echo "   - category_product_urls/ - Product URLs organized by category"
    echo "   - product_images/ - Downloaded product images"
    echo "   - scraped_products.json - Complete product database"
    echo ""
else
    echo ""
    echo "❌ Scraping failed. Check the error messages above."
    exit 1
fi
