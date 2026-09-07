import React from 'react';
import { ShoppingBag, Eye, MessageSquare, Check, Tag, Sparkles } from 'lucide-react';
import { Poster } from '../types';
import { formatFCFA, buildSmsHref } from '../utils/formatters';

interface PosterCardProps {
  poster: Poster;
  onAddToCart: (poster: Poster) => void;
  onPreview: (poster: Poster) => void;
  isInCart: boolean;
}

export const PosterCard: React.FC<PosterCardProps> = ({
  poster,
  onAddToCart,
  onPreview,
  isInCart,
}) => {
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAdd = () => {
    onAddToCart(poster);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const smsText = `Bonjour Ebrin Mathieu Chic, je souhaite commander l'affiche "${poster.title}" au prix de ${poster.priceFCFA} FCFA. Mon numéro de contact est:`;
  const smsUrl = buildSmsHref(poster.contactPhone || '01047286', smsText);

  return (
    <div 
      className="group bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
      id={`poster-card-${poster.id}`}
    >
      {/* Visual Image & Overlays */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-stone-100 overflow-hidden">
        <img
          src={poster.imageUrl}
          alt={poster.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-stone-950/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="bg-stone-900/90 backdrop-blur-sm text-stone-100 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-stone-700/50 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            {poster.enterpriseName}
          </span>

          {poster.badge && (
            <span className="bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {poster.badge}
            </span>
          )}
        </div>

        {/* Bottom Bar on Image: Price Spotlight */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="bg-stone-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 text-white shadow-lg">
            <div className="text-[10px] text-amber-300 font-medium uppercase tracking-wider">Prix Unitaire</div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-lg sm:text-xl font-bold text-amber-400">
                {formatFCFA(poster.priceFCFA)}
              </span>
              {poster.originalPriceFCFA && (
                <span className="text-xs line-through text-stone-400 font-mono">
                  {formatFCFA(poster.originalPriceFCFA)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onPreview(poster)}
            className="bg-white/90 hover:bg-white text-stone-900 p-2 rounded-xl backdrop-blur-sm shadow hover:scale-105 transition-all text-xs font-semibold flex items-center gap-1"
            title="Aperçu grand format de l'affiche"
            id={`preview-btn-${poster.id}`}
          >
            <Eye className="w-4 h-4 text-stone-700" />
            <span className="hidden sm:inline">Aperçu</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[10px]">
              {poster.category.replace('_', ' ')}
            </span>
          </div>

          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            {poster.title}
          </h3>

          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
            {poster.description}
          </p>

          {/* Feature bullets */}
          {poster.features && poster.features.length > 0 && (
            <ul className="mt-3 space-y-1">
              {poster.features.slice(0, 2).map((feature, idx) => (
                <li key={idx} className="text-[11px] text-stone-500 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                  <span className="truncate">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : isInCart
                ? 'bg-stone-900 text-amber-300 hover:bg-stone-800'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white'
            }`}
            id={`add-to-cart-${poster.id}`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Ajouté !</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{isInCart ? 'Ajouter encore' : 'Ajouter au Panier'}</span>
              </>
            )}
          </button>

          <a
            href={smsUrl}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-xs bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-900 border border-stone-200 transition-colors"
            title="Commander directement cette affiche par SMS au 01047286"
            id={`sms-order-btn-${poster.id}`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
            <span>SMS 01047286</span>
          </a>
        </div>
      </div>
    </div>
  );
};
