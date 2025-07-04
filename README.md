# Aplicación Móvil Completa con Chat y Videollamadas

Una aplicación móvil completa desarrollada con React Native y Node.js que incluye autenticación, chat en tiempo real, videollamadas, manejo de roles de usuario y soporte multiidioma.

## 🚀 Características

### Autenticación y Usuario
- ✅ Registro de usuario con confirmación de contraseña
- ✅ Autenticación por correo electrónico
- ✅ Inicio y cierre de sesión
- ✅ Recuperación de contraseña
- ✅ Manejo de roles de usuario (usuario, admin, moderador)
- ✅ Cambio de idioma (Español/Inglés)

### Chat en Tiempo Real
- ✅ Chat privado y grupal
- ✅ Mensajes de texto, imágenes, videos y archivos
- ✅ Indicadores de escritura
- ✅ Estados de mensaje (enviado, entregado, leído)
- ✅ Reacciones a mensajes
- ✅ Responder a mensajes

### Videollamadas
- ✅ Videollamadas uno a uno
- ✅ Llamadas de voz
- ✅ Llamadas grupales
- ✅ Controles de llamada (silenciar, video on/off, colgar)

### Otras Características
- ✅ Subida de avatar
- ✅ Perfil de usuario personalizable
- ✅ Notificaciones push
- ✅ Tema claro/oscuro
- ✅ Almacenamiento local persistente

## 🏗️ Arquitectura

### Frontend (React Native)
- **Navegación**: React Navigation v6
- **Estado Global**: Redux Toolkit
- **UI**: React Native Paper (Material Design 3)
- **Internacionalización**: i18next
- **Videollamadas**: react-native-webrtc
- **Chat**: react-native-gifted-chat
- **Almacenamiento**: AsyncStorage
- **Networking**: Axios

### Backend (Node.js)
- **Framework**: Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JWT
- **Tiempo Real**: Socket.io
- **Subida de Archivos**: Cloudinary
- **Email**: Nodemailer
- **Validación**: express-validator
- **Seguridad**: Helmet, bcryptjs, CORS

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- MongoDB (local o Atlas)
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS, solo macOS)

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd mobile-app-project
```

### 2. Instalar dependencias
```bash
# Instalar todas las dependencias
npm run install-all

# O instalar manualmente
npm install
cd mobile && npm install
cd ../backend && npm install
```

### 3. Configurar variables de entorno

Copiar los archivos de ejemplo y configurar:

```bash
# Backend
cd backend
cp .env.example .env
```

Editar `backend/.env` con tus configuraciones:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/mobile_app

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRE=7d

# Server
PORT=3000
NODE_ENV=development

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
EMAIL_FROM=noreply@tuapp.com

# Cloudinary (para subida de archivos)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4. Configurar la aplicación móvil

Asegúrate de que la URL del API en `mobile/src/services/apiClient.ts` apunte a tu servidor:

```typescript
const API_BASE_URL = __DEV__ ? 'http://TU_IP:3000/api' : 'https://tu-api-produccion.com/api';
```

### 5. Configuración de React Native

```bash
cd mobile

# Para iOS (solo macOS)
cd ios && pod install && cd ..

# Para Android, asegúrate de tener configurado el SDK
```

## 🚀 Ejecutar la Aplicación

### Desarrollo
```bash
# Iniciar todo (backend + frontend)
npm start

# O iniciar por separado
npm run backend  # Inicia el servidor en puerto 3000
npm run mobile   # Inicia React Native Metro

# Para dispositivo/emulador específico
npm run android  # Android
npm run ios      # iOS
```

### Producción
```bash
# Backend
cd backend
npm start

# Mobile - generar APK/IPA según plataforma
cd mobile
npx react-native run-android --variant=release
```

## 📱 Uso de la Aplicación

### Registro y Autenticación
1. Abre la aplicación
2. Toca "Registrarse" para crear una cuenta nueva
3. Completa todos los campos requeridos
4. Verifica tu email (revisa tu bandeja de entrada)
5. Inicia sesión con tus credenciales

### Chat
1. Ve a la pestaña "Chats"
2. Toca el botón "+" para crear un nuevo chat
3. Selecciona entre chat privado o grupal
4. Agrega participantes
5. ¡Comienza a chatear!

### Videollamadas
1. Dentro de un chat, toca el ícono de videollamada
2. Espera a que el otro usuario acepte
3. Disfruta de la videollamada con controles intuitivos

### Configuraciones
1. Ve a "Configuración" o "Perfil"
2. Cambia tu idioma entre Español e Inglés
3. Actualiza tu información personal
4. Cambia tu foto de perfil

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/forgot-password` - Recuperar contraseña
- `PUT /api/auth/reset-password/:token` - Restablecer contraseña

### Usuarios
- `GET /api/users` - Listar usuarios (Admin)
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/profile` - Actualizar perfil
- `POST /api/users/avatar` - Subir avatar
- `PUT /api/users/change-password` - Cambiar contraseña

### Chat
- `GET /api/chat` - Obtener chats del usuario
- `POST /api/chat` - Crear nuevo chat
- `GET /api/chat/:id/messages` - Obtener mensajes
- `POST /api/chat/:id/messages` - Enviar mensaje
- `POST /api/chat/:id/upload` - Subir archivo

### Video
- `POST /api/video/call` - Iniciar videollamada
- `GET /api/video/history` - Historial de llamadas
- `POST /api/video/end` - Finalizar llamada

## 🔐 Seguridad

- Autenticación JWT con expiración
- Hashing de contraseñas con bcrypt
- Validación de entrada con express-validator
- Rate limiting para prevenir ataques
- Sanitización de datos
- Headers de seguridad con Helmet
- CORS configurado

## 🌐 Internacionalización

La aplicación soporta:
- **Español (es)**: Idioma principal
- **Inglés (en)**: Idioma secundario

El idioma se detecta automáticamente según la configuración del dispositivo y puede cambiarse desde la configuración de la aplicación.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Mobile tests
cd mobile
npm test
```

## 📦 Estructura del Proyecto

```
mobile-app-project/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── config/         # Configuraciones
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middlewares
│   │   ├── models/         # Modelos de DB
│   │   ├── routes/         # Rutas de API
│   │   └── utils/          # Utilidades
│   └── package.json
├── mobile/                  # App React Native
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── navigation/     # Navegación
│   │   ├── screens/        # Pantallas
│   │   ├── services/       # Servicios (API, Socket)
│   │   ├── store/          # Redux store
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilidades
│   └── package.json
└── package.json            # Scripts del proyecto
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- React Native community
- Redux Toolkit
- Socket.io
- WebRTC
- Material Design 3
- Y todos los contribuidores de las librerías utilizadas

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue si es necesario
4. Contacta al equipo de desarrollo

## 🗺️ Roadmap

- [ ] Notificaciones push
- [ ] Llamadas grupales
- [ ] Compartir ubicación
- [ ] Mensajes temporales
- [ ] Modo oscuro completo
- [ ] Backup de chats
- [ ] Integración con redes sociales
