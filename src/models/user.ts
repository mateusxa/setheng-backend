import {firestore} from './index';
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

export default class User {
  name: string;
  firebaseId: string;
  companyId: string;
  id: string;
  created: Timestamp;
  updated: Timestamp;

  constructor(
    name: string,
    firebaseId: string,
    companyId: string,
    id = '',
    created: Timestamp = Timestamp.now(),
    updated: Timestamp = Timestamp.now()
  ) {
    this.name = name;
    this.firebaseId = firebaseId;
    this.companyId = companyId;
    this.id = id;
    this.created = created;
    this.updated = updated;
  }

  static async create(user: User): Promise<User> {
    const userData: {
      name: string;
      firebaseId: string;
      companyId: string;
      created: any;
      updated: any;
    } = {
      name: user.name,
      firebaseId: user.firebaseId,
      companyId: user.companyId,
      created: Timestamp.now(),
      updated: Timestamp.now(),
    };

    const nameQuery = await this.find(null, user.name);
    if (nameQuery.length > 0)
      throw new Error('User with this name already exists!');

    return await addDoc(collection(firestore, 'users'), userData)
      .then(user => {
        return this.get(user.id);
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  static async find(
    limitData: number | null = null,
    name: string | null = null,
    companyId: string | null = null,
    firebaseId: string | null = null
  ): Promise<User[]> {
    const queryData = [];

    if (limitData !== null) {
      queryData.push(limit(limitData));
    }

    if (name !== null) {
      queryData.push(where('name', '==', name));
    }

    if (companyId !== null) {
      queryData.push(where('companyId', '==', companyId));
    }

    if (firebaseId !== null) {
      queryData.push(where('firebaseId', '==', firebaseId));
    }

    const q = query(collection(firestore, 'companies'), ...queryData);

    return await getDocs(q)
      .then(snapshot => {
        const user: User[] = [];

        snapshot.forEach(childSnapshot => {
          const data = childSnapshot.data();
          data['id'] = childSnapshot.id;
          user.push(
            new User(
              data['name'],
              data['firebaseId'],
              data['companyId'],
              data['id'],
              data['created'],
              data['updated']
            )
          );
        });

        return user;
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  static async get(id: string): Promise<User> {
    const docRef = doc(firestore, 'users', id);
    return await getDoc(docRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          data['id'] = snapshot.id;

          return new User(
            data['name'],
            data['firebaseId'],
            data['companyId'],
            data['id'],
            data['created'],
            data['updated']
          );
        }
        throw new Error('No data available');
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  static async update(
    id: string,
    user: {
      name?: string;
      firebaseId?: string;
      companyId?: string;
    }
  ): Promise<User> {
    const updateUser = await this.get(id);

    if (user.name !== undefined) {
      const nameQuery = await this.find(null, user.name);
      if (nameQuery.length > 0)
        throw new Error('User with this name already exists!');

      updateUser.name = user.name;
    }
    if (user.firebaseId !== undefined) updateUser.firebaseId = user.firebaseId;
    if (user.companyId !== undefined) updateUser.companyId = user.companyId;

    const userJson = JSON.parse(JSON.stringify(updateUser));
    userJson.updated = Timestamp.now();

    delete userJson['id'];

    const updates: any = {};
    updates['/users/' + id] = userJson;

    return updateDoc(doc(firestore, 'users', id), updates)
      .then(() => {
        return this.get(id);
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  static async delete(id: string): Promise<{
    id: string;
    object: string;
    deleted: boolean;
  }> {
    const user = await this.get(id);
    const docRef = doc(firestore, 'users', id);

    return deleteDoc(docRef)
      .then(() => {
        return {
          id: user.id,
          object: 'User',
          deleted: true,
        };
      })
      .catch(e => {
        throw new Error(e);
      });
  }
}
