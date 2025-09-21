# Books API Project

This Project was made by node.js, express.js and some of third-party packages to serve the project

## Environment Variables
create a `.env` file in root directory :
```
MONGO_URI = your mongodb uri 
PORT = your port
NODE_ENV = development
JWT_SECRET_KEY = jwt secret key
USER_EMAIL = your sender email
USER_APP_PASSWORD = your app password
```

## API Reference

> [!NOTE]
> If you have any feedback, please reach out to us at akroooom40@gmail.com.

### Books
#### Get All Books

```http
  GET /api/books
```

#### Get Book By Id

```http
  GET /api/books/${id}
```

#### Add New Book

```http
  POST /api/books
```
| Parameter | Type | Description
| :-------- | :------- | :-------
| `title` | `string` | Book Title
| `description` | `string` | Book Description
| `author` | `string` | Auther Id
| `year` | `number` | Published year
| `pages` | `number` | Number of pages
| `genre` | `string` | Genre Of Book
| `cover` | `string` | `soft cover` & `hard cover`

#### Update Book

```http
  PUT /api/books/${id}
```
You can update any of the previous parameters.

#### Delete Book

```http
  DELETE /api/books/${id}
```

---
### Authors
#### Get All Authors

```http
  GET /api/authors
```

#### Get Author By Id

```http
  GET /api/authors/${id}
```
#### Add New Author

```http
  POST /api/authors
```
| Parameter | Type | Description
| :-------- | :------- | :-------
| `firstName` | `string` | Author First Name
| `lastName` | `string` | Author Last Name
| `birthYear` | `number` | Auther Birth Year
| `nationality` | `string` | Author Nationality
| `image` | `string` | Author Image

> [!IMPORTANT]
> You must pass the token value as an admin to the headers.

#### Update Author

```http
  PUT /api/authors/${id}
```
You can update any of the previous parameters.

> [!IMPORTANT]
> You must pass the token value as an admin to the headers.

#### Delete Book

```http
  DELETE /api/authors/${id}
```
> [!IMPORTANT]
> You must pass the token value as an admin to the headers.

---
### Auth
#### User Register

```http
  POST /api/auth/register
```

```
| Parameter | Type | Description
| :-------- | :------- | :-------
| `username` | `string` | username
| `email` | `string` | user email
| `password` | `number` | user password
```

#### User Login

```http
  POST /api/auth/login
```
```
| Parameter | Type | Description
| :-------- | :------- | :-------
| `email` | `string` | user email
| `password` | `number` | user password
```
---
### Users
#### Update User

```http
  PUT /api/users/${id}
```

> [!IMPORTANT]
> You must pass the token value as an admin to the headers.

#### Get Users

```http
  GET /api/users
```

> [!IMPORTANT]
> You must pass the token value as an admin to the headers.

#### Delete User

```http
  DELETE /api/users/${id}
```
> [!IMPORTANT]
> You must pass the token value as an admin to the headers.

#### Reset User Password

```http
  GET /forget-password
```

#### Upload Image

```http
  POST /upload
```

| Parameter | Type | Description
| :-------- | :------- | :-------
| `image` | `file` | image file as form-data


## Run Locally

Clone the project

```bash
  git clone https://github.com/Akram-Ebrahim/books-api-project-with-nodejs.git
```

Go to the project directory

```bash
  cd books-api-project-with-nodejs
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Support

For support, email akroooom40@gmail.com - [Linkedin Profile](https://www.linkedin.com/in/akramebrahim/) .
