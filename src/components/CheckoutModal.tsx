import React, { useState } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, Smartphone, CreditCard, MessageSquare, 
  Printer, ArrowLeft, Loader2, Sparkles, Building2, PhoneCall
} from 'lucide-react';
import { CartItem, PaymentChannel, OrderRecord } from '../types';
import { PAYMENT_METHODS } from '../data/initialPosters';
import { formatFCFA, generateOrderRef, buildSmsHref } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderCompleted: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'info' | 'processing' | 'success'>('info');
  const [selectedMethod, setSelectedMethod] = useState<PaymentChannel>('wave');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEnterprise, setCustomerEnterprise] = useState('');
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const totalFCFA = cart.reduce((sum, item) => sum + item.poster.priceFCFA * item.quantity, 0);
  const currentMethodConfig = PAYMENT_METHODS.find(m => m.id === selectedMethod)!;

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Veuillez remplir votre nom et votre numéro de téléphone.');
      return;
    }
    setErrorMessage('');
    setStep('processing');
    setCountdown(3);

    // Simulate online Mobile Money / Bank authorization in FCFA
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finalizeOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 900);
  };

  const finalizeOrder = () => {
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: generateOrderRef(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEnterprise: customerEnterprise.trim() || undefined,
      items: [...cart],
      totalFCFA,
      paymentMethod: selectedMethod,
      paymentStatus: selectedMethod === 'sms_direct' ? 'en_attente_sms' : 'payé',
      date: new Date().toLocaleString('fr-FR'),
      smsRecipient: '01047286',
      transactionRef: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setCompletedOrder(newOrder);
    onOrderCompleted(newOrder);
    setStep('success');
  };

  const smsConfirmationBody = completedOrder 
    ? `Confirmation Commande Ebrin Mathieu Chic : Réf ${completedOrder.orderNumber}, Montant ${formatFCFA(completedOrder.totalFCFA)} payé par ${completedOrder.paymentMethod}. Client: ${completedOrder.customerName} (${completedOrder.customerPhone}). Merci !`
    : '';
  const smsConfirmHref = buildSmsHref('01047286', smsConfirmationBody);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto"
        id="checkout-payment-dialog"
      >
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-5 sm:px-6 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-stone-950 font-bold font-serif text-sm">
              FCFA
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                Paiement en Ligne Sécurisé
              </h2>
              <p className="text-xs text-stone-400">
                Ebrin Mathieu Chic • Destinataire SMS : <strong>01047286</strong>
              </p>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              id="close-checkout-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Customer info & payment selection */}
        {step === 'info' && (
          <form onSubmit={handleStartPayment} className="p-5 sm:p-6 space-y-5">
            {/* Total Recap Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase font-bold text-amber-900 tracking-wider">
                  Montant Total de votre Panier
                </div>
                <div className="text-xs text-amber-800 mt-0.5">
                  {cart.length} référence(s) d'affiches sélectionnée(s)
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-extrabold text-2xl sm:text-3xl text-amber-900">
                  {formatFCFA(totalFCFA)}
                </span>
                <div className="text-[10px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Transaction 100% sécurisée</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            {/* Client & Enterprise info */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-xs uppercase text-stone-900 tracking-wider">
                1. Vos Coordonnées de Commande
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Mathieu Kouadio"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 focus:border-amber-600"
                    id="input-buyer-name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Numéro de Téléphone (Mobile Money) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ex: 01047286 ou 0700000000"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 font-mono focus:border-amber-600"
                    id="input-buyer-phone"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Entreprise / Boutique (optionnel)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={customerEnterprise}
                    onChange={(e) => setCustomerEnterprise(e.target.value)}
                    placeholder="Ex: Ebrin Mathieu Chic Partenaire"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:border-amber-600"
                    id="input-buyer-company"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector in FCFA */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-xs uppercase text-stone-900 tracking-wider">
                2. Choisissez le Moyen de Paiement en FCFA
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/50 shadow-sm ring-1 ring-amber-500'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                      }`}
                      id={`payment-option-${method.id}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-xs flex-shrink-0"
                          style={{ backgroundColor: method.accentColor }}
                        >
                          {method.shortName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-stone-900 truncate">
                            {method.name}
                          </div>
                          <div className="text-[10px] text-stone-500 line-clamp-1">
                            {method.description}
                          </div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-amber-600 bg-amber-600' : 'border-stone-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instructions on selected channel */}
              <div className="bg-stone-100 rounded-xl p-3 text-xs text-stone-700 border border-stone-200 flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900">Procédure {currentMethodConfig.name} :</span>{' '}
                  {currentMethodConfig.instructions}
                  {currentMethodConfig.ussdCode && (
                    <span className="block mt-1 font-mono font-bold text-amber-800">
                      Code USSD : {currentMethodConfig.ussdCode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Retour au panier
              </button>

              <button
                type="submit"
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-2"
                id="submit-payment-btn"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirmer et Payer {formatFCFA(totalFCFA)}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Processing state */}
        {step === 'processing' && (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                Paiement Mobile Money en cours...
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto">
                Demande de débit de <strong>{formatFCFA(totalFCFA)}</strong> envoyée au numéro{' '}
                <strong className="font-mono text-stone-900">{customerPhone}</strong> via{' '}
                <strong>{currentMethodConfig.name}</strong>.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-sm mx-auto text-xs text-amber-900 font-medium">
              Veuillez confirmer l’invite sur votre écran de téléphone avec votre code secret Mobile Money.
            </div>

            <div className="text-xs text-stone-400 font-mono">
              Finalisation automatique dans {countdown}s...
            </div>
          </div>
        )}

        {/* STEP 3: Payment Success & Receipt */}
        {step === 'success' && completedOrder && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-stone-950">
                Paiement Validé avec Succès !
              </h3>
              <p className="text-xs text-stone-600">
                Votre commande a été enregistrée auprès d'<strong>Ebrin Mathieu Chic</strong>.
              </p>
            </div>

            {/* Official printable bill/receipt */}
            <div className="bg-stone-50 border-2 border-stone-900 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <div className="font-serif font-bold text-base text-stone-950">
                    Ebrin Mathieu Chic
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Boutique & Vente d'Affiches Commerciales
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-stone-900">
                    {completedOrder.orderNumber}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {completedOrder.date}
                  </div>
                </div>
              </div>

              {/* Items recap */}
              <div className="space-y-1.5 text-xs">
                <div className="text-[10px] uppercase font-bold text-stone-400">Détails des Affiches :</div>
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-stone-800">
                    <span>
                      {item.quantity}x {item.poster.title}
                    </span>
                    <span className="font-mono font-semibold">
                      {formatFCFA(item.poster.priceFCFA * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total & Payment details */}
              <div className="pt-3 border-t border-stone-200 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-stone-900 text-sm">
                  <span>Total Réglé en FCFA :</span>
                  <span className="font-mono text-amber-800 font-extrabold">
                    {formatFCFA(completedOrder.totalFCFA)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>Mode de règlement :</span>
                  <span className="font-semibold text-stone-700 capitalize">
                    {completedOrder.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>Réf Transaction :</span>
                  <span className="font-mono text-stone-700">{completedOrder.transactionRef}</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>Numéro SMS Service :</span>
                  <span className="font-mono font-bold text-amber-700">01047286</span>
                </div>
              </div>
            </div>

            {/* Quick SMS Notification Button to 01047286 */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-amber-900">
                <div className="font-bold">Avis de commande SMS :</div>
                <div className="text-amber-800">
                  Transmettez le récapitulatif directement par SMS au <strong>01047286</strong>.
                </div>
              </div>
              <a
                href={smsConfirmHref}
                className="whitespace-nowrap bg-stone-950 hover:bg-stone-800 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                id="send-confirmation-sms-btn"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Envoyer SMS au 01047286</span>
              </a>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs text-stone-700 hover:text-stone-950 font-semibold p-2"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer la facture</span>
              </button>

              <button
                onClick={onClose}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                id="finish-order-btn"
              >
                Terminer et Retourner à la Boutique
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
