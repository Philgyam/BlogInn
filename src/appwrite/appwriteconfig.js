import {Client,Account,Storage} from 'appwrite'
import conf from "../conf/conf";




export const API_ENDPOINT = 'https://cloud.appwrite.io/v1'
export const PROJECT_ID = '66201769ed5710073074'
export const BUCKET_ID = '66292c86c05c5fc84f6b'

const client = new Client()
.setEndpoint(API_ENDPOINT)
.setProject(PROJECT_ID);


export const account = new Account(client)

export const bucket = new Storage(client)

export default client
