import request from "supertest";
import dotenv from "dotenv";
import { stopDb } from "../../db/db";
import mongoose from "mongoose";
import { HTTP_STATUS } from "../../utils/utils";
import { UserViewType } from "../../types/userTypes";
import { initApp } from "../../settings";
import { tr } from "date-fns/locale";
import { PostsViewModel } from "../../types/postsTypes";
dotenv.config();

const app = initApp();

const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
let dbName = process.env.mongoDBName || "mongoose-example";

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

describe("/blogs", () => {
  beforeAll(async () => {
    // await runDb();
    await mongoose.connect(mongoURI);

    const wipeAllRes = await request(app).delete("/testing/all-data").send();
    expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204);

    // const getBlogs = await request(app).get("/blogs").send();
    // expect(getBlogs.status).toBe(HTTP_STATUS.OK_200);
    // expect(getBlogs.body.items).toHaveLength(0);
  });

  afterAll(async () => {
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
  let createUser: UserViewType;
  let name: string;
  let description: string;
  let websiteUrl: string;
  let blogId: string;
  let userId: string;

  describe("get and create blog tests", () => {
    describe("create user and acces token", () => {
      it("get blogs", async () => {
        const getBlogsBefore = await request(app).get("/blogs").send();
        expect(getBlogsBefore.status).toBe(HTTP_STATUS.OK_200);
        expect(getBlogsBefore.body.items).toHaveLength(0);
      });

      it("create user, create accessToken", async () => {
        const testUser = {
          login: "Michail",
          password: "qwerty",
          email: "mpara7274@gamil.com",
        };
        const createUserResponse = await request(app)
          .post("/users")
          .auth("admin", "qwerty")
          .send(testUser);
        createUser = createUserResponse.body;
        expect(createUserResponse.status).toBe(HTTP_STATUS.CREATED_201);
        expect(createUser).toEqual({
          id: expect.any(String),
          login: testUser.login,
          email: testUser.email,
          createdAt: expect.any(String),
        });

        const loginOrEmail = createUser.login;
        const createAccessToken = await request(app).post("/auth/login").send({
          loginOrEmail: loginOrEmail,
          password: "qwerty",
        });
        expect(createAccessToken.status).toBe(HTTP_STATUS.OK_200);
        expect(createAccessToken.body).toEqual({
          accessToken: expect.any(String),
        });
        userId = createUser.id;
      });
    });

    describe("create new blog", () => {
      it("create new blog", async () => {
        const getBlogsBefore = await request(app).get("/blogs").send();
        expect(getBlogsBefore.status).toBe(HTTP_STATUS.OK_200);
        expect(getBlogsBefore.body.items).toHaveLength(0);

        const createBlogs = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send({
            name: "Mickle",
            description: "I am a programmer",
            websiteUrl: "https://google.com",
          });

        description = createBlogs.body.description;
        websiteUrl = createBlogs.body.websiteUrl;
        name = createBlogs.body.name;
        blogId = createBlogs.body.id;

        expect(createBlogs.status).toBe(HTTP_STATUS.CREATED_201);
        expect(createBlogs.body).toEqual({
          id: expect.any(String),
          name: name,
          description: description,
          websiteUrl: websiteUrl,
          createdAt: expect.any(String),
          isMembership: true,
        });

        const getBlogsAfter = await request(app).get("/blogs").send();
        expect(getBlogsAfter.status).toBe(HTTP_STATUS.OK_200);
        expect(getBlogsAfter.body.items).toHaveLength(1);
      });

      it("create new blogs with incorrect input data (body), should return status 400 and errorMessage", async () => {
        const createBlogsWithIncorrectData = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send({
            name: 102,
            description: true,
            webseiteUrl: false,
          });
        expect(createBlogsWithIncorrectData.status).toBe(
          HTTP_STATUS.BAD_REQUEST_400
        );
        expect(createBlogsWithIncorrectData.body).toStrictEqual(
          blogsValidationErrRes
        );
      });

      it("create blog with empty body => should return 400 status code and createErrorsMessageTest", async () => {
        const createBlogWithEmptyBody = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send({});

        expect(createBlogWithEmptyBody.status).toBe(
          HTTP_STATUS.BAD_REQUEST_400
        );
        expect(createBlogWithEmptyBody.body).toStrictEqual(
          createErrorsMessageTest(["name", "description", "websiteUrl"])
        );
      });

      it("create blogs without authorization => should return 401 status code", async () => {
        const creteBlogsWithoutAuth = await request(app)
          .post("/blogs")
          .send({});
        expect(creteBlogsWithoutAuth.status).toBe(
          HTTP_STATUS.NOT_AUTHORIZATION_401
        );
      });

      it("create blog with incorrect auth => should return 401 status code", async () => {
        const createBlogWithIncorrectHeaders = await request(app)
          .post("/blogs")
          .auth("123", "456")
          .send({});
        expect(createBlogWithIncorrectHeaders.status).toBe(
          HTTP_STATUS.NOT_AUTHORIZATION_401
        );
      });
    });

    describe("return blogs with pagin", () => {
      it("return blogs with pagin", async () => {
        const searchNameTerm = "";
        const sortBy = "createdAt";
        const sortDirection = "desc";
        const pageNumber = "1";
        const pageSize = "10";

        const getBlogs = await request(app).get(`/blogs`).query({
          searchNameTerm: "",
          sortBy: "createAt",
          sortDirection: "desc",
          pageNumber: "1",
          pageSize: "10",
        });

        // await request(app).get(`/blogs?searchNameTerm=${searchNameTerm}&sortBy=${sortBy}
        // &sortDirection=${sortDirection}&pageNumber=${pageNumber}&pageSize=${pageSize}`)

        expect(getBlogs.status).toBe(HTTP_STATUS.OK_200);
        expect(getBlogs.body).toEqual({
          pagesCount: 1,
          page: 1,
          pageSize: 10,
          totalCount: 1,
          items: [
            {
              id: expect.any(String),
              name: name,
              description: description,
              websiteUrl: websiteUrl,
              createdAt: expect.any(String),
              isMembership: true,
            },
          ],
        });
      });
    });

    describe("return all posts for specified blog", () => {
      it("return all posts for specified blog", async () => {
        const createPost = await request(app)
          .post("/posts")
          .auth("admin", "qwerty")
          .send({
            title: "PROGRAMMER",
            shortDescription: "My profession the back end developer!",
            content:
              "I am a programmere and work at backend, I like javascript!!!",
            blogId: blogId,
          })
          .expect(201);

        const title = createPost.body.title;
        const shortDescription = createPost.body.shortDescription;
        const content = createPost.body.content;
        const postIdBy = createPost.body.blogId;

        const pageNumber = "1";
        const pageSize = "10";
        const sortBy = "desc";
        const getAllPostForBlogs = await request(app)
		.get(`/blogs/${blogId}/posts`);
        console.log("getAllPostForBlogs.body: ", getAllPostForBlogs.body);

        expect(getAllPostForBlogs.status).toBe(HTTP_STATUS.OK_200);
        expect(getAllPostForBlogs.body).toEqual({
          pagesCount: 1,
          page: 1,
          pageSize: 10,
          totalCount: 1,
          items: [
            {
              id: expect.any(String),
              title: title,
              shortDescription: shortDescription,
              content: content,
              blogId: blogId,
              blogName: name,
              createdAt: expect.any(String),
            },
          ],
        });
      });
      it("if specified blog is not exist", async () => {
        const getAllPostForBlogs = await request(app).get(
          `/blogs/147896321598741563258745/posts`
        );
        expect(getAllPostForBlogs.status).toBe(HTTP_STATUS.NOT_FOUND_404);
      });
    });

    let reqBodyResponse: PostsViewModel;
	
    describe("create new post for specific blog", () => {
      type BodyBlog = {
        title: string;
        shortDescription: string;
        content: string;
      };

      let testBodyBlog: BodyBlog;
      it("create post by blogId", async () => {
        testBodyBlog = {
          title: "New title",
          shortDescription: "My new short description",
          content:
            "I am a progremmer and I like coding, my profession the back end developer.",
        };
        const createNewPost = await request(app)
          .post(`/blogs/${blogId}/posts`)
          .auth("admin", "qwerty")
          .send(testBodyBlog);

        reqBodyResponse = createNewPost.body;
        expect(createNewPost.status).toBe(HTTP_STATUS.CREATED_201);
        expect(reqBodyResponse).toStrictEqual({
          id: expect.any(String),
          title: reqBodyResponse.title,
          shortDescription: reqBodyResponse.shortDescription,
          content: reqBodyResponse.content,
          blogId: blogId,
          blogName: name,
          createdAt: expect.any(String),
        });
      });

      it("create blog with incorrect input data => return 400 errorMessage", async () => {
        const createBlogs = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send({
            name: "Mickle",
            description: "I am a programmer",
            websiteUrl: "https://google.com",
          });
        expect(createBlogs.status).toBe(HTTP_STATUS.CREATED_201);
        expect(createBlogs.body).toEqual({
          id: expect.any(String),
          name: name,
          description: description,
          websiteUrl: websiteUrl,
          createdAt: expect.any(String),
          isMembership: true,
        });
        const blogId = createBlogs.body.id;

        const createPostWithIncorrectData = await request(app)
          .post(`/blogs/${blogId}/posts`)
          .auth("admin", "qwerty")
          .send({
            title: 123,
            shortDescription: true,
            content: 456,
          });
        expect(createPostWithIncorrectData.status).toBe(
          HTTP_STATUS.BAD_REQUEST_400
        );
        expect(createPostWithIncorrectData.body).toStrictEqual(
          createErrorsMessageTest(["content", "title", "shortDescription"])
        );
      });

      it("create blog with incorrect input data => return 400 status code errorMessage", async () => {
        const createBlogs = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send({
            name: "Mickle",
            description: "I am a programmer",
            websiteUrl: "https://google.com",
          });
        expect(createBlogs.status).toBe(HTTP_STATUS.CREATED_201);
        expect(createBlogs.body).toEqual({
          id: expect.any(String),
          name: name,
          description: description,
          websiteUrl: websiteUrl,
          createdAt: expect.any(String),
          isMembership: true,
        });
        const blogId = createBlogs.body.id;
        const createPostWithIncorrectData = await request(app)
          .post(`/blogs/${blogId}/posts`)
          .auth("admin", "qwerty")
          .send({});
        expect(createPostWithIncorrectData.status).toBe(
          HTTP_STATUS.BAD_REQUEST_400
        );
        expect(createPostWithIncorrectData.body).toStrictEqual(
          createErrorsMessageTest(["content", "title", "shortDescription"])
        );
      });

      it("create new blog without authorization => return 401 status code", async () => {
        const createBlogs = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send({
            name: "Mickle",
            description: "I am a programmer",
            websiteUrl: "https://google.com",
          });
        expect(createBlogs.status).toBe(HTTP_STATUS.CREATED_201);
        expect(createBlogs.body).toEqual({
          id: expect.any(String),
          name: name,
          description: description,
          websiteUrl: websiteUrl,
          createdAt: expect.any(String),
          isMembership: true,
        });
        const blogId = createBlogs.body.id;
        const createNewPostWithoutAuth = await request(app)
          .post(`/blogs/${blogId}/posts`)
          .send({
            title: "New title",
            shortDescription: "My new short description",
            content:
              "I am a progremmer and I like coding, my profession the back end developer.",
          });
        expect(createNewPostWithoutAuth.status).toBe(
          HTTP_STATUS.NOT_AUTHORIZATION_401
        );
      });

      it("create new blog if specify blog doesn`t exist => return 404 status code", async () => {
        const createPostWithoutBlogId = await request(app)
          .post(`/blogs/123456789012345678901234/posts`)
          .auth("admin", "qwerty")
          .send(testBodyBlog);
        expect(createPostWithoutBlogId.status).toBe(HTTP_STATUS.NOT_FOUND_404);
      });
    });

    describe("return blog by id", () => {
    	let id: any
      it("return blog by id", async () => {
		const modelObj = {
            name: "Mickle",
            description: "I am a programmer",
            websiteUrl: "https://google.com",
          }
    	const createBlogs = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send(modelObj);

    	  expect(createBlogs.status).toBe(HTTP_STATUS.CREATED_201);
    	  expect(createBlogs.body).toEqual({
    		id: expect.any(String),
    		name: modelObj.name,
    		description: modelObj.description,
    		websiteUrl: modelObj.websiteUrl,
    		createdAt: expect.any(String),
    		isMembership: true,
    	  });
    	id = createBlogs.body.id
		let name = createBlogs.body.name
		let description = createBlogs.body.description
		let websiteUrl = createBlogs.body.websiteUrl

        const getblogById = await request(app).get(`/blogs/${id}`);
        expect(getblogById.status).toBe(HTTP_STATUS.OK_200);
        expect(getblogById.body).toEqual({
          id: id,
          name: name,
          description: description,
          websiteUrl: websiteUrl,
          createdAt: expect.any(String),
          isMembership: true,
        });
      });

      it("get post by incorrect blogId => return 404 status code", async () => {
        const getblogById = await request(app).get(`/blogs/123456789012345678901234`);
        expect(getblogById.status).toBe(HTTP_STATUS.NOT_FOUND_404);
      });
    });

    describe("update existing blog by id with input date", () => {
      let id: string
      it("update existing blog by id", async () => {
		const createBlogs = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send({
            name: "Mickle",
            description: "I am a programmer",
            websiteUrl: "https://google.com",
          });
        expect(createBlogs.status).toBe(HTTP_STATUS.CREATED_201);
        expect(createBlogs.body).toEqual({
          id: expect.any(String),
          name: name,
          description: description,
          websiteUrl: websiteUrl,
          createdAt: expect.any(String),
          isMembership: true,
        });
        id = createBlogs.body.id;
        const updateBlog = await request(app)
          .put(`/blogs/${id}`)
          .auth("admin", "qwerty")
          .send({
            name: "Tatiana",
            description: "I am a wife",
            websiteUrl: "https://GG5I65-a7ercNP.ru",
          });
        expect(updateBlog.status).toBe(HTTP_STATUS.NO_CONTENT_204);
      });
      it("update existion blog by id with empty body input date => return 400 status code", async () => {
        const updateBlog = await request(app)
          .put(`/blogs/${id}`)
          .auth("admin", "qwerty")
          .send({});
        expect(updateBlog.status).toBe(HTTP_STATUS.BAD_REQUEST_400);
        expect(updateBlog.body).toStrictEqual(
          createErrorsMessageTest(["name", "description", "websiteUrl"])
        );
      });

      it("update existion blog by id with incorrect input date => return 400 status code", async () => {
        const updateBlog = await request(app)
          .put(`/blogs/${id}`)
          .auth("admin", "qwerty")
          .send({
            name: 123,
            description: true,
            websiteUrl: "",
          });
        expect(updateBlog.status).toBe(HTTP_STATUS.BAD_REQUEST_400);
        expect(updateBlog.body).toStrictEqual(
          createErrorsMessageTest(["name", "description", "websiteUrl"])
        );
      });

      it("update blog without authorization => return 401 status code", async () => {
        const updateBlog = await request(app).put(`/blogs/${id}`).send({
          name: "Tatiana",
          description: "I am a wife",
          websiteUrl: "https://GG5I65-a7ercNP.ru",
        });
        expect(updateBlog.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401);
      });

      it("update blog if id of blog is not correct", async () => {
        const updateBlog = await request(app)
          .put(`/blogs/123456789012345678901234`)
          .auth("admin", "qwerty")
          .send({
            name: "Tatiana",
            description: "I am a wife",
            websiteUrl: "https://GG5I65-a7ercNP.ru",
          });
    	  expect(updateBlog.status).toBe(HTTP_STATUS.NOT_FOUND_404)
      });
    });

    describe("delete blog specified by id", () => {
      let id: string;
      it("delete blog by id", async () => {
        const createBlogs = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send({
            name: "Mickle",
            description: "I am a programmer",
            websiteUrl: "https://google.com",
          });
        expect(createBlogs.status).toBe(HTTP_STATUS.CREATED_201);
        expect(createBlogs.body).toEqual({
          id: expect.any(String),
          name: name,
          description: description,
          websiteUrl: websiteUrl,
          createdAt: expect.any(String),
          isMembership: true,
        });
        id = createBlogs.body.id;

        const wipeBlogById = await request(app)
          .delete(`/blogs/${id}`)
          .auth("admin", "qwerty");
        expect(wipeBlogById.status).toBe(HTTP_STATUS.NO_CONTENT_204);
      });
      it("delete blog by id without authorization", async () => {
        const wipeBlogById = await request(app).delete(`/blogs/${id}`);
        expect(wipeBlogById.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401);
      });
      it("delete blog by id with incorrect id", async () => {
        const wipeBlogId = await request(app)
          .delete(`/blogs/147852369874563215987532`)
          .auth("admin", "qwerty");
        expect(wipeBlogId.status).toBe(HTTP_STATUS.NOT_FOUND_404);
      });
    });
  });
});
