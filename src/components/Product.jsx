import React from 'react';

function Product() {
  const products = [
    {
      id: 1,
      name: "Premium Varsity Jacket Custom",
      category: "Outerwear / Konveksi",
      price: "Rp 185.000",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60", 
      shopeeUrl: "https://shopee.co.id",
      tokopediaUrl: "https://tokopedia.com"
    },
    {
      id: 2,
      name: "Exclusive Workshirt / Kemeja PDL",
      category: "Uniform / Seragam",
      price: "Rp 135.000",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60",
      shopeeUrl: "https://shopee.co.id",
      tokopediaUrl: "https://tokopedia.com"
    },
    {
      id: 3,
      name: "Oversized Heavyweight T-Shirt",
      category: "Casual Apparel",
      price: "Rp 85.000",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60",
      shopeeUrl: "https://shopee.co.id",
      tokopediaUrl: "https://tokopedia.com"
    }
  ];

  return (
    <section id="product" className="py-24 px-6 max-w-7xl mx-auto scroll-reveal">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">Our Marketplace Drops</p>
          <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900">Katalog Produk & Jasa</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="group flex flex-col bg-white border border-neutral-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-4 left-4 bg-blue-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                {product.category}
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 line-clamp-1">{product.name}</h3>
                <p className="text-neutral-500 font-bold text-xs mt-1">{product.price}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a href={product.shopeeUrl} target="_blank" rel="noreferrer" className="py-2 text-center text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-600 hover:text-white transition-all">Shopee</a>
                <a href={product.tokopediaUrl} target="_blank" rel="noreferrer" className="py-2 text-center text-xs font-extrabold uppercase tracking-wider text-green-600 bg-green-50 border border-green-200 hover:bg-green-600 hover:text-white transition-all">Tokopedia</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Product;