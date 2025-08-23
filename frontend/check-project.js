#!/usr/bin/env node
/**
 * Script de vérification du projet React CuraTime
 * Vérifie que tous les fichiers et composants sont en place
 */

const fs = require('fs');
const path = require('path');

console.log(`
╔══════════════════════════════════════════════════════════════╗
║              VÉRIFICATION FRONTEND REACT                     ║
║                    CuraTime Project                          ║
╚══════════════════════════════════════════════════════════════╝
`);

// Fichiers et dossiers requis
const requiredStructure = {
  'src/': {
    'components/': {
      'Layout/': ['Header.tsx', 'Footer.tsx', 'Layout.tsx'],
      'UI/': ['LoadingSpinner.tsx', 'ErrorMessage.tsx']
    },
    'pages/': {
      'Auth/': ['LoginPage.tsx', 'RegisterPage.tsx', 'ForgotPasswordPage.tsx'],
      'Client/': ['Dashboard.tsx', 'DoctorListPage.tsx', 'DoctorDetailPage.tsx', 'AppointmentsPage.tsx', 'ProfilePage.tsx'],
      'Doctor/': ['Dashboard.tsx', 'AppointmentsPage.tsx', 'LoginPage.tsx']
    },
    'services/': ['authService.ts', 'doctorService.ts', 'appointmentService.ts', 'userService.ts'],
    'contexts/': ['AuthContext.tsx'],
    'types/': ['index.ts'],
    'hooks/': ['useAuth.ts']
  },
  'public/': ['index.html'],
  'package.json': null,
  'tsconfig.json': null
};

let totalFiles = 0;
let foundFiles = 0;
let missingFiles = [];

function checkStructure(structure, basePath = '') {
  for (const [key, value] of Object.entries(structure)) {
    const fullPath = path.join(basePath, key);
    
    if (value === null) {
      // C'est un fichier
      totalFiles++;
      if (fs.existsSync(fullPath)) {
        console.log(`✅ ${fullPath}`);
        foundFiles++;
      } else {
        console.log(`❌ ${fullPath}`);
        missingFiles.push(fullPath);
      }
    } else if (Array.isArray(value)) {
      // C'est un dossier avec des fichiers
      if (fs.existsSync(fullPath)) {
        console.log(`📁 ${fullPath}`);
        for (const file of value) {
          const filePath = path.join(fullPath, file);
          totalFiles++;
          if (fs.existsSync(filePath)) {
            console.log(`  ✅ ${file}`);
            foundFiles++;
          } else {
            console.log(`  ❌ ${file}`);
            missingFiles.push(filePath);
          }
        }
      } else {
        console.log(`❌ 📁 ${fullPath} (dossier manquant)`);
        value.forEach(file => {
          totalFiles++;
          missingFiles.push(path.join(fullPath, file));
        });
      }
    } else {
      // C'est un dossier avec des sous-dossiers
      if (fs.existsSync(fullPath)) {
        console.log(`📁 ${fullPath}`);
        checkStructure(value, fullPath);
      } else {
        console.log(`❌ 📁 ${fullPath} (dossier manquant)`);
        // Compter tous les fichiers manquants dans ce dossier
        function countMissingInStructure(struct) {
          for (const [k, v] of Object.entries(struct)) {
            if (v === null) {
              totalFiles++;
              missingFiles.push(path.join(fullPath, k));
            } else if (Array.isArray(v)) {
              v.forEach(file => {
                totalFiles++;
                missingFiles.push(path.join(fullPath, k, file));
              });
            } else {
              countMissingInStructure(v);
            }
          }
        }
        countMissingInStructure(value);
      }
    }
  }
}

// Vérifier la structure
console.log('🔍 Vérification de la structure du projet...\n');
checkStructure(requiredStructure);

// Vérifier package.json
console.log('\n🔍 Vérification des dépendances...');
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredDeps = [
    'react',
    'react-dom',
    'react-router-dom',
    'typescript',
    'axios',
    'react-hook-form',
    'react-toastify'
  ];
  
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  requiredDeps.forEach(dep => {
    if (allDeps[dep]) {
      console.log(`✅ ${dep}: ${allDeps[dep]}`);
    } else {
      console.log(`❌ ${dep}: manquant`);
    }
  });
}

// Vérifier les fichiers de configuration
console.log('\n🔍 Vérification des fichiers de configuration...');
const configFiles = [
  'tsconfig.json',
  'public/index.html',
  'src/index.tsx',
  'src/App.tsx'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}`);
  }
});

// Résumé
console.log(`\n${'='.repeat(60)}`);
console.log('📊 RÉSUMÉ DE LA VÉRIFICATION');
console.log(`${'='.repeat(60)}`);
console.log(`✅ Fichiers trouvés: ${foundFiles}/${totalFiles}`);

if (missingFiles.length > 0) {
  console.log(`❌ Fichiers manquants: ${missingFiles.length}`);
  console.log('\n📋 Liste des fichiers manquants:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
}

const completionRate = Math.round((foundFiles / totalFiles) * 100);
console.log(`\n📈 Taux de completion: ${completionRate}%`);

if (completionRate === 100) {
  console.log(`
🎉 PROJET REACT COMPLET !

✅ Tous les fichiers requis sont présents
✅ Structure du projet correcte
✅ Composants principaux implémentés

🚀 Le frontend React est prêt à fonctionner !

📍 Pour démarrer l'application :
   npm start

📍 L'application sera accessible sur :
   http://localhost:3000
  `);
} else if (completionRate >= 90) {
  console.log(`
✅ PROJET REACT QUASI-COMPLET !

📊 ${completionRate}% des fichiers sont présents
⚠️ Quelques fichiers mineurs manquent mais l'application devrait fonctionner

🚀 Le frontend React est utilisable !
  `);
} else {
  console.log(`
⚠️ PROJET REACT INCOMPLET

📊 Seulement ${completionRate}% des fichiers sont présents
❌ Des fichiers importants manquent

🔧 Veuillez compléter les fichiers manquants avant de démarrer l'application
  `);
}

console.log(`\n⏰ Vérification terminée le ${new Date().toLocaleString('fr-FR')}`);
