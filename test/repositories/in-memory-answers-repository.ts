import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answersAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)
    if (!answer) return null
    return answer
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
    return answers
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )
    this.items[itemIndex] = answer
    await this.answersAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    )
    await this.answersAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)
    await this.answersAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )
    this.items.splice(itemIndex, 1)
    this.answersAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }
}
