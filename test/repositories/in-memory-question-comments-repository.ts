import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.id.toString() === id)
    if (!questionComment) return null
    return questionComment
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
    return questionComments
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        )

        if (!author)
          throw new Error(`Author with id "${comment.authorId} does not exist"`)

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.createdAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return questionComments
  }

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === questionComment.id.toString(),
    )
    this.items.splice(itemIndex, 1)
  }
}
