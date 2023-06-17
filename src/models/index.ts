import {app} from './utils/app';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

export const storage = getStorage(app);
export const firestore = getFirestore(app);
