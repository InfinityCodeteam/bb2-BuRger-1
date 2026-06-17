-- ============================================================
-- BB2 Burger - Seed Data (migrated from JSON files)
-- Run AFTER schema.sql
-- ============================================================

-- CATEGORIES
insert into public.categories (id, name) values
  ('a', 'برجر ع الفحم'),
  ('b', 'سماش برجر'),
  ('c', 'الأكيلة'),
  ('d', 'سندوتشات فرايد تشيكن'),
  ('e', 'المقبلات')
on conflict (id) do nothing;


-- ADDONS
insert into public.addons (id, name, price) values
  ('mozz-sticks', 'موتزريلا ستيكس', 25),
  ('mushroom',    'مشروم',           20),
  ('jalapeno',    'هاليبينو',        20),
  ('caramel-on',  'بصل مكرمل',       20),
  ('turkey',      'تركي',            30),
  ('pepperoni',   'ببروني',          30),
  ('bacon',       'بيكون',           30),
  ('cheese',      'جبنة',            25),
  ('tasty',       'تاستي',           20),
  ('texas',       'تكساس',           20)
on conflict (id) do nothing;


-- MENU ITEMS  (all 26 products from items.json)
insert into public.menu_items (name, description, category_id, image_url, price_single, price_double, available, featured) values

-- برجر ع الفحم (a)
('أوريجينال برجر',
 'قطعة لحمة صافي 150جم - خس - خيار مخلل - شيدر صوص - صوص من اختيارك -(بيج تاستي - سويت شيلي - باربيكو - ثاوسند ايلاند - رانش - سموكد بي بي تو)',
 'a', 'https://i.postimg.cc/hGz6dkKn/IMG-20250826-WA0037.jpg', 115, 155, true, true),

('موتزريلا برجر',
 'قطعة لحمة صافي 150جم - خس - خيار مخلل - صوص - موتزريلا (بيج تاستي - سويت شيلي - باربيكو - ثاوسند ايلاند - رانش - سموكد بي بي تو)',
 'a', 'https://i.postimg.cc/m23bcF8j/IMG-20250826-WA0024.jpg', 125, 165, true, false),

('سبايسي برجر',
 'قطعة لحمة صافي 150جم - خس - خيار مخلل - صوص - مايونيز اسبايسي - هالبينو',
 'a', 'https://i.postimg.cc/5NmV9W2k/IMG-20250826-WA0031.jpg', 115, 155, true, false),

('تركي برجر',
 'قطعة لحمة صافي 150جم محشيه موتزريلا - خس - خيار مخلل - شيدر صوص - روز صوص - 2 أصابع موتزريلا استكس - شريحة تركي مدخن مشويه',
 'a', 'https://i.postimg.cc/mZJ4py68/IMG-20250826-WA0005.jpg', 175, 215, true, false),

('بيكون برجر',
 'قطعة لحمة صافي 150جم محشيه موتزريلا - خس - خيار مخلل - شيدر صوص - بيج تاستي صوص - 2 أصابع موتزريلا استكس - شريحة بيكون مدخن مشويه',
 'a', 'https://i.postimg.cc/ry5qcKsC/IMG-20250827-WA0018.jpg', 175, 215, true, false),

('أقوي ميكس ((برجر ع الفحم & فرايد تشيكن))',
 'قطعة برجر ع الفحم 150جم - قطعة فراخ فرايد تشيكن - خس - خيار مخلل - 2 موتزريلا استكس - صوص شيدر - ميكس شيلي صوص - قطعة روز بيف مشوية ع الفحم',
 'a', 'https://i.postimg.cc/05d3Dd1z/IMG-20250826-WA0044.jpg', 220, null, true, true),

-- سماش برجر (b)
('بيج سماش',
 'قطعة لحمة صافي 100جم - خس - خيار مخلل - صوص شيدر - صوص بيج تاستي',
 'b', 'https://i.postimg.cc/52mwZG0G/IMG-20250827-WA0014.jpg', 115, 145, true, true),

('دينااميت سماش',
 'قطعة لحمة صافي 100جم - خس - خيار مخلل - بصل مكرمل - صوص شيدر - هالبينو - سبايسي مايونيز',
 'b', 'https://i.postimg.cc/RFwYPw3b/IMG-20250826-WA0041.jpg', 130, 160, true, true),

('سبشيال سماش',
 'قطعة لحمة صافي 100جم - خس - خيار مخلل - صوص شيدر - صوص تكساس - 2 أصابع موتزريلا استكس',
 'b', 'https://i.postimg.cc/bNnh7S78/IMG-20250826-WA0002.jpg', 135, 165, true, false),

-- الأكيلة (c)
('ميكس تشيز برجر',
 'قطعة لحمة صافي 150جم محشيه موتزريلا وامريكان تشيز - خيار مخلل - خس - شيدر صوص -تكساس صوص- أصابع موتزريلا استكس - قطعة روز بيف',
 'c', 'https://i.postimg.cc/4xxGzP5B/IMG-20250827-WA0020.jpg', 185, 225, true, true),

('كرمليز مشروم برجر',
 'قطعة لحمة صافي 150جم محشيه موتزريلا - خس - خيار مخلل - شيدر صوص -ميكس صوص- مشروم - 4قطع ببروني - أصابع موتزريلا استكس - بصل مكرمل - مشروم مشوي ع الفحم',
 'c', 'https://i.postimg.cc/WbTBHYwm/IMG-20250826-WA0034.jpg', 185, 225, true, true),

('دوريتوس برجر',
 'قطعة لحمة صافي 150جم محشيه موتزريلا - خيار مخلل - خس - شيدر صوص - تاستي صوص -2 أصابع موتزريلا استكس - ميكس قطع دوريتوس وبيكون وامريكان تشيز',
 'c', 'https://i.postimg.cc/HxPmgwWW/IMG-20250826-WA0003.jpg', 185, 225, true, true),

('بي بي تو برجر',
 'قطعة لحمة صافي 150جم محشيه موتزريلا و بيكون - خس - خيار مخلل - شيدر صوص - بي بي تو صوص - 2أصابع موتزريلا استكس',
 'c', 'https://i.postimg.cc/PJ4RHhQW/IMG-20250826-WA0042.jpg', 175, 215, true, true),

('نمبر ون',
 'قطعة لحمة صافي 150جم محشيه موتزريلا - خس - خيار مخلل - شيدر صوص - تاستي صوص - 2 أصابع موتزريلا استكس - ببروني',
 'c', 'https://i.postimg.cc/PJ4RHhQW/IMG-20250826-WA0042.jpg', 185, 225, true, false),

-- سندوتشات فرايد تشيكن (d)
('كومبو ناشفل تشيكن',
 '(( خس - خيار مخلل - قطعة تشيكن ناشفل - كريمي صوص -  - ٢ موتزريلا استكس - قطعة تركي - شيدر صوص )) + كرينكل فرايز + بيج كولا + ٢ قطعة دره حلو',
 'd', 'https://i.postimg.cc/x13mPTtd/Whats-App-Image-2025-09-14-at-01-53-12-b7553c7c.jpg', 180, 220, true, true),

('أوريجنال تشيكن',
 'فرايد تشيكن - خس - خيار مخلل - صوص شيدر - صوص من اختيارك (بيج تاستي - سويت شيلي - باربيكو - ثاوسند ايلاند - رانش - سموكد بي بي تو)',
 'd', 'https://i.postimg.cc/3J7YwYDM/IMG-20250827-WA0021.jpg', 100, 140, true, false),

('سبايسي تشيكن',
 'خس - خيار مخلل - قطعة فرايد تشيكن - صوص شيدر - سبايسي مايونيز - هالبينو',
 'd', 'https://i.postimg.cc/kXc96zx2/IMG-20250827-WA0019.jpg', 100, 140, true, false),

('شيلي تشيكن',
 'قطعة فرايد تشيكن - خس - خيار مخلل - صوص شيدر - صوص شيلي - 2 أصابع موتزريلا - قطعة بيكون مشوي علي الفحم',
 'd', 'https://i.postimg.cc/tg80vXB7/IMG-20250826-WA0033.jpg', 155, 195, true, false),

('رانش تشيكن',
 'قطعة فرايد تشيكن - خس - خيار مخلل - 4 قطع ببروني مشوي - صوص شيدر - 2 أصابع موتزريلا استكس - صوص رانش',
 'd', 'https://i.postimg.cc/26j9Cy20/Whats-App-Image-2025-08-27-at-01-21-33-a13a0fa5.jpg', 155, 195, true, false),

('تركي تشيكن',
 'فرايد تشيكن - خس - خيار مخلل - صوص شيدر - صوص تاستي - 2 أصابع موتزريلا استكس - قطعة تركي مدخن مشوي ع الفحم',
 'd', 'https://i.postimg.cc/mg6KhLfV/IMG-20250826-WA0038.jpg', 155, 195, true, false),

('روز تشيكن',
 'فرايد تشيكن - خس - خيار مخلل - صوص شيدر - روز صوص - 2 أصابع موتزريلا استكس - روز بيف مشوي ع الفحم',
 'd', 'https://i.postimg.cc/26PHhGCK/Whats-App-Image-2025-08-27-at-01-26-13-e52075d5.jpg', 155, 195, true, false),

-- المقبلات (e) — no double price
('2 قطعه استربس حار', '', 'e',
 'https://i.postimg.cc/LX12JsTS/IMG-20250827-WA0016.jpg', 65, null, true, false),

('بطاطس', '', 'e',
 'https://i.postimg.cc/6qnpnBCs/Whats-App-Image-2025-08-28-at-17-13-26-94119853.jpg', 55, null, true, false),

('بطاطس جبنه', '', 'e',
 'https://i.postimg.cc/QxXJNhTm/IMG-20250826-WA0064-1.jpg', 70, null, true, false),

('بطاطس جبنه هالبينو', '', 'e',
 'https://i.postimg.cc/PqVJk3d7/Whats-App-Image-2025-08-28-at-17-11-24-68b1107c.jpg', 80, null, true, false),

('بطاطس جبنه استربس', '', 'e',
 'https://i.postimg.cc/d1z0hhkm/Whats-App-Image-2025-08-28-at-17-12-44-fa7a1fbb.jpg', 95, null, true, false),

('بطاطس سماش شيدر', '', 'e',
 'https://i.postimg.cc/Pxfkhth1/Whats-App-Image-2025-12-29-at-7-50-05-PM.jpg', 105, null, true, false);


-- SETTINGS
insert into public.settings (key, value) values
  ('brand',           'BB2 Burger'),
  ('whatsapp_number', '201006473229'),
  ('address',         'الساحه-شارع الاوقاف-عمارات الاستثمار عمارة 2 امام مدرسة التجارة'),
  ('hours',           ''),
  ('logo',            'https://i.postimg.cc/90b37MGv/Whats-App-Image-2025-08-22-at-10-03-25-621ae7a1-removebg-preview.png'),
  ('facebook',        'https://www.facebook.com/share/1EhgB6LvHR/'),
  ('instagram',       'https://www.instagram.com/bb2burger?igsh=MWhuenhwcWJ4YjFqMQ=='),
  ('banners',         '["https://i.postimg.cc/HxPmgwWW/IMG-20250826-WA0003.jpg","https://i.postimg.cc/zBLz3tcH/IMG-20250826-WA0019.jpg","https://i.postimg.cc/6QMJrrvV/IMG-20250826-WA0007.jpg","https://i.postimg.cc/y6T6C6Mq/Whats-App-Image-2025-08-22-at-09-59-53-5ae70d60.jpg"]')
on conflict (key) do update set value = excluded.value;
