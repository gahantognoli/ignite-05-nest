import { Uploader } from '@/domain/forum/application/storage/uploader'
import { Module } from '@nestjs/common'
import { AzureBlobContainerUploader } from './azure-blob-container-uploader'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: AzureBlobContainerUploader,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
