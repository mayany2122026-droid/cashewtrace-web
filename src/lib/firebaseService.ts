import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  writeBatch, 
  query, 
  limit,
  deleteDoc,
  where
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Batch, InventoryRecord, Supplier, CleanSheetData, MangoPilotRecord } from '../types';
import sheetDataRaw from '../data/clean_sheet_data.json';

const sheetDataDefault = sheetDataRaw as CleanSheetData;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

/**
 * Handle Firestore errors by logging and throwing a structured JSON error as required by Firebase skill.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errStr = error instanceof Error ? error.message : String(error);
  // Gracefully handle client offline or network timeout events without crashing
  if (errStr.includes('offline') || errStr.includes('unavailable') || errStr.includes("Backend didn't respond")) {
    console.warn(`Firestore operating in offline cache mode for [${operationType}] at ${path || 'unknown'}`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errStr,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Seeding Firestore if any collections are empty
 */
export async function seedDatabaseIfNeeded() {
  try {
    // 1. Seed Batches if empty
    const batchesCol = collection(db, 'batches');
    const qBatches = query(batchesCol, limit(1));
    let querySnapshotBatches;
    try {
      const qPromise = getDocs(qBatches);
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
      const res = await Promise.race([qPromise, timeoutPromise]);
      if (!res) {
        console.warn('Firestore seed skipped due to connection timeout');
        return;
      }
      querySnapshotBatches = res;
    } catch (err) {
      console.warn('Firestore seed skipped batches check:', err);
      return;
    }

    if (querySnapshotBatches.empty) {
      console.log('Firestore batches are empty. Seeding from clean_sheet_data.json...');
      let firebaseBatch = writeBatch(db);
      let count = 0;

      for (const batch of sheetDataDefault.batches) {
        const batchRef = doc(db, 'batches', batch.batch_id);
        firebaseBatch.set(batchRef, batch);
        count++;

        if (count === 400) {
          try {
            await firebaseBatch.commit();
          } catch (err) {
            console.warn('Seed batches batch write error:', err);
          }
          firebaseBatch = writeBatch(db);
          count = 0;
        }
      }
      if (count > 0) {
        try {
          await firebaseBatch.commit();
        } catch (err) {
          console.warn('Seed batches commit error:', err);
        }
      }
    }

    // 2. Seed Inventory if empty
    const inventoryCol = collection(db, 'inventory');
    const qInventory = query(inventoryCol, limit(1));
    let querySnapshotInventory;
    try {
      const qPromise = getDocs(qInventory);
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
      const res = await Promise.race([qPromise, timeoutPromise]);
      if (!res) return;
      querySnapshotInventory = res;
    } catch (err) {
      console.warn('Firestore seed skipped inventory check:', err);
      return;
    }

    if (querySnapshotInventory.empty) {
      console.log('Firestore inventory is empty. Seeding from clean_sheet_data.json...');
      let firebaseBatch = writeBatch(db);
      let count = 0;

      for (let i = 0; i < sheetDataDefault.inventory.length; i++) {
        const inv = sheetDataDefault.inventory[i];
        const invId = `inv_seed_${i}_${inv.date_raw}_${inv.ct_id || 'unknown'}`;
        const invRef = doc(db, 'inventory', invId);
        firebaseBatch.set(invRef, inv);
        count++;

        if (count === 400) {
          try {
            await firebaseBatch.commit();
          } catch (err) {
            console.warn('Seed inventory batch error:', err);
          }
          firebaseBatch = writeBatch(db);
          count = 0;
        }
      }
      if (count > 0) {
        try {
          await firebaseBatch.commit();
        } catch (err) {
          console.warn('Seed inventory commit error:', err);
        }
      }
    }

    // 3. Seed Suppliers if empty
    const suppliersCol = collection(db, 'suppliers');
    const qSuppliers = query(suppliersCol, limit(1));
    let querySnapshotSuppliers;
    try {
      const qPromise = getDocs(qSuppliers);
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
      const res = await Promise.race([qPromise, timeoutPromise]);
      if (!res) return;
      querySnapshotSuppliers = res;
    } catch (err) {
      console.warn('Firestore seed skipped suppliers check:', err);
      return;
    }

    if (querySnapshotSuppliers.empty) {
      console.log('Firestore suppliers are empty. Seeding from clean_sheet_data.json...');
      let firebaseBatch = writeBatch(db);
      
      for (const supplier of sheetDataDefault.suppliers) {
        const supRef = doc(db, 'suppliers', supplier['ST ID']);
        firebaseBatch.set(supRef, supplier);
      }
      try {
        await firebaseBatch.commit();
      } catch (err) {
        console.warn('Seed suppliers commit error:', err);
      }
    }

    console.log('Seeding checks complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

/**
 * Subscribe to Batches in real-time
 */
export function subscribeToBatches(onUpdate: (batches: Batch[]) => void) {
  const batchesCol = collection(db, 'batches');
  return onSnapshot(batchesCol, (snapshot) => {
    const batches: Batch[] = [];
    snapshot.forEach((doc) => {
      batches.push(doc.data() as Batch);
    });
    batches.sort((a, b) => b.batch_id.localeCompare(a.batch_id));
    onUpdate(batches);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'batches');
  });
}

/**
 * Subscribe to Inventory in real-time
 */
export function subscribeToInventory(onUpdate: (records: InventoryRecord[]) => void) {
  const inventoryCol = collection(db, 'inventory');
  return onSnapshot(inventoryCol, (snapshot) => {
    const records: InventoryRecord[] = [];
    snapshot.forEach((doc) => {
      records.push(doc.data() as InventoryRecord);
    });
    records.sort((a, b) => b.date_raw - a.date_raw);
    onUpdate(records);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'inventory');
  });
}

/**
 * Subscribe to Suppliers in real-time
 */
export function subscribeToSuppliers(onUpdate: (suppliers: Supplier[]) => void) {
  const suppliersCol = collection(db, 'suppliers');
  return onSnapshot(suppliersCol, (snapshot) => {
    const suppliers: Supplier[] = [];
    snapshot.forEach((doc) => {
      suppliers.push(doc.data() as Supplier);
    });
    suppliers.sort((a, b) => a['Supplier Name'].localeCompare(b['Supplier Name']));
    onUpdate(suppliers);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'suppliers');
  });
}

/**
 * Save / Update a batch in Firestore
 */
export async function saveBatchToFirestore(batch: Batch, inventoryRecords: InventoryRecord[]) {
  try {
    // 1. Save Batch Document
    const batchRef = doc(db, 'batches', batch.batch_id);
    try {
      await setDoc(batchRef, batch);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `batches/${batch.batch_id}`);
    }

    // 2. Delete existing inventory records for this date and suppliers to prevent duplicates
    const sIds = inventoryRecords.map(r => r.ct_id).filter(Boolean);
    const inventoryCol = collection(db, 'inventory');
    
    let snapshot;
    try {
      snapshot = await getDocs(inventoryCol);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'inventory');
      return;
    }

    const deletePromises: Promise<void>[] = [];
    
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data() as InventoryRecord;
      if (data.date_raw === batch.production_date_raw && data.ct_id && sIds.includes(data.ct_id)) {
        deletePromises.push(
          deleteDoc(docSnapshot.ref).catch(err => {
            handleFirestoreError(err, OperationType.DELETE, `inventory/${docSnapshot.id}`);
          })
        );
      }
    });

    await Promise.all(deletePromises);

    // 3. Add new inventory records
    const firebaseBatch = writeBatch(db);
    inventoryRecords.forEach((inv, index) => {
      const invId = `inv_${batch.batch_id}_${index}_${inv.ct_id || 'unknown'}`;
      const invRef = doc(db, 'inventory', invId);
      firebaseBatch.set(invRef, inv);
    });
    
    try {
      await firebaseBatch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'inventory');
    }

    console.log(`Saved batch ${batch.batch_id} and its inventory records to Firestore!`);
  } catch (error) {
    console.error('Error saving batch to Firestore:', error);
    throw error;
  }
}

/**
 * Save / Update a supplier in Firestore
 */
export async function saveSupplierToFirestore(supplier: Supplier) {
  try {
    const supRef = doc(db, 'suppliers', supplier['ST ID']);
    await setDoc(supRef, supplier);
    console.log(`Saved supplier ${supplier['Supplier Name']} to Firestore!`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `suppliers/${supplier['ST ID']}`);
  }
}

/**
 * Save / Update a mango pilot record in Firestore
 */
export async function saveMangoPilotToFirestore(record: MangoPilotRecord): Promise<string> {
  const recordId = record.id || `mango_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const updatedRecord = { ...record, id: recordId };
  const mangoRef = doc(db, 'mango_pilots', recordId);
  try {
    await setDoc(mangoRef, updatedRecord);
    console.log(`Saved mango pilot ${recordId} to Firestore!`);
    return recordId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `mango_pilots/${recordId}`);
    throw error;
  }
}

/**
 * Delete a mango pilot record from Firestore
 */
export async function deleteMangoPilotFromFirestore(recordId: string) {
  const mangoRef = doc(db, 'mango_pilots', recordId);
  try {
    await deleteDoc(mangoRef);
    console.log(`Deleted mango pilot ${recordId} from Firestore!`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `mango_pilots/${recordId}`);
  }
}

/**
 * Subscribe to Mango Pilot Records in real-time
 */
export function subscribeToMangoPilots(onUpdate: (records: MangoPilotRecord[]) => void) {
  const pilotsCol = collection(db, 'mango_pilots');
  return onSnapshot(pilotsCol, (snapshot) => {
    const records: MangoPilotRecord[] = [];
    snapshot.forEach((doc) => {
      records.push(doc.data() as MangoPilotRecord);
    });
    records.sort((a, b) => b.timestamp - a.timestamp);
    onUpdate(records);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'mango_pilots');
  });
}

export interface WebsiteViewRecord {
  id: string;
  visitorId: string;
  timestamp: number;
  referrer: string;
  language: string;
  platform: string;
  userAgent: string;
  screenResolution: string;
  page: string;
}

export interface SectorClickRecord {
  id: string;
  visitorId: string;
  sectorId: string;
  sectorName: string;
  timestamp: number;
  device: string;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server_visitor';
  let vid = localStorage.getItem('cashewtrace_visitor_id');
  if (!vid) {
    vid = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('cashewtrace_visitor_id', vid);
  }
  return vid;
}

/**
 * Record a website page view in Firestore
 */
export async function recordWebsiteView(page: string = 'home'): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const visitorId = getOrCreateVisitorId();
    const viewId = `view_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const viewData: WebsiteViewRecord = {
      id: viewId,
      visitorId,
      timestamp: Date.now(),
      referrer: (document.referrer || 'direct').substring(0, 480),
      language: (navigator.language || 'unknown').substring(0, 40),
      platform: (navigator.platform || 'unknown').substring(0, 80),
      userAgent: (navigator.userAgent || '').substring(0, 480),
      screenResolution: `${window.innerWidth}x${window.innerHeight}`,
      page: page.substring(0, 80)
    };
    const viewRef = doc(db, 'website_views', viewId);
    await setDoc(viewRef, viewData);
    console.log(`[Analytics] Recorded website view for visitor ${visitorId}`);
  } catch (error) {
    console.warn('Analytics logging notice (offline/adblock):', error);
  }
}

/**
 * Record a user clicking on any of the 5 agricultural sectors
 */
export async function recordSectorClick(sectorId: string, sectorName: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const visitorId = getOrCreateVisitorId();
    const clickId = `click_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    const clickData: SectorClickRecord = {
      id: clickId,
      visitorId,
      sectorId: sectorId.substring(0, 40),
      sectorName: sectorName.substring(0, 90),
      timestamp: Date.now(),
      device: isMobile ? 'Mobile' : 'Desktop'
    };
    const clickRef = doc(db, 'sector_clicks', clickId);
    await setDoc(clickRef, clickData);
    console.log(`[Analytics] Recorded sector click: ${sectorName} (${sectorId})`);
  } catch (error) {
    console.warn('Sector click logging notice:', error);
  }
}

export interface UserSignInRecord {
  id: string;
  visitorId: string;
  name: string;
  phone: string;
  organization?: string;
  targetProject?: string;
  timestamp: number;
  device: string;
}

/**
 * Record user sign-in with name & phone number in Firestore
 */
export async function recordUserSignIn(
  name: string, 
  phone: string, 
  organization?: string, 
  targetProject?: string
): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const visitorId = getOrCreateVisitorId();
    const signinId = `signin_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    const data: UserSignInRecord = {
      id: signinId,
      visitorId,
      name: name.trim(),
      phone: phone.trim(),
      organization: organization?.trim() || '',
      targetProject: targetProject || 'general',
      timestamp: Date.now(),
      device: isMobile ? 'Mobile' : 'Desktop'
    };
    const ref = doc(db, 'user_signins', signinId);
    await setDoc(ref, data);
    console.log(`[Auth] Recorded user sign-in: ${name} (${phone}) for project: ${targetProject}`);
  } catch (error) {
    console.warn('User sign-in logging notice:', error);
  }
}

