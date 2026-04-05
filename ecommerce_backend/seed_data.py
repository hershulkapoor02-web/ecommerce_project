import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from store.models import Category, Product

if Product.objects.exists():
    print("Products already exist, skipping seed.")
else:
    print("Seeding database...")
    
    Category.objects.all().delete()

    categories_data = [
        {'name': 'Electronics', 'slug': 'electronics', 'description': 'Gadgets and tech'},
        {'name': 'Fashion', 'slug': 'fashion', 'description': 'Clothing and accessories'},
        {'name': 'Home & Living', 'slug': 'home-living', 'description': 'Furniture and decor'},
        {'name': 'Books', 'slug': 'books', 'description': 'Bestsellers and classics'},
        {'name': 'Sports', 'slug': 'sports', 'description': 'Sports equipment'},
    ]

    cats = {d['slug']: Category.objects.create(**d) for d in categories_data}

    products = [
        {'name': 'Wireless Noise-Cancelling Headphones', 'slug': 'wireless-headphones', 'category': cats['electronics'], 'price': 8999, 'sale_price': 6499, 'description': 'Premium sound quality with 30hr battery life and active noise cancellation.', 'image_url': 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?w=500', 'stock': 50, 'is_featured': True},
        {'name': 'Mechanical Gaming Keyboard', 'slug': 'gaming-keyboard', 'category': cats['electronics'], 'price': 4999, 'sale_price': None, 'description': 'RGB backlit mechanical keyboard with tactile switches for ultimate gaming experience.', 'image_url': 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?w=500', 'stock': 30, 'is_featured': False},
        {'name': '4K Webcam', 'slug': '4k-webcam', 'category': cats['electronics'], 'price': 6999, 'sale_price': 4999, 'description': 'Ultra HD 4K webcam with built-in ring light and auto-focus for crystal clear video calls.', 'image_url': 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?w=500', 'stock': 25, 'is_featured': True},
        {'name': 'Portable Bluetooth Speaker', 'slug': 'bluetooth-speaker', 'category': cats['electronics'], 'price': 3499, 'sale_price': 2799, 'description': 'Waterproof 360-degree sound with 20hr playtime. Perfect for outdoor adventures.', 'image_url': 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?w=500', 'stock': 60, 'is_featured': False},
        {'name': 'Premium Cotton Hoodie', 'slug': 'cotton-hoodie', 'category': cats['fashion'], 'price': 2499, 'sale_price': 1799, 'description': 'Ultra-soft 100% organic cotton hoodie. Available in 8 colors. Unisex fit.', 'image_url': 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=500', 'stock': 100, 'is_featured': True},
        {'name': 'Leather Crossbody Bag', 'slug': 'leather-bag', 'category': cats['fashion'], 'price': 3999, 'sale_price': None, 'description': 'Genuine leather crossbody bag with multiple compartments and adjustable strap.', 'image_url': 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=500', 'stock': 40, 'is_featured': True},
        {'name': 'Running Sneakers', 'slug': 'running-sneakers', 'category': cats['fashion'], 'price': 5999, 'sale_price': 4499, 'description': 'Lightweight mesh sneakers with cushioned sole for all-day comfort and performance.', 'image_url': 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?w=500', 'stock': 75, 'is_featured': False},
        {'name': 'Minimalist Desk Lamp', 'slug': 'desk-lamp', 'category': cats['home-living'], 'price': 1999, 'sale_price': 1499, 'description': 'LED desk lamp with touch dimmer, USB charging port, and 5 brightness levels.', 'image_url': 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?w=500', 'stock': 45, 'is_featured': True},
        {'name': 'Ceramic Plant Pot Set', 'slug': 'plant-pots', 'category': cats['home-living'], 'price': 899, 'sale_price': None, 'description': 'Set of 3 handcrafted ceramic pots with bamboo trays. Perfect for succulents.', 'image_url': 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?w=500', 'stock': 80, 'is_featured': False},
        {'name': 'Scented Soy Candles', 'slug': 'soy-candles', 'category': cats['home-living'], 'price': 699, 'sale_price': 499, 'description': 'Hand-poured soy wax candles with wooden wick. Set of 3 in calming lavender scent.', 'image_url': 'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?w=500', 'stock': 120, 'is_featured': False},
        {'name': 'Atomic Habits', 'slug': 'atomic-habits', 'category': cats['books'], 'price': 499, 'sale_price': 399, 'description': "James Clear's #1 bestseller on building good habits and breaking bad ones.", 'image_url': 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?w=500', 'stock': 200, 'is_featured': True},
        {'name': 'The Psychology of Money', 'slug': 'psychology-of-money', 'category': cats['books'], 'price': 449, 'sale_price': None, 'description': "Morgan Housel's timeless lessons on wealth, greed, and happiness.", 'image_url': 'https://images.pexels.com/photos/210126/pexels-photo-210126.jpeg?w=500', 'stock': 150, 'is_featured': False},
        {'name': 'Yoga Mat Premium', 'slug': 'yoga-mat', 'category': cats['sports'], 'price': 1299, 'sale_price': 999, 'description': 'Eco-friendly TPE yoga mat with alignment lines, 6mm thick, non-slip surface.', 'image_url': 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?w=500', 'stock': 90, 'is_featured': True},
        {'name': 'Resistance Bands Set', 'slug': 'resistance-bands', 'category': cats['sports'], 'price': 799, 'sale_price': 599, 'description': 'Set of 5 latex resistance bands with handles, door anchor, and carry bag.', 'image_url': 'https://images.pexels.com/photos/4498294/pexels-photo-4498294.jpeg?w=500', 'stock': 110, 'is_featured': False},
    ]

    for p in products:
        Product.objects.create(**p)

    print(f"Done! Created {len(products)} products.")