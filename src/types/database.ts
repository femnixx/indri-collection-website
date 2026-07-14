export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category; // hasil join
}

export interface ContactInfo {
  id: string;
  whatsapp_number: string;
  address: string | null;
  operational_hours: string | null;
  instagram_url: string | null;
  updated_by: string | null;
  updated_at: string;
}
