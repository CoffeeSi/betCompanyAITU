// OpenAPI (Swagger) specification for the Blog CRUD API
// Served at: GET /api-docs
module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Blog CRUD API",
    version: "1.0.0",
    description: "CRUD API for a simple blogging platform using Node.js, Express, and MongoDB (Mongoose)."
  },
  servers: [
    { url: "http://localhost:3000", description: "Local development server" }
  ],
  components: {
    schemas: {
      Blog: {
        type: "object",
        properties: {
          _id: { type: "string", example: "65f1c2b3a4d5e6f7890a1234" },
          title: { type: "string", example: "Hello World" },
          body: { type: "string", example: "This is my first blog post." },
          author: { type: "string", example: "Anonymous" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      BlogCreate: {
        type: "object",
        required: ["title", "body"],
        properties: {
          title: { type: "string", example: "My Post" },
          body: { type: "string", example: "Post content goes here..." },
          author: { type: "string", example: "Max" }
        }
      },
      BlogUpdate: {
        type: "object",
        properties: {
          title: { type: "string", example: "Updated title" },
          body: { type: "string", example: "Updated content..." },
          author: { type: "string", example: "Anonymous" }
        }
      },
      Error: {
        type: "object",
        properties: {
          message: { type: "string", example: "Server error" },
          error: { type: "string", example: "Detailed error message" }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "Server is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { status: { type: "string", example: "ok" } }
                }
              }
            }
          }
        }
      }
    },
    "/blogs": {
      post: {
        summary: "Create a new blog post",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/BlogCreate" } }
          }
        },
        responses: {
          "201": {
            description: "Created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Blog" } } }
          },
          "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "500": { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      get: {
        summary: "Get all blog posts",
        responses: {
          "200": {
            description: "List of blogs",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Blog" } }
              }
            }
          },
          "500": { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },
    "/blogs/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "MongoDB ObjectId" }
      ],
      get: {
        summary: "Get a blog post by id",
        responses: {
          "200": { description: "Blog", content: { "application/json": { schema: { $ref: "#/components/schemas/Blog" } } } },
          "400": { description: "Invalid id", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "500": { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      put: {
        summary: "Update a blog post by id",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/BlogUpdate" } } }
        },
        responses: {
          "200": { description: "Updated", content: { "application/json": { schema: { $ref: "#/components/schemas/Blog" } } } },
          "400": { description: "Invalid request", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "500": { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      delete: {
        summary: "Delete a blog post by id",
        responses: {
          "204": { description: "Deleted (no content)" },
          "400": { description: "Invalid id", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "500": { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    }
  }
};
