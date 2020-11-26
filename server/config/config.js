/***
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000;

/***
 * Vencimiento del Token
 */

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/***
 * SEED de autenticacion
 */

process.env.SEED = process.env.SEED || 'este-es-el-secret-de-desarrollo-node';

/***
 * Entorno
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/***
 * Base de Datos
 */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

/***
 * Google client ID
 */

process.env.CLIENT_ID = process.env.CLIENT_ID || '739703802144-r08gephm1795r0d86s3c8fgcu9htfj35.apps.googleusercontent.com';