# Borno-Cloud-Service

#Cloud service for both Client and publisher

Serverless web service in AWS platform, using serverless package for using boilerlates. 

#Target

Publisher:
1. Can upload file, which is stored in AWS, sends confirmation notifications. 
2. Adds the book id along with publisher id in relational db,

Client:
1. Can See available books in store, [through the DB], and download them
2. Download happens after file is encrypted with user secret id.      

Note: 
Serverless v: 1.43.0
Node: 10
