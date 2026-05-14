# ✦ Parfum Shop

## Démarrage rapide

### Prérequis
- Node.js 18+ installé → https://nodejs.org

### Installation en une commande
Double-clique sur `install.bat` — ça installe tout et remplit la base de données.

### Démarrer le projet
Ouvre **2 terminaux** :

**Terminal 1 — Backend :**
```bash
cd parfum-shop/backend
npm run dev
```

**Terminal 2 — Frontend :**
```bash
cd parfum-shop/frontend
npm run dev
```

Puis ouvre → http://localhost:5173

---

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@parfumshop.com | admin123 |
| Client | client@parfumshop.com | client123 |

---

## Fonctionnalités

**Boutique client**
- Catalogue avec filtres (catégorie, prix, recherche)
- Fiche produit avec galerie, like/dislike, notes et commentaires
- Panier persistant + checkout
- Dashboard commandes

**Admin** → /admin
- Dashboard avec graphiques (revenus, commandes)
- CRUD produits avec upload images (Cloudinary)
- Gestion commandes (changer statut)
- Gestion utilisateurs (promouvoir admin)
