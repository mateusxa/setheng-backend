import {
  deleteObject,
  FullMetadata,
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytes,
} from 'firebase/storage';
import {storage} from './app';

export default class Storage {
  title: string;
  folder: string | undefined;
  metadata: FullMetadata | undefined;
  link: string;

  constructor(
    title: string,
    link: string,
    folder?: string,
    metadata?: FullMetadata
  ) {
    this.title = title;
    this.link = link;
    this.folder = folder;
    this.metadata = metadata;
  }

  static async upload(
    title: string,
    file: Buffer,
    folder?: string,
    metadata?: {}
  ): Promise<Storage> {
    const storageRef =
      folder === undefined
        ? ref(storage, `${title}`)
        : ref(storage, `${folder}/${title}`);

    return await uploadBytes(storageRef, file, metadata)
      .then(async snapshot => {
        return await this.get(title, folder);
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  static async get(title: string, folder?: string): Promise<Storage> {
    const storageRef =
      folder === undefined
        ? ref(storage, `${title}`)
        : ref(storage, `${folder}/${title}`);

    return await getDownloadURL(storageRef)
      .then(async url => {
        return await getMetadata(storageRef).then(metadata => {
          return new Storage(title, url, folder, metadata);
        });
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  static async getByLink(link: string): Promise<Storage> {
    const metadata = await this.getMetadataByLink(link);
    const fullPath = metadata.fullPath.split('/');
    return this.get(fullPath[0], fullPath[1]);
  }

  static async getMetadataByLink(link: string) {
    const httpsReference = ref(storage, link);
    return await getMetadata(httpsReference);
  }

  static async delete(
    title: string,
    folder?: string
  ): Promise<{
    file: Storage;
    deleted: boolean;
  }> {
    const storageRef =
      folder === undefined
        ? ref(storage, `${title}`)
        : ref(storage, `${folder}/${title}`);

    const storageObject = await this.get(title, folder);

    return await deleteObject(storageRef)
      .then(() => {
        return {
          file: storageObject,
          deleted: true,
        };
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  static async deleteByLink(link: string): Promise<{
    file: Storage;
    deleted: boolean;
  }> {
    const metadata = await this.getMetadataByLink(link);
    const fullPath = metadata.fullPath.split('/');
    return this.delete(fullPath[1], fullPath[0]);
  }
}
