import mongoose, {Mongoose} from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if(!MONGODB_URI) {
  throw new Error('cannot access')
}
// khai bao ket noi 1 lan, va duy tri ket noi, tranh ket noi nhieu lan dan den loi ket noi
interface MongooseCache {
  Types: any;
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null
}

declare global {
  var mongoose: MongooseCache
}

let cached = global.mongoose;

if(!cached) {
  cached = global.mongoose = { conn: null, promise: null};
}

// thiet lap ket noi
// dont need to reestablish every sever action call
const dbConnect= async (): Promise<Mongoose>  =>{
  if(cached.conn) {
    return cached.conn;
  }

  if(!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'privateclinic',
    })
    .then((result) =>{
      console.log('Connected to MongoDB');
    return result;
    }).catch((error) =>{
      console.error('Error connecting to MongoDB', error);
      throw error
    })
  }
    cached.conn = await cached.promise;
    return cached.conn;
};

export default dbConnect;