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

export default class Company {
  name: string;
  taxId: string;
  id: string;
  created: Timestamp;
  updated: Timestamp;

  constructor(
    name: string,
    taxId: string,
    id = '',
    created: Timestamp = Timestamp.now(),
    updated: Timestamp = Timestamp.now()
  ) {
    this.name = name;
    this.taxId = taxId;
    this.id = id;
    this.created = created;
    this.updated = updated;
  }

  static async create(company: Company): Promise<Company> {
    const companyData: {
      name: string;
      taxId: string;
      created: Timestamp;
      updated: Timestamp;
    } = {
      name: company.name,
      taxId: company.taxId,
      created: Timestamp.now(),
      updated: Timestamp.now(),
    };

    const nameQuery = await this.find(null, company.name);
    if (nameQuery.length > 0) {
      throw new Error('Company with this name already exists!');
    }

    const taxIdQuery = await this.find(null, company.taxId);
    if (taxIdQuery.length > 0) {
      throw new Error('Company with this taxId already exists!');
    }

    return await addDoc(collection(firestore, 'companies'), companyData)
      .then(company => {
        return this.get(company.id);
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  static async find(
    limitData: number | null = null,
    name: string | null = null,
    taxId: string | null = null
  ): Promise<Company[]> {
    const queryData = [];

    if (limitData !== null) {
      queryData.push(limit(limitData));
    }

    if (name !== null) {
      queryData.push(where('name', '==', name));
    }

    if (taxId !== null) {
      queryData.push(where('taxId', '==', taxId));
    }

    const q = query(collection(firestore, 'companies'), ...queryData);

    return await getDocs(q)
      .then(snapshot => {
        const company: Company[] = [];

        snapshot.forEach(childSnapshot => {
          const data = childSnapshot.data();
          data['id'] = childSnapshot.id;
          company.push(
            new Company(
              data['name'],
              data['taxId'],
              data['id'],
              data['created'],
              data['updated']
            )
          );
        });

        return company;
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  static async get(id: string): Promise<Company> {
    const docRef = doc(firestore, 'companies', id);
    return await getDoc(docRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          data['id'] = snapshot.id;

          return new Company(
            data['name'],
            data['taxId'],
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
    company: {
      name?: string;
      taxId?: string;
    }
  ): Promise<Company> {
    const updateCompany: {
      id?: string;
      name: string;
      taxId: string;
      created: Timestamp;
      updated: Timestamp;
    } = JSON.parse(JSON.stringify(await this.get(id)));

    if (company.name !== undefined) {
      const nameQuery = await this.find(null, company.name);
      if (nameQuery.length > 0) {
        throw new Error('Company with this name already exists!');
      }
      updateCompany.name = company.name;
    }

    if (company.taxId !== undefined) {
      const taxIdQuery = await this.find(null, company.taxId);
      if (taxIdQuery.length > 0) {
        throw new Error('Company with this taxId already exists!');
      }
      updateCompany.taxId = company.taxId;
    }
    updateCompany.updated = Timestamp.now();

    delete updateCompany['id'];

    return updateDoc(doc(firestore, 'companies', id), updateCompany)
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
    const company = await this.get(id);
    const docRef = doc(firestore, 'companies', id);

    return deleteDoc(docRef)
      .then(() => {
        return {
          id: company.id,
          object: 'Company',
          deleted: true,
        };
      })
      .catch(e => {
        throw new Error(e);
      });
  }
}
