
# How to do REST & Mongo
## REST

* Refactor all routes
* Add oauth2
* Refactor some parts with Mongo (part touchable from the REST layer) but not directly Mongo operation

## Live Todo

UPDATE Fri 9 nov 2018
- [ ] {User} List all
- [x] {User} Create
- [x] {User} Update
- [x] {User} Delete
- [x] {User} Activate
- [x] {User} Deactivate
- [x] {User} Get (me)
- [ ] {User} Get by id

.
- [x] {Page} Paginate
- [x] {Page} Create
- [x] {Page} Get
- [x] {Page} Update
- [ ] {Page} Delete
- [x] {Page} Publish
- [x] {Page} Unpublish
.
- [ ] {Template} List all
- [ ] {Template} Create
- [ ] {Template} Get
- [ ] {Template} Update
- [ ] {Template} Delete
.
- [ ] {Role} List


## How to process
### 1) Define which routes are needed

* 200		Success - Without error
* 400 		The request is malformed
* 401 		Unauthorized
* 403 		Forbidden
* 404 		Page or resource is not found
* 422 		Unprocessable entity
* 500 		We have a problem with our server. Please try again later.
* Connection refused 		Most likely cause is not using HTTPS.

#### Resource "Template"

A template is defined by:

* id
* name
* filename
* template

##### Get list of templates
* GET /templates

Response:
```
{
	"list": {
		"id": {
			"id": "id",
			"filename": "file.html",
			"name": "blog-post",
			"template": "THE TEMPLATE",
		}
	},
	"count": 10,
}
```

##### Add a template
* POST /template

Request:
```
{
	"id": "id",
	"filename": "file.html",
	"name": "blog-post",
	"template": "THE TEMPLATE",
}
```

##### Get a template by id
* GET /template/:id

Response:
```
{
	"id": "id",
	"filename": "file.html",
	"template": "THE TEMPLATE",
}
```

Get a template by filename
* GET /template/:filename


#### Resource "Page"

A **page** is defined by:

* template_id
* name
* url
* data
* createdAt
* lastUpdate
* workflow (draft / published)

##### Get a page for the editor
* GET /pages?page=page_url

> Example : http://localhost:3000/abe/rest/pages?page=/blog.html

Response:
```
html page requested ex: /blog.html
```

##### Get list of pages by pagination
* GET /pages/paginate

Response:
```
{
	"recordsTotal":4,
	"recordsFiltered":4,
	"data":[
		{
			"path":"/yourpath/my-abe/data/posts/blog3.json",
			"revisions":[
				{
					"name":"blog3",
					"path":"/yourpath/my-abe/data/posts/blog3.json","date":"2018-11-09T11:35:57.704Z",
					"abe_meta": {
						"date":"2018-11-09T11:35:57.704Z",
						"link":"/blog3.html",
						"template":"blog",
						"status":"publish"
					},
					"link":"/blog3.html"
				},
				...
			],
			"name":"blog3",
			"date":"2018-11-09T11:35:57.704Z",
			"abe_meta":{
				"date":"
```

##### Create a page from a template
* POST /pages

Request:
```
{
	"template": "blog",
	"name": "name of the page (url is  'name + .html')",
}
```

##### Update the data of a page from the editor
* PUT /pages

Request:
```
{
	"name": "/blog3.html",
	"json": {
		"abe_meta": {...}
		"my-title-tag": "My Title",
	}
}
```

##### Publish a page
* PUT /pages/publish

Request:
```
{
	"url": "/blog3.html",
	"json": {
		"abe_meta": {...}
		"my-title-tag": "My Title",
	}
}
```

##### Unpublish a page
* PUT /pages/unpublish

Request:
```
{
	"url": "/blog3.html",
	"json": {
		"abe_meta": {...}
		"my-title-tag": "My Title",
	}
}
```

##### Delete a page
* DELETE /pages/:name



#### Resource "User"

A **User** is defined by:

* name
* username
* email
* password
* role
* actif

##### Create a user
* POST /users

Request:
```
{
	"name": "Full Name",
	"username": "username",
	"email": "email@dot.com",
	"password": "****",
	"role": "admin",
}
```

##### List users
* GET /users (/:count/:page)

Response:
```
{
	"list": [ user ],
	count: 10,
	max_page: 20,
}
```

##### Update a user
* POST /users

Request:
```
{
	"id": "id",
	"fullname": "Full Name",
	"username": "username",
	"email": "email@dot.com",
	"password": "****",
	"role": "admin",
	"actif": true,
}
```

##### Delete a user
* DELETE /users/:id

#### Resource "Reference"

A **Reference** is defined by:

* id
* path
* content

##### Add or Update a reference
* POST /reference

Request:
```
{
	"path": "colors.json",
	"content": JSON content
}
```

##### Get a reference
* GET /reference/:path

Response:
```
{
	"content": "JSON content"
}
```

##### Delete a reference
* DELETE /reference/:path

#### Resource "Role"

Role are defined by:
* Name
*

##### List of roles
* GET /roles

Response:
```
{
	"list": [
		{ "name": "Hello" }
	]
}
```
