export interface Product {
  id: string;
  name: string;
  image_url: string;
  category_id: string | null;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  products?: Product[];
}
