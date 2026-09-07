import React from 'react';
import { X, Package, MessageSquare, Printer, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { OrderRecord } from '../types';
import { formatFCFA, buildSmsHref } from '../utils/formatters';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto"
        id="orders-history-dialog"
      >
        <div className="bg-stone-900 text-stone-100 p-5 sm:px-6 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                Historique des Commandes & Factures FCFA
              </h2>
              <p className="text-xs text-stone-400">
                Ebrin Mathieu Chic • Suivi direct par SMS au 01047286
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <div className="font-serif font-bold text-base text-stone-800">
                Aucune commande enregistrée pour l'instant
              </div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Ajoutez vos affiches au panier et effectuez votre premier paiement en FCFA pour voir vos reçus ici.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const smsText = `Bonjour Ebrin Mathieu Chic, suivi de ma commande Réf: ${order.orderNumber} d'un montant de ${formatFCFA(order.totalFCFA)}. Nom: ${order.customerName}`;
              const smsUrl = buildSmsHref('01047286', smsText);

              return (
                <div
                  key={order.id}
                  className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900">
                          {order.orderNumber}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Payé en FCFA
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        Client : <strong className="text-stone-800">{order.customerName}</strong>
                        {order.customerEnterprise && ` (${order.customerEnterprise})`} • {order.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-extrabold text-base text-amber-800">
                        {formatFCFA(order.totalFCFA)}
                      </div>
                      <div className="text-[10px] text-stone-400 capitalize">
                        Via {order.paymentMethod.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-stone-700">
                        <span>
                          {it.quantity}x {it.poster.title}
                        </span>
                        <span className="font-mono font-medium">
                          {formatFCFA(it.poster.priceFCFA * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-mono">
                      Réf: {order.transactionRef}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={smsUrl}
                        className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>SMS 01047286</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
