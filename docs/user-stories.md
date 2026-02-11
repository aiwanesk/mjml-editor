# User Stories - Template Editor

## Stack & Contraintes

- **Front**: React
- **Back**: Node.js
- **Architecture**: DDD (Domain-Driven Design)
- **Format templates**: MJML
- **Cible utilisateur**: Non-technique (UX ultra simple, zéro ambiguïté)

---

## Epic 1 : Gestion des Templates

### US-1.1 : Charger un template MJML

**En tant qu'** utilisateur,
**je veux** importer un fichier template MJML depuis mon ordinateur,
**afin de** pouvoir l'éditer dans l'application.

**Critères d'acceptation :**

- Un bouton "Importer" bien visible sur la page d'accueil
- Drag & drop supporté sur une zone clairement identifiée
- Seuls les fichiers `.mjml` sont acceptés
- Message d'erreur clair et humain si le format est invalide ("Ce fichier n'est pas un template valide. Essayez avec un fichier .mjml")
- Un loader/spinner pendant le chargement
- Redirection automatique vers l'éditeur une fois le template chargé

**DDD - Domain :**

- Aggregate : `Template`
- Value Object : `TemplateContent`, `TemplateMetadata`
- Domain Event : `TemplateUploaded`

---

### US-1.2 : Visualiser la liste des templates

**En tant qu'** utilisateur,
**je veux** voir tous mes templates disponibles sous forme de vignettes,
**afin de** retrouver facilement celui que je veux éditer.

**Critères d'acceptation :**

- Affichage en grille avec preview visuelle (thumbnail) de chaque template
- Nom du template affiché sous chaque vignette
- Date de dernière modification visible
- Clic sur une vignette ouvre le template dans l'éditeur
- État vide explicite si aucun template ("Vous n'avez pas encore de template. Importez-en un !")
- Recherche/filtre par nom

**DDD - Domain :**

- Repository : `TemplateRepository.findAll()`
- Read Model / Query : `ListTemplatesQuery`

---

### US-1.3 : Supprimer un template

**En tant qu'** utilisateur,
**je veux** pouvoir supprimer un template dont je n'ai plus besoin,
**afin de** garder ma liste propre.

**Critères d'acceptation :**

- Bouton de suppression accessible sur chaque vignette (icône poubelle)
- Modale de confirmation obligatoire ("Êtes-vous sûr ? Cette action est irréversible.")
- Le bouton de confirmation est rouge et dit "Supprimer", le bouton d'annulation est mis en avant visuellement
- Feedback visuel après suppression (toast "Template supprimé")
- Retour à la liste après suppression

**DDD - Domain :**

- Command : `DeleteTemplateCommand`
- Domain Event : `TemplateDeleted`

---

## Epic 2 : Édition de Template

### US-2.1 : Afficher le template dans l'éditeur visuel

**En tant qu'** utilisateur,
**je veux** voir mon template rendu visuellement dans un éditeur,
**afin de** comprendre immédiatement ce que je modifie (WYSIWYG).

**Critères d'acceptation :**

- Le template MJML est compilé et rendu en HTML dans un panneau de preview
- La preview se met à jour en temps réel à chaque modification
- Le panneau de preview est responsive (toggle desktop / mobile)
- Aucun code source visible par défaut (l'utilisateur ne doit jamais voir du MJML brut)

**DDD - Domain :**

- Domain Service : `MjmlRenderingService`
- Value Object : `RenderedTemplate`

---

### US-2.2 : Modifier les champs éditables du template

**En tant qu'** utilisateur,
**je veux** cliquer sur un élément du template (texte, image, bouton) pour le modifier,
**afin de** personnaliser le contenu sans toucher au code.

**Critères d'acceptation :**

- Clic sur un élément du template le sélectionne et ouvre un panneau de propriétés à droite
- Les champs éditables sont surlignés au survol (hover) pour indiquer qu'ils sont cliquables
- Modification de texte : édition inline directement dans la preview
- Modification d'image : bouton "Changer l'image" avec upload ou URL
- Modification de couleurs : color picker simple
- Modification de liens : champ URL avec validation
- Chaque modification met à jour la preview en temps réel
- Bouton "Annuler" (Ctrl+Z) pour revenir en arrière

**DDD - Domain :**

- Command : `UpdateTemplateFieldCommand`
- Value Object : `EditableField` (type, valeur, contraintes)
- Domain Event : `TemplateFieldUpdated`

---

### US-2.3 : Sauvegarder les modifications

**En tant qu'** utilisateur,
**je veux** que mes modifications soient sauvegardées,
**afin de** ne pas perdre mon travail.

**Critères d'acceptation :**

- Auto-save toutes les 30 secondes si des modifications existent
- Bouton "Sauvegarder" toujours visible
- Indicateur visuel de l'état de sauvegarde ("Sauvegardé", "Modifications non sauvegardées", "Sauvegarde en cours...")
- Confirmation avant de quitter la page si des modifications ne sont pas sauvegardées
- Versionning basique : possibilité de revenir à la dernière version sauvegardée

**DDD - Domain :**

- Command : `SaveTemplateCommand`
- Domain Event : `TemplateSaved`
- Value Object : `TemplateVersion`

---

## Epic 3 : Design System & Widgets

### US-3.1 : Afficher le catalogue de widgets du design system

**En tant qu'** utilisateur,
**je veux** voir un panneau latéral avec les composants disponibles du design system,
**afin de** savoir ce que je peux ajouter à mon template.

**Critères d'acceptation :**

- Panneau latéral gauche avec les widgets disponibles, organisés par catégorie
- Catégories minimales : "Contenu" (texte, image, séparateur), "Actions" (bouton, lien), "Layout" (colonnes, spacer)
- Chaque widget a une icône claire et un nom explicite
- Preview au survol du widget pour montrer à quoi il ressemble
- Le panneau est rétractable pour gagner de la place

**DDD - Domain :**

- Aggregate : `DesignSystem`
- Entity : `Widget` (nom, catégorie, template MJML par défaut)
- Repository : `WidgetRepository`

---

### US-3.2 : Ajouter un widget au template

**En tant qu'** utilisateur,
**je veux** ajouter un composant du design system à mon template en cliquant dessus ou en le glissant,
**afin d'** enrichir mon template facilement.

**Critères d'acceptation :**

- Drag & drop du widget depuis le panneau vers la preview (zone de drop mise en évidence)
- Alternative au drag & drop : clic sur le widget → insertion à la position du curseur ou en fin de template
- Indicateur visuel clair de la zone d'insertion (ligne bleue entre les blocs)
- Animation fluide d'insertion
- Le widget ajouté est immédiatement sélectionné et son panneau de propriétés s'ouvre
- Impossible d'insérer un widget à un endroit invalide (feedback visuel : zone rouge)

**DDD - Domain :**

- Command : `AddWidgetToTemplateCommand`
- Domain Event : `WidgetAddedToTemplate`
- Domain Service : `TemplateCompositionService`

---

### US-3.3 : Supprimer un widget du template

**En tant qu'** utilisateur,
**je veux** pouvoir retirer un composant de mon template,
**afin de** modifier la structure de mon email.

**Critères d'acceptation :**

- Bouton "Supprimer" (icône poubelle) visible quand un widget est sélectionné
- Raccourci clavier `Suppr` / `Delete` quand un widget est sélectionné
- Confirmation uniquement si le widget contient du contenu modifié
- Animation de suppression fluide
- Undo possible immédiatement après suppression (toast "Widget supprimé — Annuler")

**DDD - Domain :**

- Command : `RemoveWidgetFromTemplateCommand`
- Domain Event : `WidgetRemovedFromTemplate`

---

## Epic 4 : Export

### US-4.1 : Exporter le template en HTML

**En tant qu'** utilisateur,
**je veux** exporter mon template finalisé en fichier HTML,
**afin de** l'utiliser dans mon outil d'emailing.

**Critères d'acceptation :**

- Bouton "Exporter" → menu avec les options d'export
- Option "HTML" télécharge un fichier `.html`
- Le HTML généré est responsive et compatible avec les principaux clients email
- Le nom du fichier reprend le nom du template
- Notification de succès après téléchargement

**DDD - Domain :**

- Domain Service : `TemplateExportService`
- Value Object : `ExportFormat.HTML`
- Command : `ExportTemplateCommand`

---

### US-4.2 : Exporter le template en PNG

**En tant qu'** utilisateur,
**je veux** exporter une capture du template en PNG,
**afin de** pouvoir le partager ou l'utiliser comme aperçu.

**Critères d'acceptation :**

- Option "PNG" dans le menu d'export
- Rendu fidèle du template en image haute résolution
- Le fichier est nommé `{nom-template}.png`
- Loader pendant la génération (screenshot côté serveur)

**DDD - Domain :**

- Domain Service : `TemplateExportService`
- Value Object : `ExportFormat.PNG`
- Infrastructure Service : `ScreenshotService` (Puppeteer/Playwright côté serveur)

---

### US-4.3 : Générer une thumbnail du template

**En tant qu'** utilisateur,
**je veux** qu'une thumbnail soit générée automatiquement pour chaque template,
**afin de** les identifier visuellement dans la liste.

**Critères d'acceptation :**

- Thumbnail générée automatiquement à chaque sauvegarde
- Taille optimisée pour l'affichage en grille (max 400x600px)
- Format léger (JPEG ou WebP)
- Fallback avec une image placeholder si la génération échoue
- Option d'export manuel de la thumbnail via le menu d'export

**DDD - Domain :**

- Domain Event handler : on `TemplateSaved` → génère thumbnail
- Infrastructure Service : `ThumbnailGenerationService`

---

## Epic 5 : UX / Accessibilité (transverse)

### US-5.1 : Onboarding premier lancement

**En tant que** nouvel utilisateur,
**je veux** être guidé lors de ma première utilisation,
**afin de** comprendre comment fonctionne l'outil sans lire de doc.

**Critères d'acceptation :**

- Tour guidé au premier lancement (3-5 étapes max)
- Tooltips sur les zones clés : import, panneau widgets, preview, export
- Bouton "Passer" à chaque étape
- Ne se relance pas aux visites suivantes (stocké en localStorage)
- Lien "Aide" dans le header pour relancer le tour

---

### US-5.2 : Feedback et gestion d'erreurs user-friendly

**En tant qu'** utilisateur,
**je veux** recevoir des messages clairs quand quelque chose ne fonctionne pas,
**afin de** ne jamais être bloqué sans comprendre pourquoi.

**Critères d'acceptation :**

- Aucun message technique (pas de "Error 500", pas de stack trace)
- Messages en langage humain avec action suggérée ("Impossible de sauvegarder. Vérifiez votre connexion et réessayez.")
- Toasts pour les notifications éphémères (succès, info)
- Modales pour les erreurs bloquantes avec CTA clair
- État de chargement sur tous les boutons d'action (disable + spinner)

---

## Récap des Bounded Contexts (DDD)

```
┌─────────────────────────────────────────────────┐
│              Template Management                 │
│  (Upload, List, Delete, Metadata)                │
│  Aggregate: Template                             │
├─────────────────────────────────────────────────┤
│              Template Editing                    │
│  (WYSIWYG, Field editing, Save, Versioning)      │
│  Aggregate: Template (état étendu en édition)    │
├─────────────────────────────────────────────────┤
│              Design System                       │
│  (Widget catalog, Composition)                   │
│  Aggregate: DesignSystem, Entity: Widget         │
├─────────────────────────────────────────────────┤
│              Export                               │
│  (HTML, PNG, Thumbnail)                          │
│  Services: ExportService, ScreenshotService      │
└─────────────────────────────────────────────────┘
```

## Priorisation (MoSCoW)

| Priorité       | US                                              |
| -------------- | ----------------------------------------------- |
| **Must Have**  | US-1.1, US-1.2, US-1.3, US-2.1, US-2.2, US-4.1 |
| **Should Have**| US-2.3, US-3.1, US-3.2, US-3.3, US-4.2, US-4.3 |
| **Could Have** | US-5.1, US-5.2                                  |
