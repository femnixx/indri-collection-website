"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Send, Image as ImageIcon, X } from 'lucide-react';
import { processAndCompressImage } from '@/lib/imageUtils';

export default function OrderPage() {
  const [formData, setFormData] = useState({
    customer_name: '',
    order_type: '',
    size: '',
    description: '',
    quantity: 1,
    product_image_url: '',
    product_category: '',
  });
  const [images, setImages] = useState<{ url: string; category?: string; productId?: string; productName?: string }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [customerImagePreview, setCustomerImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchContactInfo();
  }, []);

  const fetchProducts = async () => {
    setIsLoadingImages(true);
    try {
      const res = await fetch('/api/indri-set/products');
      const json = await res.json();

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || 'Failed to fetch products');
      }

      const allImages: { url: string; category?: string; productId?: string; productName?: string }[] = [];

      for (const category of json.data) {
        if (category.products && Array.isArray(category.products)) {
          for (const product of category.products) {
            if (product.image_url) {
              allImages.push({
                url: product.image_url,
                category: category.name,
                productId: product.id,
                productName: product.name || category.name
              });
            }
          }
        }
      }

      setImages(allImages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const fetchContactInfo = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.whatsapp_number) {
        setWhatsappNumber(data.whatsapp_number.replace(/^\+/, ''));
      } else if (data.phone) {
        setWhatsappNumber(data.phone.replace(/^\+/, ''));
      }
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
    }
  };

  const handleImageSelect = (imageUrl: string, productId?: string, category?: string, productName?: string) => {
    setSelectedProduct(imageUrl);
    const orderType = productName || category || '';
    setFormData({
      ...formData,
      product_image_url: imageUrl,
      product_category: category || '',
      order_type: orderType
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setFormData({ ...formData, quantity: value });
  };

  const handleCustomerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Compress image before upload
      try {
        const compressedFile = await processAndCompressImage(file);

        // Upload via file-based storage API route → returns a visitable URL
        const uploadFormData = new FormData();
        uploadFormData.append('file', compressedFile);
        uploadFormData.append('folder', 'customer_orders');

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok || !uploadResult.success) {
          throw new Error(uploadResult.error || 'Gagal mengunggah gambar');
        }

        // Store the visitable URL
        setCustomerImagePreview(uploadResult.url);
      } catch (error: any) {
        console.error('Error uploading image:', error);
        alert('Gagal mengunggah gambar. Silakan coba lagi.');
      }
    }
  };

  const formatWhatsAppMessage = (): string => {
    const lines = [
      "🛍 *Pesanan Baru*",
      `👤 *Nama:* ${formData.customer_name}`,
      `📝 *Tipe Pesanan:* ${formData.order_type}`,
    ];

    if (formData.product_category) {
      lines.push(`📂 *Kategori:* ${formData.product_category}`);
    }

    if (formData.product_image_url) {
      lines.push(`🖼 *Gambar Produk:* ${formData.product_image_url}`);
    }

    if (formData.size) {
      lines.push(`📏 *Ukuran:* ${formData.size}`);
    }

    if (formData.description) {
      lines.push(`📄 *Deskripsi:* ${formData.description}`);
    }

    lines.push(`🔢 *Jumlah:* ${formData.quantity} pcs`);

    if (customerImagePreview) {
      lines.push(`📷 *Gambar/Contoh:* ${customerImagePreview}`);
    }

    lines.push("", "Mohon konfirmasi pesanan ini. Terima kasih! 🙏");

    return lines.join("\n");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.order_type || !formData.quantity || !formData.size) {
      alert('Nama, tipe pesanan, ukuran, dan jumlah wajib diisi!');
      return;
    }

    setIsSubmitting(true);

    try {
      const message = formatWhatsAppMessage();

      if (!whatsappNumber) {
        alert('Nomor WhatsApp belum dikonfigurasi. Silakan hubungi kami melalui halaman kontak.');
        return;
      }

      const encodedText = encodeURIComponent(message);

      // Use official wa.me - clean phone number
      const cleanPhone = whatsappNumber.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // Reset form
      setFormData({
        customer_name: '',
        order_type: '',
        size: '',
        description: '',
        quantity: 1,
        product_image_url: '',
        product_category: '',
      });
      setSelectedProduct(null);
      setCustomerImagePreview(null);
    } catch (error: any) {
      alert(error.message || 'Gagal membuat pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Buat Pesanan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih produk yang ingin Anda pesan dan isi detail pesanan. Kami akan segera menghubungi Anda via WhatsApp.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Selection */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Pilih Produk</h2>

            {isLoadingImages ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Belum ada produk tersedia.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-4 bg-white rounded-2xl shadow-sm">
                {images.map((image, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleImageSelect(image.url, image.productId, image.category, image.productName)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden aspect-square transition-all duration-300 ${
                      selectedProduct === image.url
                        ? 'ring-4 ring-blue-600 shadow-xl scale-105'
                        : 'ring-2 ring-transparent hover:ring-blue-300 shadow-md'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.productName || image.category || 'Product'}
                      className="w-full h-full object-cover"
                    />
                    {selectedProduct === image.url && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Detail Pesanan</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {selectedProduct ? "Produk Dipilih" : "Hal yang ingin dipesan"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="order_type"
                    value={formData.order_type}
                    onChange={handleInputChange}
                    required
                    disabled={!!selectedProduct}
                    className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${selectedProduct ? 'bg-blue-50 text-blue-900 font-medium cursor-not-allowed' : ''}`}
                    placeholder="Contoh: Jahitan, Pembuatan Baju, dll"
                  />
                  {selectedProduct && formData.order_type && (
                    <p className="text-xs text-blue-600 mt-1">✓ Terisi otomatis sesuai produk yang dipilih</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ukuran / Pengukuran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Contoh: S, M, L, XL atau lingkar perut 80cm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Untuk pakaian: ukuran S/M/L/XL atau lingkar perut, lingkar dada, panjang badan, dll
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                    placeholder="Detail tambahan tentang pesanan Anda (warna, bahan, motif, dll)..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Jumlah (pcs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Gambar / Contoh Gambar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomerImageChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {customerImagePreview && (
                    <div className="mt-3 relative inline-block">
                      <img
                        src={customerImagePreview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomerImagePreview(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Kirim Pesanan via WhatsApp
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
