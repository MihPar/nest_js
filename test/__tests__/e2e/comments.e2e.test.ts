import { stopDb } from "../../db/db";
import request from "supertest";
import { initApp } from "../../settings";
import { HTTP_STATUS } from "../../utils/utils";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { CommentViewModel } from "../../types/commentType";
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

describe("/like", () => {
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

  //   beforeEach(async () => {
  //     const wipeAllRes = await request(app).delete("/testing/all-data").send();
  //   });
  type TokenType = {
    accessToken: string;
  };

  let commentBody: CommentViewModel;
  let token: TokenType;
  let token2: string


  describe("make like/dislike => return 204 status code", () => {
    it("PUT -> /comments/:commentId/like-status: create comment then: status 204; used additional methods: POST user,  POST => /blogs, POST => /posts, POST => /posts/:postId/comments, GET => /comments/:id;", async () => {
      // create user(login, psw)!!!!!!
      //accwessToken = loginUser
      //blogId = createBlog
      //postId = createPost
      //comment = createComment

      /************** crate users ***************/

      const createUser = await request(app)
        .post("/users")
        .auth("admin", "qwerty")
        .send({
          login: "Michail",
          password: "qwerty1",
          email: "1mpara7472@gmail.com",
        });
      expect(createUser.status).toBe(HTTP_STATUS.CREATED_201);
      expect(createUser.body).toEqual({
        id: expect.any(String),
        login: "Michail",
        email: "1mpara7472@gmail.com",
        createdAt: expect.any(String),
      });

      /************** create access token **************************/

      const loginOrEmail = createUser.body.login;
      const createAccessToken = await request(app).post("/auth/login").send({
        loginOrEmail: loginOrEmail,
        password: "qwerty1",
      });

      token = createAccessToken.body;

      expect(createAccessToken.status).toBe(HTTP_STATUS.OK_200);
      expect(token).toEqual({
        accessToken: expect.any(String),
      });

      /****************************** create blogs ******************************/

      const createBlogs = await request(app)
        .post("/blogs")
        .auth("admin", "qwerty")
        .send({
          name: "Michail",
          description: "my description",
          websiteUrl: "https://learn.javascript.ru",
        });
      expect(createBlogs.status).toBe(HTTP_STATUS.CREATED_201);
      expect(createBlogs.body).toEqual({
        id: expect.any(String),
        name: "Michail",
        description: "my description",
        websiteUrl: "https://learn.javascript.ru",
        createdAt: expect.any(String),
        isMembership: true,
      });
      const blogId1 = createBlogs.body.id;
      const blogName1 = createBlogs.body.name;

      /******************************** create Posts ******************************/

      const createPosts = await request(app)
        .post("/posts")
        .auth("admin", "qwerty")
        .send({
          title: "new title",
          shortDescription: "new shortDescription",
          content:
            "myContent I like javascript and I will be a developer in javascript, back end developer",
          blogId: blogId1,
        });

      expect(createPosts.status).toBe(HTTP_STATUS.CREATED_201);
      expect(createPosts.body).toEqual({
        id: expect.any(String),
        title: "new title",
        shortDescription: "new shortDescription",
        content:
          "myContent I like javascript and I will be a developer in javascript, back end developer",
        blogId: blogId1,
        blogName: blogName1,
        createdAt: expect.any(String),
      });

      const postId = createPosts.body.id;
      const userId = createUser.body.id;
      const login = createUser.body.login;

      /******************************* create comments by post id ***********************************/

      const createCommentPostByPostId = await request(app)
        .post(`/posts/${postId}/comments`)
        .set("Authorization", `Bearer ${createAccessToken.body.accessToken}`)
        .send({
          content:
            "My profession is a programmer, I work in javascript and I work for back end developer",
        });
      commentBody = createCommentPostByPostId.body;
      expect(createCommentPostByPostId.status).toBe(HTTP_STATUS.CREATED_201);
      expect(commentBody).toEqual({
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

      /*************************** create comments by commentsId (like/dislike) ******************************/

      const commentId = createCommentPostByPostId.body.id;
      const updateCommentByCommentId = await request(app)
        .put(`/comments/${commentId}/like-status`)
        .set("Authorization", `Bearer ${createAccessToken.body.accessToken}`)
        .send({ likeStatus: "None" });
      expect(updateCommentByCommentId.status).toBe(HTTP_STATUS.NO_CONTENT_204);
    });

    it("make like/dislike if input data is empty body => return 400 status code", async () => {
      const commentId = commentBody.id;
      let tokenAccess = token.accessToken;
      const updateCommentByCommentId = await request(app)
        .put(`/comments/${commentId}/like-status`)
        .set("Authorization", `Bearer ${tokenAccess}`)
        .send({});
      expect(updateCommentByCommentId.status).toBe(HTTP_STATUS.BAD_REQUEST_400);
      expect(updateCommentByCommentId.body).toStrictEqual(
        createErrorsMessageTest(["likeStatus"])
      );
    });
    it("make like/dislike if input data is incorrect => return 400 status code", async () => {
      const commentId = commentBody.id;
      let tokenAccess = token.accessToken;
      const updateCommentByCommentId = await request(app)
        .put(`/comments/${commentId}/like-status`)
        .set("Authorization", `Bearer ${tokenAccess}`)
        .send({ likeStatus: true });
      expect(updateCommentByCommentId.status).toBe(HTTP_STATUS.BAD_REQUEST_400);
      expect(updateCommentByCommentId.body).toStrictEqual(
        createErrorsMessageTest(["likeStatus"])
      );
    });
    it("make like/dislike without authorization => return 401 status code", async () => {
      const commentId = commentBody.id;
      const updateCommentByCommentId = await request(app)
        .put(`/comments/${commentId}/like-status`)
        .send({ likeStatus: "None" });
      expect(updateCommentByCommentId.status).toBe(
        HTTP_STATUS.NOT_AUTHORIZATION_401
      );
    });
    it("make like/dislike with doesn`t existing id => return 404 status code", async () => {
      let tokenAccess = token.accessToken;
      const updateCommentByCommentId = await request(app)
        .put(`/comments/123456789012345678901234/like-status`)
        .set("Authorization", `Bearer ${tokenAccess}`)
        .send({ likeStatus: "None" });
      expect(updateCommentByCommentId.status).toBe(HTTP_STATUS.NOT_FOUND_404);
    });
  });
  describe("update existing comment by id with correct input model", function() {
	it("create new user", async () => {
    const createUserNext = await request(app)
      .post("/users")
      .auth("admin", "qwerty")
      .send({
        login: "Tatiana",
        password: "qwerty2",
        email: "2mpara7472@gmail.com",
      });
    expect(createUserNext.status).toBe(HTTP_STATUS.CREATED_201);
    expect(createUserNext.body).toEqual({
      id: expect.any(String),
      login: "Tatiana",
      email: "2mpara7472@gmail.com",
      createdAt: expect.any(String),
    });
    const loginOrEmail = createUserNext.body.login;
    const createAccessTokenNew = await request(app).post("/auth/login").send({
      loginOrEmail: loginOrEmail,
      password: "qwerty2",
    });
    expect(createAccessTokenNew.status).toBe(HTTP_STATUS.OK_200);
    expect(createAccessTokenNew.body).toEqual({
      accessToken: expect.any(String),
    });
    token2 = createAccessTokenNew.body.accessToken;
  });
  const updateObj = {
    content: "My daughter`s name is Maria, she is nine",
  };
  it("update existing comment by id => return 204 status code", async () => {
    const updateCommentById = await request(app)
      .put(`/comments/${commentBody.id}`)
      .set("Authorization", `Bearer ${token.accessToken}`)
      .send(updateObj);
    expect(updateCommentById.status).toBe(HTTP_STATUS.NO_CONTENT_204);
  });
  it("update existing comment by id with incorrect input model=> return 400 status code", async () => {
    const updateObj = {
      content: true,
    };
    const updateCommentById = await request(app)
      .put(`/comments/${commentBody.id}`)
      .set("Authorization", `Bearer ${token.accessToken}`)
      .send(updateObj);
    expect(updateCommentById.status).toBe(HTTP_STATUS.BAD_REQUEST_400);
    expect(updateCommentById.body).toEqual(
      createErrorsMessageTest(["content"])
    );
  });
  it("update existing comment by id with empty body=> return 400 status code", async () => {
    const updateObj = {};
    const updateCommentById = await request(app)
      .put(`/comments/${commentBody.id}`)
      .set("Authorization", `Bearer ${token.accessToken}`)
      .send(updateObj);
    expect(updateCommentById.status).toBe(HTTP_STATUS.BAD_REQUEST_400);
    expect(updateCommentById.body).toEqual(
      createErrorsMessageTest(["content"])
    );
  });
		it("update existing comment by id => return 204 status code", async() => {
			const updateObj = {
				"content": "My daughter`s name is Maria, she is nine"
			}
			const updateCommentById = await request(app)
			.put(`/comments/${commentBody.id}`)
			.send(updateObj)
			expect(updateCommentById.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401)
		})
		it("update existing comment by id => return 204 status code", async() => {
			const updateObj = {
				"content": "My daughter`s name is Maria, she is nine"
			}
			const updateCommentById = await request(app)
			.put(`/comments/123456789012345678901234`)
			.set("Authorization", `Bearer ${token.accessToken}`)
			.send(updateObj)
			expect(updateCommentById.status).toBe(HTTP_STATUS.NOT_FOUND_404)
		})
		it("update existing comment by id => return 204 status code", async() => {
			const updateObj = {
				"content": "My daughter`s name is Maria, she is nine"
			}
			const updateCommentById = await request(app)
			.put(`/comments/${commentBody.id}`)
			.set("Authorization", `Bearer ${token2}`)
			.send(updateObj)
			expect(updateCommentById.status).toBe(HTTP_STATUS.FORBIDEN_403)
		})
  })

  describe("return comment by id", () => {
	it("get comment by id with correct input data => return 200 status code", async() => {
		const getCommentById = await request(app)
		.get(`/comments/${commentBody.id}`)
		.set("Authorization", `Bearer ${token.accessToken}`)
		expect(getCommentById.status).toBe(HTTP_STATUS.OK_200)
		expect(getCommentById.body).toStrictEqual({
			id: commentBody.id,
			content: expect.any(String),
			commentatorInfo: {
				userId: commentBody.commentatorInfo.userId,
				userLogin: commentBody.commentatorInfo.userLogin,
			},
			createdAt: expect.any(String),
			likesInfo: {
				likesCount: 0,
				dislikesCount: 0,
				myStatus: "None",
			},
		})
	})

	it("get comment by id with doesn`t existing comment => return 404 status code", async() => {
		const getCommentById = await request(app)
		.get(`/comments/123456789012345678901234}`)
		.set("Authorization", `Bearer ${token.accessToken}`)
		expect(getCommentById.status).toBe(HTTP_STATUS.NOT_FOUND_404)
	})
  })
  describe("delete comment specified by id => return 204 status code", () => {
	it("delete comment with correct input data return 404 status code", async() => {
		const deleteCommentById = await request(app)
		.delete(`/comments/${commentBody.id}`)
		.set("Authorization", `Bearer ${token2}`)
		expect(deleteCommentById.status).toBe(HTTP_STATUS.FORBIDEN_403)
	})
	it("delete comment without uesr`s authorazing return 401 status code", async() => {
		const deleteCommentById = await request(app)
		.delete(`/comments/${commentBody.id}`)
		expect(deleteCommentById.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401)
	})
	it("delete comment with correct input data", async() => {
		const deleteCommentById = await request(app)
		.delete(`/comments/${commentBody.id}`)
		.set("Authorization", `Bearer ${token.accessToken}`)
		expect(deleteCommentById.status).toBe(HTTP_STATUS.NO_CONTENT_204)
	})
	it("delete comment without existing commentId return 404 status code", async() => {
		const deleteCommentById = await request(app)
		.delete(`/comments`)
		.set("Authorization", `Bearer ${token.accessToken}`)
		expect(deleteCommentById.status).toBe(HTTP_STATUS.NOT_FOUND_404)
	})
  })
});
