// services/photoFiles.ts
import { Directory, File, Paths } from 'expo-file-system';

const photosDir = new Directory(Paths.document, 'photos');

/**
 * Copia la foto desde la caché a la carpeta de documentos permanente de la app.
 */
export function persistPhoto(cacheUri: string): string {
  if (cacheUri.startsWith('http://') || cacheUri.startsWith('https://')) {
    return cacheUri;
  }
  try {
    if (!photosDir.exists) {
      photosDir.create();
    }
    const source = new File(cacheUri);
    if (!source.exists) {
      return cacheUri;
    }
    const destination = new File(
      photosDir,
      `geocam_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`
    );
    source.copy(destination);
    return destination.uri;
  } catch (err) {
    console.warn('Error persistiendo archivo de foto en documentos:', err);
    return cacheUri;
  }
}

/**
 * Elimina el archivo permanente cuando se borra el registro en SQLite.
 */
export function deletePhotoFile(uri: string) {
  try {
    if (uri.startsWith('http://') || uri.startsWith('https://')) return;
    const file = new File(uri);
    if (file.exists) {
      file.delete();
    }
  } catch (err) {
    console.warn('Error eliminando archivo físico de foto:', err);
  }
}
