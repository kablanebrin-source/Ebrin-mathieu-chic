import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, Filter, MessageSquare, ShoppingBag, PlusCircle, 
  CheckCircle2, PhoneCall, ShieldCheck, ArrowRight, RefreshCw, 
  Building, HelpCircle, FileText, Smartphone, CreditCard
} from 'lucide-react';
import { Poster, CartItem, PosterCategory, OrderRecord } from './types';
import { INITIAL_POSTERS } from './data/initialPosters';
import { Navbar } from './components/Navbar';
import { PosterCard } from './components/PosterCard';
import { PosterPreviewModal } from './components/PosterPreviewModal';
import { PublishPosterModal } from './components/PublishPosterModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { formatFCFA, buildSmsHref } from './utils/formatters';

const STORAGE_POSTERS_KEY = 'emc_posters_v1';
const STORAGE_CART_KEY = 'emc_cart_v1';
const STORAGE_ORDERS_KEY = 'emc_orders_v1';

export default function App() {
  // Posters state
  const [posters, setPosters] = useState<Poster[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POSTERS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_POSTERS;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Orders history state
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'catalog' | 'publish' | 'orders'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PosterCategory>('tous');
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [previewPoster, setPreviewPoster] = useState<Poster | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_POSTERS_KEY, JSON.stringify(posters));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [posters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [orders]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Cart actions
  const handleAddToCart = (poster: Poster) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.poster.id === poster.id);
      if (existing) {
        return prev.map((item) =>
          item.poster.id === poster.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { poster, quantity: 1 }];
    });
    showNotification(`"${poster.title}" ajouté au panier en FCFA !`);
  };

  const handleUpdateQuantity = (posterId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.poster.id === posterId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (posterId: string) => {
    setCart((prev) => prev.filter((item) => item.poster.id !== posterId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Publish poster
  const handlePublishPoster = (newPoster: Poster) => {
    setPosters((prev) => [newPoster, ...prev]);
    showNotification(`Affiche "${newPoster.title}" publiée avec succès !`);
  };

  // Order completion
  const handleOrderCompleted = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
  };

  // Filtered posters
  const filteredPosters = posters.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.enterpriseName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'tous' ? true : p.category === selectedCategory;

    const matchesPrice = p.priceFCFA <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const cartTotalFCFA = cart.reduce(
    (sum, item) => sum + item.poster.priceFCFA * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const directSmsUrl = buildSmsHref(
    '01047286',
    'Bonjour Ebrin Mathieu Chic, je vous contacte depuis la plateforme d\'affiches pour passer commande ou me renseigner.'
  );

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {/* Navbar with Brand, SMS, and Cart */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartTotalFCFA}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPublish={() => setIsPublishOpen(true)}
      />

      {/* Floating toast notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/40 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Hero Section with clear mission and contact */}
        <section 
          className="relative bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden border border-amber-500/20"
          id="hero-banner"
        >
          {/* Subtle background glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Plateforme Officielle • Ebrin Mathieu Chic</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-100 leading-tight">
              Affiches de Vente pour Entreprises & Boutiques
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Publiez et commandez des affiches commerciales haute qualité pour booster vos ventes d'entreprise. 
              Panier en ligne en <strong className="text-amber-400">FCFA</strong> avec tarifs exclusifs de <strong className="text-amber-400">500 à 1 000 FCFA</strong>.
            </p>

            {/* Micro Highlights Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-2.5">
                <div className="text-[10px] uppercase font-bold text-stone-400">Tarif Unique</div>
                <div className="font-mono text-sm sm:text-base font-bold text-amber-400">500 à 1 000 F</div>
              </div>
              <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-2.5">
                <div className="text-[10px] uppercase font-bold text-stone-400">Moyen de Paiement</div>
                <div className="text-xs sm:text-sm font-bold text-stone-200">En ligne en FCFA</div>
              </div>
              <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-2.5">
                <div className="text-[10px] uppercase font-bold text-stone-400">Numéro SMS</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-amber-400">01047286</div>
              </div>
              <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-2.5">
                <div className="text-[10px] uppercase font-bold text-stone-400">Maison Mère</div>
                <div className="text-xs sm:text-sm font-bold text-stone-200">Ebrin Mathieu Chic</div>
              </div>
            </div>

            {/* Quick Actions in Hero */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => setIsPublishOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2"
                id="hero-publish-btn"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publier une Nouvelle Affiche</span>
              </button>

              <a
                href={directSmsUrl}
                className="bg-stone-800/90 hover:bg-stone-800 text-amber-300 font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl border border-stone-700 active:scale-95 transition-all flex items-center gap-2"
                id="hero-sms-btn"
              >
                <MessageSquare className="w-4 h-4" />
                <span>SMS Direct : 01047286</span>
              </a>

              <button
                onClick={() => setIsOrdersOpen(true)}
                className="text-stone-400 hover:text-stone-200 text-xs font-semibold px-3 py-2 flex items-center gap-1.5 transition-colors"
                id="hero-orders-history-btn"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Mes Factures ({orders.length})</span>
              </button>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une affiche, costume, chaussures, accessoires..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                id="search-posters-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-600"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Price Range Slider (500 à 1000 FCFA) */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 px-4 flex items-center gap-3 min-w-[260px]">
              <div className="text-xs text-stone-600 whitespace-nowrap">
                Prix max : <strong className="font-mono text-amber-800">{formatFCFA(maxPrice)}</strong>
              </div>
              <input
                type="range"
                min={500}
                max={1000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
                id="filter-max-price-slider"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Catégorie :
            </span>
            {[
              { id: 'tous', label: 'Toutes les Affiches' },
              { id: 'vetements', label: 'Vêtements Chic' },
              { id: 'chaussures', label: 'Chaussures & Souliers' },
              { id: 'accessoires', label: 'Accessoires' },
              { id: 'affiches_pub', label: 'Affiches Publicitaires' },
              { id: 'packs_promo', label: 'Packs Entreprise' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as PosterCategory)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-amber-300 font-semibold shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
                id={`cat-filter-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Posters Catalogue Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-950">
                Catalogue d'Affiches en Vente
              </h2>
              <p className="text-xs text-stone-500">
                {filteredPosters.length} affiches disponibles pour commande immédiate en FCFA
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPublishOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-stone-200 transition-colors"
                id="publish-btn-secondary"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>+ Publier une Affiche</span>
              </button>
            </div>
          </div>

          {filteredPosters.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-800">
                Aucune affiche trouvée avec ces critères
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Essayez d'augmenter le filtre de prix jusqu'à 1 000 FCFA ou de modifier votre recherche.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('tous');
                  setMaxPrice(1000);
                }}
                className="bg-stone-900 text-amber-300 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {filteredPosters.map((poster) => (
                <PosterCard
                  key={poster.id}
                  poster={poster}
                  onAddToCart={handleAddToCart}
                  onPreview={(p) => setPreviewPoster(p)}
                  isInCart={cart.some((item) => item.poster.id === poster.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Enterprise Services & Payment Explainer Banner */}
        <section className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-700/80 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-700 pb-5">
            <div>
              <div className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest">
                SERVICES COMMERCIAUX & LOGISTIQUE
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                Comment commander vos affiches de vente en FCFA ?
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 bg-stone-800 text-amber-400 px-4 py-2 rounded-xl text-xs font-mono font-bold border border-stone-700">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>SMS Contact : 01047286</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 bg-stone-800/60 p-4 rounded-2xl border border-stone-700/50">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-stone-100">
                Choix au Panier en FCFA
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Sélectionnez les affiches de vente de votre choix entre <strong>500 et 1 000 FCFA</strong>. Ajoutez-les au panier pour regrouper vos articles d'entreprise.
              </p>
            </div>

            <div className="space-y-2 bg-stone-800/60 p-4 rounded-2xl border border-stone-700/50">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-stone-100">
                Paiement en Ligne Sécurisé
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Réglez en ligne directement en FCFA avec votre opérateur préféré : Wave, Orange Money, MTN MoMo, Moov Money ou Carte bancaire d'entreprise.
              </p>
            </div>

            <div className="space-y-2 bg-stone-800/60 p-4 rounded-2xl border border-stone-700/50">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-stone-100">
                Confirmation & Reçu par SMS
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Recevez votre référence de commande instantanément avec confirmation automatique par SMS au <strong>01047286</strong> d'<strong>Ebrin Mathieu Chic</strong>.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-stone-950 font-serif font-bold flex items-center justify-center text-sm">
              EM
            </div>
            <div>
              <div className="font-bold text-stone-200">Ebrin Mathieu Chic</div>
              <div className="text-[11px] text-stone-500">
                Boutique d'affiches commerciales & articles pour entreprises • 500 à 1 000 FCFA
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-center sm:text-right">
            <a href={directSmsUrl} className="hover:text-amber-400 transition-colors">
              Contact SMS : <strong>01047286</strong>
            </a>
            <span>•</span>
            <span>Paiement en ligne en FCFA</span>
            <span>•</span>
            <button
              onClick={() => setIsOrdersOpen(true)}
              className="text-amber-400 hover:underline"
            >
              Historique des Factures
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Cart Bar for Quick Access if items exist */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:right-6 z-40 max-w-sm sm:max-w-xs mx-auto">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-amber-400/40 active:scale-95 transition-all"
            id="floating-cart-bar"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-amber-200" />
                <span className="absolute -top-1.5 -right-1.5 bg-white text-stone-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-amber-100">Votre Panier</div>
                <div className="font-mono text-sm font-extrabold text-white">
                  {formatFCFA(cartTotalFCFA)}
                </div>
              </div>
            </div>
            <div className="bg-stone-950/80 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1">
              <span>Voir</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Publish Poster Modal */}
      <PublishPosterModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        onPublish={handlePublishPoster}
      />

      {/* Full Flyer Preview & Print Modal */}
      <PosterPreviewModal
        poster={previewPoster}
        onClose={() => setPreviewPoster(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Online Payment Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Orders & Receipts History Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />
    </div>
  );
}
