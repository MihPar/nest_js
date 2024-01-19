import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsViewModel } from '../../posts/posts.type';
import { PostClass } from '../../../schema/post.schema';
import { PostsRepository } from '../../posts/posts.repository';
import { bodyPostsModelClass } from '../../posts/posts.class';
import { LikesRepository } from '../../likes/likes.repository';

export class CreateNewPostForBlogCommand {
  constructor(
	public blogId: string,
    public inputDataModel: bodyPostsModelClass,
	public blogName: string
  ) {}
}

@CommandHandler(CreateNewPostForBlogCommand)
export class CreateNewPostForBlogUseCase
  implements ICommandHandler<CreateNewPostForBlogCommand>
{
  constructor(
	protected readonly postsRepository: PostsRepository,
	protected readonly likesRepository: LikesRepository
  ) {}
  async execute(command: CreateNewPostForBlogCommand): Promise<PostsViewModel | null> {
    const newPost: PostClass = new PostClass(
      command.inputDataModel.title,
      command.inputDataModel.shortDescription,
      command.inputDataModel.content,
      command.blogId,
      command.blogName,
      0, 0
    );
    const createPost: PostClass | null = await this.postsRepository.createNewPosts(newPost)
	if(!createPost) return null
	const post = await this.postsRepository.findPostById(command.blogId)
    // const post = await this.postModel
    //   .findOne({ blogId: new ObjectId(blogId) }, { __v: 0 }) //
    //   .lean();
    if (!post) return null;
	const result = await this.likesRepository.getNewLike(post._id.toString(), command.blogId)
    // const newestLikes = await this.likeModel
    //   .find({ postId: post._id }) //
    //   .sort({ addedAt: -1 })
    //   .limit(3)
    //   .skip(0)
    //   .lean();
    // let myStatus: LikeStatusEnum = LikeStatusEnum.None;
    // if (blogId) {
    //   const reaction = await this.likeModel.findOne(
    //     { blogId: new ObjectId(blogId) },
    //     { __v: 0 },
    //   ); //
    //   myStatus = reaction
    //     ? (reaction.myStatus as unknown as LikeStatusEnum)
    //     : LikeStatusEnum.None;
    // }
    return createPost.getPostViewModel(result.myStatus, result.newestLikes);
  }
}
