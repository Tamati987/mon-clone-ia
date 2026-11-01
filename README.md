# Mon Clone IA

Assistant IA personnel, installable sur téléphone.

- **App installable (PWA)** : https://tamati987.github.io/mon-clone-ia/ — code dans `web/`, publiée automatiquement par GitHub Actions à chaque push. Connecteurs : OpenRouter, Gemini, OpenAI, Claude (API), autre API compatible OpenAI. Clés, mémoire et conversations stockées dans le téléphone (localStorage), export/restauration JSON.

- **Ancienne version (artifact claude.ai, sans clé)** : https://claude.ai/artifact/UrmGdRDS2T3nxz28EL333S (privée, compte Claude de Tamati)
- **Code de l'app** : `app.html` (page publiée comme artifact claude.ai, sans clé API : Claude passe par le compte de l'utilisateur)
- **Données** : stockées dans le compte Claude (espace privé `data/users/me/` de l'artifact)
  - `profil` : consignes + statistiques
  - `profil/convs/*` : conversations
  - `notes` : mémoire (passages de texte)
- **Coffre-fort** : Supabase, projet PulseConnect, schéma `clone_ia` (voir `supabase/schema.sql`). Non exposé à l'API publique.

## Procédure « intervention »

Quand Tamati écrit « intervention » à Claude :

1. Lire l'app (`Artifact read`) et ses données (`ArtifactData list data/users/me`).
2. Corriger ce qui ne va pas dans `app.html`, republier sur la même URL, commit ici.
3. Synchroniser les données vers Supabase (`clone_ia.profil`, `notes`, `conversations`) et ajouter une ligne dans `clone_ia.syncs`.
4. Compte rendu court en français.
