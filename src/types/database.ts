export interface AuthUser {
  id: string;
}

export interface Admin {
  id: string;
  email: string; 
  full_name: string | null;
  role: string | null;
  created_at: string | null; 
}

export interface Category {
  id: string;
  name: string; 
  created_at: string | null;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string; 
  description: string | null;
  is_published: boolean; 
  created_by: string | null; 
  created_at: string | null;
  updated_at: string | null;
  image_url: string | null;
  categories?: Category;
  admins?: Admin;
}

export interface ContactInfo {
  id: string;
  whatsapp_number: string;
  address: string | null;
  operational_hours: string | null;
  instagram_url: string | null;
  updated_by: string | null;
  updated_at: string | null;
  tiktok_url: string | null;
  email_address: string | null;
  admins?: Admin;
}