import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      common: {
        ok: 'OK',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        send: 'Send',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Info',
        yes: 'Yes',
        no: 'No',
        retry: 'Retry',
        close: 'Close',
        search: 'Search',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
      },
      
      // Authentication
      auth: {
        login: 'Login',
        register: 'Register',
        forgotPassword: 'Forgot Password',
        resetPassword: 'Reset Password',
        verifyEmail: 'Verify Email',
        emailVerification: 'Email Verification',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
        
        // Form labels
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        username: 'Username',
        firstName: 'First Name',
        lastName: 'Last Name',
        
        // Messages
        loginSuccess: 'Login successful',
        registerSuccess: 'Registration successful. Please verify your email.',
        logoutSuccess: 'Logout successful',
        passwordResetSent: 'Password reset email sent',
        passwordResetSuccess: 'Password reset successful',
        emailVerified: 'Email verified successfully',
        
        // Errors
        invalidCredentials: 'Invalid email or password',
        emailRequired: 'Email is required',
        passwordRequired: 'Password is required',
        passwordTooShort: 'Password must be at least 6 characters',
        passwordsDoNotMatch: 'Passwords do not match',
        usernameRequired: 'Username is required',
        firstNameRequired: 'First name is required',
        lastNameRequired: 'Last name is required',
        invalidEmail: 'Please enter a valid email address',
      },
      
      // Chat
      chat: {
        chats: 'Chats',
        newChat: 'New Chat',
        createGroup: 'Create Group',
        groupName: 'Group Name',
        groupDescription: 'Group Description',
        addParticipants: 'Add Participants',
        typeMessage: 'Type a message...',
        sendMessage: 'Send Message',
        messageDeleted: 'Message deleted',
        messageEdited: 'Message edited',
        typing: 'typing...',
        online: 'online',
        offline: 'offline',
        away: 'away',
        busy: 'busy',
        lastSeen: 'Last seen',
        delivered: 'Delivered',
        read: 'Read',
        
        // Media
        photo: 'Photo',
        video: 'Video',
        audio: 'Audio',
        file: 'File',
        camera: 'Camera',
        gallery: 'Gallery',
        
        // Calls
        videoCall: 'Video Call',
        voiceCall: 'Voice Call',
        incomingCall: 'Incoming call',
        callEnded: 'Call ended',
        callRejected: 'Call rejected',
        callFailed: 'Call failed',
        calling: 'Calling...',
        connecting: 'Connecting...',
        connected: 'Connected',
        
        // Settings
        chatSettings: 'Chat Settings',
        notifications: 'Notifications',
        media: 'Media',
        participants: 'Participants',
        leaveChat: 'Leave Chat',
        deleteChat: 'Delete Chat',
      },
      
      // Profile
      profile: {
        myProfile: 'My Profile',
        editProfile: 'Edit Profile',
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        phoneNumber: 'Phone Number',
        dateOfBirth: 'Date of Birth',
        country: 'Country',
        city: 'City',
        language: 'Language',
        avatar: 'Profile Picture',
        uploadPhoto: 'Upload Photo',
        takePhoto: 'Take Photo',
        removePhoto: 'Remove Photo',
        profileUpdated: 'Profile updated successfully',
        passwordChanged: 'Password changed successfully',
      },
      
      // Settings
      settings: {
        appSettings: 'App Settings',
        account: 'Account',
        privacy: 'Privacy',
        security: 'Security',
        notifications: 'Notifications',
        appearance: 'Appearance',
        language: 'Language',
        theme: 'Theme',
        about: 'About',
        version: 'Version',
        contactSupport: 'Contact Support',
        termsOfService: 'Terms of Service',
        privacyPolicy: 'Privacy Policy',
        deleteAccount: 'Delete Account',
      },
      
      // Errors
      errors: {
        networkError: 'Network error. Please check your connection.',
        serverError: 'Server error. Please try again later.',
        unknownError: 'An unknown error occurred.',
        validationError: 'Please check your input and try again.',
        authenticationError: 'Authentication failed. Please login again.',
        permissionDenied: 'Permission denied.',
        notFound: 'Resource not found.',
        timeout: 'Request timeout. Please try again.',
      },
    },
  },
  es: {
    translation: {
      // Common
      common: {
        ok: 'Aceptar',
        cancel: 'Cancelar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        send: 'Enviar',
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        warning: 'Advertencia',
        info: 'Información',
        yes: 'Sí',
        no: 'No',
        retry: 'Reintentar',
        close: 'Cerrar',
        search: 'Buscar',
        profile: 'Perfil',
        settings: 'Configuración',
        logout: 'Cerrar Sesión',
      },
      
      // Authentication
      auth: {
        login: 'Iniciar Sesión',
        register: 'Registrarse',
        forgotPassword: 'Olvidé mi Contraseña',
        resetPassword: 'Restablecer Contraseña',
        verifyEmail: 'Verificar Email',
        emailVerification: 'Verificación de Email',
        signIn: 'Ingresar',
        signUp: 'Registrarse',
        signOut: 'Cerrar Sesión',
        
        // Form labels
        email: 'Correo Electrónico',
        password: 'Contraseña',
        confirmPassword: 'Confirmar Contraseña',
        username: 'Nombre de Usuario',
        firstName: 'Nombre',
        lastName: 'Apellido',
        
        // Messages
        loginSuccess: 'Inicio de sesión exitoso',
        registerSuccess: 'Registro exitoso. Por favor verifica tu email.',
        logoutSuccess: 'Cierre de sesión exitoso',
        passwordResetSent: 'Email de recuperación enviado',
        passwordResetSuccess: 'Contraseña restablecida exitosamente',
        emailVerified: 'Email verificado exitosamente',
        
        // Errors
        invalidCredentials: 'Email o contraseña incorrectos',
        emailRequired: 'El email es requerido',
        passwordRequired: 'La contraseña es requerida',
        passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
        passwordsDoNotMatch: 'Las contraseñas no coinciden',
        usernameRequired: 'El nombre de usuario es requerido',
        firstNameRequired: 'El nombre es requerido',
        lastNameRequired: 'El apellido es requerido',
        invalidEmail: 'Por favor ingresa un email válido',
      },
      
      // Chat
      chat: {
        chats: 'Chats',
        newChat: 'Nuevo Chat',
        createGroup: 'Crear Grupo',
        groupName: 'Nombre del Grupo',
        groupDescription: 'Descripción del Grupo',
        addParticipants: 'Agregar Participantes',
        typeMessage: 'Escribe un mensaje...',
        sendMessage: 'Enviar Mensaje',
        messageDeleted: 'Mensaje eliminado',
        messageEdited: 'Mensaje editado',
        typing: 'escribiendo...',
        online: 'en línea',
        offline: 'desconectado',
        away: 'ausente',
        busy: 'ocupado',
        lastSeen: 'Visto por última vez',
        delivered: 'Entregado',
        read: 'Leído',
        
        // Media
        photo: 'Foto',
        video: 'Video',
        audio: 'Audio',
        file: 'Archivo',
        camera: 'Cámara',
        gallery: 'Galería',
        
        // Calls
        videoCall: 'Videollamada',
        voiceCall: 'Llamada de Voz',
        incomingCall: 'Llamada entrante',
        callEnded: 'Llamada terminada',
        callRejected: 'Llamada rechazada',
        callFailed: 'Llamada fallida',
        calling: 'Llamando...',
        connecting: 'Conectando...',
        connected: 'Conectado',
        
        // Settings
        chatSettings: 'Configuración del Chat',
        notifications: 'Notificaciones',
        media: 'Medios',
        participants: 'Participantes',
        leaveChat: 'Salir del Chat',
        deleteChat: 'Eliminar Chat',
      },
      
      // Profile
      profile: {
        myProfile: 'Mi Perfil',
        editProfile: 'Editar Perfil',
        changePassword: 'Cambiar Contraseña',
        currentPassword: 'Contraseña Actual',
        newPassword: 'Nueva Contraseña',
        phoneNumber: 'Número de Teléfono',
        dateOfBirth: 'Fecha de Nacimiento',
        country: 'País',
        city: 'Ciudad',
        language: 'Idioma',
        avatar: 'Foto de Perfil',
        uploadPhoto: 'Subir Foto',
        takePhoto: 'Tomar Foto',
        removePhoto: 'Quitar Foto',
        profileUpdated: 'Perfil actualizado exitosamente',
        passwordChanged: 'Contraseña cambiada exitosamente',
      },
      
      // Settings
      settings: {
        appSettings: 'Configuración de la App',
        account: 'Cuenta',
        privacy: 'Privacidad',
        security: 'Seguridad',
        notifications: 'Notificaciones',
        appearance: 'Apariencia',
        language: 'Idioma',
        theme: 'Tema',
        about: 'Acerca de',
        version: 'Versión',
        contactSupport: 'Contactar Soporte',
        termsOfService: 'Términos de Servicio',
        privacyPolicy: 'Política de Privacidad',
        deleteAccount: 'Eliminar Cuenta',
      },
      
      // Errors
      errors: {
        networkError: 'Error de red. Por favor verifica tu conexión.',
        serverError: 'Error del servidor. Por favor intenta más tarde.',
        unknownError: 'Ocurrió un error desconocido.',
        validationError: 'Por favor verifica tu entrada e intenta de nuevo.',
        authenticationError: 'Falló la autenticación. Por favor inicia sesión de nuevo.',
        permissionDenied: 'Permiso denegado.',
        notFound: 'Recurso no encontrado.',
        timeout: 'Tiempo de espera agotado. Por favor intenta de nuevo.',
      },
    },
  },
};

// Get device language
const deviceLanguage = getLocales()[0]?.languageCode || 'en';
const supportedLanguages = ['en', 'es'];
const fallbackLanguage = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'en';

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: fallbackLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18next;