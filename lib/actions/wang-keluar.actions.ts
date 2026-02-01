'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

const { APPWRITE_DATABASE_ID: DATABASE_ID } = process.env;
const WANG_KELUAR_COLLECTION_ID = 'wang-keluar'; 

// 1. Create Record (Existing)
export const createAgihanDana = async (agihanData: any) => {
  try {
    const { database } = await createAdminClient();

    const newRecord = await database.createDocument(
      DATABASE_ID!,
      WANG_KELUAR_COLLECTION_ID,
      ID.unique(),
      {
        ...agihanData,
        jumlah: Number(agihanData.jumlah),
        status: agihanData.status || 'pending', 
        tarikhKeluar: new Date(agihanData.tarikhKeluar).toISOString(),
      }
    );

    revalidatePath('/wang-keluar/senarai-agihan');
    return parseStringify(newRecord);
  } catch (error) {
    console.error("Error creating Disbursement:", error);
    return null;
  }
}

// 2. Fetch Records (Existing)
export const getRecentAgihan = async () => {
  try {
    const { database } = await createAdminClient();

    const records = await database.listDocuments(
      DATABASE_ID!,
      WANG_KELUAR_COLLECTION_ID,
      [Query.orderDesc('$createdAt')]
    );

    return parseStringify(records.documents);
  } catch (error) {
    console.error("Error fetching Agihan records:", error);
    return [];
  }
}

// 3. Update Status (Existing)
export const updateAgihanStatus = async (
  documentId: string, 
  status: 'approved' | 'rejected' | 'kiv' | 'tangguh'
) => {
  try {
    const { database } = await createAdminClient();

    const updatedRecord = await database.updateDocument(
      DATABASE_ID!,
      WANG_KELUAR_COLLECTION_ID,
      documentId,
      { status }
    );

    revalidatePath('/wang-keluar/senarai-agihan');
    revalidatePath('/wang-keluar'); // Added to refresh dashboard stats
    return parseStringify(updatedRecord);
  } catch (error) {
    console.error("Error updating status:", error);
    return null;
  }
}

// 4. NEW: Dashboard Stats Logic (Added for the mini-dashboard)
export const getAgihanStats = async () => {
  try {
    const { database } = await createAdminClient();

    const records = await database.listDocuments(
      DATABASE_ID!,
      WANG_KELUAR_COLLECTION_ID,
      [Query.orderDesc('$createdAt')]
    );

    // FIX: Tell TypeScript these documents have our custom fields
    const documents = records.documents as any[]; 

    // Calculate totals only for approved disbursements
    const totalKeluar = documents
      .filter(doc => doc.status === 'approved') // Now TS won't complain
      .reduce((acc, curr) => acc + Number(curr.jumlah), 0); // Now TS won't complain

    // Count pending requests
    const pendingCount = documents.filter(doc => doc.status === 'pending').length;

    return {
      recentAgihan: parseStringify(documents.slice(0, 5)),
      totalKeluar,
      pendingCount,
      allAgihan: parseStringify(documents)
    };
  } catch (error) {
    console.error("Error calculating agihan stats:", error);
    return { recentAgihan: [], totalKeluar: 0, pendingCount: 0, allAgihan: [] };
  }
}