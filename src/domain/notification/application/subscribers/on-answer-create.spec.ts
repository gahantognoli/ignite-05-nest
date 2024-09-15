/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAnswer } from 'test/factories/make-answer'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { makeQuestion } from 'test/factories/make-question'
import { vi } from 'vitest'
import { waitFor } from 'test/utils/wait-for'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let sendNotificationUse: SendNotificationUseCase
let sendNotificationExecuteSpy: any

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      new InMemoryAnswerAttachmentsRepository(),
    )
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      new InMemoryQuestionAttachmentsRepository(),
    )
    sendNotificationUse = new SendNotificationUseCase(
      new InMemoryNotificationsRepository(),
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUse, 'execute')

    // eslint-disable-next-line no-new
    new OnAnswerCreated(inMemoryQuestionRepository, sendNotificationUse)
  })

  it('should send a notification when a answer was created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled())
  })
})
