# Blog CRUD API (Node.js + MongoDB)

## Objective
CRUD API for a simple blogging platform using Node.js and MongoDB (Mongoose). Includes a basic frontend UI.

## Endpoints
- POST /blogs (Create)
- GET /blogs (Read all)
- GET /blogs/:id (Read one)
- PUT /blogs/:id (Update)
- DELETE /blogs/:id (Delete)

## Blog Fields
- title (string, required)
- body (string, required)
- author (string, optional, default: "Anonymous")
- timestamps: createdAt, updatedAt

## Setup (Local MongoDB)
1) Install dependencies
```bash
npm install
```

2) Create .env
```bash
cp .env.example .env
```

3) Start server
```bash
npm run dev
```

Open:
- UI: http://localhost:3000/
- Health: http://localhost:3000/health

## Postman Manual Tests
Base URL: http://localhost:3000

### Create
POST /blogs
```json
{ "title": "Hello", "body": "My first post", "author": "Max" }
```

### Read all
GET /blogs

### Read one
GET /blogs/:id

### Update
PUT /blogs/:id
```json
{ "title": "Updated", "body": "Updated body", "author": "Anonymous" }
```

### Delete
DELETE /blogs/:id


## Swagger (API Documentation)
After starting the server, open:
- Swagger UI: http://localhost:3000/api-docs

Swagger provides interactive documentation where you can click **Try it out** to test endpoints directly.
