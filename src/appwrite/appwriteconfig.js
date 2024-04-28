import {Client,Account,Storage, Databases,ID} from 'appwrite'
import conf from "../conf/conf";




export const API_ENDPOINT = 'https://cloud.appwrite.io/v1'
export const PROJECT_ID = '66201769ed5710073074'
export const BUCKET_ID = '66292c86c05c5fc84f6b'
export const COLLECTION_ID = '662ddd4700255a63f561'
export const DATABASE_ID = '6629286d2a643c69418a'

const client = new Client()
.setEndpoint(API_ENDPOINT)
.setProject(PROJECT_ID);


export const account = new Account(client)

export const bucket = new Storage(client)

export const databases = new Databases(client)
export default client
