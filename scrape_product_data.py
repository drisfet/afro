"""
Phase 3: Product Data Scraping
Uses Playwright to scrape detailed product information from product pages.
"""
import os
import json
import re
import time
import hashlib
import requests
from pathlib import Path
from urllib.parse import urlparse, urljoin
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# Configuration
BASE_URL = 'https://howtfoods.com.au'
PRODUCT_URLS_DIR = 'category_product_urls'
IMAGE_DIR = 'product_images_organized'  # Organized by category
OUTPUT_FILE = 'scraped_products.json'
FAILED_URLS_FILE = 'failed_products.txt'  # Log failed scrapes
REQUEST_DELAY = 0.5  # seconds between requests
HEADLESS = True
MAX_RETRIES = 2

# Setup
Path(IMAGE_DIR).mkdir(exist_ok=True)

def sanitize_filename(url):
    """Generate safe filename from URL"""
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path)
    # Keep extension
    name, ext = os.path.splitext(filename)
    # Clean name
    name = re.sub(r'[^\w\-]', '_', name)[:100]
    return f"{name}{ext}" if ext else f"{name}.jpg"

def download_image(image_url, product_handle, categories=None):
    """
    Download product image with organized folder structure by category
    
    Args:
        image_url: URL of the image to download
        product_handle: Product handle (slug)
        categories: List of product categories for organization
    
    Returns:
        Dictionary with path and metadata, or None if failed
    """
    if not image_url:
        return None
    
    try:
        # Clean URL
        image_url = image_url.split('?')[0]
        
        # Skip placeholder images
        if 'placeholder' in image_url.lower():
            print(f"       ⚠️  Skipping placeholder image")
            return None
        
        # Determine category folder
        category_folder = "uncategorized"
        if categories and len(categories) > 0:
            # Sanitize category name for folder
            category_folder = re.sub(r'[^\w\s-]', '', categories[0].lower())
            category_folder = re.sub(r'[-\s]+', '-', category_folder).strip('-')
        
        # Generate clean filename: handle_original-filename.jpg
        original_filename = sanitize_filename(image_url)
        organized_filename = f"{product_handle}_{original_filename}"
        
        # Create category directory
        organized_dir = os.path.join(IMAGE_DIR, category_folder)
        os.makedirs(organized_dir, exist_ok=True)
        organized_filepath = os.path.join(organized_dir, organized_filename)
        
        # Check if already downloaded
        if os.path.exists(organized_filepath):
            print(f"       ↻ Image exists: {category_folder}/{organized_filename}")
            return {
                'url': image_url,
                'path': organized_filepath,
                'category': category_folder,
                'filename': organized_filename,
                'relative_path': f"{category_folder}/{organized_filename}"
            }
        
        # Download with headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://howtfoods.com.au/'
        }
        response = requests.get(image_url, headers=headers, timeout=15, stream=True)
        response.raise_for_status()
        
        # Verify it's an image
        content_type = response.headers.get('content-type', '')
        if 'image' not in content_type.lower():
            print(f"       ⚠️  Not an image: {content_type}")
            return None
        
        # Save to organized location
        with open(organized_filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"       ✓ Downloaded: {category_folder}/{organized_filename}")
        
        return {
            'url': image_url,
            'path': organized_filepath,
            'category': category_folder,
            'filename': organized_filename,
            'relative_path': f"{category_folder}/{organized_filename}"
        }
        
        print(f"       ✓ Downloaded: {category_folder}/{organized_filename}")
        
        return {
            'url': image_url,
            'flat_path': flat_filepath,
            'organized_path': organized_filepath,
            'category': category_folder,
            'filename': organized_filename
        }
        
    except Exception as e:
        print(f"       ⚠️  Failed to download image: {e}")
        return None
        return filepath
        
    except Exception as e:
        print(f"       ⚠️  Failed to download image: {e}")
        return None

def extract_price(price_text):
    """Extract numeric price from text"""
    if not price_text:
        return None
    
    # Remove currency symbols and extract number
    match = re.search(r'[\d,]+\.?\d*', price_text.replace(',', ''))
    if match:
        return float(match.group())
    return None

def log_failed_url(url, reason):
    """Log failed URLs to file for manual review"""
    try:
        with open(FAILED_URLS_FILE, 'a', encoding='utf-8') as f:
            f.write(f"{url} | {reason}\n")
    except Exception:
        pass  # Silently fail if can't log

def scrape_product_page(page, product_url):
    """Scrape detailed information from a product page"""
    try:
        # Navigate to product page
        page.goto(product_url, wait_until='networkidle', timeout=30000)
        time.sleep(2)  # Let page fully render (increased from 1.5s)
        
        # Extract product handle from URL
        handle = urlparse(product_url).path.split('/')[-2]
        
        # Extract product name - use simple h1 selector (more reliable)
        name = None
        name_selectors = [
            'h1',  # Simple, works on most pages
            'h1.product_title',
            'h1.product-title',
            '.product_title',
            'h1[itemprop="name"]',
            '.product h1',
            'article.product h1'
        ]
        for selector in name_selectors:
            elem = page.query_selector(selector)
            if elem:
                name = elem.inner_text().strip()
                if name and len(name) > 0:  # Make sure it's not empty
                    break
        
        if not name:
            # Check if it's a 404 page
            if 'error404' in page.content().lower() or '404' in page.title().lower():
                reason = "404 Page"
                print(f"       ⚠️  {reason}")
            else:
                reason = f"No product name (Title: {page.title()[:50]})"
                print(f"       ⚠️  Could not find product name (Page title: {page.title()[:50]}...)")
            
            log_failed_url(product_url, reason)
            return None
        
        # Extract categories
        categories = []
        cat_links = page.query_selector_all('a[rel="tag"], .posted_in a, .product-categories a')
        for link in cat_links:
            cat_name = link.inner_text().strip()
            if cat_name and cat_name not in [',', '']:
                categories.append(cat_name)
        
        # Extract prices
        regular_price = None
        sale_price = None
        
        # Try to find sale price (discounted price)
        sale_elem = page.query_selector('ins .woocommerce-Price-amount, .price ins')
        if sale_elem:
            sale_price = extract_price(sale_elem.inner_text())
        
        # Try to find regular price
        regular_elem = page.query_selector('del .woocommerce-Price-amount, .price del')
        if regular_elem:
            regular_price = extract_price(regular_elem.inner_text())
        
        # If no sale, just get the main price
        if not sale_price and not regular_price:
            price_elem = page.query_selector('.woocommerce-Price-amount, .price .amount, p.price')
            if price_elem:
                price = extract_price(price_elem.inner_text())
                regular_price = price
        
        # Extract description
        description = None
        desc_selectors = [
            '.woocommerce-product-details__short-description',
            '[itemprop="description"]',
            '.product-description',
            '#tab-description'
        ]
        for selector in desc_selectors:
            elem = page.query_selector(selector)
            if elem:
                description = elem.inner_text().strip()[:500]  # Limit length
                break
        
        # INTELLIGENT IMAGE EXTRACTION
        # Strategy: Extract images from product-specific areas only, not entire page
        # This avoids getting images from related products
        
        def get_full_size_url(url):
            """Convert sized URL to full-size version"""
            return re.sub(r'-\d+x\d+(?=\.)', '', url)
        
        def get_base_url(url):
            """Get base URL without size suffix"""
            return re.sub(r'-\d+x\d+\.', '.', url)
        
        # Step 1: Extract HTML from product-specific areas only
        product_html_parts = []
        
        # Gallery area
        gallery = page.query_selector('.woocommerce-product-gallery, .product-images, .images')
        if gallery:
            product_html_parts.append(gallery.inner_html())
        
        # Product summary (often contains metadata)
        summary = page.query_selector('.summary, .entry-summary, .product-info')
        if summary:
            product_html_parts.append(summary.inner_html())
        
        # JSON-LD structured data
        scripts = page.query_selector_all('script[type="application/ld+json"]')
        for script in scripts:
            content = script.inner_text()
            if 'image' in content:
                product_html_parts.append(content)
        
        # Combine product-specific HTML
        product_html = ' '.join(product_html_parts)
        
        # Step 2: Extract all image URLs from product HTML only
        product_images = re.findall(
            r'https://howtfoods\.com\.au/wp-content/uploads/[^\"\'\s<>]+\.(?:jpg|jpeg|png)',
            product_html,
            re.IGNORECASE
        )
        
        # Step 3: Group by base URL and score
        image_groups = {}
        for url in product_images:
            base = get_base_url(url)
            if base not in image_groups:
                image_groups[base] = []
            image_groups[base].append(url)
        
        # Step 4: Score each image group
        def score_image_group(base_url, variants):
            """Score image relevance - higher is better"""
            score = 0
            url_lower = base_url.lower()
            
            # Heavy penalties for non-product images
            penalties = ['placeholder', 'logo', 'icon', 'cropped', 'payment', 'card', 'banner']
            if any(bad in url_lower for bad in penalties):
                return -1000
            
            # Bonus if product handle appears in image URL
            handle_parts = handle.replace('-', '').replace('_', '').lower()
            image_name = base_url.split('/')[-1].replace('-', '').replace('_', '').lower()
            
            # Check for keyword overlap
            handle_words = set(handle.split('-'))
            image_words = set(re.findall(r'[a-z]+', image_name))
            overlap = len(handle_words & image_words)
            if overlap > 0:
                score += overlap * 200  # Strong bonus for name match
            
            # Prefer full-size images
            full_size_variants = [v for v in variants if not re.search(r'-\d+x\d+', v)]
            if full_size_variants:
                score += 200
            
            # More variants = likely a real product image
            score += len(variants) * 10
            
            # Recent uploads (year in URL) get bonus
            if '/2025/' in url_lower or '/2024/' in url_lower:
                score += 50
            
            return score
        
        # Step 5: Score and select best image
        scored_groups = [(base, variants, score_image_group(base, variants)) 
                        for base, variants in image_groups.items()]
        scored_groups.sort(key=lambda x: x[2], reverse=True)
        
        # Select best image (full-size version)
        image_url = None
        if scored_groups and scored_groups[0][2] > 0:
            best_base = scored_groups[0][0]
            image_url = get_full_size_url(best_base)
        
        # Even if no good image found, still scrape the product data
        # (some products may only have placeholders)
        
        # Check for "Out of Stock"
        out_of_stock = False
        stock_elem = page.query_selector('.out-of-stock, .stock.out-of-stock')
        if stock_elem:
            out_of_stock = True
        
        # Extract SKU
        sku = None
        sku_elem = page.query_selector('.sku')
        if sku_elem:
            sku = sku_elem.inner_text().strip()
        
        # Create product data
        product = {
            'url': product_url,
            'handle': handle,
            'name': name,
            'categories': categories,
            'regular_price': regular_price,
            'sale_price': sale_price,
            'current_price': sale_price if sale_price else regular_price,
            'description': description,
            'image_url': image_url,
            'image_path': None,
            'sku': sku,
            'in_stock': not out_of_stock
        }
        
        # Download image with category organization
        if image_url:
            image_data = download_image(image_url, handle, categories)
            if image_data:
                product['image_path'] = image_data.get('path')  # Full path
                product['image_relative_path'] = image_data.get('relative_path')  # category/filename
                product['image_category'] = image_data.get('category')
                product['image_filename'] = image_data.get('filename')
        
        return product
        
    except PlaywrightTimeout:
        print(f"       ⚠️  Timeout loading product")
        log_failed_url(product_url, "Timeout")
        return None
    except Exception as e:
        print(f"       ⚠️  Error scraping product: {e}")
        log_failed_url(product_url, f"Error: {str(e)[:100]}")
        return None

def load_all_product_urls():
    """Load all product URLs from category files"""
    all_urls = set()
    
    if not os.path.exists(PRODUCT_URLS_DIR):
        print(f"❌ Error: Directory '{PRODUCT_URLS_DIR}' not found!")
        return []
    
    files = list(Path(PRODUCT_URLS_DIR).glob('*.txt'))
    
    for file in files:
        with open(file, 'r') as f:
            urls = [line.strip() for line in f if line.strip()]
            all_urls.update(urls)
    
    return sorted(all_urls)

def main():
    print("=" * 80)
    print("PHASE 3: PRODUCT DATA SCRAPING")
    print("=" * 80)
    
    # Load all product URLs
    product_urls = load_all_product_urls()
    
    if not product_urls:
        print("❌ No product URLs found!")
        return
    
    print(f"\n📋 Found {len(product_urls)} unique products to scrape")
    
    # Check if we should resume
    scraped_products = []
    scraped_urls = set()
    
    if os.path.exists(OUTPUT_FILE):
        print(f"\n📂 Found existing data file. Loading...")
        with open(OUTPUT_FILE, 'r') as f:
            scraped_products = json.load(f)
            scraped_urls = {p['url'] for p in scraped_products}
        print(f"   ✓ Loaded {len(scraped_products)} previously scraped products")
    
    # Filter out already scraped
    urls_to_scrape = [url for url in product_urls if url not in scraped_urls]
    
    if not urls_to_scrape:
        print("\n✅ All products already scraped!")
        return
    
    print(f"   → {len(urls_to_scrape)} new products to scrape")
    
    # Start scraping
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS)
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport={'width': 1920, 'height': 1080}
        )
        page = context.new_page()
        
        success_count = 0
        failed_count = 0
        
        for i, url in enumerate(urls_to_scrape, 1):
            print(f"\n[{i}/{len(urls_to_scrape)}] {url}")
            
            product = None
            for attempt in range(MAX_RETRIES):
                try:
                    product = scrape_product_page(page, url)
                    if product:
                        break
                    elif attempt < MAX_RETRIES - 1:
                        print(f"       ↻ Retry {attempt + 1}/{MAX_RETRIES}")
                        time.sleep(2)
                except Exception as e:
                    print(f"       ⚠️  Attempt {attempt + 1} failed: {e}")
                    if attempt < MAX_RETRIES - 1:
                        time.sleep(2)
            
            if product:
                scraped_products.append(product)
                success_count += 1
                print(f"     ✅ {product['name']} - ${product['current_price']}")
            else:
                failed_count += 1
                print(f"     ❌ Failed to scrape")
            
            # Save progress every 10 products
            if i % 10 == 0:
                with open(OUTPUT_FILE, 'w') as f:
                    json.dump(scraped_products, f, indent=2)
                print(f"\n     💾 Progress saved ({len(scraped_products)} products)")
            
            # Rate limiting
            time.sleep(REQUEST_DELAY)
        
        context.close()
        browser.close()
    
    # Final save
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(scraped_products, f, indent=2)
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"✅ Total products scraped: {len(scraped_products)}")
    print(f"✅ Successful: {success_count}")
    print(f"❌ Failed: {failed_count}")
    print(f"💾 Data saved to: {OUTPUT_FILE}")
    
    # Show failed URLs if any
    if os.path.exists(FAILED_URLS_FILE):
        with open(FAILED_URLS_FILE, 'r') as f:
            failed_lines = f.readlines()
        if failed_lines:
            print(f"\n⚠️  Failed URLs logged to: {FAILED_URLS_FILE}")
            print(f"   Total failed: {len(failed_lines)}")
            print(f"   Review this file for manual processing")
    
    # Category breakdown
    category_counts = {}
    for product in scraped_products:
        for cat in product['categories']:
            category_counts[cat] = category_counts.get(cat, 0) + 1
    
    if category_counts:
        print(f"\n📊 Products by category:")
        for cat, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"   {cat}: {count}")

if __name__ == '__main__':
    main()
