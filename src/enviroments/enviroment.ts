// Entorno de desarrollo (ng serve). El de producción es enviroment.prod.ts (Fase 8).
// La carpeta se llama "enviroments" (typo heredado, no corregir).
export const environment = {
  DOMINIO_API_LOCAL : 'http://127.0.0.1:8000/api/bdkpos/',
  DOMINIO_API_LOGIN : 'http://127.0.0.1:8000/api/auth/login',

  NOMBRE_USUARIO_SISTEMA: 'BDKPOS',
  IMG_LOGO_LOGIN: '/ruta/a/la/imagen1.jpg',
  SUBTITULO_LOGO_LOGIN: {
    title: 'SOFTWARE POS PARA TODO TIPO DE COMERCIO.',
    size: '16px',
  },
  TITULO_PROYECTO: 'BDK POS',

  TITULO_LOGIN: '',
  CONTENIDO_LOGIN: '/ruta/a/la/imagen3.jpg',

  IMAGE_TITLE_2: 'Título de la imagen 2',
  IMAGE_TITLE_3: 'Título de la imagen 3',
};
