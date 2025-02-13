import * as sdk from 'node-appwrite';
export const{
  PROJECT_ID, API_KEY, 
  DATABASE_ID, PATIENT_COLLECTION_ID, 
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID, 
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT
} = process.env;

const client = new sdk.Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6785e3b8002e9c709766')
  .setKey('standard_2e6d8f4e1c0351cc3774af4e86444008985ce3b346db88426e0a2c4fb629679f09a0127facf012756e9eb59206dd164d0238447ad6d0a6d008411c77d3201995f89da0627dbc030d36773384dea002cc7e11a66bce9c3630faef65f56d9bf38ff877f4199444245326a982e7b33b8315b437f512ef5e3d2d237211c32c6c6461');

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);

