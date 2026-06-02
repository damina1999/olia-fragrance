export default function TrustBadges({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <img src="/icons/shield.svg" alt="Authentic" className="w-6 h-6" />
        <div className="text-sm">
          <div className="font-semibold text-white">Authenticité garantie</div>
          <div className="text-xs text-white/60">Tous les parfums sont originaux</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <img src="/icons/lock.svg" alt="Secure" className="w-6 h-6" />
        <div className="text-sm">
          <div className="font-semibold text-white">Paiement sécurisé</div>
          <div className="text-xs text-white/60">Cartes et mobile payments</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <img src="/icons/return.svg" alt="Returns" className="w-6 h-6" />
        <div className="text-sm">
          <div className="font-semibold text-white">Retour 14 jours</div>
          <div className="text-xs text-white/60">Satisfait ou remboursé</div>
        </div>
      </div>
    </div>
  );
}
