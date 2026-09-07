import React from 'react';
import { X, Printer, Share2, ShoppingBag, MessageSquare, Phone, Sparkles, Check } from 'lucide-react';
import { Poster } from '../types';
import { formatFCFA, buildSmsHref, buildWhatsAppHref } from '../utils/formatters';

interface PosterPreviewModalProps {
  poster: Poster | null;
  onClose: () => void;
  onAddToCart: (poster: Poster) => void;
}

export const PosterPreviewModal: React.FC<PosterPreviewModalProps> = ({
  poster,
  onClose,
  onAddToCart,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!poster) return null;

  const smsText = `Bonjour Ebrin Mathieu Chic, je commande l'affiche commerciale "${poster.title}" (${poster.priceFCFA} FCFA). Merci de confirmer ma livraison.`;
  const smsUrl = buildSmsHref(poster.contactPhone || '01047286', smsText);
  const whatsAppUrl = buildWhatsAppHref(poster.contactPhone || '01047286', smsText);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${poster.enterpriseName} - ${poster.title}`,
          text: `Découvrez cette affiche de vente à ${poster.priceFCFA} FCFA chez ${poster.enterpriseName}. Contact SMS : ${poster.contactPhone}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      navigator.clipboard.writeText(
        `Affiche de vente ${poster.title} à ${poster.priceFCFA} FCFA - Contactez Ebrin Mathieu Chic au ${poster.contactPhone}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto relative"
        id="poster-preview-dialog"
      >
        {/* Header toolbar */}
        <div className="bg-stone-900 text-stone-100 p-4 sm:px-6 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="font-serif font-bold text-sm sm:text-base text-stone-100">
              Affiche Commerciale Grand Format
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Imprimer cette affiche"
              id="print-poster-btn"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Partager"
              id="share-poster-btn"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Fermer"
              id="close-poster-preview-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Affiche Content */}
        <div className="p-5 sm:p-8 bg-gradient-to-b from-stone-50 to-amber-50/40 print:p-0">
          <div className="bg-white border-2 border-stone-900 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            {/* Top Enterprise Banner on the Poster */}
            <div className="border-b-2 border-stone-900 pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[10px] tracking-widest font-extrabold uppercase text-amber-700">
                  MAISON DE COMMERCE & STYLISME
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
                  {poster.enterpriseName}
                </h2>
              </div>
              <div className="text-right sm:text-right">
                <div className="inline-flex items-center gap-1.5 bg-stone-950 text-amber-400 font-mono text-xs font-bold px-3 py-1 rounded-full">
                  <Phone className="w-3.5 h-3.5" />
                  <span>SMS : {poster.contactPhone}</span>
                </div>
              </div>
            </div>

            {/* Poster Imagery */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] mb-4 bg-stone-900">
              <img
                src={poster.imageUrl}
                alt={poster.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              
              {/* Floating Price Tag */}
              <div className="absolute bottom-4 right-4 bg-amber-500 text-stone-950 p-3 sm:p-4 rounded-2xl shadow-2xl border-2 border-stone-950 text-center transform rotate-1">
                <div className="text-[10px] uppercase font-black tracking-wider">Tarif Vente</div>
                <div className="font-mono text-2xl sm:text-3xl font-extrabold leading-none">
                  {formatFCFA(poster.priceFCFA)}
                </div>
                {poster.originalPriceFCFA && (
                  <div className="text-xs line-through text-stone-900/70 font-bold mt-0.5">
                    Au lieu de {formatFCFA(poster.originalPriceFCFA)}
                  </div>
                )}
              </div>

              {poster.badge && (
                <div className="absolute top-4 left-4 bg-stone-900/90 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40 flex items-center gap-1 shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                  {poster.badge}
                </div>
              )}
            </div>

            {/* Title & Description */}
            <div className="mb-4">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                {poster.title}
              </h3>
              <p className="text-sm text-stone-700 mt-2 leading-relaxed">
                {poster.description}
              </p>
            </div>

            {/* Features list */}
            {poster.features && poster.features.length > 0 && (
              <div className="bg-stone-50 rounded-xl p-3 sm:p-4 border border-stone-200 mb-4">
                <div className="text-xs font-bold uppercase text-stone-900 tracking-wider mb-2">
                  Détails & Avantages pour votre Entreprise :
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {poster.features.map((feature, i) => (
                    <div key={i} className="text-xs text-stone-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Call To Action in Poster */}
            <div className="bg-stone-950 text-stone-100 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <div className="text-xs text-amber-400 font-bold">Pour commander cette offre :</div>
                <div className="text-xs text-stone-300">
                  Envoyez un SMS direct au <strong className="text-white">{poster.contactPhone}</strong> ou ajoutez au panier en ligne.
                </div>
              </div>
              <div className="text-xs font-mono font-bold bg-amber-500 text-stone-950 px-3 py-1.5 rounded-lg whitespace-nowrap">
                Paiement Mobile Money en FCFA
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={smsUrl}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-300 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
              id="preview-sms-btn"
            >
              <MessageSquare className="w-4 h-4" />
              <span>SMS au {poster.contactPhone}</span>
            </a>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
              id="preview-whatsapp-btn"
            >
              <span>WhatsApp</span>
            </a>
          </div>

          <button
            onClick={() => {
              onAddToCart(poster);
              onClose();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition-all"
            id="preview-add-cart-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ajouter au Panier ({formatFCFA(poster.priceFCFA)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
