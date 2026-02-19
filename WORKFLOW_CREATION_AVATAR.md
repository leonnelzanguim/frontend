# 🎭 Workflow Complet : Création d'un Avatar 3D avec Lip Sync

## 📋 Vue d'Ensemble du Processus

```
1. ReadyPlayerMe      → Avatar personnalisé (.glb avec morph targets)
2. gltfjsx            → Génération composant React Avatar.jsx
3. Blender            → Conversion .glb → .fbx
4. Mixamo             → Téléchargement des animations (.fbx)
5. Intégration React  → Implémentation de la logique
```

**Durée totale : ~30 minutes**

---

## 🎨 Étape 1 : Créer l'Avatar sur ReadyPlayerMe

### 1.1 Créer l'Avatar

**Aller sur :** https://readyplayer.me/

1. **Créer un avatar personnalisé**
   - Choisir le genre (masculin/féminin)
   - Personnaliser l'apparence :
     - Visage (forme, traits)
     - Cheveux (style, couleur)
     - Vêtements (style, couleurs)
     - Accessoires (lunettes, etc.)

2. **Options avancées** (si disponibles)
   - Style réaliste vs cartoon
   - Détails de la peau
   - Expressions par défaut

### 1.2 Ajouter les Paramètres Morph Targets

**URL finale doit contenir :**
```
https://models.readyplayer.me/[ID].glb?morphTargets=ARKit,Oculus Visemes
```

**⚠️ TRÈS IMPORTANT :** Les paramètres `morphTargets` sont ESSENTIELS pour :
- **ARKit** : 52 morph targets pour expressions faciales (sourcils, yeux, bouche, etc.)
- **Oculus Visemes** : 15 morph targets pour la synchronisation labiale (phonèmes)

**Sans ces paramètres :**
❌ Pas d'expressions faciales
❌ Pas de lip sync
❌ Avatar statique

**Avec ces paramètres :**
✅ Expressions faciales complètes (smile, sad, angry, etc.)
✅ Synchronisation labiale précise
✅ Avatar vivant et expressif

### 1.3 Télécharger le Modèle

**Méthode 1 : Depuis l'interface**
- Cliquer sur "Download" ou "Export"
- Choisir le format `.glb`
- S'assurer que l'URL contient `?morphTargets=ARKit,Oculus Visemes`

**Méthode 2 : Copier l'URL**
```bash
# Exemple d'URL complète
https://models.readyplayer.me/696a4b8a86e729b70995ba73.glb?morphTargets=ARKit,Oculus%20Visemes

# Télécharger avec curl (optionnel)
curl -o mon-avatar.glb "https://models.readyplayer.me/[ID].glb?morphTargets=ARKit,Oculus%20Visemes"
```

### 1.4 Placer le Fichier

```bash
# Structure du projet
frontend/
└── public/
    └── models/
        └── 696a4b8a86e729b70995ba73.glb  # ← Votre fichier .glb ici
```

**Nommage recommandé :**
- Utiliser l'ID ReadyPlayerMe (ex: `696a4b8a86e729b70995ba73.glb`)
- OU un nom descriptif (ex: `jack-avatar.glb`)

---

## ⚙️ Étape 2 : Générer le Composant React avec gltfjsx

### 2.1 Qu'est-ce que gltfjsx ?

**gltfjsx** est un outil qui convertit un fichier `.glb/.gltf` en un composant React optimisé pour React Three Fiber.

**Avantages :**
✅ Génère automatiquement le JSX
✅ Extrait les nodes, materials, animations
✅ Typage TypeScript (optionnel)
✅ Optimisé pour R3F

### 2.2 Exécuter la Commande

```bash
npx gltfjsx public/models/696a4b8a86e729b70995ba73.glb \
  -o src/components/Avatar.jsx \
  -r public
```

**Explication des paramètres :**

| Paramètre | Signification | Valeur |
|-----------|---------------|--------|
| `public/models/...glb` | Fichier source | Chemin vers votre .glb |
| `-o` | Output (sortie) | Où créer le fichier .jsx |
| `-r public` | Root directory | Chemins relatifs depuis /public |

**Autres options utiles :**

```bash
# Avec TypeScript
npx gltfjsx model.glb -o Avatar.tsx -t

# Avec transformation (position, rotation, scale)
npx gltfjsx model.glb -o Avatar.jsx -T

# Avec instance (plusieurs avatars)
npx gltfjsx model.glb -o Avatar.jsx -i
```

### 2.3 Fichier Généré

**Le fichier `Avatar.jsx` contient :**

```jsx
import { useGLTF } from '@react-three/drei';

export function Avatar(props) {
  const { nodes, materials } = useGLTF('/models/696a4b8a86e729b70995ba73.glb');
  
  return (
    <group {...props} dispose={null}>
      <primitive object={nodes.Hips} />
      
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      
      {/* ... autres meshes ... */}
      
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      
      {/* ... */}
    </group>
  );
}

useGLTF.preload('/models/696a4b8a86e729b70995ba73.glb');
```

**Éléments importants :**

1. **`morphTargetDictionary`** : Dictionnaire des morph targets
   ```javascript
   {
     "eyeBlinkLeft": 0,
     "eyeBlinkRight": 1,
     "mouthSmileLeft": 2,
     "viseme_PP": 48,
     // ... 52 morph targets ARKit
   }
   ```

2. **`morphTargetInfluences`** : Valeurs actuelles (0 à 1)
   ```javascript
   [0, 0, 0, ..., 0]  // Array de 52 valeurs
   ```

3. **`skeleton`** : Structure osseuse pour les animations

---

## 🔄 Étape 3 : Conversion .glb → .fbx avec Blender

### 3.1 Pourquoi cette Conversion ?

**Problème :**
- Mixamo n'accepte QUE le format `.fbx` (pas .glb)
- Le .glb de ReadyPlayerMe n'a pas de skeleton compatible Mixamo

**Solution :**
- Convertir .glb → .fbx
- Blender fait cette conversion gratuitement

### 3.2 Installation de Blender

**Télécharger :** https://www.blender.org/download/

**Version recommandée :** Blender 3.6+ (LTS)

### 3.3 Processus de Conversion

#### A. Ouvrir Blender

1. Lancer Blender
2. **File** → **New** → **General**
3. Supprimer les objets par défaut (Select All → Delete)

#### B. Importer le .glb

1. **File** → **Import** → **glTF 2.0 (.glb/.gltf)**
2. Naviguer vers `public/models/696a4b8a86e729b70995ba73.glb`
3. **Import glTF 2.0**

**Vérifications :**
- L'avatar apparaît dans la vue 3D
- Le skeleton (armature) est présent
- Les textures sont chargées

#### C. Préparer pour Mixamo

**⚠️ IMPORTANT : Mixamo nécessite une pose en T**

1. **Sélectionner l'armature** (skeleton)
2. **Mode Object** → **Mode Pose** (Ctrl+Tab)
3. **Pose** → **Clear Transform** → **All**
4. Vérifier que les bras sont en position T (horizontale)

**Si les bras ne sont pas en T :**
- Sélectionner les os des bras
- Rotation Y : 0°
- Les bras doivent être parfaitement horizontaux

#### D. Exporter en .fbx

1. **File** → **Export** → **FBX (.fbx)**

2. **Paramètres d'export ESSENTIELS :**

```
Include:
  ☑ Selected Objects (ou All si tout est bon)
  ☐ Active Collection
  ☑ Include → Armature
  ☑ Include → Mesh

Transform:
  Scale: 1.00
  ☑ Apply Scalings: FBX All
  Forward: -Z Forward
  Up: Y Up

Geometry:
  ☑ Apply Modifiers
  
Armature:
  ☑ Add Leaf Bones (IMPORTANT pour Mixamo)
```

3. **Nommer le fichier :** `avatar-for-mixamo.fbx`
4. **Export FBX**

### 3.4 Vérification

**Le fichier .fbx doit contenir :**
✅ Le mesh (géométrie)
✅ L'armature (skeleton)
✅ Les textures (ou références)
✅ Pose en T

**Taille du fichier :** 5-20 MB typiquement

---

## 🎬 Étape 4 : Télécharger les Animations sur Mixamo

### 4.1 Qu'est-ce que Mixamo ?

**Mixamo** = Bibliothèque gratuite d'animations 3D par Adobe

**Avantages :**
✅ 2000+ animations gratuites
✅ Retargeting automatique (adapte aux différents skeletons)
✅ Qualité professionnelle
✅ Téléchargement illimité

**Site :** https://www.mixamo.com/

### 4.2 Créer un Compte

1. Aller sur https://www.mixamo.com/
2. **Sign In** avec un compte Adobe (gratuit)
3. Accepter les conditions

### 4.3 Uploader l'Avatar

1. **Upload Character**
2. Sélectionner `avatar-for-mixamo.fbx`
3. **Open**

**Processus de rigging automatique :**

```
1. Mixamo détecte les joints
   ↓
2. Vous validez les positions
   - Menton
   - Poignets
   - Coudes
   - Genoux
   - Entrejambe
   ↓
3. Mixamo génère le skeleton
   ↓
4. Avatar prêt pour les animations !
```

**Temps : 30 secondes à 2 minutes**

### 4.4 Sélectionner et Télécharger les Animations

#### Animations Recommandées pour un Chatbot

**Animations de base :**
```
1. Idle                      # Animation par défaut (respiration)
2. Talking                   # Parle en bougeant les mains
3. Standing Greeting         # Salutation
4. Sitting Talking           # Parle assis (optionnel)
```

**Animations émotionnelles :**
```
5. Angry Gesture            # Colère
6. Happy Idle               # Joie
7. Sad Idle                 # Tristesse
8. Thinking                 # Réflexion
9. Agree                    # Accord (hochement de tête)
10. Disagree                # Désaccord
```

**Animations gestuelles :**
```
11. Explaining              # Explique quelque chose
12. Pointing                # Pointe du doigt
13. Shrugging               # Haussement d'épaules
14. Waving                  # Salut de la main
```

#### Processus de Téléchargement

**Pour CHAQUE animation :**

1. **Rechercher l'animation** (ex: "Idle")
2. **Cliquer sur l'animation** pour la prévisualiser
3. **Ajuster les paramètres** (optionnel)
   - Speed : Vitesse (100% = normal)
   - Trim : Couper le début/fin
   - Overdrive : Exagérer les mouvements
   - In Place : Animation sans déplacement (⚠️ Important !)

4. **Download**

**Paramètres de téléchargement ESSENTIELS :**

```
Format: FBX for Unity (.fbx)
Frames per Second: 30 fps (ou 60 fps)
☐ With Skin (décocher ! On a déjà le mesh)
☑ In Place (cocher si vous ne voulez pas de déplacement)
```

5. **Download**

6. **Renommer le fichier** de manière descriptive
   ```
   # Avant
   Idle.fbx
   
   # Après (recommandé)
   Idle.fbx                     # OU
   Standing Greeting.fbx        # Garder le nom Mixamo
   Angry Gesture.fbx
   ```

### 4.5 Organiser les Animations

```bash
# Structure recommandée
frontend/
└── public/
    └── animations/
        ├── Idle.fbx
        ├── Talking.fbx
        ├── Standing Greeting.fbx
        ├── Angry Gesture.fbx
        ├── Sitting Talking.fbx
        └── ... autres animations
```

**⚠️ Important :**
- **Tous les fichiers .fbx dans `/public/animations/`**
- Noms cohérents et descriptifs
- Pas d'espaces dans les noms (ou entre guillemets dans le code)

---

## 💻 Étape 5 : Implémentation de la Logique dans Avatar.jsx

### 5.1 Modifications Nécessaires

Le fichier généré par `gltfjsx` est un bon point de départ, mais il faut ajouter :

1. ✅ Chargement des animations
2. ✅ Gestion des morph targets (expressions faciales)
3. ✅ Lip sync
4. ✅ État local (animation, expression, etc.)
5. ✅ Intégration avec useChat

### 5.2 Structure Complète

```jsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useGraph } from '@react-three/fiber';
import { useGLTF, useFBX, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useChat } from '../hooks/useChat';

// 1. CONFIGURATION : Expressions faciales
const facialExpressions = {
  default: {},
  smile: { /* morph targets */ },
  sad: { /* morph targets */ },
  // ...
};

// 2. CONFIGURATION : Mapping phonèmes → visemes
const corresponding = {
  A: 'viseme_PP',
  B: 'viseme_kk',
  // ...
};

export function Avatar(props) {
  // 3. CHARGEMENT : Modèle 3D
  const { scene } = useGLTF('/models/avatar.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  // 4. CHARGEMENT : Animations FBX
  const { animations: idleAnimation } = useFBX('/animations/Idle.fbx');
  const { animations: talkingAnimation } = useFBX('/animations/Talking.fbx');
  // ... autres animations

  // 5. PRÉPARATION : Renommer et combiner animations
  const animations = useMemo(() => {
    const combined = [];
    if (idleAnimation?.[0]) {
      idleAnimation[0].name = 'Idle';
      combined.push(idleAnimation[0]);
    }
    // ... autres animations
    return combined;
  }, [idleAnimation, talkingAnimation, /* ... */]);

  // 6. ÉTAT LOCAL
  const [animation, setAnimation] = useState('Idle');
  const [facialExpression, setFacialExpression] = useState('');
  const [lipsync, setLipsync] = useState();
  const [audio, setAudio] = useState();
  const [blink, setBlink] = useState(false);

  // 7. INTÉGRATION : useChat hook
  const { message, onMessagePlayed } = useChat();

  // 8. GESTION : Animations
  const group = useRef();
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions?.[animation].reset().fadeIn(0.5).play();
    return () => actions?.[animation]?.fadeOut(0.5);
  }, [animation, actions]);

  // 9. GESTION : Messages du backend
  useEffect(() => {
    if (!message) {
      setAnimation('Idle');
      return;
    }
    
    setAnimation(message.animation);
    setFacialExpression(message.facialExpression);
    setLipsync(message.lipsync);
    
    const audio = new Audio('data:audio/mp3;base64,' + message.audio);
    audio.play();
    setAudio(audio);
    audio.onended = onMessagePlayed;
  }, [message, onMessagePlayed]);

  // 10. FONCTION : Interpolation des morph targets
  const lerpMorphTarget = (target, value, speed = 0.1) => {
    if (!group.current) return;
    
    group.current.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (index === undefined) return;
        
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
      }
    });
  };

  // 11. RENDU : Chaque frame
  useFrame(() => {
    // A. Appliquer expression faciale
    Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
      if (key === 'eyeBlinkLeft' || key === 'eyeBlinkRight') return;
      
      const mapping = facialExpressions[facialExpression];
      if (mapping && mapping[key]) {
        lerpMorphTarget(key, mapping[key], 0.1);
      } else {
        lerpMorphTarget(key, 0, 0.1);
      }
    });

    // B. Clignement des yeux
    lerpMorphTarget('eyeBlinkLeft', blink ? 1 : 0, 0.5);
    lerpMorphTarget('eyeBlinkRight', blink ? 1 : 0, 0.5);

    // C. Lip sync
    if (message && lipsync && audio) {
      const currentTime = audio.currentTime;
      
      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const cue = lipsync.mouthCues[i];
        if (currentTime >= cue.start && currentTime <= cue.end) {
          lerpMorphTarget(corresponding[cue.value], 1, 0.2);
          break;
        }
      }
    }
  });

  // 12. EFFET : Clignement automatique des yeux
  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // 13. JSX : Rendu de l'avatar
  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      {/* ... skinnedMeshes générés par gltfjsx ... */}
    </group>
  );
}

useGLTF.preload('/models/avatar.glb');
```

---

## 📊 Récapitulatif Complet

| Étape | Outil | Input | Output | Durée |
|-------|-------|-------|--------|-------|
| 1 | ReadyPlayerMe | Personnalisation | .glb + morphTargets | 5-10 min |
| 2 | gltfjsx | .glb | Avatar.jsx | 10 sec |
| 3 | Blender | .glb | .fbx (pose T) | 2-5 min |
| 4 | Mixamo | .fbx | Animations .fbx | 10-15 min |
| 5 | VS Code | Avatar.jsx | Logique complète | 30-60 min |

**Total : ~1 heure** (première fois)  
**Total : ~30 minutes** (une fois maîtrisé)

---

## ⚠️ Problèmes Fréquents et Solutions

### Problème 1 : Pas de Morph Targets

**Symptôme :**
```javascript
console.log(nodes.EyeLeft.morphTargetDictionary);
// → undefined ou {}
```

**Cause :** Paramètre `?morphTargets=ARKit,Oculus Visemes` oublié

**Solution :** Retélécharger le .glb avec les bons paramètres

---

### Problème 2 : Animations ne Fonctionnent Pas

**Symptôme :** Avatar reste figé

**Causes possibles :**
1. ❌ Fichier .fbx avec skin (trop lourd)
2. ❌ Skeleton incompatible
3. ❌ Animation ne correspond pas au skeleton

**Solutions :**
1. Télécharger Mixamo **sans skin** (décocher "With Skin")
2. Vérifier que l'avatar est bien en pose T dans Blender
3. S'assurer que le retargeting Mixamo a fonctionné

---

### Problème 3 : Lip Sync Désynchronisé

**Symptôme :** Bouche bouge mal ou en retard

**Causes possibles :**
1. ❌ `audio.currentTime` pas mis à jour
2. ❌ Morph targets viseme manquants
3. ❌ Mapping phonème incorrect

**Solutions :**
1. Vérifier que `audio.ontimeupdate` est appelé
2. Console.log les morph targets disponibles
3. Vérifier le mapping `corresponding`

---

### Problème 4 : Performance Lente

**Symptôme :** FPS bas, lag

**Causes :**
1. Modèle trop détaillé (trop de polygones)
2. Textures trop grandes
3. Trop d'objets dans `useFrame`

**Solutions :**
1. Utiliser un modèle optimisé (< 20k triangles)
2. Compresser les textures (1024x1024 max)
3. Memoizer et optimiser `useFrame`

---

## 🎯 Checklist Finale

Avant de considérer que tout fonctionne :

- [ ] Avatar s'affiche correctement
- [ ] Animations jouent (Idle, Talking, etc.)
- [ ] Expressions faciales fonctionnent (smile, sad, etc.)
- [ ] Lip sync synchronisé avec l'audio
- [ ] Yeux clignent automatiquement
- [ ] Pas d'erreurs dans la console
- [ ] Performance acceptable (> 30 FPS)

---

## 🚀 Prochaines Étapes

Une fois ce workflow maîtrisé, vous pouvez :

1. **Créer plusieurs avatars** (homme, femme, différents styles)
2. **Ajouter plus d'animations** (centaines sur Mixamo)
3. **Personnaliser les expressions** (ajuster les valeurs des morph targets)
4. **Optimiser les performances** (LOD, instancing)
5. **Ajouter des accessoires** (chapeaux, lunettes dynamiques)

---

Bravo pour ce workflow pro ! Vous avez maintenant un pipeline complet et reproductible. 🎉
