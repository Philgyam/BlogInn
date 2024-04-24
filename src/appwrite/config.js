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
        
    } catch (error) {
        
    }
    }
}

