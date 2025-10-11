#!/usr/bin/env python3
"""
Site Structure Mapper
Maps entire website structure: pages, navigation, menus, footer links, etc.
Uses Playwright to capture JavaScript-rendered content.
"""

from playwright.sync_api import sync_playwright
import json
import time
from urllib.parse import urljoin, urlparse
from collections import defaultdict

BASE_URL = "https://howtfoods.com.au"
OUTPUT_FILE = "site_structure_map.json"
VISITED = set()
TO_VISIT = set([BASE_URL])

def is_same_domain(url):
    """Check if URL is from same domain"""
    parsed = urlparse(url)
    return parsed.netloc == '' or 'howtfoods.com.au' in parsed.netloc

def normalize_url(url):
    """Normalize URL for comparison"""
    parsed = urlparse(url)
    # Remove fragments and trailing slashes
    clean_path = parsed.path.rstrip('/')
    return f"{parsed.scheme}://{parsed.netloc}{clean_path}"

def categorize_url(url):
    """Categorize URL by type"""
    path = urlparse(url).path.lower()
    
    if not path or path == '/':
        return 'homepage'
    elif '/product/' in path:
        return 'product'
    elif '/product-category/' in path:
        return 'category'
    elif '/cart' in path or '/checkout' in path:
        return 'ecommerce'
    elif '/my-account' in path:
        return 'account'
    elif '/about' in path:
        return 'about'
    elif '/contact' in path:
        return 'contact'
    elif '/privacy' in path or '/terms' in path or '/policy' in path:
        return 'legal'
    elif '/blog' in path or path.startswith('/20'):
        return 'blog'
    else:
        return 'other'

def extract_site_structure(page):
    """Extract comprehensive site structure from page"""
    structure = {
        'url': page.url,
        'title': page.title(),
        'navigation': {},
        'footer': {},
        'metadata': {},
        'links': []
    }
    
    # Extract main navigation
    nav_selectors = [
        'nav.main-navigation',
        'nav.primary-navigation', 
        '.main-menu',
        'header nav',
        '#site-navigation'
    ]
    
    for selector in nav_selectors:
        nav = page.query_selector(selector)
        if nav:
            links = nav.query_selector_all('a')
            structure['navigation']['main_menu'] = [
                {
                    'text': link.inner_text().strip(),
                    'url': link.get_attribute('href'),
                    'classes': link.get_attribute('class')
                }
                for link in links if link.inner_text().strip()
            ]
            break
    
    # Extract footer
    footer = page.query_selector('footer')
    if footer:
        footer_links = footer.query_selector_all('a')
        structure['footer']['links'] = [
            {
                'text': link.inner_text().strip(),
                'url': link.get_attribute('href')
            }
            for link in footer_links if link.inner_text().strip()
        ]
    
    # Extract metadata
    structure['metadata'] = {
        'description': page.query_selector('meta[name="description"]').get_attribute('content') if page.query_selector('meta[name="description"]') else None,
        'keywords': page.query_selector('meta[name="keywords"]').get_attribute('content') if page.query_selector('meta[name="keywords"]') else None,
        'og_title': page.query_selector('meta[property="og:title"]').get_attribute('content') if page.query_selector('meta[property="og:title"]') else None,
    }
    
    # Extract all links on page
    all_links = page.query_selector_all('a')
    for link in all_links:
        href = link.get_attribute('href')
        if href:
            full_url = urljoin(page.url, href)
            if is_same_domain(full_url):
                structure['links'].append({
                    'text': link.inner_text().strip()[:100],
                    'url': full_url,
                    'type': categorize_url(full_url)
                })
    
    return structure

def main():
    print("="*80)
    print("SITE STRUCTURE MAPPER")
    print("="*80)
    print(f"Starting URL: {BASE_URL}\n")
    
    site_map = {
        'base_url': BASE_URL,
        'pages': {},
        'url_categories': defaultdict(list),
        'navigation_structure': None
    }
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Start with homepage
        print("📍 Mapping homepage...")
        page.goto(BASE_URL, wait_until='networkidle')
        time.sleep(2)
        
        homepage_structure = extract_site_structure(page)
        site_map['pages']['homepage'] = homepage_structure
        site_map['navigation_structure'] = homepage_structure['navigation']
        
        # Collect unique pages to visit (non-product pages)
        priority_pages = set()
        for link in homepage_structure['links']:
            url = normalize_url(link['url'])
            link_type = categorize_url(url)
            
            # Skip products but get everything else
            if link_type != 'product' and url not in VISITED:
                priority_pages.add((url, link_type))
        
        print(f"Found {len(priority_pages)} unique pages to map\n")
        
        # Visit all important pages (no limit)
        for i, (url, page_type) in enumerate(sorted(priority_pages), 1):
            try:
                print(f"[{i}/{len(priority_pages)}] {page_type}: {url}")
                page.goto(url, wait_until='networkidle', timeout=15000)
                time.sleep(1)
                
                structure = extract_site_structure(page)
                site_map['pages'][url] = structure
                site_map['url_categories'][page_type].append(url)
                
                VISITED.add(url)
                
            except Exception as e:
                print(f"  ⚠️  Failed: {e}")
                continue
        
        browser.close()
    
    # Save to JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(site_map, f, indent=2, ensure_ascii=False)
    
    # Summary
    print("\n" + "="*80)
    print("SITE MAP SUMMARY")
    print("="*80)
    print(f"✅ Total pages mapped: {len(site_map['pages'])}")
    print(f"💾 Saved to: {OUTPUT_FILE}\n")
    
    print("📊 Page Types:")
    for page_type, urls in sorted(site_map['url_categories'].items()):
        print(f"   {page_type}: {len(urls)} pages")
    
    print("\n🧭 Main Navigation Items:")
    if site_map['navigation_structure'].get('main_menu'):
        for item in site_map['navigation_structure']['main_menu'][:10]:
            print(f"   - {item['text']}")
    
    print(f"\n✅ Complete! Review '{OUTPUT_FILE}' for full site structure")

if __name__ == '__main__':
    main()
