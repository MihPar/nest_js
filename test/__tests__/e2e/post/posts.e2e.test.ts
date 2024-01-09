import { stopDb } from "../../../db/db";
import request from "supertest";
import { initApp } from "../../../settings";
import { HTTP_STATUS } from "../../../utils/utils";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { log } from "console";
import { PostsViewModel } from "../../../types/postsTypes";
dotenv.config();

const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
let dbName = process.env.mongoDBName || "mongoose-example";

const app = initApp();

export function createErrorsMessageTest(fields: string[]) {
  const errorsMessages: any = [];
  for (const field of fields) {
    errorsMessages.push({
      message: expect.any(String),
      field: field ?? expect.any(String),
    });
  }
  return { errorsMessages: errorsMessages };
}

describe("/posts", () => {
  beforeAll(async () => {
    // await runDb()
    // console.log(mongoURI, ': MongoURI')
    // console.log(mongoURI, ': e')
    await mongoose.connect(mongoURI);

    const wipeAllRes = await request(app).delete("/testing/all-data");
    expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204);

    const getPosts = await request(app).get("/posts");
    expect(getPosts.status).toBe(HTTP_STATUS.OK_200);

    expect(getPosts.body.items).toHaveLength(0);
  });

  afterAll(async () => {
    // await stop()
    await stopDb();
  });

  afterAll((done) => {
    done();
  });

  const blogsValidationErrRes = {
    errorsMessages: expect.arrayContaining([
      {
        message: expect.any(String),
        field: "name",
      },
      {
        message: expect.any(String),
        field: "description",
      },
      {
        message: expect.any(String),
        field: "websiteUrl",
      },
    ]),
  };

  const blogsValidationErrResId = {
    errorsMessages: expect.arrayContaining([
      {
        message: expect.any(String),
        field: "id",
      },
    ]),
  };

  const postsValidationErrResPost = {
    errorsMessages: expect.arrayContaining([
      {
        message: expect.any(String),
        field: "title",
      },
      {
        message: expect.any(String),
        field: "shortDescription",
      },
      {
        message: expect.any(String),
        field: "content",
      },
      {
        message: expect.any(String),
        field: "blogId",
      },
    ]),
  };

  //   beforeEach(async() => {
  // 	const wipeAllRes = await request(app).delete('/testing/all-data').send()
  // })

  type token = {
    accessToken: string;
  };
  let firstPost: PostsViewModel;
  let createAccessTokenBody: token;
  let userId: string;
  let login: string;
  let postId1: string

  it("POST -> /posts/:postId/comments: should create new comment; status 201; content: created comment; used additional methods: POST -> /blogs, POST -> /posts, GET -> /comments/:commentId;", async () => {
    // create user(login, psw)!!!!!!
    //accwessToken = loginUser
    //blogId = createBlog
    //postId = createPost
    //comment = createComment

    const createUser = await request(app)
      .post("/users")
      .auth("admin", "qwerty")
      .send({
        login: "Mickle",
        password: "qwerty",
        email: "mpara7472@gmail.com",
      });
    expect(createUser.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createUser.body).toEqual({
      id: expect.any(String),
      login: "Mickle",
      email: "mpara7472@gmail.com",
      createdAt: expect.any(String),
    });

    const loginOrEmail = createUser.body.login;
    const createAccessToken = await request(app).post("/auth/login").send({
      loginOrEmail: loginOrEmail,
      password: "qwerty",
    });

    createAccessTokenBody = createAccessToken.body;

    expect(createAccessToken.status).toBe(HTTP_STATUS.OK_200);
    expect(createAccessToken.body).toEqual({
      accessToken: expect.any(String),
    });

    const createBlogs = await request(app)
      .post("/blogs")
      .auth("admin", "qwerty")
      .send({
        name: "Mickle",
        description: "my description",
        websiteUrl: "https://learn.javascript.ru",
      });
    expect(createBlogs.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createBlogs.body).toEqual({
      id: expect.any(String),
      name: "Mickle",
      description: "my description",
      websiteUrl: "https://learn.javascript.ru",
      createdAt: expect.any(String),
      isMembership: true,
    });

    const blogId = createBlogs.body.id;
    const blogName = createBlogs.body.name;

    const createPosts = await request(app)
      .post("/posts")
      .auth("admin", "qwerty")
      .send({
        title: "new title",
        shortDescription: "new shortDescription",
        content:
          "myContent I like javascript and I will be a developer in javascript, back end developer",
        blogId: blogId,
      });
	  postId1 = createPosts.body.id
    expect(createPosts.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createPosts.body).toEqual({
      id: expect.any(String),
      title: "new title",
      shortDescription: "new shortDescription",
      content:
        "myContent I like javascript and I will be a developer in javascript, back end developer",
      blogId: blogId,
      blogName: blogName,
      createdAt: expect.any(String),
	  "extendedLikesInfo": {
		"likesCount": 0,
		"dislikesCount": 0,
		"myStatus": "None",
		"newestLikes": [
		//   {
		// 	"addedAt": expect.any(String),
		// 	"userId": userId,
		// 	"login": login
		//   }
		]
	  }
    });

    firstPost = createPosts.body;

    const postId = createPosts.body.id;
    userId = createUser.body.id;
    login = createUser.body.login;

    /*************************** create comment by postId *****************************/

    const createCommentPostByPostId = await request(app)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${createAccessToken.body.accessToken}`)
      .send({
        content:
          "My profession is a programmer, I work in javascript and I work for back end developer",
      });

    expect(createCommentPostByPostId.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createCommentPostByPostId.body).toEqual({
      id: expect.any(String),
      content: expect.any(String),
      commentatorInfo: {
        userId: userId,
        userLogin: login,
      },
      createdAt: expect.any(String),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
    });

    const createCommentWithIncorrectData = await request(app)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${createAccessToken.body.accessToken}`)
      .send({ content: true });
    expect(createCommentWithIncorrectData.status).toBe(
      HTTP_STATUS.BAD_REQUEST_400
    );
    expect(createCommentWithIncorrectData.body).toStrictEqual(
      createErrorsMessageTest(["content"])
    );

    /*************************** get comment by postId *****************************/

    const id = createCommentPostByPostId.body.id;
    const getComment = await request(app).get(`/comments/${id}`);
    expect(getComment.status).toBe(HTTP_STATUS.OK_200);
    expect(getComment.body).toEqual({
      id: id,
      content: expect.any(String),
      commentatorInfo: {
        userId: userId,
        userLogin: login,
      },
      createdAt: expect.any(String),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
    });
  });

  /********************************************************************************************/

  type inputDataBlogType = {
    name: string;
    description: string;
    websiteUrl: string;
  };

  type inputDataPostType = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
  };
  let blogId: string;
  let inputDataBlog: inputDataBlogType;
  let inputDataPost: inputDataPostType;

  let id: string;

  let postId: string;
  it("make status like/dislike => return 204 status code", async() => {
	const updateLikeDiske = await request(app)
	.put(`/posts/${postId1}/like-status`)
	.set("Authorization", `Bearer ${createAccessTokenBody.accessToken}`)
	.send({
		"likeStatus": "None"
	})
	console.log("updateLikeStatus: ", updateLikeDiske.body)
	expect(updateLikeDiske.status).toBe(HTTP_STATUS.NO_CONTENT_204)
  })

  it("make status like/dislike with incorrect input data => return 400 status code", async() => {
	const updateLikeDiske = await request(app)
	.put(`/posts/${postId1}/like-status`)
	.set("Authorization", `Bearer ${createAccessTokenBody.accessToken}`)
	.send({
		"likeStatus": true
	})
	expect(updateLikeDiske.status).toBe(HTTP_STATUS.BAD_REQUEST_400)
	expect(updateLikeDiske.body).toStrictEqual(createErrorsMessageTest(["likeStatus"]))
  })

  it("make status like/dislike with empty input data of body  => return 400 status code", async() => {
	const updateLikeDiske = await request(app)
	.put(`/posts/${postId1}/like-status`)
	.set("Authorization", `Bearer ${createAccessTokenBody.accessToken}`)
	.send({})
	expect(updateLikeDiske.status).toBe(HTTP_STATUS.BAD_REQUEST_400)
	expect(updateLikeDiske.body).toStrictEqual(createErrorsMessageTest(["likeStatus"]))
  })

  it("make status like/dislike without authorization => return 401 status code", async() => {
	const updateLikeDiske = await request(app)
	.put(`/posts/${postId1}/like-status`)
	.send({
		"likeStatus": "None"
	})
	expect(updateLikeDiske.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401)
  })

  it("make status like/dislike without id=> return 404 status code", async() => {
	const updateLikeDiske = await request(app)
	.put(`/posts/123456789012345678901234/like-dislike`)
	.set("Authorization", `Bearer ${createAccessTokenBody.accessToken}`)
	.send({
		"likeStatus": "None"
	})
	expect(updateLikeDiske.status).toBe(HTTP_STATUS.NOT_FOUND_404)
  })

  it("create new post with correnct input data => return 201 status code", async () => {
    inputDataBlog = {
      name: "Mickhael",
      description: "new description",
      websiteUrl: "https://google.com",
    };
    const createBlog = await request(app)
      .post("/blogs")
      .auth("admin", "qwerty")
      .send(inputDataBlog);
    expect(createBlog.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createBlog.body).toEqual({
      id: expect.any(String),
      name: inputDataBlog.name,
      description: inputDataBlog.description,
      websiteUrl: inputDataBlog.websiteUrl,
      createdAt: expect.any(String),
      isMembership: true,
    });

    blogId = createBlog.body.id;
    inputDataPost = {
      title: "New title",
      shortDescription: "new shortDescription",
      content:
        "My live is variable, I maked many diferent things and I had diferent profession",
      blogId: blogId,
    };

    const createNewPost = await request(app)
      .post("/posts")
      .auth("admin", "qwerty")
      .send(inputDataPost);
    expect(createNewPost.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createNewPost.body).toEqual({
      id: expect.any(String),
      title: inputDataPost.title,
      shortDescription: inputDataPost.shortDescription,
      content: inputDataPost.content,
      blogId: blogId,
      blogName: inputDataBlog.name,
      createdAt: expect.any(String),
	  extendedLikesInfo: {
		likesCount: expect.any(Number),
		dislikesCount: expect.any(Number),
		myStatus: expect.any(String),
		newestLikes: [
		//   {
		// 	"addedAt": "2023-12-13T11:39:16.432Z",
		// 	"userId": "string",
		// 	"login": "string"
		//   }
		]
	  }
    });

    id = createNewPost.body.id;
  });
  it("create new post with incorrect input data => return 400 status code", async () => {
    const inputDataPost = {
      title: 123,
      shortDescription: 456,
      content: true,
      blogId: null,
    };
    const createNewPost = await request(app)
      .post("/posts")
      .auth("admin", "qwerty")
      .send(inputDataPost);
    expect(createNewPost.status).toBe(HTTP_STATUS.BAD_REQUEST_400);
    expect(createNewPost.body).toStrictEqual(postsValidationErrResPost);
  });

  it("create new post with empty body => return 400 status code", async () => {
    const createNewPost = await request(app)
      .post("/posts")
      .auth("admin", "qwerty")
      .send({});
    expect(createNewPost.status).toBe(HTTP_STATUS.BAD_REQUEST_400);
    expect(createNewPost.body).toEqual(
      createErrorsMessageTest([
        "title",
        "shortDescription",
        "content",
        "blogId",
      ])
    );
  });

  it("create new post without authorization => return 401 status code", async () => {
    const inputDataPost = {
      title: "New title",
      shortDescription: "new shortDescription",
      content:
        "My live is variable, I maked many diferent things and I had diferent profession",
      blogId: blogId,
    };
    const createNewPost = await request(app).post("/posts").send(inputDataPost);
    expect(createNewPost.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401);
  });

  it("return all posts with correct input data => return 200 status code", async () => {
    const pageNumber = "1";
    const pageSize = "10";
    const sortBy = "createAt";
    const sortDirection = "desc";

    const getAllPost = await request(app).get(
      `/posts?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    // .get('/posts').query({pageNumber: "1", pageSize: "10", sortBy: "createAt", sortDirection: "desc"})
    expect(getAllPost.status).toBe(HTTP_STATUS.OK_200);
    expect(getAllPost.body.pagesCount).toEqual(1);
    expect(getAllPost.body.page).toEqual(1);
    expect(getAllPost.body.pageSize).toEqual(10);
    expect(getAllPost.body.totalCount).toEqual(2);
    expect(getAllPost.body.items).toEqual([
      {
        ...firstPost,
        id: expect.any(String),
        createdAt: expect.any(String),
      },
      {
        id: expect.any(String),
        title: inputDataPost.title,
        shortDescription: inputDataPost.shortDescription,
        content: inputDataPost.content,
        blogId: inputDataPost.blogId,
        blogName: inputDataBlog.name,
        createdAt: expect.any(String),
		extendedLikesInfo: {
			likesCount: expect.any(Number),
			dislikesCount: expect.any(Number),
			myStatus: expect.any(String),
			// newestLikes: [
			//   {
			// 	"addedAt": "2023-12-13T11:39:16.432Z",
			// 	"userId": "string",
			// 	"login": "string"
			//   }
			// ]
		  }
      },
    ]);
  });

  it("get post by id => return 200 status code", async () => {
    const getPostById = await request(app)
      .get(`/posts/${id}`)
      .set("Authorization", `Bearer ${createAccessTokenBody.accessToken}`);
    expect(getPostById.status).toBe(HTTP_STATUS.OK_200);
    expect(getPostById.body).toStrictEqual({
      id: id,
      title: inputDataPost.title,
      shortDescription: inputDataPost.shortDescription,
      content: inputDataPost.content,
      blogId: inputDataPost.blogId,
      blogName: inputDataBlog.name,
      createdAt: expect.any(String),
	  extendedLikesInfo: {
		likesCount: expect.any(Number),
		dislikesCount: expect.any(Number),
		myStatus: expect.any(String),
		newestLikes: [
		//   {
		// 	"addedAt": "2023-12-13T11:39:16.432Z",
		// 	"userId": "string",
		// 	"login": "string"
		//   }
		]
	  }
    });
  });

  let content: string
  let createdAt: string
  it("get post by id with incorrect input data => return 400 status code", async () => {
    let id = "123456789012345678901234";
    const getPostByIdWithIncorrectData = await request(app)
      .get(`/posts/${id}`)
      .set("Authorization", `Bearer ${createAccessTokenBody.accessToken}`);
    expect(getPostByIdWithIncorrectData.status).toBe(HTTP_STATUS.NOT_FOUND_404);
    // expect(getPostByIdWithIncorrectData.body).toStrictEqual(createErrorsMessageTest(["id"]))
  });
  let createCommentByPostId: PostsViewModel;
  it("create comment by postId", async () => {
    postId = firstPost.id;
    const createCommentPostByPostId = await request(app)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${createAccessTokenBody.accessToken}`)
      .send({
        content:
          "My profession is a programmer, I work in javascript and I work for back end developer",
      });

    createCommentByPostId = createCommentPostByPostId.body;
	content = createCommentByPostId.content
	createdAt = createCommentByPostId.createdAt
    expect(createCommentPostByPostId.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createCommentByPostId).toEqual({
      id: expect.any(String),
      content: content,
      commentatorInfo: {
        userId: userId,
        userLogin: login,
      },
      createdAt: expect.any(String),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
    });
  });
  it("create comment with incorrect input data => return 400 status code", async () => {
    const createCommentWithIncorrectData = await request(app)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${createAccessTokenBody.accessToken}`)
      .send({ content: true });
    expect(createCommentWithIncorrectData.status).toBe(
      HTTP_STATUS.BAD_REQUEST_400
    );
    expect(createCommentWithIncorrectData.body).toStrictEqual(
      createErrorsMessageTest(["content"])
    );
  });
  it("create comment with empty input data of body => return 400 status code", async () => {
    const createCommentWithIncorrectData = await request(app)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${createAccessTokenBody.accessToken}`)
      .send({});
    expect(createCommentWithIncorrectData.status).toBe(
      HTTP_STATUS.BAD_REQUEST_400
    );
    expect(createCommentWithIncorrectData.body).toStrictEqual(
      createErrorsMessageTest(["content"])
    );
  });
  it("create comment without authorization => return 401 status code", async () => {
    const createCommentWithIncorrectData = await request(app)
      .post(`/posts/${postId}/comments`)
      .send({
        content:
          "My profession is a programmer, I work in javascript and I work for back end developer",
      });
    expect(createCommentWithIncorrectData.status).toBe(
      HTTP_STATUS.NOT_AUTHORIZATION_401
    );
  });
  it("create comment with empty input data of body => return 400 status code", async () => {
    const createCommentWithIncorrectData = await request(app)
      .post(`/posts/123456789012345678901234/comments`)
      .set("Authorization", `Bearer ${createAccessTokenBody.accessToken}`)
      .send({
        content:
          "My profession is a programmer, I work in javascript and I work for back end developer",
      });
    expect(createCommentWithIncorrectData.status).toBe(
      HTTP_STATUS.NOT_FOUND_404
    );
  });

  it("return comments for specified post by postId", async () => {
    const postId = firstPost.id;
    const pageNumber = "1";
    const pageSize = "10";
    const sortBy = "createdAt";
    const sortDirection = "desc";

    const getCommentByPost = await request(app)
      .get(`/posts/${postId}/comments`)
      .query({
        pageNumber: "1",
        pageSize: "10",
        sortBy: "createdAt",
        sortDirection: "desc",
      });
    expect(getCommentByPost.status).toBe(HTTP_STATUS.OK_200);
    expect(getCommentByPost.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: expect.any(Array),
    });
    expect(getCommentByPost.body.items).toHaveLength(2);
    expect(getCommentByPost.body.items[0]).toEqual({
      id: expect.any(String),
      content: content,
      commentatorInfo: {
        userId: userId,
        userLogin: login,
      },
      createdAt: createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
    });
  });
  it("get comment by specified postId with incorrect postId => return 404 status code", async() => {
	const postId = createCommentByPostId.id;
	const pageNumber = "1"
	const pageSize = "10"
	const sortBy = "createdAt"
	const sortDirection = "desc"

    const getCommentByPost = await request(app)
	.get(`/comments/123456789012345678901234`)
	.query({pageNumber: "1", pageSize: "10", sortBy: "createdAt", sortDirection: "desc"})
    expect(getCommentByPost.status).toBe(HTTP_STATUS.NOT_FOUND_404);
  })

  it("update existign post by id with input data => return 204 staus code", async() => {
	const objUpdate = {
		"title": "my new title",
		"shortDescription": "my new shortDescription",
		"content": "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
		"blogId": blogId
	}
	const updatePostById = await request(app)
	.put(`/posts/${postId}`)
	.auth("admin", "qwerty")
	.send(objUpdate)
	expect(updatePostById.status).toBe(HTTP_STATUS.NO_CONTENT_204)
  })
  it("update existing post by id with empty body => return 400 status code", async() => {
	const id = createCommentByPostId.id
	
	const updatePostById = await request(app)
	.put(`/posts/${id}`)
	.auth("admin", "qwerty")
	.send({})
	expect(updatePostById.status).toBe(HTTP_STATUS.BAD_REQUEST_400)
	expect(updatePostById.body).toStrictEqual(createErrorsMessageTest(["title", "shortDescription", "content", "blogId"]))
  })
  it("update existing post by id with empty incorrect input model => return 400 status code", async() => {
	const id = createCommentByPostId.id
	
	const updatePostById = await request(app)
	.put(`/posts/${id}`)
	.auth("admin", "qwerty")
	.send({
		"title": true,
		"shortDescription": 123,
		"content": null,
		"blogId": Symbol()
	})
	expect(updatePostById.status).toBe(HTTP_STATUS.BAD_REQUEST_400)
	expect(updatePostById.body).toStrictEqual(createErrorsMessageTest(["title", "shortDescription", "content", "blogId"]))
  })
  it("update existign post by id without authorization => return 401 status code", async() => {
	const id = createCommentByPostId.id
	const objUpdate = {
		"title": "my new title",
		"shortDescription": "my new shortDescription",
		"content": "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
		"blogId": blogId
	}
	const updatePostById = await request(app)
	.put(`/posts/${id}`)
	.send(objUpdate)
	expect(updatePostById.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401)
  })
  it("update existign post by id with not existing postId => return 401 status code", async() => {
	const id = createCommentByPostId.id
	const objUpdate = {
		"title": "my new title",
		"shortDescription": "my new shortDescription",
		"content": "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
		"blogId": blogId
	}
	const updatePostById = await request(app)
	.put(`/posts/123456789012345678901234`)
	.send(objUpdate)
	expect(updatePostById.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401)
  })

  it("delete post specified by id => return 204 status code", async() => {
	const deletePostById = await request(app)
	.delete(`/posts/${id}`)
	.auth("admin", "qwerty")
	expect(deletePostById.status).toBe(HTTP_STATUS.NO_CONTENT_204)
  })
  it("delete post specified by id => return 401 status code", async() => {
	const deletePostById = await request(app)
	.delete(`/posts/${id}`)
	expect(deletePostById.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401)
  })
  it("delete post specified by id => return 404 status code", async() => {
	const deletePostById = await request(app)
	.delete(`/posts/123456789012345678901234`)
	.auth("admin", "qwerty")
	expect(deletePostById.status).toBe(HTTP_STATUS.NOT_FOUND_404)
  })
});
