import React, { useState } from 'react';
import { X, Upload, Sparkles, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Poster, PosterCategory } from '../types';
import { formatFCFA } from '../utils/formatters';

interface PublishPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newPoster: Poster) => void;
}

const PRESET_IMAGES = [
  { label: 'Costume & Veste', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mode Urbaine', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' },
  { label: 'Souliers Cuir', url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Accessoires Or', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Promo Vente', url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Robe Cocktail', url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80' },
];

const PRICE_PRESETS = [500, 600, 750, 800, 900, 1000];

export const PublishPosterModal: React.FC<PublishPosterModalProps> = ({
  isOpen,
  onClose,
  onPublish,
}) => {
  const [title, setTitle] = useState('');
  const [enterpriseName, setEnterpriseName] = useState('Ebrin Mathieu Chic');
  const [category, setCategory] = useState<PosterCategory>('vetements');
  const [priceFCFA, setPriceFCFA] = useState<number>(750);
  const [originalPriceFCFA, setOriginalPriceFCFA] = useState<string>('1200');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('01047286');
  const [badge, setBadge] = useState('Offre Spéciale');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [customFeatures, setCustomFeatures] = useState('Article de haute qualité\nDisponible en stock pour entreprise');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handlePriceChange = (val: number) => {
    setPriceFCFA(val);
    if (val < 500 || val > 1000) {
      setErrorMsg('Le prix doit être compris entre 500 et 1 000 FCFA conformément aux consignes.');
    } else {
      setErrorMsg('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg('Veuillez renseigner le titre de l’affiche.');
      return;
    }

    if (priceFCFA < 500 || priceFCFA > 1000) {
      setErrorMsg('Le tarif doit être strictement entre 500 et 1 000 FCFA.');
      return;
    }

    const featuresList = customFeatures
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const newPoster: Poster = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      enterpriseName: enterpriseName.trim() || 'Ebrin Mathieu Chic',
      category,
      priceFCFA: Number(priceFCFA),
      originalPriceFCFA: originalPriceFCFA ? Number(originalPriceFCFA) : undefined,
      description: description.trim() || 'Affiche commerciale haut de gamme éditée pour vente aux entreprises.',
      badge: badge.trim() || undefined,
      imageUrl,
      contactPhone: contactPhone.trim() || '01047286',
      createdAt: new Date().toISOString().split('T')[0],
      features: featuresList.length > 0 ? featuresList : ['Haute qualité garantie', 'Commande SMS au 01047286'],
      salesCount: 0,
      isCustom: true,
    };

    onPublish(newPoster);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto"
        id="publish-poster-form-dialog"
      >
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-5 sm:px-6 flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="font-serif font-bold text-lg sm:text-xl text-white">
                Publier une Affiche de Vente Entreprise
              </h2>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Entreprise : <strong>{enterpriseName}</strong> • Tarif imposé : <strong>500 à 1 000 FCFA</strong> • SMS : <strong>{contactPhone}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            id="close-publish-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form Grid */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
          {/* Form inputs: Left column */}
          <div className="lg:col-span-7 space-y-4">
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Titre & Entreprise */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Nom de l'Entreprise
                </label>
                <input
                  type="text"
                  value={enterpriseName}
                  onChange={(e) => setEnterpriseName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl px-3 py-2 text-sm text-stone-900 font-medium"
                  placeholder="Ebrin Mathieu Chic"
                  required
                  id="input-enterprise-name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Numéro SMS de Contact
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl px-3 py-2 text-sm text-stone-900 font-mono font-bold"
                  placeholder="01047286"
                  required
                  id="input-contact-phone"
                />
              </div>
            </div>

            {/* Titre de l'Affiche */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Titre de l'Affiche de Vente *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl px-3.5 py-2 text-sm text-stone-900 font-semibold"
                placeholder="Ex: Collection Chemises Chic pour Entreprises"
                required
                id="input-poster-title"
              />
            </div>

            {/* Catégorie & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Catégorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PosterCategory)}
                  className="w-full bg-stone-50 border border-stone-300 focus:border-amber-600 rounded-xl px-3 py-2 text-sm text-stone-900"
                  id="select-poster-category"
                >
                  <option value="vetements">Vêtements Chic</option>
                  <option value="chaussures">Chaussures & Souliers</option>
                  <option value="accessoires">Accessoires de Mode</option>
                  <option value="affiches_pub">Affiches Publicitaires</option>
                  <option value="packs_promo">Packs Promo Entreprise</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Badge Promotionnel
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 focus:border-amber-600 rounded-xl px-3 py-2 text-sm text-stone-900"
                  placeholder="Ex: Offre Flash, Chic, Nouveau"
                  id="input-poster-badge"
                />
              </div>
            </div>

            {/* PRIX EN FCFA (STRICTEMENT 500 A 1000 FCFA) */}
            <div className="bg-amber-50/60 border-2 border-amber-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                  Prix en FCFA (Obligatoire : 500 à 1 000 FCFA)
                </label>
                <span className="font-mono font-extrabold text-lg text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-lg">
                  {formatFCFA(priceFCFA)}
                </span>
              </div>

              {/* Slider for quick range selection */}
              <input
                type="range"
                min={500}
                max={1000}
                step={50}
                value={priceFCFA}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-amber-200 rounded-lg"
                id="slider-poster-price"
              />

              {/* Quick Select Buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {PRICE_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePriceChange(p)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                      priceFCFA === p
                        ? 'bg-amber-700 text-white shadow-sm'
                        : 'bg-white text-stone-700 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {p} F
                  </button>
                ))}
              </div>

              {/* Optional strike-through price */}
              <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center gap-3">
                <label className="text-xs text-amber-900 font-medium whitespace-nowrap">
                  Ancien prix barré (optionnel) :
                </label>
                <input
                  type="number"
                  value={originalPriceFCFA}
                  onChange={(e) => setOriginalPriceFCFA(e.target.value)}
                  placeholder="Ex: 1500"
                  className="w-28 bg-white border border-amber-300 rounded-lg px-2 py-1 text-xs font-mono"
                  id="input-original-price"
                />
                <span className="text-xs text-amber-800">FCFA</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Description de l'Affiche & Offre Entreprise
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl p-3 text-xs sm:text-sm text-stone-900"
                placeholder="Décrivez l'offre commerciale proposée aux entreprises..."
                id="input-poster-desc"
              />
            </div>

            {/* Caractéristiques */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Points Forts (1 par ligne)
              </label>
              <textarea
                rows={2}
                value={customFeatures}
                onChange={(e) => setCustomFeatures(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 focus:border-amber-600 rounded-xl p-3 text-xs text-stone-900 font-mono"
                placeholder="Point 1&#10;Point 2"
                id="input-poster-features"
              />
            </div>
          </div>

          {/* Right column: Image picker & Live Preview */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Choix du Visuel de l'Affiche
              </label>

              {/* Presets images */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {PRESET_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                      imageUrl === img.url
                        ? 'border-amber-600 ring-2 ring-amber-400'
                        : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-stone-900/80 text-[9px] text-white py-0.5 px-1 truncate text-center">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Upload image file or URL */}
              <div className="flex items-center gap-2 mb-3">
                <label className="flex-1 cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-dashed border-stone-300">
                  <Upload className="w-3.5 h-3.5 text-stone-500" />
                  <span>Importer une photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload-poster"
                  />
                </label>
              </div>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Ou collez une URL d'image..."
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 truncate"
              />
            </div>

            {/* LIVE PREVIEW CARD */}
            <div className="bg-stone-100 p-3 rounded-2xl border border-stone-300">
              <div className="text-[10px] uppercase font-bold text-stone-500 mb-1.5 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                Aperçu instantané de l'Affiche :
              </div>
              <div className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-md">
                <div className="relative aspect-[16/10] bg-stone-900">
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {enterpriseName || 'Ebrin Mathieu Chic'}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-amber-500 text-stone-950 font-mono font-extrabold text-xs px-2.5 py-1 rounded-md shadow">
                    {formatFCFA(priceFCFA)}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-xs text-stone-900 truncate">
                    {title || 'Titre de l’affiche commerciale'}
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-1 line-clamp-1">
                    {description || 'Description de l’offre pour entreprises'}
                  </p>
                  <div className="mt-2 text-[10px] text-amber-800 font-mono font-bold flex items-center justify-between">
                    <span>SMS : {contactPhone}</span>
                    <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                      En vente en FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit buttons */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-2"
                id="submit-publish-btn"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publier l'Affiche de Vente</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
