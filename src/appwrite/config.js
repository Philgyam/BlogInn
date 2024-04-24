import conf from "../conf/conf";

import { Client, Databases,Storage,Query,ID } from "appwrite";


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

    async createpost ({title,slug,content,featuredImage,userId,category}){
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,slug,{
                title,
                content,
                featuredImage,
                userId,
                category
            })
            
        } catch (error) {
            console.log(error,'create post error')
            return false
        }
    }

    async updatePost(slug,{title,content,featuredImage}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                   
                }
            ) 
        } catch (error) {
            console.log(error,'update DOc')
        }
    }

    async deletePost(slug){
        try {
         this.databases.deleteDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,slug)
         return true

        } catch (error) {
            console.log(error, 'deletePost')
        }
    }


    // Storage Service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(conf.appwriteBucketId,ID.unique(),file)
        } catch (error) {
            console.log(error, 'uploadfile Error')
        }
    }

    async deleteFile(fileId){
        try {
            return await this.bucket.deleteFile(conf.appwriteBucketId,fileId)
        } catch (error) {
            console.log(error, 'Delete Error')
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(conf.appwriteBucketId,fileId).href
    }
}

const service = new Service()
export default service
