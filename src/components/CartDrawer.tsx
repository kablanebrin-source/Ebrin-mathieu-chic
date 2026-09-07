import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageSquare, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../types';
import { formatFCFA, buildSmsHref } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (posterId: string, delta: number) => void;
  onRemoveItem: (posterId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalFCFA = cart.reduce((sum, item) => sum + item.poster.priceFCFA * item.quantity, 0);
  const totalArticles = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Preformatted SMS content with cart items
  const itemsText = cart
    .map(i => `${i.quantity}x ${i.poster.title} (${formatFCFA(i.poster.priceFCFA * i.quantity)})`)
    .join(', ');
  const smsBody = `Bonjour Ebrin Mathieu Chic, je passe commande de mon panier : [${itemsText}]. Total : ${formatFCFA(totalFCFA)}. Nom/Entreprise :`;
  const smsDirectUrl = buildSmsHref('01047286', smsBody);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div 
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200"
          id="cart-drawer-panel"
        >
          {/* Header */}
          <div className="p-5 sm:px-6 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                  Mon Panier en FCFA
                </h2>
                <p className="text-[11px] text-stone-400">
                  {totalArticles} {totalArticles > 1 ? 'articles' : 'article'} • Ebrin Mathieu Chic
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
              id="close-cart-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-800">
                    Votre panier est actuellement vide
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Parcourez nos affiches de vente à 500 et 1 000 FCFA pour ajouter des articles chic à votre commande.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-stone-900 text-amber-300 hover:bg-stone-800 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                >
                  Voir les Affiches
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
                  <span>Articles sélectionnés</span>
                  <button
                    onClick={onClearCart}
                    className="text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Vider le panier
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.poster.id}
                    className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex gap-3 relative group"
                    id={`cart-item-${item.poster.id}`}
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.poster.imageUrl}
                      alt={item.poster.title}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0 bg-stone-200"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                            {item.poster.title}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.poster.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-stone-500 truncate">
                          {item.poster.enterpriseName}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {/* Quantity counter */}
                        <div className="flex items-center border border-stone-300 rounded-lg bg-white shadow-xs">
                          <button
                            onClick={() => onUpdateQuantity(item.poster.id, -1)}
                            className="p-1 hover:bg-stone-100 text-stone-600 rounded-l-lg transition-colors"
                            title="Diminuer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold font-mono text-stone-800 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.poster.id, 1)}
                            className="p-1 hover:bg-stone-100 text-stone-600 rounded-r-lg transition-colors"
                            title="Augmenter"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price in FCFA */}
                        <div className="text-right">
                          <span className="font-mono font-extrabold text-xs sm:text-sm text-amber-800">
                            {formatFCFA(item.poster.priceFCFA * item.quantity)}
                          </span>
                          <div className="text-[10px] text-stone-400">
                            {formatFCFA(item.poster.priceFCFA)} / u
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 space-y-3">
              {/* Financial calculations in FCFA */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Sous-total articles :</span>
                  <span className="font-mono font-semibold text-stone-900">{formatFCFA(totalFCFA)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de traitement & SMS :</span>
                  <span className="text-emerald-700 font-semibold font-mono">0 FCFA (Gratuit)</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-stone-900">Total à Payer :</span>
                  <span className="font-serif font-extrabold text-xl text-amber-700 font-mono">
                    {formatFCFA(totalFCFA)}
                  </span>
                </div>
              </div>

              {/* Primary action: Online Payment */}
              <button
                onClick={onProceedToCheckout}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                id="proceed-checkout-btn"
              >
                <span>Payer en Ligne en FCFA</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary action: Direct SMS order */}
              <a
                href={smsDirectUrl}
                className="w-full bg-stone-900 hover:bg-stone-800 text-amber-300 py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-stone-800"
                id="cart-sms-direct-btn"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Commander par SMS au 01047286</span>
              </a>

              <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paiement sécurisé FCFA (Wave, Orange, MTN, Moov, Carte)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
