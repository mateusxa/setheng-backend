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
import Storage from './utils/storage';

export default class Report {
  name: string;
  companyId: string;
  category: string;
  pdf: string | Buffer;
  id: string;
  created: Timestamp;

  constructor(
    name: string,
    companyId: string,
    category: string,
    pdf: string | Buffer,
    id = '',
    created: Timestamp = Timestamp.now()
  ) {
    this.name = name;
    this.companyId = companyId;
    this.category = category;
    this.pdf = pdf;
    this.id = id;
    this.created = created;
  }

  static async create(report: Report): Promise<Report> {
    const reportData: {
      name: string;
      companyId: string;
      category: string;
      pdf: string | Buffer;
      created: any;
    } = {
      name: report.name,
      companyId: report.companyId,
      category: report.category,
      pdf: '',
      created: Timestamp.now(),
    };

    const nameQuery = await this.find(null, report.name);
    if (nameQuery.length > 0)
      throw new Error('Report with this name already exists!');

    return await addDoc(collection(firestore, 'reports'), reportData)
      .then(async reportReturned => {
        const metadata = {
          contentType: 'application/pdf',
        };

        const StoragePdf = await Storage.upload(
          reportReturned.id,
          report.pdf as Buffer,
          'reports',
          metadata
        )
          .then(StoragePdf => {
            return StoragePdf;
          })
          .catch(e => {
            this.delete(reportReturned.id);
            throw new Error(e);
          });

        const reportPdf = {
          pdf: '',
        };
        reportPdf.pdf = StoragePdf.link;

        return updateDoc(
          doc(firestore, 'reports', reportReturned.id),
          reportPdf
        )
          .then(() => {
            return this.get(reportReturned.id);
          })
          .catch(e => {
            this.delete(reportReturned.id);
            throw new Error(e);
          });
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  static async find(
    limitData: number | null = null,
    name: string | null = null,
    companyId: string | null = null,
    category: string | null = null
  ): Promise<Report[]> {
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

    if (category !== null) {
      queryData.push(where('category', '==', category));
    }

    const q = query(collection(firestore, 'reports'), ...queryData);

    return await getDocs(q)
      .then(snapshot => {
        const report: Report[] = [];

        snapshot.forEach(childSnapshot => {
          const data = childSnapshot.data();
          data['id'] = childSnapshot.id;
          report.push(
            new Report(
              data['name'],
              data['companyId'],
              data['category'],
              data['pdf'],
              data['id'],
              data['created']
            )
          );
        });

        return report;
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  static async get(id: string): Promise<Report> {
    const docRef = doc(firestore, 'companies', id);
    return await getDoc(docRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          data['id'] = snapshot.id;

          return new Report(
            data['name'],
            data['companyId'],
            data['category'],
            data['pdf'],
            data['id'],
            data['created']
          );
        }
        throw new Error('No data available');
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
    const report = await this.get(id);
    const docRef = doc(firestore, 'reports', id);

    await Storage.deleteByLink(report.pdf as string);

    return deleteDoc(docRef)
      .then(() => {
        return {
          id: report.id,
          object: 'Report',
          deleted: true,
        };
      })
      .catch(e => {
        throw new Error(e);
      });
  }
}
