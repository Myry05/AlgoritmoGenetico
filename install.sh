#!/bin/bash

# Script de instalación para la aplicación móvil completa
# Uso: ./install.sh

set -e

echo "🚀 Iniciando instalación de la aplicación móvil completa..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar que Node.js está instalado
print_step "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js 18 o superior."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version $NODE_VERSION encontrada. Se requiere Node.js 18 o superior."
    exit 1
fi

print_message "Node.js $(node -v) encontrado ✓"

# Verificar que npm está instalado
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado."
    exit 1
fi

print_message "npm $(npm -v) encontrado ✓"

# Instalar dependencias del proyecto principal
print_step "Instalando dependencias del proyecto principal..."
npm install

# Instalar dependencias del backend
print_step "Instalando dependencias del backend..."
cd backend
npm install
print_message "Dependencias del backend instaladas ✓"

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    print_step "Creando archivo .env para el backend..."
    cp .env.example .env
    print_warning "Por favor configura las variables de entorno en backend/.env"
fi

cd ..

# Instalar dependencias del móvil
print_step "Instalando dependencias de la aplicación móvil..."
cd mobile
npm install
print_message "Dependencias del móvil instaladas ✓"

# Verificar React Native CLI
print_step "Verificando React Native CLI..."
if ! command -v npx react-native &> /dev/null; then
    print_warning "React Native CLI no encontrado. Instalando..."
    npm install -g @react-native-community/cli
fi

print_message "React Native CLI disponible ✓"

# Para iOS (solo en macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_step "Configurando iOS (macOS detectado)..."
    
    # Verificar CocoaPods
    if ! command -v pod &> /dev/null; then
        print_warning "CocoaPods no encontrado. Instalando..."
        sudo gem install cocoapods
    fi
    
    # Instalar pods
    if [ -d "ios" ]; then
        cd ios
        pod install
        cd ..
        print_message "CocoaPods configurado para iOS ✓"
    else
        print_warning "Directorio ios no encontrado. Ejecuta 'npx react-native run-ios' para crear el proyecto iOS."
    fi
else
    print_warning "macOS no detectado. Configuración de iOS omitida."
fi

cd ..

# Verificar MongoDB
print_step "Verificando MongoDB..."
if command -v mongod &> /dev/null; then
    print_message "MongoDB encontrado localmente ✓"
else
    print_warning "MongoDB no encontrado. Puedes:"
    echo "  1. Instalar MongoDB localmente"
    echo "  2. Usar MongoDB Atlas (cloud)"
    echo "  3. Usar Docker: docker run -d -p 27017:27017 mongo"
fi

# Resumen final
echo ""
echo "🎉 ¡Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Configura las variables de entorno en backend/.env"
echo "  2. Inicia MongoDB si usas instalación local"
echo "  3. Ejecuta 'npm start' para iniciar la aplicación completa"
echo "  4. O ejecuta por separado:"
echo "     - Backend: 'npm run backend'"
echo "     - Mobile: 'npm run mobile'"
echo "     - Android: 'npm run android'"
echo "     - iOS: 'npm run ios' (solo macOS)"
echo ""
echo "📖 Consulta el README.md para más información detallada."
echo ""

# Verificar herramientas adicionales
print_step "Verificando herramientas adicionales..."

# Android Studio / SDK
if command -v adb &> /dev/null; then
    print_message "Android SDK encontrado ✓"
else
    print_warning "Android SDK no encontrado. Instala Android Studio para desarrollo Android."
fi

# Xcode (solo macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v xcodebuild &> /dev/null; then
        print_message "Xcode encontrado ✓"
    else
        print_warning "Xcode no encontrado. Instala Xcode para desarrollo iOS."
    fi
fi

echo ""
print_message "Instalación finalizada. ¡Happy coding! 🚀"