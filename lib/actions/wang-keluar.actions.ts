'use server';

import { ID, Query, InputFile } from "node-appwrite"; // Added InputFile for storage
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

const { 
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_STORAGE_ID: BUCKET_ID // Added for storage bucket
} = process.env;
const WANG_KELUAR_COLLECTION_ID = 'wang-keluar'; 

// 1. Create Record (Updated for File Upload & Accountability)
export const createAgihanDana = async (formData: FormData) => {
  try {
    const { database, storage } = await createAdminClient();

    // Extracting fields from FormData
    const file = formData.get('file') as File;
    const tujuan = formData.get('tujuan') as string;
    const penerima = formData.get('penerima') as string;
    const jumlah = formData.get('jumlah') as string;
    const kategoriPenerima = formData.get('kategoriPenerima') as string;
    const kaedahBayaran = formData.get('kaedahBayaran') as string;
    const tarikhKeluar = formData.get('tarikhKeluar') as string;
    const urussetiaId = formData.get('urussetiaId') as string;
    const urussetiaName = formData.get('urussetiaName') as string;
    const remark = formData.get('remark') as string;

    let fileId = "";

    // Upload file to Appwrite Storage if it exists
    if (file && file.size > 0) {
      const inputFile = InputFile.fromBuffer(
        Buffer.from(await file.arrayBuffer()),
        file.name
      );
      
      const uploadedFile = await storage.createFile(
        BUCKET_ID!, 
        ID.unique(),
        inputFile
      );
      fileId = uploadedFile.$id;
    }

    const newRecord = await database.createDocument(
      DATABASE_ID!,
      WANG_KELUAR_COLLECTION_ID,
      ID.unique(),
      {
        tujuan,
        penerima,
        jumlah: Number(jumlah),
        kategoriPenerima,
        kaedahBayaran,
        tarikhKeluar: new Date(tarikhKeluar).toISOString(),
        status: 'pending',
        urussetiaId, // New attribute for accountability
        urussetiaName, // New attribute for accountability
        attachmentId: fileId, // New attribute for document link
        remark,
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
  [
    Query.orderDesc('$createdAt'),
    Query.limit(100)
  ]
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

// 5. NEW: Update Agihan Data (Added for inline editing from Modal)
export const updateAgihanDana = async (id: string, updates: any) => {
  try {
    const { database } = await createAdminClient();

    const updatedRecord = await database.updateDocument(
      DATABASE_ID!,
      WANG_KELUAR_COLLECTION_ID,
      id,
      {
        tujuan: updates.tujuan,
        penerima: updates.penerima,
        jumlah: Number(updates.jumlah),
        kategoriPenerima: updates.kategoriPenerima,
        kaedahBayaran: updates.kaedahBayaran,
        tarikhKeluar: new Date(updates.tarikhKeluar).toISOString(),
        remark: updates.remark,
      }
    );

    revalidatePath('/wang-keluar/senarai-agihan');
    revalidatePath('/wang-keluar');
    return parseStringify(updatedRecord);
  } catch (error) {
    console.error("Error updating agihan record:", error);
    return null;
  }
}

// 6. BOD Consensus Approval
export const approveAgihanByBOD = async (permohonanId: string, userId: string) => {
  try {
    const { database } = await createAdminClient();

    // 1. Get the current record to check existing approvals
    const currentRecord = await database.getDocument(
      DATABASE_ID!,
      WANG_KELUAR_COLLECTION_ID,
      permohonanId
    );

    // Cast to any to access custom attributes like 'approvals'
    const existingApprovals = (currentRecord as any).approvals || [];

    // 2. Check if this user has already approved (prevent double voting)
    if (existingApprovals.includes(userId)) {
      return { success: false, message: "Anda telah pun meluluskan permohonan ini." };
    }

    // 3. Prepare the new array
    const updatedApprovals = [...existingApprovals, userId];
    const existingRejections = (currentRecord as any).rejections || [];
    
    // 4. Determine status: If 10 people approved, set to 'approved', else 'pending' or 'kiv'
    let finalStatus = 'pending';

    if (existingRejections.length > 0) {
      finalStatus = 'kiv';
    } else if (updatedApprovals.length >= 10) {
      finalStatus = 'approved';
    }

    // 5. Update the document
    const updatedDoc = await database.updateDocument(
      DATABASE_ID!,
      WANG_KELUAR_COLLECTION_ID,
      permohonanId,
      {
        approvals: updatedApprovals,
        status: finalStatus
      }
    );

    // 6. Trigger revalidation so the Table and Dashboard update immediately
    revalidatePath('/bod-dashboard');
    revalidatePath('/'); 

    // Return in a consistent format
    return JSON.parse(JSON.stringify({ success: true, data: updatedDoc }));
  } catch (error) {
    console.error("Error in BOD Approval:", error);
    return JSON.parse(JSON.stringify({ success: false, message: "Gagal merekodkan kelulusan." }));
  }
}

// 7. BOD Consensus Rejection (KIV Logic)
export const rejectAgihanByBOD = async (agihanId: string, userId: string, reason: string) => {
  try {
    const { database } = await createAdminClient();

    // 1. Get current doc to preserve existing data
    const currentDoc = await database.getDocument(
      DATABASE_ID!,
      WANG_KELUAR_COLLECTION_ID,
      agihanId
    );

    const existingRejections = (currentDoc as any).rejections || [];
    const existingRemarks = (currentDoc as any).remark || "";

    // 2. Prepare the new remark entry with user and date
    const newRemarkEntry = `\n[BOD REJECT - ${new Date().toLocaleDateString('en-GB')}]: ${reason}`;
    
    // 3. Update document: push to rejections array and change status to KIV
    const updatedDoc = await database.updateDocument(
      DATABASE_ID!,
      WANG_KELUAR_COLLECTION_ID,
      agihanId,
      {
        status: 'kiv',
        rejections: [...existingRejections, userId],
        remark: existingRemarks + newRemarkEntry
      }
    );

    // Revalidate the BOD dashboard and any other pages showing the agihan table
    revalidatePath('/bod-dashboard');
    revalidatePath('/'); // Add this if your main table is on the home/root page
    
    return parseStringify({ success: true, data: updatedDoc });
  } catch (error) {
    console.error("Error rejecting agihan:", error);
    return parseStringify({ success: false, message: "Gagal memproses penolakan." });
  }
}

export const getKJActivityStats = async () => {
  try {
    const { database } = await createAdminClient();

    const records = await database.listDocuments(
      DATABASE_ID!,
      WANG_KELUAR_COLLECTION_ID!
    );

    return parseStringify(records.documents);
  } catch (error) {
    console.error("Error fetching KJ stats:", error);
    return [];
  }
}