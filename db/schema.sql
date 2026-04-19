-- ─────────────────────────────────────────
-- DROP (reverse dependency order)
-- ─────────────────────────────────────────
DROP TABLE IF EXISTS thread_products CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS call_logs CASCADE;
DROP TABLE IF EXISTS contact_auth CASCADE;
DROP TABLE IF EXISTS threads CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- ─────────────────────────────────────────
-- ACCOUNTS  (BMW, Mercedes, VW Group…)
-- ─────────────────────────────────────────
CREATE TABLE accounts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  country      TEXT,
  website      TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────
-- CONTACTS  (people at the account)
-- all fields nullable — a contact can be created from just a caller ID phone number
-- fields filled in progressively as the agent extracts them during the call
-- ─────────────────────────────────────────
CREATE TABLE contacts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id   UUID REFERENCES accounts(id) ON DELETE SET NULL,
  full_name    TEXT,
  job_title    TEXT,
  phone        TEXT,
  email        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  brand             TEXT NOT NULL,
  model             TEXT NOT NULL,
  category          TEXT NOT NULL,
  vehicle_type      TEXT[] NOT NULL,
  size_width        INTEGER,
  size_aspect_ratio INTEGER,
  size_rim_diameter INTEGER,
  size_full         TEXT,
  load_index        INTEGER,
  speed_rating      TEXT,
  price             NUMERIC(10,2) NOT NULL,
  original_price    NUMERIC(10,2),
  stock             INTEGER DEFAULT 0,
  wet_grip          TEXT,
  fuel_efficiency   TEXT,
  noise_level       INTEGER,
  noise_class       INTEGER,
  description       TEXT,
  features          TEXT[],
  highlights        TEXT[],
  best_for          TEXT[],
  tags              TEXT[],
  images            TEXT[],
  season_optimal    TEXT,
  warranty_years    INTEGER,
  warranty_mileage  INTEGER,
  rating            NUMERIC(3,1),
  review_count      INTEGER DEFAULT 0,
  is_runflat        BOOLEAN NOT NULL DEFAULT false,
  url               TEXT GENERATED ALWAYS AS ('https://tum-ai-eta.vercel.app/tires/' || id) STORED,
  created_at        TIMESTAMPTZ DEFAULT now()
);

INSERT INTO products (id, name, brand, model, category, vehicle_type, size_width, size_aspect_ratio, size_rim_diameter, size_full, load_index, speed_rating, price, original_price, stock, wet_grip, fuel_efficiency, noise_level, noise_class, description, features, highlights, best_for, tags, images, season_optimal, warranty_years, warranty_mileage, rating, review_count, is_runflat) VALUES

-- SUMMER
('mich-ps5-22545r17', 'Michelin Pilot Sport 5', 'Michelin', 'Pilot Sport 5', 'summer', ARRAY['passenger','sports'], 225, 45, 17, '225/45 R17', 94, 'Y', 189, NULL, 24, 'A', 'B', 69, 1, 'The Michelin Pilot Sport 5 sets new benchmarks in the high-performance segment. Outstanding wet grip and precise steering make it the first choice for sporty drivers.', ARRAY['Bi-Compound Technology','Dynamic Response Technology','Reinforced Sidewall'], ARRAY['Wet Grip EU Label A','Optimized for driving dynamics','Low road noise 69 dB','5-year Michelin warranty'], ARRAY['sporty-driving','highway-driving','long-distance'], ARRAY['bestseller','premium'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Michelin-Pilot-Sport-5.png'], 'May–September', 5, 60000, 4.8, 312, false),

('cont-sc7-20555r16', 'Continental SportContact 7', 'Continental', 'SportContact 7', 'summer', ARRAY['passenger','sports'], 205, 55, 16, '205/55 R16', 91, 'W', 149, NULL, 38, 'A', 'B', 70, 1, 'Continental SportContact 7 delivers maximum control on wet and dry roads. Developed for sports cars and sporty saloons.', ARRAY['Adaptive Ground Mechanics','Active Comfort Technology','SportGrip Compound'], ARRAY['Wet Grip A','Optimal braking performance','Reduced fuel consumption'], ARRAY['sporty-driving','city-commute','highway-driving'], ARRAY['premium','bestseller'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Continental-SportContact-7.png'], 'May–September', 5, 50000, 4.7, 245, false),

('brid-turanza6-22545r18', 'Bridgestone Turanza 6', 'Bridgestone', 'Turanza 6', 'summer', ARRAY['passenger','suv'], 225, 45, 18, '225/45 R18', 95, 'V', 162, NULL, 16, 'A', 'A', 68, 1, 'The Turanza 6 is Bridgestone''s flagship for comfort and efficiency. Thanks to Enliten Technology it saves up to 4% fuel compared to its predecessor.', ARRAY['Enliten Technology','DriveGuard compatible','Low Rolling Resistance'], ARRAY['Fuel Efficiency A','Comfort-oriented ride','Low road noise 68 dB','EV-optimized variant available'], ARRAY['long-distance','fuel-economy','city-commute'], ARRAY['eco-friendly','new'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Bridgestone-Turanza-6.png'], 'May–September', 5, 70000, 4.6, 189, false),

('pir-cinturato-p7-19550r15', 'Pirelli Cinturato P7', 'Pirelli', 'Cinturato P7', 'summer', ARRAY['passenger'], 195, 50, 15, '195/50 R15', 82, 'V', 89, NULL, 44, 'B', 'A', 71, 2, 'The Pirelli Cinturato P7 combines efficiency with safety for the mid-range segment. Ideal for city drivers who keep an eye on fuel costs.', ARRAY['Low Rolling Resistance','Optimized for tire pressure monitoring','Aramid-reinforced sidewall'], ARRAY['Fuel Efficiency A','Low rolling resistance','Excellent value for money'], ARRAY['city-commute','fuel-economy','long-distance'], ARRAY['bestseller'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Pirelli-CINTURATO-P7.png'], 'May–September', 4, 50000, 4.3, 421, false),

('good-eagle-f1-25540r19', 'Goodyear Eagle F1 Asymmetric 6', 'Goodyear', 'Eagle F1 Asymmetric 6', 'summer', ARRAY['passenger','sports'], 255, 40, 19, '255/40 R19', 100, 'Y', 279, 319, 8, 'A', 'B', 72, 2, 'Eagle F1 Asymmetric 6 is Goodyear''s premium summer tire for high-performance vehicles. Shortest braking distances in its class.', ARRAY['ActiveBraking Technology','EfficientGrip Compound','Asymmetric tread pattern'], ARRAY['Shortest braking distances in class','Optimal aquaplaning resistance','20% more wet grip vs predecessor'], ARRAY['sporty-driving','highway-driving'], ARRAY['sale','premium'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Goodyear-Eagle-F1-Asymmetric-6.png'], 'May–September', 5, 50000, 4.7, 178, false),

('hank-ventus-s1-18565r15', 'Hankook Ventus S1 Evo3', 'Hankook', 'Ventus S1 Evo3', 'summer', ARRAY['passenger'], 185, 65, 15, '185/65 R15', 88, 'H', 67, NULL, 60, 'B', 'B', 70, 1, 'The Hankook Ventus S1 Evo3 delivers solid performance in the budget segment. Very popular with commuters and as original equipment.', ARRAY['Ventus Compound','Asymmetric tread pattern','Noise-reducing bridge bars'], ARRAY['Affordable entry into the premium segment','Proven compact tread pattern','Good wet weather properties'], ARRAY['city-commute','long-distance'], ARRAY['budget','bestseller'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Hankook-Ventus-S1-evo-3.png'], 'May–September', 4, 45000, 4.2, 533, false),

('dun-sp-sport-maxx-24535r20', 'Dunlop SP Sport Maxx RT 2', 'Dunlop', 'SP Sport Maxx RT 2', 'summer', ARRAY['passenger','sports','suv'], 245, 35, 20, '245/35 R20', 95, 'Y', 245, NULL, 12, 'A', 'C', 73, 2, 'Dunlop SP Sport Maxx RT 2 for large rims and sporty UHP vehicles. Maximum cornering performance and stable high-speed behaviour.', ARRAY['Multi-radius tread pattern','Sport+ Compound','Reinforced sidewall'], ARRAY['UHP segment','Excellent cornering performance','Fits 20-inch rims'], ARRAY['sporty-driving','highway-driving'], ARRAY['premium'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Dunlop-Sport-Maxx-Race-2.jpg'], 'May–September', 4, 40000, 4.5, 134, false),

('vred-quatrac-20555r17', 'Vredestein Ultrac', 'Vredestein', 'Ultrac', 'summer', ARRAY['passenger','suv'], 205, 55, 17, '205/55 R17', 95, 'W', 118, NULL, 28, 'A', 'B', 69, 1, 'Vredestein Ultrac combines Dutch engineering with the highest safety standards. Quiet ride and precise steering.', ARRAY['SilicaDens Compound','Asymmetric tread pattern','Silica technology'], ARRAY['Wet Grip A','Very low road noise','Long tread life warranty'], ARRAY['highway-driving','long-distance','city-commute'], ARRAY['new'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Vredestein-Ultrac.jpg'], 'May–September', 5, 55000, 4.4, 97, false),

('falken-ziex-21555r17', 'Falken Ziex ZE914 Ecorun', 'Falken', 'Ziex ZE914 Ecorun', 'summer', ARRAY['passenger'], 215, 55, 17, '215/55 R17', 94, 'V', 74, NULL, 50, 'C', 'B', 71, 2, 'Falken Ziex ZE914 Ecorun is the entry-level tire for eco-conscious drivers. Good fuel efficiency at a fair price.', ARRAY['Ecorun Compound','Asymmetric tread pattern','Silica rubber'], ARRAY['Fuel Efficiency B','Budget-friendly price','Solid everyday performance'], ARRAY['fuel-economy','city-commute'], ARRAY['budget','eco-friendly'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Falken-ZIEX-ZE914-EcoRun.jpg'], 'May–September', 3, 40000, 4.0, 289, false),

('noki-seasons-21560r16', 'Nokian Tyres Wetproof', 'Nokian', 'Wetproof', 'summer', ARRAY['passenger'], 215, 60, 16, '215/60 R16', 99, 'H', 105, NULL, 33, 'A', 'B', 70, 1, 'Nokian Wetproof is specifically optimised for wet conditions — no surprise from a Finnish manufacturer. Excellent aquaplaning resistance.', ARRAY['Wetproof Compound','Aquaplaning sensing ribs','Nordic quality standards'], ARRAY['Wet Grip A','Nordic safety standards','Outstanding aquaplaning resistance'], ARRAY['long-distance','highway-driving','city-commute'], ARRAY['new'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Nokian-WetProof.jpg'], 'May–September', 5, 60000, 4.5, 211, false),

('cont-premiumcontact7-22545r18', 'Continental PremiumContact 7', 'Continental', 'PremiumContact 7', 'summer', ARRAY['passenger','suv'], 225, 45, 18, '225/45 R18', 95, 'W', 155, NULL, 34, 'A', 'B', 69, 1, 'Continental PremiumContact 7 combines comfort and safety. The all-rounder for premium mid-range vehicles.', ARRAY['PremiumContact Compound','SoundComfort Technology','Asymmetric tread pattern'], ARRAY['Wet Grip A','Very low road noise 69 dB','Long tread life'], ARRAY['city-commute','highway-driving','long-distance'], ARRAY['bestseller'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Continental-PremiumContact-7.jpg'], 'May–September', 5, 55000, 4.5, 322, false),

('mich-primacy4-21555r17', 'Michelin Primacy 4+', 'Michelin', 'Primacy 4+', 'summer', ARRAY['passenger'], 215, 55, 17, '215/55 R17', 98, 'W', 133, NULL, 44, 'A', 'A', 69, 1, 'Michelin Primacy 4+ maintains its safety reserves down to the last millimetre of tread. Innovative SafetyLine indicates when the safety buffer is exhausted.', ARRAY['SafetyLine Technology','EverGrip Compound','Low Rolling Resistance'], ARRAY['SafetyLine Technology','Wet Grip A even when worn','Fuel Efficiency A','Ideal for family cars'], ARRAY['long-distance','highway-driving','fuel-economy'], ARRAY['bestseller','eco-friendly'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Michelin-Primacy-4-Plus.png'], 'May–September', 5, 70000, 4.6, 388, false),

('brid-potenza-s001-23540r19', 'Bridgestone Potenza S001', 'Bridgestone', 'Potenza S001', 'summer', ARRAY['sports','passenger'], 235, 40, 19, '235/40 R19', 96, 'Y', 221, NULL, 11, 'A', 'C', 72, 2, 'Bridgestone Potenza S001 is original equipment for Mercedes AMG and several BMW M models. Sport compound with maximum grip.', ARRAY['Sport Compound','Monoblock reinforcement','OEM for Mercedes AMG'], ARRAY['OEM for Mercedes AMG, BMW M','Short braking distances','Y speed rating','Sport Compound'], ARRAY['sporty-driving','highway-driving'], ARRAY['premium'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Bridgestone-Potenza-S001.jpg'], 'May–September', 4, 40000, 4.6, 155, false),

-- WINTER
('cont-wc-ts870-20555r16', 'Continental WinterContact TS 870', 'Continental', 'WinterContact TS 870', 'winter', ARRAY['passenger'], 205, 55, 16, '205/55 R16', 91, 'H', 129, NULL, 42, 'A', 'B', 71, 2, 'Continental WinterContact TS 870 is the best-selling winter tire in Germany. Superior snow and ice traction combined with excellent wet weather performance.', ARRAY['Snowflake certified (3PMSF)','IcePlus Compound','Aquaplaning channels'], ARRAY['3PMSF snowflake symbol','Short braking distances on ice','Wet Grip A','5-year warranty'], ARRAY['winter-safety','city-commute','highway-driving'], ARRAY['bestseller','premium'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Continental-WinterContact-TS-870.png'], 'October–April', 5, 50000, 4.8, 387, false),

('mich-alpinea5-22545r17', 'Michelin Alpin 6', 'Michelin', 'Alpin 6', 'winter', ARRAY['passenger'], 225, 45, 17, '225/45 R17', 94, 'H', 172, NULL, 29, 'A', 'B', 70, 1, 'Michelin Alpin 6 impresses with excellent winter performance and long tread life. Test winner in several independent comparisons.', ARRAY['3PMSF','CrossClimate Compound','Michelin Total Performance'], ARRAY['Multiple test winner','3PMSF certified','Excellent tread life'], ARRAY['winter-safety','long-distance','highway-driving'], ARRAY['bestseller','premium'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Michelin-Alpin-6.png'], 'October–April', 5, 55000, 4.9, 264, false),

('pir-sottozero3-24540r18', 'Pirelli Winter Sottozero 3', 'Pirelli', 'Winter Sottozero 3', 'winter', ARRAY['passenger','sports'], 245, 40, 18, '245/40 R18', 97, 'V', 198, NULL, 15, 'A', 'C', 72, 2, 'Pirelli Winter Sottozero 3 is the sports tire for winter. Uncompromising handling even in cold and snowy conditions.', ARRAY['3PMSF','PNCS noise reducer','Silica Compound'], ARRAY['OEM for BMW, Mercedes','Sporty winter compound','Noise damping technology'], ARRAY['winter-safety','sporty-driving'], ARRAY['premium'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Pirelli-Winter-Sottozero-3.jpeg'], 'October–April', 4, 40000, 4.6, 143, false),

('brid-blizzak-lm005-19565r15', 'Bridgestone Blizzak LM 005', 'Bridgestone', 'Blizzak LM 005', 'winter', ARRAY['passenger','suv'], 195, 65, 15, '195/65 R15', 95, 'T', 99, NULL, 55, 'A', 'B', 71, 2, 'Blizzak LM 005 with Multicell Compound is especially superior on icy roads. Short braking distances on ice and snow.', ARRAY['3PMSF','Multicell Compound','V-shaped sipes'], ARRAY['Best ice grip in class','3PMSF certified','Affordable premium segment'], ARRAY['winter-safety','city-commute'], ARRAY['bestseller'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Bridgestone-Blizzak-LM005.jpg'], 'October–April', 4, 40000, 4.7, 502, false),

('good-ultragrip9-18565r15', 'Goodyear UltraGrip 9+', 'Goodyear', 'UltraGrip 9+', 'winter', ARRAY['passenger'], 185, 65, 15, '185/65 R15', 92, 'T', 79, NULL, 68, 'B', 'B', 72, 2, 'Goodyear UltraGrip 9+ provides reliable winter traction for compact cars. The best-selling entry-level winter tire.', ARRAY['3PMSF','WetCommand Technology','Sipe technology'], ARRAY['Budget winter tire','3PMSF certified','Over 600 positive reviews'], ARRAY['winter-safety','city-commute'], ARRAY['budget','bestseller'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Goodyear-UltraGrip-9-Plus.jpg'], 'October–April', 4, 40000, 4.4, 611, false),

('noki-hakka-r3-22545r18', 'Nokian Hakkapeliitta R5', 'Nokian', 'Hakkapeliitta R5', 'winter', ARRAY['passenger','suv'], 225, 45, 18, '225/45 R18', 95, 'H', 185, NULL, 20, 'A', 'B', 69, 1, 'The Nokian Hakkapeliitta R5 is Finland''s answer to extreme winter conditions. Reinforced and optimised for electric vehicles.', ARRAY['3PMSF','Arctic Silica Compound','EV-Reinforced','Nordic Hakkapeliitta grip'], ARRAY['Developed for Scandinavia','EV-optimized','Quiet winter tire 69 dB','Best ice grip level'], ARRAY['winter-safety','electric-vehicles','long-distance'], ARRAY['premium','new'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Nokian-Hakkapeliitta-R5.png'], 'October–April', 5, 50000, 4.9, 198, false),

('hank-winter-icept-20555r16', 'Hankook Winter i*cept RS3', 'Hankook', 'Winter i*cept RS3', 'winter', ARRAY['passenger'], 205, 55, 16, '205/55 R16', 94, 'H', 92, NULL, 47, 'B', 'C', 72, 2, 'Hankook Winter i*cept RS3 delivers reliable winter performance at a fair price. Good traction on snow and ice.', ARRAY['3PMSF','Multi-sipe technology','Silica compound'], ARRAY['Best value for money','3PMSF certified','Solid snow traction'], ARRAY['winter-safety','city-commute'], ARRAY['budget'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Hankook-Winter-I-cept-RS3.png'], 'October–April', 4, 40000, 4.3, 358, false),

('dun-winter-sport5-21560r16', 'Dunlop Winter Sport 5', 'Dunlop', 'Winter Sport 5', 'winter', ARRAY['passenger','suv'], 215, 60, 16, '215/60 R16', 99, 'H', 114, NULL, 35, 'A', 'B', 71, 2, 'Dunlop Winter Sport 5 combines sporty handling with winter safety. Recommended for drivers who refuse to compromise even in winter.', ARRAY['3PMSF','Winter Compound','Optimized water drainage'], ARRAY['Sporty winter handling','3PMSF certified','Wet Grip A'], ARRAY['winter-safety','highway-driving'], ARRAY[]::TEXT[], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Dunlop-Winter-Sport-5.jpg'], 'October–April', 4, 45000, 4.5, 227, false),

('vred-wintrac-pro-25540r19', 'Vredestein Wintrac Pro', 'Vredestein', 'Wintrac Pro', 'winter', ARRAY['passenger','sports'], 255, 40, 19, '255/40 R19', 100, 'Y', 232, NULL, 10, 'A', 'C', 72, 2, 'Vredestein Wintrac Pro for high-performance vehicles that make no compromises in winter. Y-rating for speeds above 300 km/h.', ARRAY['3PMSF','Silica Compound','Asymmetric UHP tread'], ARRAY['Y speed rating (300+ km/h)','UHP winter tire','Excellent wet performance in winter'], ARRAY['winter-safety','sporty-driving','highway-driving'], ARRAY['premium'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Vredestein-Wintrac-Pro.png'], 'October–April', 5, 40000, 4.6, 88, false),

('falken-eurowinter-19555r16', 'Falken Eurowinter HS02 Pro', 'Falken', 'Eurowinter HS02 Pro', 'winter', ARRAY['passenger'], 195, 55, 16, '195/55 R16', 87, 'H', 62, NULL, 72, 'C', 'B', 73, 2, 'Falken Eurowinter HS02 Pro is the most affordable 3PMSF-certified winter tire in the range. Ideal for city-oriented drivers on a smaller budget.', ARRAY['3PMSF','Ecovantage Compound'], ARRAY['Most affordable winter tire in the range','3PMSF certified','Widely available'], ARRAY['winter-safety','city-commute'], ARRAY['budget'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Falken-EUROWINTER-HS02-Pro.jpg'], 'October–April', 3, 35000, 3.9, 445, false),

-- ALL-SEASON
('mich-crossclimate2-22545r17', 'Michelin CrossClimate 2', 'Michelin', 'CrossClimate 2', 'all-season', ARRAY['passenger','suv'], 225, 45, 17, '225/45 R17', 94, 'W', 175, NULL, 30, 'A', 'B', 70, 1, 'Michelin CrossClimate 2 is the second generation of the revolutionary all-season tire. Summer-tire wet grip combined with genuine winter grip.', ARRAY['3PMSF','Bi-Directional V-tread','Summer+Winter compound','TrailShield Technology'], ARRAY['3PMSF and summer performance in one','Wet Grip A','All-season test winner 2024','Up to 65,000 km tread life'], ARRAY['all-year','highway-driving','long-distance','city-commute'], ARRAY['bestseller','premium','new'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Michelin-CrossClimate-2.png'], 'Year-round', 5, 65000, 4.8, 419, false),

('cont-allseasoncontact2-20555r16', 'Continental AllSeasonContact 2', 'Continental', 'AllSeasonContact 2', 'all-season', ARRAY['passenger'], 205, 55, 16, '205/55 R16', 91, 'H', 138, NULL, 44, 'A', 'B', 71, 2, 'Continental AllSeasonContact 2 delivers reliable performance in all four seasons. A bestseller for all-year use, especially popular across Europe.', ARRAY['3PMSF','Evovis sipe technology','All-Season Silica'], ARRAY['3PMSF certified','Continental all-season test winner','Wet Grip A'], ARRAY['all-year','city-commute','highway-driving'], ARRAY['bestseller'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Continental-AllSeasonContact-2.jpg'], 'Year-round', 5, 55000, 4.6, 289, false),

('good-vector4s-gen3-21560r16', 'Goodyear Vector 4Seasons Gen-3', 'Goodyear', 'Vector 4Seasons Gen-3', 'all-season', ARRAY['passenger','suv'], 215, 60, 16, '215/60 R16', 99, 'V', 121, NULL, 38, 'A', 'B', 71, 2, 'Goodyear Vector 4Seasons Gen-3 adapts automatically to the weather. WeatherReactive Technology optimises grip according to temperature.', ARRAY['3PMSF','WeatherReactive Technology','SoundComfort Technology'], ARRAY['WeatherReactive Technology','3PMSF certified','Quiet ride'], ARRAY['all-year','city-commute','long-distance'], ARRAY[]::TEXT[], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Goodyear-Vector-4Seasons-Gen-3.png'], 'Year-round', 4, 50000, 4.5, 352, false),

('pir-cinturato-as-sf2-19560r16', 'Pirelli Cinturato All Season SF2', 'Pirelli', 'Cinturato All Season SF2', 'all-season', ARRAY['passenger'], 195, 60, 16, '195/60 R16', 93, 'H', 109, NULL, 55, 'A', 'B', 70, 1, 'Pirelli Cinturato All Season SF2 combines eco-friendliness with all-season safety. Developed with Eco-Balance Technology for the lowest rolling resistance.', ARRAY['3PMSF','Aramid Compound','Eco-Balance Technology'], ARRAY['Fuel Efficiency B','Eco-Balance optimised','3PMSF and Wet Grip A'], ARRAY['all-year','fuel-economy','city-commute'], ARRAY['eco-friendly'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Pirelli-Cinturato-All-Season-SF2.png'], 'Year-round', 4, 50000, 4.3, 177, false),

('hank-kinergy4s2-22550r18', 'Hankook Kinergy 4S2', 'Hankook', 'Kinergy 4S2', 'all-season', ARRAY['passenger','suv'], 225, 50, 18, '225/50 R18', 99, 'W', 126, NULL, 25, 'B', 'B', 71, 2, 'Hankook Kinergy 4S2 with 4D Nano Compound offers balanced performance in all seasons at a competitive price.', ARRAY['3PMSF','4D Nano Compound','All-season sipes'], ARRAY['4D Nano Compound','3PMSF certified','Excellent value for money'], ARRAY['all-year','highway-driving'], ARRAY['budget'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Hankook-Kinergy-4S2.png'], 'Year-round', 4, 45000, 4.2, 214, false),

('vred-quatrac-pro-21555r17', 'Vredestein Quatrac Pro+', 'Vredestein', 'Quatrac Pro+', 'all-season', ARRAY['passenger','sports'], 215, 55, 17, '215/55 R17', 98, 'W', 144, NULL, 18, 'A', 'B', 69, 1, 'Vredestein Quatrac Pro+ is the all-season tire for sports car drivers. Uncompromising performance in every season.', ARRAY['3PMSF','Asymmetric tread pattern','Silica Winter-Summer Compound'], ARRAY['Sporty handling all year round','3PMSF and Wet Grip A','W speed rating'], ARRAY['all-year','sporty-driving','highway-driving'], ARRAY['new'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Vredestein-Quatrac-Pro.jpg'], 'Year-round', 5, 55000, 4.6, 131, false),

('noki-seas3-18565r15', 'Nokian Seasons 3', 'Nokian', 'Seasons 3', 'all-season', ARRAY['passenger'], 185, 65, 15, '185/65 R15', 92, 'H', 87, NULL, 60, 'B', 'B', 71, 2, 'Nokian Seasons 3 from the Finnish winter tire specialist — for drivers who want to run a single set of tires all year.', ARRAY['3PMSF','Nordic Compound','Snow Claws tread'], ARRAY['Finnish winter expertise','3PMSF certified','Optimised for northern European winters'], ARRAY['all-year','winter-safety','city-commute'], ARRAY[]::TEXT[], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Nokian-SeasonProof.jpg'], 'Year-round', 4, 45000, 4.3, 302, false),

('brid-weathercontrol-20555r16', 'Bridgestone Weather Control A005 EVO', 'Bridgestone', 'Weather Control A005 EVO', 'all-season', ARRAY['passenger'], 205, 55, 16, '205/55 R16', 94, 'V', 118, NULL, 41, 'A', 'B', 70, 1, 'Bridgestone Weather Control A005 EVO with Dual-Layer construction delivers outstanding performance in all weather conditions.', ARRAY['3PMSF','EVO Compound','Dual-Layer construction'], ARRAY['Dual-Layer compound','3PMSF certified','Wet Grip A'], ARRAY['all-year','long-distance','fuel-economy'], ARRAY[]::TEXT[], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Bridgestone-Weather-Control-A005-EVO.png'], 'Year-round', 5, 55000, 4.4, 199, false),

-- PERFORMANCE
('mich-ps4s-28535r21', 'Michelin Pilot Sport 4S', 'Michelin', 'Pilot Sport 4S', 'performance', ARRAY['sports','passenger'], 285, 35, 21, '285/35 R21', 105, 'ZR', 489, 549, 4, 'A', 'C', 74, 2, 'The Michelin Pilot Sport 4S is the ultimate road sports tire. Original equipment for Ferrari 488, Porsche 911 and McLaren. Track-capable with road approval.', ARRAY['Bi-Compound Technology','Dynamic Response Technology','Track-optimized','OEM for Ferrari, Porsche'], ARRAY['OEM Ferrari, Porsche, McLaren','Track day capable','Bi-Compound with dual rubber mix','Wet Grip A'], ARRAY['sporty-driving','highway-driving'], ARRAY['premium','sale'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Michelin-Pilot-Sport-4-S.png'], 'May–September', 3, 30000, 4.9, 89, false),

('pir-trofeo-r-23535r19', 'Pirelli P Zero Trofeo RS', 'Pirelli', 'P Zero Trofeo RS', 'performance', ARRAY['sports'], 235, 35, 19, '235/35 R19', 91, 'ZR', 395, NULL, 6, 'A', 'D', 76, 3, 'Pirelli P Zero Trofeo RS — the race track on the road. Semi-slick character with full road approval. For experienced drivers only.', ARRAY['Motorsport compound','Slick-inspired tread','Track-only sidewall markings'], ARRAY['Semi-slick for the road','Maximum lateral grip','Track day champion','For BMW M, Lamborghini, Ferrari'], ARRAY['sporty-driving'], ARRAY['premium'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Pirelli-P-Zero-Trofeo-RS.jpg'], 'May–September (dry)', 2, 15000, 4.9, 44, false),

('cont-sc6-26535r18', 'Continental SportContact 6', 'Continental', 'SportContact 6', 'performance', ARRAY['sports','passenger'], 265, 35, 18, '265/35 R18', 97, 'ZR', 325, NULL, 8, 'A', 'C', 73, 2, 'Continental SportContact 6 with Black Chili Compound for maximum grip on track and country road. OEM tire for AMG, BMW M and Audi RS.', ARRAY['Black Chili Compound','Laser technology','Racetrack Compound'], ARRAY['Black Chili Compound','OEM for AMG, BMW M, Audi RS','UHP summer tire test winner'], ARRAY['sporty-driving','highway-driving'], ARRAY['premium'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Continental-SportContact-7.png'], 'May–September', 3, 35000, 4.8, 112, false),

('good-eagle-f1-super-24540r18', 'Goodyear Eagle F1 SuperSport', 'Goodyear', 'Eagle F1 SuperSport', 'performance', ARRAY['sports'], 245, 40, 18, '245/40 R18', 97, 'ZR', 278, NULL, 10, 'A', 'C', 74, 2, 'Eagle F1 SuperSport is Goodyear''s answer to extreme demands. Carbon-fibre-reinforced sidewall and track texture tread.', ARRAY['ActiveBraking Compound','Track Texture','Carbon-Fibre sidewall'], ARRAY['Carbon-Fibre sidewall','Track Texture tread','Wet Grip A'], ARRAY['sporty-driving'], ARRAY['premium'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Goodyear-Eagle-F1-SuperSport.jpg'], 'May–September', 3, 30000, 4.7, 76, false),

('dun-sport-maxx-race2-27540r20', 'Dunlop Sport Maxx Race 2', 'Dunlop', 'Sport Maxx Race 2', 'performance', ARRAY['sports'], 275, 40, 20, '275/40 R20', 106, 'ZR', 342, NULL, 5, 'A', 'D', 75, 3, 'Dunlop Sport Maxx Race 2 for supercars and muscle cars. Racing DNA for public roads.', ARRAY['Racing-Inspired Compound','Multi-radius tread','Sport+ Carbon'], ARRAY['Racing DNA','Optimised for 20-inch rims','Maximum lateral acceleration'], ARRAY['sporty-driving'], ARRAY['premium'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Dunlop-Sport-Maxx-Race-2.jpg'], 'May–September', 2, 20000, 4.7, 54, false),

('hank-ventus-td-24545r18', 'Hankook Ventus TD', 'Hankook', 'Ventus TD', 'performance', ARRAY['sports','passenger'], 245, 45, 18, '245/45 R18', 100, 'ZR', 219, NULL, 14, 'A', 'C', 73, 2, 'Hankook Ventus TD delivers track day performance at an affordable price. Direct steering feedback and maximum grip.', ARRAY['Track Compound','Direct feedback tread','Asymmetric racing tread'], ARRAY['Most affordable performance tire','Track day capable','ZR speed rating'], ARRAY['sporty-driving','highway-driving'], ARRAY['budget'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Hankook-Ventus-S1-evo-3.png'], 'May–September', 3, 30000, 4.5, 97, false),

-- OFF-ROAD
('brid-dueler-at-26570r17', 'Bridgestone Dueler A/T 002', 'Bridgestone', 'Dueler A/T 002', 'off-road', ARRAY['suv','truck'], 265, 70, 17, '265/70 R17', 113, 'T', 198, NULL, 22, 'C', 'D', 75, 3, 'Bridgestone Dueler A/T 002 is the most versatile all-terrain tire for SUVs and pick-ups. Road-capable off-road performance.', ARRAY['3PMSF','Off-road capable AT tread','Steel belt reinforced','Cut & Chip Resistant'], ARRAY['All-terrain optimised','High tread life 80,000 km','3PMSF certified','Reinforced sidewall'], ARRAY['heavy-loads','long-distance','highway-driving'], ARRAY['bestseller'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Falken-Wildpeak-AT-Trail.jpeg'], 'Year-round', 5, 80000, 4.6, 234, false),

('good-wrangler-at-27565r18', 'Goodyear Wrangler All-Terrain Adventure', 'Goodyear', 'Wrangler All-Terrain Adventure', 'off-road', ARRAY['suv','truck'], 275, 65, 18, '275/65 R18', 113, 'T', 212, NULL, 16, 'C', 'D', 76, 3, 'Goodyear Wrangler All-Terrain Adventure with Kevlar reinforcement for maximum load capacity. For Jeep, Land Rover and large pick-ups.', ARRAY['3PMSF','Kevlar sidewall','AT tread','Self-cleaning tread blocks'], ARRAY['Kevlar sidewall','Self-cleaning tread','3PMSF certified','For Jeep, Land Rover'], ARRAY['heavy-loads','highway-driving'], ARRAY[]::TEXT[], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Goodyear-Wrangler-All-Terrain-Adventure.jpg'], 'Year-round', 5, 75000, 4.5, 187, false),

('falken-wildpeak-at-23575r17', 'Falken Wildpeak A/T Trail', 'Falken', 'Wildpeak A/T Trail', 'off-road', ARRAY['suv','truck'], 235, 75, 17, '235/75 R17', 109, 'T', 149, NULL, 28, 'C', 'D', 74, 2, 'Falken Wildpeak A/T Trail combines off-road capability with low road noise thanks to Silentcore technology.', ARRAY['3PMSF','Off-road stability','Silentcore foam'], ARRAY['Silentcore for low noise','3PMSF certified','Good value for money'], ARRAY['heavy-loads','long-distance'], ARRAY['budget'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Falken-Wildpeak-AT-Trail.jpeg'], 'Year-round', 4, 65000, 4.3, 145, false),

('cont-crosscontact-lx25-25565r17', 'Continental CrossContact LX25', 'Continental', 'CrossContact LX25', 'off-road', ARRAY['suv'], 255, 65, 17, '255/65 R17', 110, 'H', 175, NULL, 19, 'B', 'C', 72, 2, 'Continental CrossContact LX25 for large-volume SUVs and crossovers. Road-oriented with light off-road capability.', ARRAY['3PMSF','EcoPlus Compound','Wide and stable'], ARRAY['EcoPlus Compound','Long tread life','Optimised for large SUVs'], ARRAY['highway-driving','long-distance','heavy-loads'], ARRAY[]::TEXT[], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Continental-CrossContact-LX25.jpg'], 'Year-round', 5, 70000, 4.5, 221, false),

-- ECO / EV
('mich-pilot-ev-25545r21', 'Michelin Pilot Sport EV', 'Michelin', 'Pilot Sport EV', 'eco', ARRAY['passenger','suv'], 255, 45, 21, '255/45 R21', 106, 'Y', 389, NULL, 8, 'A', 'A', 67, 1, 'Michelin Pilot Sport EV is specifically developed for electric vehicles. High load capacity, low rolling resistance, and maximised range thanks to acoustic insert.', ARRAY['EV-Reinforced','Low Rolling Resistance','Acoustic comfort insert','Axial reinforcement'], ARRAY['Specifically for electric cars','Maximises EV range','Acoustic insert (quiet ride)','Axial reinforcement for EV torque','Wet Grip A'], ARRAY['electric-vehicles','highway-driving','long-distance','fuel-economy'], ARRAY['premium','new','eco-friendly'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Michelin-Pilot-Sport-EV.png'], 'May–September', 5, 50000, 4.9, 127, false),

('brid-turanza6-ev-23545r20', 'Bridgestone Turanza 6 EV', 'Bridgestone', 'Turanza 6 EV', 'eco', ARRAY['passenger','suv'], 235, 45, 20, '235/45 R20', 100, 'W', 255, NULL, 12, 'A', 'A', 68, 1, 'Bridgestone Turanza 6 EV with Enliten Technology specifically for Tesla, BMW iX and other EV models. Foam damper reduces interior noise.', ARRAY['EV-Reinforced','Enliten Technology','Foam damper','Low Rolling Resistance'], ARRAY['For Tesla, BMW iX, Rivian','Foam damper','Enliten for maximum range','Fuel Efficiency A'], ARRAY['electric-vehicles','long-distance','fuel-economy'], ARRAY['eco-friendly','new'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Bridgestone-Turanza-6.png'], 'May–September', 5, 60000, 4.7, 89, false),

('cont-eccontact7-19560r16', 'Continental EcoContact 7', 'Continental', 'EcoContact 7', 'eco', ARRAY['passenger'], 195, 60, 16, '195/60 R16', 89, 'H', 98, NULL, 48, 'A', 'A', 68, 1, 'Continental EcoContact 7 sets benchmarks in fuel efficiency. Both EU labels at A — a rarity in the market. Ideal for electric and hybrid vehicles.', ARRAY['Adaptive Silica Compound','Low Rolling Resistance','Eco-certified'], ARRAY['Fuel Efficiency A + Wet Grip A','Lowest rolling resistance in class','Eco-certified'], ARRAY['fuel-economy','city-commute','electric-vehicles'], ARRAY['eco-friendly','bestseller'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Continental-EcoContact-7.png'], 'May–September', 5, 60000, 4.5, 275, false),

('pir-elect-p7-22550r17', 'Pirelli Elect P7', 'Pirelli', 'Elect P7', 'eco', ARRAY['passenger'], 225, 50, 17, '225/50 R17', 98, 'W', 168, NULL, 20, 'A', 'A', 68, 1, 'Pirelli Elect P7 with special ELECT Compound was developed exclusively for electric vehicles. Optimal balance between range and safety.', ARRAY['ELECT Compound','EV-reinforced sidewall','Low Rolling Resistance','Self-supporting sidewall'], ARRAY['ELECT Compound for EV','Wet Grip A + Fuel Efficiency A','OEM for VW ID., Renault Zoe'], ARRAY['electric-vehicles','fuel-economy','long-distance'], ARRAY['eco-friendly','new'], ARRAY['https://www.tyrereviews.com/public/tyres/thumbs/x200-Pirelli-Cinturato-P7-C2.png'], 'May–September', 5, 55000, 4.6, 144, false);

CREATE TABLE contact_auth (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id   UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  code_phrase  TEXT NOT NULL UNIQUE,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────
-- THREADS  (one deal / outreach campaign)
-- account and contact can be unknown at creation, linked later
-- ─────────────────────────────────────────
CREATE TABLE threads (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id         UUID REFERENCES accounts(id) ON DELETE SET NULL,
  primary_contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  title              TEXT,
  description        TEXT,
  status             TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'confirmed_purchase', 'closed')),
  last_call_outcome  TEXT,
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE call_logs (
  run_id       UUID PRIMARY KEY,
  contact_id   UUID REFERENCES contacts(id) ON DELETE SET NULL,
  thread_id    UUID REFERENCES threads(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  phone_number TEXT,
  transcript   JSONB
);

CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id   UUID REFERENCES threads(id) ON DELETE CASCADE,
  contact_id  UUID REFERENCES contacts(id) ON DELETE SET NULL,
  channel     TEXT NOT NULL CHECK (channel IN ('chat', 'sms')),
  direction   TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  body        TEXT NOT NULL,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE purchases (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id    UUID REFERENCES threads(id) ON DELETE SET NULL,
  contact_id   UUID REFERENCES contacts(id) ON DELETE SET NULL,
  product_id   TEXT REFERENCES products(id),
  quantity     INTEGER,
  confirmed_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE thread_products (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  priority   INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (thread_id, product_id)
);

-- ─────────────────────────────────────────
-- MOCK DATA
-- ─────────────────────────────────────────

-- INSERT INTO accounts (id, name, country, website) VALUES
--   ('a0000000-0000-0000-0000-000000000001', 'BMW Group',          'Germany', 'https://www.bmwgroup.com'),
--   ('a0000000-0000-0000-0000-000000000002', 'Mercedes-Benz AG',   'Germany', 'https://www.mercedes-benz.com'),
--   ('a0000000-0000-0000-0000-000000000003', 'Volkswagen Group',   'Germany', 'https://www.volkswagenag.com'),
--   ('a0000000-0000-0000-0000-000000000004', 'Stellantis NV',      'Netherlands', 'https://www.stellantis.com');

-- INSERT INTO contacts (id, account_id, full_name, job_title, phone, email) VALUES
--   ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Klaus Berger',  'Global Purchasing Director', '+49 89 3820 1100', 'k.berger@bmwgroup.com'),
--   ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Anna Richter',  'R&D Engineering Lead',       '+49 89 3820 1201', 'a.richter@bmwgroup.com'),
--   ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Stefan Wolf',   'Procurement Manager',        '+49 711 1720 3300', 's.wolf@mercedes-benz.com'),
--   ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'Petra Koch',    'Supply Chain Director',      '+49 5361 9 4400',  'p.koch@volkswagen.de'),
--   ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000004', 'Marc Dubois',   'Fleet Procurement Lead',     '+31 20 4442 5500', 'm.dubois@stellantis.com'),
--   ('c0000000-0000-0000-0000-000000000006', NULL,                                   NULL,            NULL,                         '+49 30 9988 7766', NULL);

-- ACCOUNTS
INSERT INTO accounts (id, name, country, website) VALUES
('a0000001-0000-0000-0000-000000000001', 'BMW Group',            'Germany', 'https://www.bmwgroup.com'),
('a0000001-0000-0000-0000-000000000002', 'Mercedes-Benz',        'Germany', 'https://www.mercedes-benz.com'),
('a0000001-0000-0000-0000-000000000003', 'Audi AG',              'Germany', 'https://www.audi.com'),
('a0000001-0000-0000-0000-000000000004', 'Volkswagen Group',     'Germany', 'https://www.volkswagen-group.com');

-- CONTACTS
INSERT INTO contacts (id, account_id, full_name, job_title, phone, email) VALUES
('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Karreem Battles', 'Fleet Sales Manager',          '+1 205 555-0183', 'k.battles@bmwdealer.com'),
('c0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', 'Lance Walker',    'Fleet Sales Manager',          '+44 28 555-0174', 'l.walker@bmw-agnew.com'),
('c0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000002', 'Sally Dennis',    'National Fleet Sales Manager', '+44 20 555-0392', 's.dennis@mercedes-benz.co.uk'),
('c0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000002', 'James O''Reilly', 'Fleet Strategic Account Mgr',  '+44 131 555-0047', 'j.oreilly@mercedes-benz.co.uk'),
('c0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000002', 'Damien Rigby',    'Fleet Strategic Account Mgr',  '+44 121 555-0133', 'd.rigby@mercedes-benz.co.uk'),
('c0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000003', 'Fabio Madeddu',   'Fleet Account Manager',        '+39 02 555-0261', 'f.madeddu@giacomel-audi.it'),
('c0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000003', 'James Douglas',   'Head of Fleet Sales',          '+44 118 555-0219', 'j.douglas@audi.co.uk'),
('c0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000004', 'Sam Ragheb',      'Fleet Strategic Account Mgr',  '+44 161 555-0088', 's.ragheb@vw-group.com'),
('c0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000001', 'Liam Carter',     'Senior Sales Executive',       '+49 89 555-0322',  'dragoncityfacebookgems@gmail.com');

INSERT INTO contact_auth (contact_id, code_phrase) VALUES
  ('c0000001-0000-0000-0000-000000000001', '774112'),
  ('c0000001-0000-0000-0000-000000000002', '220934'),
  ('c0000001-0000-0000-0000-000000000003', '551287'),
  ('c0000001-0000-0000-0000-000000000004', '883409'),
  ('c0000001-0000-0000-0000-000000000005', '330156'),
  ('c0000001-0000-0000-0000-000000000006', '416703'),
  ('c0000001-0000-0000-0000-000000000007', '629841'),
  ('c0000001-0000-0000-0000-000000000008', '957034'),
  ('c0000001-0000-0000-0000-000000000009', '103847');

INSERT INTO purchases (contact_id, product_id, quantity, confirmed_at) VALUES

-- Karreem Battles (BMW)
('c0000001-0000-0000-0000-000000000001', 'cont-wc-ts870-20555r16',          320, '2026-01-12 09:30:00+00'),
('c0000001-0000-0000-0000-000000000001', 'mich-crossclimate2-22545r17',     180, '2026-02-03 11:00:00+00'),

-- Lance Walker (BMW)
('c0000001-0000-0000-0000-000000000002', 'good-ultragrip9-18565r15',        500, '2026-01-08 14:00:00+00'),
('c0000001-0000-0000-0000-000000000002', 'hank-kinergy4s2-22550r18',        220, '2026-03-15 10:30:00+00'),

-- Sally Dennis (Mercedes)
('c0000001-0000-0000-0000-000000000003', 'cont-premiumcontact7-22545r18',   400, '2026-02-18 08:45:00+00'),
('c0000001-0000-0000-0000-000000000003', 'mich-pilot-ev-25545r21',          120, '2026-03-22 13:00:00+00'),

-- James O'Reilly (Mercedes Scotland)
('c0000001-0000-0000-0000-000000000004', 'pir-sottozero3-24540r18',         160, '2026-01-20 09:00:00+00'),
('c0000001-0000-0000-0000-000000000004', 'noki-hakka-r3-22545r18',           90, '2026-02-10 16:00:00+00'),

-- Damien Rigby (Mercedes Midlands)
('c0000001-0000-0000-0000-000000000005', 'mich-primacy4-21555r17',          300, '2026-03-05 10:00:00+00'),
('c0000001-0000-0000-0000-000000000005', 'cont-allseasoncontact2-20555r16', 200, '2026-03-28 14:30:00+00'),

-- Fabio Madeddu (Audi Italy)
('c0000001-0000-0000-0000-000000000006', 'brid-potenza-s001-23540r19',       80, '2026-02-25 11:30:00+00'),
('c0000001-0000-0000-0000-000000000006', 'cont-sc7-20555r16',               240, '2026-04-01 09:15:00+00'),

-- James Douglas (Audi UK)
('c0000001-0000-0000-0000-000000000007', 'cont-eccontact7-19560r16',        350, '2026-01-30 15:00:00+00'),
('c0000001-0000-0000-0000-000000000007', 'good-eagle-f1-25540r19',          100, '2026-03-10 12:00:00+00'),

-- Sam Ragheb (VW)
('c0000001-0000-0000-0000-000000000008', 'falken-ziex-21555r17',            400, '2026-02-14 08:00:00+00'),
('c0000001-0000-0000-0000-000000000008', 'good-vector4s-gen3-21560r16',     180, '2026-04-05 10:45:00+00'),

-- Liam Carter (BMW Group) — top buyer (~€130,625; ~20% above previous leader)
('c0000001-0000-0000-0000-000000000009', 'mich-crossclimate2-22545r17',     300, '2026-01-15 09:00:00+00'),
('c0000001-0000-0000-0000-000000000009', 'cont-premiumcontact7-22545r18',   250, '2026-02-20 11:30:00+00'),
('c0000001-0000-0000-0000-000000000009', 'brid-turanza6-22545r18',          200, '2026-03-18 14:00:00+00'),
('c0000001-0000-0000-0000-000000000009', 'good-eagle-f1-25540r19',           25, '2026-04-08 10:00:00+00');