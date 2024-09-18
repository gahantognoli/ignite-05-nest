import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AzureBlobContainerUploader implements Uploader {
  private readonly blobServiceClient: BlobServiceClient
  private readonly containerClient: ContainerClient
  private readonly CONTAINER_NAME = 'filesignite'

  constructor(private envService: EnvService) {
    const sasUrl = envService.get('AZURE_BLOB_SAS')
    this.blobServiceClient = new BlobServiceClient(sasUrl)
    this.containerClient = this.blobServiceClient.getContainerClient(
      this.CONTAINER_NAME,
    )
  }

  async upload({ body, fileName }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID() + '-' + fileName

    const blockBlobClient = this.containerClient.getBlockBlobClient(uploadId)

    await blockBlobClient.upload(body, body.length)

    return { url: blockBlobClient.url }
  }
}
