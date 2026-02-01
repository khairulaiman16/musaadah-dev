'use server';

import { ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Query } from "node-appwrite";

const { APPWRITE_DATABASE_ID: DATABASE_ID } = process.env;
const JAWATANKUASA_COLLECTION_ID = 'jawatankuasa'; // Ensure this matches your Appwrite ID

export const createCommitteeMember = async (memberData: any) => {
  try {
    const { database } = await createAdminClient();

    const newMember = await database.createDocument(
      DATABASE_ID!,
      JAWATANKUASA_COLLECTION_ID,
      ID.unique(),
      {
        nama: memberData.nama,
        jawatan: memberData.jawatan,
        noTelefon: memberData.noTelefon,
        status: memberData.status,
        // email: memberData.email, // Uncomment if you added this attribute
      }
    );

    return parseStringify(newMember);
  } catch (error: any) {
    console.error("Error creating Committee Member:", error.message);
    return null;
  }
}

export const getCommitteeMembers = async () => {
  try {
    const { database } = await createAdminClient();
    const members = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.COMMITTEE_COLLECTION_ID!,
      [Query.orderAsc('nama')]
    );
    return parseStringify(members.documents);
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}