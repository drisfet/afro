#!/usr/bin/env python3
"""
Complete Site Architecture Analyzer
Analyzes EVERYTHING about the site: navigation, footer, widgets, menus, styles, etc.
"""

from playwright.sync_api import sync_playwright
import json
import time

BASE_URL = "https://howtfoods.com.au"
OUTPUT_FILE = "site_architecture.json"

def analyze_homepage(page):
    """Deep analysis of homepage structure"""
    
    analysis = {
        'url': BASE_URL,
        'title': page.title(),
        'layout': {},
        'navigation': {},
        'footer': {},
        'widgets': {},
        'features': {},
        'pages_discovered': {}  # Add page discovery
    }
    
    # HEADER ANALYSIS
    header = page.query_selector('header')
    if header:
        analysis['layout']['header'] = {
            'classes': header.get_attribute('class'),
            'logo': None,
            'tagline': None,
            'search': False,
            'cart_icon': False,
            'account_link': False
        }
        
        # Logo
        logo = header.query_selector('img.logo, .site-logo img, .custom-logo')
        if logo:
            analysis['layout']['header']['logo'] = logo.get_attribute('src')
        
        # Search
        if header.query_selector('form.search, input[type="search"], .search-form'):
            analysis['layout']['header']['search'] = True
        
        # Cart
        if header.query_selector('.cart, .shopping-cart, [href*="cart"], .cart-icon'):
            analysis['layout']['header']['cart_icon'] = True
        
        # Check for account/user link
        account_selectors = [
            'a[href*="#cz-sign-in"]',  # Cartzilla modal pattern
            'a[href*="#sign-in"]',
            '[href*="#cz-sign-in"]',
            'a[href*="account"]',
            'a[href*="my-account"]',
            'a[href*="login"]',
            '.account-link',
            '[class*="account"]',
            'a[href*="my-account-2"]'  # Specific to this site
        ]
        for selector in account_selectors:
            if header.query_selector(selector):
                analysis['layout']['header']['account_link'] = True
                break
    
    # NAVIGATION MENUS
    all_navs = page.query_selector_all('nav, .menu, ul.navigation')
    analysis['navigation']['menus'] = []
    
    for i, nav in enumerate(all_navs[:5], 1):  # Limit to first 5
        menu_items = nav.query_selector_all('a')
        if menu_items:
            analysis['navigation']['menus'].append({
                'id': nav.get_attribute('id') or f'menu-{i}',
                'classes': nav.get_attribute('class'),
                'items': [
                    {
                        'text': item.inner_text().strip(),
                        'url': item.get_attribute('href'),
                        'has_submenu': bool(item.query_selector('~ ul, + ul'))
                    }
                    for item in menu_items[:20]  # Limit items
                    if item.inner_text().strip()
                ]
            })
    
    # HERO/BANNER SECTION
    hero_selectors = ['.hero', '.banner', '.slider', '.carousel', '.jumbotron']
    for selector in hero_selectors:
        hero = page.query_selector(selector)
        if hero:
            analysis['layout']['hero'] = {
                'type': selector.replace('.', ''),
                'classes': hero.get_attribute('class'),
                'has_images': bool(hero.query_selector('img')),
                'has_cta': bool(hero.query_selector('a.button, .btn, .cta'))
            }
            break
    
    # FOOTER ANALYSIS
    footer = page.query_selector('footer')
    if footer:
        analysis['footer'] = {
            'sections': [],
            'social_links': [],
            'payment_methods': [],
            'copyright': None
        }
        
        # Footer sections/widgets
        widgets = footer.query_selector_all('.widget, .footer-column, .footer-section')
        for widget in widgets:
            title_elem = widget.query_selector('h1, h2, h3, h4, .widget-title')
            analysis['footer']['sections'].append({
                'title': title_elem.inner_text().strip() if title_elem else 'Untitled',
                'links': [
                    {
                        'text': a.inner_text().strip(),
                        'url': a.get_attribute('href')
                    }
                    for a in widget.query_selector_all('a')
                    if a.inner_text().strip()
                ][:10]
            })
        
        # Social links
        social_keywords = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok']
        social_links = footer.query_selector_all('a')
        for link in social_links:
            href = link.get_attribute('href') or ''
            for keyword in social_keywords:
                if keyword in href.lower():
                    analysis['footer']['social_links'].append({
                        'platform': keyword,
                        'url': href
                    })
                    break
        
        # Payment methods
        payment_imgs = footer.query_selector_all('img[alt*="payment"], img[alt*="card"], .payment-methods img')
        analysis['footer']['payment_methods'] = [
            img.get_attribute('alt') or img.get_attribute('src').split('/')[-1]
            for img in payment_imgs
        ]
        
        # Copyright
        copyright = footer.query_selector('.copyright, .copy')
        if copyright:
            analysis['footer']['copyright'] = copyright.inner_text().strip()
    
    # SIDEBAR/WIDGETS
    sidebars = page.query_selector_all('.sidebar, aside, .widget-area')
    analysis['widgets']['sidebars'] = []
    for sidebar in sidebars:
        widgets = sidebar.query_selector_all('.widget')
        analysis['widgets']['sidebars'].append({
            'position': sidebar.get_attribute('class'),
            'widgets': [
                {
                    'title': w.query_selector('.widget-title, h3').inner_text().strip() 
                            if w.query_selector('.widget-title, h3') else 'Untitled',
                    'type': w.get_attribute('class')
                }
                for w in widgets
            ]
        })
    
    # FEATURES DETECTION
    analysis['features'] = {
        'woocommerce': bool(page.query_selector('.woocommerce, .wc-')),
        'breadcrumbs': bool(page.query_selector('.breadcrumb, .breadcrumbs')),
        'live_search': bool(page.query_selector('[data-search], .live-search')),
        'newsletter': bool(page.query_selector('input[type="email"][placeholder*="mail"], .newsletter')),
        'chat_widget': bool(page.query_selector('[class*="chat"], [id*="chat"]')),
        'reviews': bool(page.query_selector('.reviews, .testimonials')),
        'recently_viewed': bool(page.query_selector('.recently-viewed')),
    }
    
    # THEME/FRAMEWORK DETECTION
    body_classes = page.query_selector('body').get_attribute('class') or ''
    analysis['theme'] = {
        'body_classes': body_classes.split(),
        'likely_theme': None,
        'frameworks': []
    }
    
    # Detect common themes/frameworks
    if 'cartzilla' in body_classes.lower():
        analysis['theme']['likely_theme'] = 'Cartzilla'
    elif 'storefront' in body_classes.lower():
        analysis['theme']['likely_theme'] = 'Storefront'
    elif 'flatsome' in body_classes.lower():
        analysis['theme']['likely_theme'] = 'Flatsome'
    
    # DISCOVER ALL PAGES (categorized)
    from collections import defaultdict
    from urllib.parse import urljoin, urlparse
    
    def categorize_url(url):
        """Categorize URL by type"""
        path = urlparse(url).path.lower()
        if not path or path == '/': return 'homepage'
        elif '/product/' in path: return 'product'
        elif '/product-category/' in path: return 'category'
        elif '/cart' in path or '/checkout' in path: return 'ecommerce'
        elif '/my-account' in path: return 'account'
        elif '/about' in path: return 'about'
        elif '/contact' in path: return 'contact'
        elif '/privacy' in path or '/terms' in path or '/policy' in path: return 'legal'
        else: return 'other'
    
    discovered = defaultdict(list)
    all_links = page.query_selector_all('a')
    
    for link in all_links:
        href = link.get_attribute('href')
        if href and 'howtfoods.com.au' in href:
            page_type = categorize_url(href)
            text = link.inner_text().strip()[:50]
            if href not in [item['url'] for item in discovered[page_type]]:
                discovered[page_type].append({
                    'url': href,
                    'text': text
                })
    
    analysis['discovered_pages'] = dict(discovered)
    
    return analysis

def main():
    print("="*80)
    print("COMPLETE SITE ARCHITECTURE ANALYZER")
    print("="*80)
    print(f"Analyzing: {BASE_URL}\n")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        print("📍 Loading homepage...")
        page.goto(BASE_URL, wait_until='networkidle')
        time.sleep(3)  # Let everything load
        
        print("🔍 Analyzing structure...")
        architecture = analyze_homepage(page)
        
        browser.close()
    
    # Save to JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(architecture, f, indent=2, ensure_ascii=False)
    
    # Display Summary
    print("\n" + "="*80)
    print("SITE ARCHITECTURE SUMMARY")
    print("="*80)
    
    print(f"\n🎨 THEME: {architecture['theme']['likely_theme'] or 'Unknown'}")
    
    print(f"\n🧭 NAVIGATION:")
    print(f"   Menus found: {len(architecture['navigation']['menus'])}")
    for menu in architecture['navigation']['menus'][:2]:
        print(f"   - {menu.get('id', 'Unnamed')}: {len(menu['items'])} items")
    
    print(f"\n📦 HEADER:")
    header = architecture['layout'].get('header', {})
    print(f"   Logo: {'✓' if header.get('logo') else '✗'}")
    print(f"   Search: {'✓' if header.get('search') else '✗'}")
    print(f"   Cart Icon: {'✓' if header.get('cart_icon') else '✗'}")
    print(f"   Account Link: {'✓' if header.get('account_link') else '✗'}")
    
    print(f"\n🦶 FOOTER:")
    footer = architecture.get('footer', {})
    print(f"   Sections: {len(footer.get('sections', []))}")
    print(f"   Social Links: {len(footer.get('social_links', []))}")
    for social in footer.get('social_links', []):
        print(f"      - {social['platform'].title()}")
    print(f"   Payment Methods: {len(footer.get('payment_methods', []))}")
    
    print(f"\n✨ FEATURES:")
    features = architecture.get('features', {})
    for feature, enabled in features.items():
        status = '✓' if enabled else '✗'
        print(f"   {status} {feature.replace('_', ' ').title()}")
    
    print(f"\n� DISCOVERED PAGES:")
    discovered = architecture.get('discovered_pages', {})
    total_pages = sum(len(pages) for pages in discovered.values())
    print(f"   Total unique pages: {total_pages}")
    for page_type, pages in sorted(discovered.items()):
        print(f"   {page_type.title()}: {len(pages)}")
    
    print(f"\n�💾 Full analysis saved to: {OUTPUT_FILE}")
    print(f"\n✅ Complete! Use this to replicate the site structure in MedusaJS storefront.")

if __name__ == '__main__':
    main()
