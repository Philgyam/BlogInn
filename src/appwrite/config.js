import conf from "../conf/conf";

import { Client, Databases,Storage,Query } from "appwrite";


export class Service {
    client = new Client()
    databases;
    bucket;

    constructor(){
        this.client.setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
       

        this.bucket = new Storage(this.client);

        this.databases = new Databases(this.client);
    }

    async getPost(slug){
    
        try {
        
            return await this.databases.getDocument(conf.appwriteProjectId,conf.appwriteCollectionId,slug)
    } catch (error) {
        console.log('get Post()',error)
        return false
    }
    }

    async getPosts(queries = [queries = [Query.equal('category','sport')]]){

        try {
          return await  this.databases.listDocuments(conf.appwriteDatabaseId,conf.appwriteCollectionId,queries)
        } catch (error) {
            console.log(error,'get Post')
            return false
        }

    }
}

