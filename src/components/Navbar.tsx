import React from 'react';
import { ShoppingBag, PlusCircle, MessageSquare, Sparkles, PhoneCall, ShieldCheck } from 'lucide-react';
import { formatFCFA } from '../utils/formatters';

interface NavbarProps {
  activeTab: 'catalog' | 'publish' | 'orders';
  setActiveTab: (tab: 'catalog' | 'publish' | 'orders') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenPublish: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenPublish,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      {/* Top micro-announcement bar */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-50 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 tracking-wide">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200" />
        <span>Offres Entreprises Ebrin Mathieu Chic : Affiches & Ventes de <strong>500 à 1 000 FCFA</strong></span>
        <span className="hidden sm:inline">|</span>
        <span className="hidden sm:flex items-center gap-1">
          <MessageSquare className="w-3 h-3" /> SMS direct : <strong>01047286</strong>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity */}
          <div 
            onClick={() => setActiveTab('catalog')} 
            className="cursor-pointer flex items-center gap-3 group"
            id="brand-logo-button"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-serif font-bold text-xl shadow-lg border border-amber-400/30 group-hover:scale-105 transition-transform">
              EM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-100 group-hover:text-amber-400 transition-colors">
                  Ebrin Mathieu Chic
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full">
                  Entreprise
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Affiches de vente & articles chics • Paiement en ligne en FCFA
              </p>
            </div>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Direct SMS phone shortcut */}
            <a
              href="sms:01047286?body=Bonjour%20Ebrin%20Mathieu%20Chic,%20je%20souhaite%20commander%20une%20affiche%20de%20vente."
              className="hidden md:flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 px-3.5 py-2 rounded-xl text-xs font-semibold border border-stone-700 transition-colors"
              id="header-sms-link"
              title="Envoyer un SMS au 01047286"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>SMS : 01047286</span>
            </a>

            {/* Quick Publish button */}
            <button
              onClick={onOpenPublish}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95"
              id="publish-poster-nav-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Publier une Affiche</span>
              <span className="sm:hidden">Publier</span>
            </button>

            {/* Cart Button with FCFA indicator */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 px-3.5 sm:px-4 py-2 rounded-xl border border-stone-700 transition-all shadow-sm active:scale-95"
              id="cart-toggle-nav-btn"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-stone-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden xs:block">
                <div className="text-[10px] uppercase font-semibold text-stone-400 leading-tight">Mon Panier</div>
                <div className="text-xs sm:text-sm font-bold text-amber-400 font-mono leading-tight">
                  {formatFCFA(cartTotal)}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
