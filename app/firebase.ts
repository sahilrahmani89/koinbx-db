
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const apiKey  =  process.env.NEXT_PUBLIC_apiKey
const authDomain = process.env.NEXT_PUBLIC_authDomain
const databaseURL = process.env.NEXT_PUBLIC_databaseURL
const projectId = process.env.NEXT_PUBLIC_projectId
const storageBucket = process.env.NEXT_PUBLIC_storageBucket
const messagingSenderId = process.env.NEXT_PUBLIC_messagingSenderId
const appId = process.env.NEXT_PUBLIC_appId

if(!apiKey || !authDomain ||!databaseURL || !projectId || !storageBucket  || !messagingSenderId || !appId ){
  throw  new Error(' Key is not available')
}
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
