// lib/actions/report.actions.ts
'use server';

import { Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

export const getFilteredReports = async ({ 
  type, 
  startDate, 
  endDate, 
  kategori 
}: { 
  type: 'masuk' | 'keluar', 
  startDate?: string, 
  endDate?: string, 
  kategori?: string 
}) => {
  try {
    const { database } = await createAdminClient();
    const collectionId = type === 'masuk' ? 'penerimaan_dana' : 'wang-keluar';
    const dateField = type === 'masuk' ? 'tarikhMasuk' : 'tarikhKeluar';

    const queries = [Query.orderDesc(dateField)];

    if (startDate && endDate) {
      queries.push(Query.between(dateField, startDate, endDate));
    }
    
    if (kategori && kategori !== 'all') {
      const field = type === 'masuk' ? 'kategoriPenyumbang' : 'kategoriPenerima';
      queries.push(Query.equal(field, kategori));
    }

    const result = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      collectionId,
      queries
    );

    return parseStringify(result.documents);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}