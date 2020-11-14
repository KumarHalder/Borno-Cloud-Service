import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

const epubTable = process.env.GROUPS_TABLE
const bucketName = process.env.FILES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Caller event', event)
    const userId = 'ss'
    const fileId = uuidv4()


    const newItem = await addFile(userId, fileId)

    const url = getUploadUrl(fileId)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true

        },
        body: JSON.stringify({
            newItem: newItem,
            uploadUrl: url
        })
    }
}

async function addFile(userId: string, fileId: string) {
    const timestamp = new Date().toISOString()
    const newItem = {
        id: userId,
        timestamp,
        fileId,
        imageUrl: `https://${bucketName}.s3.amazonaws.com/${fileId}`
    }

    await docClient
        .put({
            TableName: epubTable,
            Item: newItem
        })
        .promise()


    return newItem
}

function getUploadUrl(fileId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: fileId,
        Expires: parseInt(urlExpiration)
    })
}