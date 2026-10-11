import React, { useState } from 'react';
import { GalleryItem } from '../../types.ts';
import { Images, Maximize2, X } from 'lucide-react';

interface GalleryProps {
  gallery: GalleryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ gallery }) => {
  const [filter, setFilter] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = ['all', 'Campus', 'Labs', 'Sports'];

  const filteredItems = gallery.filter((item) => {
    if (filter === 'all') return true;
    return item.category.toLowerCase() === filter.toLowerCase();
  });

  return (
    <section id="gallery" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Header with Category Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900">
              Campus Life & Moments
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Photo Gallery & Campus Milestones
            </h2>
            <p className="text-sm text-slate-600">
              Glimpses into student life, sports victories, laboratory demonstrations, and morning assembly in Swarghat.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                  filter === cat
                    ? 'bg-indigo-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'All Photos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative rounded-xl overflow-hidden bg-slate-900 aspect-4/3 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="absolute bottom-0 inset-x-0 p-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-amber-300">
                  <span>{item.category}</span>
                  {item.date && <span className="text-slate-400">{item.date}</span>}
                </div>
                <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/85 backdrop-blur-md">
            <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-black/50 hover:bg-black/75 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-16/9 w-full bg-black">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-400">
                  <span className="font-semibold">{activePhoto.category}</span>
                  {activePhoto.date && <span className="text-slate-400">{activePhoto.date}</span>}
                </div>
                <h3 className="text-lg font-bold">{activePhoto.title}</h3>
                {activePhoto.caption && (
                  <p className="text-xs sm:text-sm text-slate-300">{activePhoto.caption}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
