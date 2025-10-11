#!/usr/bin/env python3
"""
Master Scraping Pipeline
Orchestrates the entire web scraping process in sequential phases.
"""
import subprocess
import sys
import os
from pathlib import Path

def check_phase2_completed():
    """Check if Phase 2 has already been completed"""
    category_dir = Path('category_product_urls')
    
    if not category_dir.exists():
        return False
    
    # Check if directory has .txt files
    txt_files = list(category_dir.glob('*.txt'))
    if not txt_files:
        return False
    
    # Count total URLs discovered
    total_urls = 0
    for file in txt_files:
        try:
            with open(file, 'r') as f:
                urls = [line.strip() for line in f if line.strip()]
                total_urls += len(urls)
        except:
            continue
    
    return total_urls > 0

def run_phase(script_name, description):
    """Run a Python script and handle errors"""
    print("\n" + "=" * 80)
    print(f"RUNNING: {description}")
    print("=" * 80 + "\n")
    
    try:
        result = subprocess.run(
            [sys.executable, script_name],
            check=True,
            capture_output=False
        )
        print(f"\n✅ {description} completed successfully!\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ {description} failed with error code {e.returncode}")
        return False
    except FileNotFoundError:
        print(f"\n❌ Script not found: {script_name}")
        return False

def check_requirements():
    """Check if required files and dependencies exist"""
    print("=" * 80)
    print("PRE-FLIGHT CHECKS")
    print("=" * 80)
    
    # Check for required files
    if not os.path.exists('all-urls.txt'):
        print("❌ Error: 'all-urls.txt' not found!")
        print("   Please ensure you have the category URLs file.")
        return False
    
    # Check for required scripts
    required_scripts = [
        'discover_product_urls.py',
        'scrape_product_data.py'
    ]
    
    for script in required_scripts:
        if not os.path.exists(script):
            print(f"❌ Error: Required script '{script}' not found!")
            return False
    
    # Check Python packages
    try:
        import playwright
        print("✅ Playwright is installed")
    except ImportError:
        print("❌ Playwright not installed!")
        print("   Run: pip install playwright")
        print("   Then: playwright install chromium")
        return False
    
    try:
        import requests
        print("✅ Requests is installed")
    except ImportError:
        print("❌ Requests not installed!")
        print("   Run: pip install requests")
        return False
    
    # Check if Chromium is installed
    print("\n📦 Checking Playwright browsers...")
    try:
        result = subprocess.run(
            [sys.executable, "-m", "playwright", "install", "chromium"],
            capture_output=True,
            text=True
        )
        print("✅ Playwright Chromium browser ready")
    except Exception as e:
        print(f"⚠️  Could not verify Playwright browser: {e}")
    
    print("\n✅ All pre-flight checks passed!\n")
    return True

def main():
    print("""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    HOWT FOODS WEB SCRAPING PIPELINE                          ║
║                                                                              ║
║  This pipeline will:                                                         ║
║  1. Discover all product URLs from categories                                ║
║  2. Scrape detailed product data                                             ║
║  3. Download product images                                                  ║
║  4. Generate structured JSON output                                          ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
""")
    
    # Run pre-flight checks
    if not check_requirements():
        print("\n❌ Pre-flight checks failed. Please fix the issues and try again.")
        sys.exit(1)
    
    # Phase 2: Discover Product URLs (skip if already completed)
    if check_phase2_completed():
        print("\n" + "=" * 80)
        print("✨ PHASE 2: Product URL Discovery - ALREADY COMPLETED")
        print("=" * 80)
        
        # Count existing URLs
        category_dir = Path('category_product_urls')
        txt_files = list(category_dir.glob('*.txt'))
        total_urls = 0
        for file in txt_files:
            with open(file, 'r') as f:
                urls = [line.strip() for line in f if line.strip()]
                total_urls += len(urls)
        
        print(f"\n✅ Found {len(txt_files)} category files with {total_urls} product URLs")
        print("⏭️  Skipping Phase 2...\n")
    else:
        if not run_phase(
            'discover_product_urls.py',
            'Phase 2: Product URL Discovery'
        ):
            print("\n❌ Pipeline failed at Phase 2")
            sys.exit(1)
    
    # Phase 3: Scrape Product Data
    if not run_phase(
        'scrape_product_data.py',
        'Phase 3: Product Data Scraping'
    ):
        print("\n❌ Pipeline failed at Phase 3")
        sys.exit(1)
    
    # Final summary
    print("\n" + "=" * 80)
    print("🎉 PIPELINE COMPLETED SUCCESSFULLY!")
    print("=" * 80)
    
    # Check outputs
    print("\n📂 Generated Files:")
    
    if os.path.exists('category_product_urls'):
        file_count = len(list(Path('category_product_urls').glob('*.txt')))
        print(f"   ✓ category_product_urls/ - {file_count} category files")
    
    if os.path.exists('product_images'):
        image_count = len(list(Path('product_images').glob('*')))
        print(f"   ✓ product_images/ - {image_count} images")
    
    if os.path.exists('scraped_products.json'):
        import json
        with open('scraped_products.json', 'r') as f:
            products = json.load(f)
        print(f"   ✓ scraped_products.json - {len(products)} products")
    
    print("\n✅ All data has been successfully scraped and organized!")
    print("✅ You can now use 'scraped_products.json' to generate your MedusaJS seed.")

if __name__ == '__main__':
    main()
