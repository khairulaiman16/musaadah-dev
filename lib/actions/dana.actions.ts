'use server';


import { ID, Query } from "node-appwrite"; // Added Query import
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";


const {
 APPWRITE_DATABASE_ID: DATABASE_ID,
} = process.env;


// This ID must match the collection ID you created in Appwrite
const DANA_MASUK_COLLECTION_ID = 'penerimaan_dana';


/**
* 1. CREATE RECORD (Maintained existing logic)
*/
export const createPenerimaanDana = async (danaData: any) => {
 try {
   const { database } = await createAdminClient();


   const newRecord = await database.createDocument(
     DATABASE_ID!,
     DANA_MASUK_COLLECTION_ID,
     ID.unique(),
     {
       ...danaData,
       // Ensure the amount is stored as a number
       jumlah: Number(danaData.jumlah),
       // Ensure date is in ISO format
       tarikhMasuk: new Date(danaData.tarikhMasuk).toISOString(),
     }
   );


   return parseStringify(newRecord);
 } catch (error) {
   console.error("Error creating Fund Receipt:", error);
   return null;
 }
}


/**
* 2. GET RECENT RECORDS (New function for the List sub-section)
*/
export const getRecentPenerimaan = async () => {
 try {
   const { database } = await createAdminClient();


   const transactions = await database.listDocuments(
     DATABASE_ID!,
     DANA_MASUK_COLLECTION_ID,
     [
       Query.orderDesc('$createdAt'), // Newest first for "Rekod Transaksi Terkini"
      //  Query.limit(15) // Balance between info and performance
     ]
   );


   return parseStringify(transactions.documents);
 } catch (error) {
   console.error("Error fetching transactions:", error);
   return [];
 }
}
