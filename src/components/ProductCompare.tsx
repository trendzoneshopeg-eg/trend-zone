import React from 'react';
import { Star, X, Check, ArrowDown } from 'lucide-react';
import { Product, Language } from '../types';

interface ProductCompareProps {
  compareList: Product[];
  onRemove: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  lang: Language;
}

export default function ProductCompare({ compareList, onRemove, onAddToCart, lang }: ProductCompareProps) {
  const isAr = lang === 'ar';

  const translations = {
    ar: {
      title: 'مقارنة المنتجات',
      subtitle: 'قارن المواصفات والأسعار والميزات المختلفة لمساعدتك في الاختيار',
      maxMsg: 'يمكنك مقارنة حتى 3 منتجات معًا',
      emptyState: 'الرجاء إضافة منتجات من المتجر من زر المقارنة لعرضها هنا.',
      price: 'السعر',
      rating: 'التقييم',
      colors: 'الألوان المتاحة',
      sizes: 'المقاسات المتاحة',
      stock: 'المخزون',
      addToCart: 'إضافة للسلة',
      remove: 'إزالة من المقارنة'
    },
    en: {
      title: 'Product Comparison',
      subtitle: 'Compare specs, pricing, and key features to make the best purchase',
      maxMsg: 'You can compare up to 3 products side-by-side',
      emptyState: 'Add products using the compare button on each item card to see them here.',
      price: 'Price',
      rating: 'Rating',
      colors: 'Available Colors',
      sizes: 'Available Sizes',
      stock: 'Stock Status',
      addToCart: 'Add to Cart',
      remove: 'Remove'
    }
  };

  const t = translations[lang];

  if (compareList.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 border border-slate-100 text-center text-slate-400" id="compare-empty">
        <p className="text-sm font-medium">{t.emptyState}</p>
        <p className="text-xs text-slate-300 mt-1">{t.maxMsg}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-100 shadow-sm" id="compare-section">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">{t.title}</h3>
        <p className="text-xs text-slate-500 mt-1">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        {compareList.map((product) => {
          const finalPrice = product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price;
          const discount = product.originalPrice ? Math.round(((product.originalPrice - finalPrice) / product.originalPrice) * 100) : 0;

          return (
            <div 
              key={product.id} 
              className="border border-slate-100 rounded-xl p-4 flex flex-col justify-between hover:border-amber-400 transition-all relative overflow-hidden"
              id={`compare-item-${product.id}`}
            >
              {/* Remove button */}
              <button 
                onClick={() => onRemove(product.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 transition-colors cursor-pointer"
                title={t.remove}
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <img 
                  src={product.image} 
                  alt={isAr ? product.nameAr : product.nameEn} 
                  className="w-full h-32 object-cover rounded-lg mb-3"
                  referrerPolicy="no-referrer"
                />
                
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {isAr ? product.nameAr : product.nameEn}
                </h4>
                
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-bold text-slate-700 font-mono">{product.rating}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({product.reviewsCount})</span>
                </div>

                <div className="mt-3 space-y-3 pt-3 border-t border-slate-100">
                  {/* Price */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">{t.price}</span>
                    <div className="text-left">
                      <span className="font-bold text-amber-600 font-mono">{finalPrice} EGP</span>
                      {product.originalPrice && (
                        <div className="text-[10px] text-slate-400 line-through font-mono">
                          {product.originalPrice} EGP
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">{t.rating}</span>
                    <span className="text-slate-800 font-medium">
                      {product.rating >= 4.7 ? (isAr ? 'ممتاز' : 'Excellent') : (isAr ? 'جيد جداً' : 'Very Good')}
                    </span>
                  </div>

                  {/* Colors */}
                  <div className="text-xs">
                    <span className="text-slate-500 block mb-1">{t.colors}</span>
                    <div className="flex flex-wrap gap-1">
                      {product.colors.map((c, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-sm">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="text-xs">
                    <span className="text-slate-500 block mb-1">{t.sizes}</span>
                    <div className="flex flex-wrap gap-1">
                      {product.sizes.map((s, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">{t.stock}</span>
                    {product.stock > 5 ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> {isAr ? 'متوفر' : 'In Stock'}
                      </span>
                    ) : (
                      <span className="text-rose-500 font-bold flex items-center gap-1 font-mono">
                        {isAr ? 'محدود متبقي' : 'Limited'}: {product.stock}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50">
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-amber-600 hover:text-white transition-all cursor-pointer"
                >
                  {t.addToCart}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
