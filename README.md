# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

Pour créer un bucket (stockage) dans Supabase, vous devez utiliser l'interface du tableau de bord Supabase ou l'API Supabase. Voici comment créer un bucket via l'interface du tableau de bord :

Connectez-vous à votre projet Supabase et accédez au tableau de bord Supabase.

Dans le tableau de bord, accédez à l'onglet "Storage".

Cliquez sur le bouton "Create bucket" pour créer un nouveau bucket.

Donnez un nom unique à votre bucket, par exemple, 'products-images', et configurez les autres paramètres selon vos besoins.

Cliquez sur le bouton "Create bucket" pour créer le bucket.

Répétez les mêmes étapes pour créer un autre bucket nommé 'looks-images' ou tout autre bucket que vous souhaitez créer.

Les buckets créés seront ensuite disponibles pour que vous puissiez y stocker des fichiers et des ressources.

```sql
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  old_id TEXT,
  title TEXT,
  description TEXT,
  images JSONB,
  condition TEXT,
  brand TEXT,
  category TEXT,
  type TEXT,
  provider TEXT,
  colors TEXT[],
  materials TEXT[],
  details TEXT[],
  shoe_size TEXT,
  size TEXT,
  custom_fields JSONB,
  instructions TEXT,
  price REAL,
  final_price REAL,
  published BOOLEAN
);

CREATE TABLE IF NOT EXISTS looks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP,
  title TEXT,
  thumbnail BOOLEAN,
  designer TEXT,
  univers TEXT,
  left_top UUID REFERENCES products(id),
  left_bottom UUID REFERENCES products(id),
  right_top UUID REFERENCES products(id),
  right_middle UUID REFERENCES products(id),
  right_bottom UUID REFERENCES products(id),
  is_public BOOLEAN,
  published BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS profiles (
  email TEXT NOT NULL PRIMARY KEY,
  last_update TIMESTAMP DEFAULT NOW(),
  firstname TEXT,
  lastname TEXT,
  silhouette TEXT,
  age TEXT,
  looking_for TEXT[],
  occasion TEXT,
  height TEXT,
  color TEXT,
  top_budget SMALLINT,
  coat_budget SMALLINT,
  bottom_budget SMALLINT,
  shoes_budget SMALLINT,
  bag_budget SMALLINT,
  complete_budget INTEGER,
  prefered_brands TEXT[],
  season TEXT,
  styles TEXT[],
  not_colors TEXT[],
  not_materials TEXT[],
  not_details TEXT[],
  not_imprimes TEXT[],
  top_size SMALLINT,
  bottom_size SMALLINT,
  shoe_size SMALLINT,
  heel_height TEXT[],
  phone TEXT,
  finished BOOLEAN
);

CREATE TABLE IF NOT EXISTS looks_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  customer_email TEXT REFERENCES profiles(email),
  look_id UUID REFERENCES looks(id)
);

CREATE OR REPLACE VIEW brands AS
SELECT DISTINCT brand
FROM products;

CREATE OR REPLACE VIEW providers AS
SELECT DISTINCT provider
FROM products;


CREATE OR REPLACE VIEW designers AS
SELECT DISTINCT designer
FROM looks;

CREATE OR REPLACE VIEW univers AS
SELECT DISTINCT univers
FROM looks;

CREATE OR REPLACE FUNCTION get_unused_looks()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_agg(jsonb_build_object(
           'id', unassigned_looks.id,
           'created_at', unassigned_looks.created_at,
           'left_top', leftTopProducts,
           'left_bottom', leftBottomProducts,
           'right_top', rightTopProducts,
           'right_middle', rightMiddleProducts,
           'right_bottom', rightBottomProducts
         ))
  INTO result
  FROM (SELECT looks.id as id, looks.created_at, looks.left_top, looks.left_bottom, looks.right_top, looks.right_middle, looks.right_bottom
        FROM looks
        LEFT OUTER JOIN looks_profiles  ON looks_profiles.look_id = looks.id
        WHERE looks_profiles.look_id IS NULL) as unassigned_looks
  LEFT JOIN products AS leftTopProducts ON unassigned_looks.left_top = leftTopProducts.id
  LEFT JOIN products AS leftBottomProducts ON unassigned_looks.left_bottom = leftBottomProducts.id
  LEFT JOIN products AS rightTopProducts ON unassigned_looks.right_top = rightTopProducts.id
  LEFT JOIN products AS rightMiddleProducts ON unassigned_looks.right_middle = rightMiddleProducts.id
  LEFT JOIN products AS rightBottomProducts ON unassigned_looks.right_bottom = rightBottomProducts.id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_all_looks()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_agg(jsonb_build_object(
           'id', all_looks.id,
           'created_at', all_looks.created_at,
           'customers', all_looks.customers,
           'left_top', leftTopProducts,
           'left_bottom', leftBottomProducts,
           'right_top', rightTopProducts,
           'right_middle', rightMiddleProducts,
           'right_bottom', rightBottomProducts
         ))
  INTO result
  FROM (
    SELECT looks.id as id, looks.created_at,
           looks.left_top, looks.left_bottom, looks.right_top, looks.right_middle, looks.right_bottom,
           array_remove(array_agg(looks_profiles.customer_email), NULL) as customers
    FROM looks
    LEFT JOIN looks_profiles  ON looks_profiles.look_id = looks.id
    GROUP BY looks.id
  ) as all_looks
  LEFT JOIN products AS leftTopProducts ON all_looks.left_top = leftTopProducts.id
  LEFT JOIN products AS leftBottomProducts ON all_looks.left_bottom = leftBottomProducts.id
  LEFT JOIN products AS rightTopProducts ON all_looks.right_top = rightTopProducts.id
  LEFT JOIN products AS rightMiddleProducts ON all_looks.right_middle = rightMiddleProducts.id
  LEFT JOIN products AS rightBottomProducts ON all_looks.right_bottom = rightBottomProducts.id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_nb_looks_users()
RETURNS SETOF JSONB AS $$
BEGIN
  RETURN QUERY
  SELECT jsonb_build_object(
           'profile', profiles,
           'nb_looks', COUNT(looks_profiles.customer_email),
           'last_look_date', MAX(looks_profiles.created_at)
         ) AS result
  FROM profiles
  LEFT JOIN looks_profiles ON profiles.email = looks_profiles.customer_email
  GROUP BY profiles.email;
END;
$$ LANGUAGE plpgsql;
```