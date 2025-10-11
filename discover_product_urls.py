"""
Phase 2: Product URL Discovery
Uses Playwright to discover all product URLs from category pages.
"""
import os
import re
import time
from pathlib import Path
from urllib.parse import urlparse, urljoin
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# Configuration
BASE_URL = 'https://howtfoods.com.au'
CATEGORIES_FILE = 'all-urls.txt'
OUTPUT_DIR = 'category_product_urls'
REQUEST_DELAY = 1  # seconds between requests
HEADLESS = True  # Set to False for debugging

# Setup output directory
Path(OUTPUT_DIR).mkdir(exist_ok=True)

def sanitize_filename(url):
    """Convert URL to safe filename"""
    parsed = urlparse(url)
    path = parsed.path.strip('/').replace('/', '_')
    # Remove product-category prefix and clean up
    path = path.replace('product-category_', '')
    return f"{path}.txt"

def extract_product_urls(page):
    """Extract product URLs from the current page"""
    product_urls = set()
    
    try:
        # Wait for products to load
        page.wait_for_selector('article.product, li.product, .product-item', timeout=5000)
        
        # Multiple selectors to catch different product link patterns
        selectors = [
            'a.woocommerce-LoopProduct-link',
            'a[href*="/product/"]',
            'h3 a[href*="/product/"]',
            '.product h3 a',
            '.product-title a'
        ]
        
        for selector in selectors:
            links = page.query_selector_all(selector)
            for link in links:
                href = link.get_attribute('href')
                if href and '/product/' in href and '/product-category/' not in href:
                    # Clean URL
                    full_url = urljoin(BASE_URL, href)
                    # Remove query parameters
                    full_url = full_url.split('?')[0]
                    product_urls.add(full_url)
        
    except PlaywrightTimeout:
        print("      [!] Timeout waiting for products")
    except Exception as e:
        print(f"      [!] Error extracting URLs: {e}")
    
    return product_urls

def check_for_next_page(page):
    """Check if there's a next page and return its URL"""
    try:
        # Common pagination selectors
        next_selectors = [
            'a.next.page-numbers',
            'a[rel="next"]',
            '.pagination a.next',
            'a:has-text("Next")',
            'a:has-text("→")'
        ]
        
        for selector in next_selectors:
            next_link = page.query_selector(selector)
            if next_link:
                href = next_link.get_attribute('href')
                if href:
                    return urljoin(BASE_URL, href)
        
    except Exception as e:
        print(f"      [!] Error checking pagination: {e}")
    
    return None

def scrape_category(browser, category_url):
    """Scrape all product URLs from a category, handling pagination"""
    print(f"\n  📂 Processing: {category_url}")
    
    all_product_urls = set()
    visited_pages = set()
    current_url = category_url
    page_num = 1
    
    context = browser.new_context(
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport={'width': 1920, 'height': 1080}
    )
    page = context.new_page()
    
    try:
        while current_url and current_url not in visited_pages:
            print(f"     Page {page_num}: {current_url}")
            visited_pages.add(current_url)
            
            try:
                # Navigate to page
                page.goto(current_url, wait_until='networkidle', timeout=30000)
                time.sleep(2)  # Let JavaScript fully render
                
                # Extract product URLs
                products = extract_product_urls(page)
                all_product_urls.update(products)
                print(f"     ✓ Found {len(products)} products on this page (Total: {len(all_product_urls)})")
                
                # Check for next page
                next_url = check_for_next_page(page)
                if next_url and next_url not in visited_pages:
                    current_url = next_url
                    page_num += 1
                    time.sleep(REQUEST_DELAY)
                else:
                    break
                    
            except PlaywrightTimeout:
                print(f"     [!] Timeout loading page")
                break
            except Exception as e:
                print(f"     [!] Error: {e}")
                break
    
    finally:
        context.close()
    
    return all_product_urls

def main():
    print("=" * 80)
    print("PHASE 2: PRODUCT URL DISCOVERY")
    print("=" * 80)
    
    # Read category URLs
    if not os.path.exists(CATEGORIES_FILE):
        print(f"❌ Error: {CATEGORIES_FILE} not found!")
        return
    
    with open(CATEGORIES_FILE, 'r') as f:
        category_urls = [line.strip() for line in f if line.strip()]
    
    print(f"\n📋 Found {len(category_urls)} categories to process")
    
    # Start Playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS)
        
        for i, category_url in enumerate(category_urls, 1):
            print(f"\n[{i}/{len(category_urls)}]", end=" ")
            
            try:
                # Scrape category
                product_urls = scrape_category(browser, category_url)
                
                if product_urls:
                    # Save to file
                    filename = sanitize_filename(category_url)
                    filepath = os.path.join(OUTPUT_DIR, filename)
                    
                    with open(filepath, 'w') as f:
                        for url in sorted(product_urls):
                            f.write(f"{url}\n")
                    
                    print(f"  ✅ Saved {len(product_urls)} URLs to: {filename}")
                else:
                    print(f"  ⚠️  No products found")
                
                # Rate limiting
                if i < len(category_urls):
                    time.sleep(REQUEST_DELAY)
                    
            except Exception as e:
                print(f"  ❌ Error processing category: {e}")
                continue
        
        browser.close()
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    
    total_products = 0
    files = list(Path(OUTPUT_DIR).glob('*.txt'))
    
    for file in files:
        with open(file, 'r') as f:
            count = len(f.readlines())
            total_products += count
            print(f"  {file.name}: {count} products")
    
    print(f"\n✅ Total unique product URLs discovered: {total_products}")
    print(f"✅ Saved to {len(files)} category files in '{OUTPUT_DIR}/'")

if __name__ == '__main__':
    main()
