import { ID, Query } from "node-appwrite"
import { parseStringify } from "../utils"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import {InputFile} from "node-appwrite/file";

// Trang viet cac funtion cho backend
export const createUser = async (user: CreateUserParams) =>{
  try{
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    )
    console.log({newUser})

    return parseStringify(newUser);
  } catch (error: any){  
    if(error && error?.code === 409){
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);
      return existingUser.users[0];
    }
  }
};


export const getUser = async (userId: string) =>{
  try{
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error){
    console.log(error);
  }
};

export const registerPatient = async ({ identificationDocument, ...patient}: RegisterUserParams) =>{
  try{
    let file;

    if(identificationDocument){
     const inputFile = InputFile.fromBuffer(
      identificationDocument?.get('blobFile') as Blob,
      identificationDocument?.get('fileName') as string,
    )

    file = await storage.createFile('6785e5ac0003f1ff57f1', ID.unique(), inputFile);

    }

    const newPatient = await databases.createDocument(
      '6785e47f000971f0f63d',
      '6785e4b5001c8f761799',
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `https://cloud.appwrite.io/v1/storage/buckets/6785e5ac0003f1ff57f1/files/${file?.$id}/view?project=6785e3b8002e9c709766`, 
        ...patient
      }
    )

    return parseStringify(newPatient);
  } catch (error){
    console.log(error);
  }

}