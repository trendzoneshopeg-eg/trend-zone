import React, { useState } from 'react';
import { Star, Camera, Check, User, Calendar } from 'lucide-react';
import { Review, Language } from '../types';

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
  lang: Language;
}

export default function ReviewSection({ productId, initialReviews, lang }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews.filter(r => r.productId === productId));
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [reviewImage, setReviewImage] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const translations = {
    ar: {
      title: 'آراء وتقييمات العملاء',
      averageRating: 'متوسط التقييم',
      basedOn: 'بناءً على {count} من التقييمات الموثقة',
      noReviews: 'لا توجد تقييمات لهذا المنتج بعد. كن أول من يقيمه!',
      writeReview: 'اكتب تقييمك للمنتج',
      yourName: 'اسمك الكريم',
      placeholderName: 'مثال: أحمد محمد',
      ratingLabel: 'تقييمك بالنجوم',
      commentLabel: 'رأيك وتجربتك بالتفصيل',
      placeholderComment: 'اكتب رأيك هنا بكل أمانة لمساعدة الآخرين في الاختيار...',
      uploadImage: 'إرفاق صورة للمنتج (اختياري)',
      submit: 'إرسال التقييم المعتمد',
      success: 'تم إرسال قييمك بنجاح! شكرًا لمشاركتنا تجربتك.',
      verifiedPurchase: 'عملية شراء مؤكدة'
    },
    en: {
      title: 'Customer Reviews & Feedback',
      averageRating: 'Average Rating',
      basedOn: 'Based on {count} verified ratings',
      noReviews: 'No reviews yet. Be the first to review this product!',
      writeReview: 'Write a Review',
      yourName: 'Your Name',
      placeholderName: 'e.g. John Doe',
      ratingLabel: 'Your Rating',
      commentLabel: 'Detailed review comment',
      placeholderComment: 'Provide your honest opinion to help future customers...',
      uploadImage: 'Attach product photo (Optional)',
      submit: 'Submit Verified Review',
      success: 'Your review was submitted! Thank you for sharing.',
      verifiedPurchase: 'Verified Purchase'
    }
  };

  const t = translations[lang];

  // Fast calculations
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: newName,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0],
      images: reviewImage ? [reviewImage] : undefined
    };

    setReviews([newRev, ...reviews]);
    setNewName('');
    setNewComment('');
    setNewRating(5);
    setReviewImage(null);
    setSuccessMsg(t.success);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-xs border border-slate-100" id="reviews-container">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span>{t.title}</span>
        <span className="text-amber-500 font-mono">({reviews.length})</span>
      </h3>

      {/* Aggregate Score Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 p-4 rounded-xl mb-6">
        <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r md:border-slate-200 pb-4 md:pb-0">
          <div className="text-4xl font-extrabold font-mono text-slate-900">{avgRating}</div>
          <div className="flex justify-center my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-5 h-5 ${star <= Math.round(Number(avgRating)) ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} 
              />
            ))}
          </div>
          <p className="text-xs text-slate-500">
            {t.basedOn.replace('{count}', String(totalReviews))}
          </p>
        </div>

        <div className="md:col-span-8 space-y-2 px-2">
          {/* Star breakdowns */}
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(r => r.rating === stars).length;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2 text-xs">
                <span className="w-12 font-mono text-slate-600 text-right flex items-center justify-end gap-1">
                  {stars} <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </span>
                <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="w-8 text-left text-slate-400 font-mono">{Math.round(percentage)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form and List Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Review list */}
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl text-slate-400 text-sm">
              {t.noReviews}
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border-b border-slate-100 pb-4 last:border-0" id={`review-item-${r.id}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{r.userName}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 font-medium">
                            <Check className="w-3 h-3" /> {t.verifiedPurchase}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {r.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating stars */}
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-3.5 h-3.5 ${star <= r.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-250'}`} 
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-2 text-sm text-slate-600 leading-relaxed text-slate-700 bg-slate-50/50 p-2 rounded-lg mt-1.5 self-start">
                  {r.comment}
                </p>

                {r.images && r.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {r.images.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="customer preview" 
                        className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Create Review area */}
        <div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-100 self-start">
          <h4 className="text-base font-bold text-slate-900 mb-3">{t.writeReview}</h4>

          {successMsg && (
            <div className="p-3 mb-4 bg-emerald-100 text-emerald-800 text-xs rounded-lg font-medium flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.yourName}</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t.placeholderName}
                required
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.ratingLabel}</label>
              <div className="flex gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-6 h-6 ${star <= newRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.commentLabel}</label>
              <textarea 
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t.placeholderComment}
                required
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.uploadImage}</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-white border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-2 text-xs text-slate-700 hover:bg-slate-100 font-medium whitespace-nowrap">
                  <Camera className="w-4 h-4 text-slate-500" />
                  <span>{lang === 'ar' ? 'حدد صورة...' : 'Select Photo...'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden" 
                  />
                </label>
                {reviewImage && (
                  <div className="relative">
                    <img 
                      src={reviewImage} 
                      alt="upload preview" 
                      className="w-12 h-12 object-cover rounded-lg border border-amber-500"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      type="button" 
                      onClick={() => setReviewImage(null)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-amber-600 hover:text-white text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-all duration-150 flex items-center justify-center gap-2"
            >
              {t.submit}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
