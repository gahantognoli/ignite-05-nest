import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/Answer'
import { Answer as PrismaAnswer, Prisma } from '@prisma/client'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        content: raw.content,
        questionId: new UniqueEntityID(raw.questionId),
        authorId: new UniqueEntityID(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(raw: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      questionId: raw.questionId.toString(),
      content: raw.content,
      authorId: raw.authorId.toString(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
