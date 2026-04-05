#!/bin/bash

echo "🔍 Vérification du Projet Happipet"
echo "=================================="
echo ""

# Check folders
echo "📁 Vérification des dossiers..."
folders=("src" "src/screens" "src/components" "src/navigation" "src/constants" "src/utils" "assets")

for folder in "${folders[@]}"; do
  if [ -d "$folder" ]; then
    echo "✅ $folder"
  else
    echo "❌ $folder MANQUANT"
  fi
done

echo ""
echo "📄 Vérification des fichiers clés..."

files=(
  "App.js"
  "app.json"
  "package.json"
  "src/screens/HomeScreen.js"
  "src/screens/SearchScreen.js"
  "src/screens/ProfileScreen.js"
  "src/screens/MessagesScreen.js"
  "src/components/Header.js"
  "src/components/DogSitterCard.js"
  "src/navigation/RootNavigator.js"
  "src/constants/colors.js"
  "src/constants/mockData.js"
  "README_HAPPIPET.md"
  "DEVELOPER_GUIDE.md"
  "GETTING_STARTED.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file MANQUANT"
  fi
done

echo ""
echo "📦 Vérification des dépendances..."

if grep -q '"react": "19' package.json; then
  echo "✅ React v19 installée"
else
  echo "⚠️ React version inconnue"
fi

if grep -q '"@react-navigation/native"' package.json; then
  echo "✅ React Navigation installée"
else
  echo "❌ React Navigation manquante"
fi

if grep -q '"@expo/vector-icons"' package.json; then
  echo "✅ Material Icons disponibles"
else
  echo "❌ Material Icons manquantes"
fi

echo ""
echo "✨ Vérification complétée!"
echo ""
echo "💡 Prochaines étapes:"
echo "1. npm install (si vous n'avez pas déjà fait)"
echo "2. npm start"
echo "3. Appuyez sur 'i', 'a', ou 'w' pour lancer sur iOS, Android ou Web"
echo ""
