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
import * as bcrypt from 'bcrypt';

export default class SuperUser {
  name: string;
  email: string;
  password: string;
  id: string;
  created: Timestamp;
  updated: Timestamp;

  constructor(
    name: string,
    email: string,
    password: string,
    id = '',
    created: Timestamp = Timestamp.now(),
    updated: Timestamp = Timestamp.now()
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.id = id;
    this.created = created;
    this.updated = updated;
  }

  static async create(user: SuperUser): Promise<SuperUser> {
    const userData: {
      name: string;
      email: string;
      password: string;
      created: Timestamp;
      updated: Timestamp;
    } = {
      name: user.name,
      email: user.email,
      password: user.password,
      created: Timestamp.now(),
      updated: Timestamp.now(),
    };

    if (!_validateEmail(user.email)) throw new Error('Invalid e-mail!');

    // Check if user exists
    const nameQuery = await this.find(null, user.name);
    if (nameQuery.length > 0)
      throw new Error('User with this name already exists!');

    const emailQuery = await this.find(null, null, user.email);

    if (emailQuery.length > 0)
      throw new Error('User with this email already exists!');

    userData.password = await _hashPassword(user.password);

    return await addDoc(collection(firestore, 'super-users'), userData)
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
    email: string | null = null
  ): Promise<SuperUser[]> {
    const queryData = [];

    if (limitData !== null) {
      queryData.push(limit(limitData));
    }

    if (name !== null) {
      queryData.push(where('name', '==', name));
    }

    if (email !== null) {
      queryData.push(where('email', '==', email));
    }

    const q = query(collection(firestore, 'super-users'), ...queryData);

    return await getDocs(q)
      .then(snapshot => {
        const superUser: SuperUser[] = [];

        snapshot.forEach(childSnapshot => {
          const data = childSnapshot.data();
          data['id'] = childSnapshot.id;
          superUser.push(
            new SuperUser(
              data['name'],
              data['email'],
              data['password'],
              data['created'],
              data['updated']
            )
          );
        });

        return superUser;
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  static async get(id: string): Promise<SuperUser> {
    const docRef = doc(firestore, 'super-users', id);
    return await getDoc(docRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          data['id'] = snapshot.id;

          return new SuperUser(
            data['name'],
            data['email'],
            data['password'],
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
      email?: string;
      password?: string;
    }
  ): Promise<SuperUser> {
    const updateSuperUser = await this.get(id);

    if (user.name !== undefined) {
      const nameQuery = await this.find(null, user.name);
      if (nameQuery.length > 0)
        throw new Error('User with this name already exists!');

      updateSuperUser.name = user.name;
    }
    if (user.email !== undefined) {
      const emailQuery = await this.find(null, null, user.email);
      if (emailQuery.length > 0)
        throw new Error('User with this email already exists!');

      updateSuperUser.email = user.email;
    }
    if (user.password !== undefined)
      updateSuperUser.password = await _hashPassword(user.password);

    const userJson = JSON.parse(JSON.stringify(updateSuperUser));
    userJson.updated = Timestamp.now();

    delete userJson['id'];

    return updateDoc(doc(firestore, 'super-users', id), userJson)
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
    const superUser = await this.get(id);
    const docRef = doc(firestore, 'super-users', id);

    return deleteDoc(docRef)
      .then(() => {
        return {
          id: superUser.id,
          object: 'SuperUser',
          deleted: true,
        };
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  async verify(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}

async function _hashPassword(password: string) {
  return await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS as string)
  );
}

const _validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
