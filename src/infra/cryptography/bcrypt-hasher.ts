import { HashComparer } from '@/domain/forum/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { hash, compare } from 'bcryptjs'

export class BCryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH: number = 8

  async hash(plain: string): Promise<string> {
    return await hash(plain, this.HASH_SALT_LENGTH)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash)
  }
}
