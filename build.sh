#!/bin/bash

# Build script for Enquetes BH
# Generates a production-ready ZIP package

echo "--- Iniciando Build do Enquetes BH ---"

# 1. Clean previous builds
rm -rf dist
rm -f enquetesbh-site.zip

# 2. Build Frontend
echo "Compilando assets frontend..."
npm run build

# 3. Prepare package directory
mkdir -p dist/package
cp -r dist/* dist/package/
cp server.ts dist/package/
cp package.json dist/package/
cp .env.example dist/package/
cp enquetes.db dist/package/ 2>/dev/null || :

# 4. Create ZIP
echo "Gerando pacote ZIP..."
cd dist/package && zip -r ../../enquetesbh-site.zip .
cd ../..

echo "--- Build concluído com sucesso! ---"
echo "Arquivo gerado: enquetesbh-site.zip"
