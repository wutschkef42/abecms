
# How to do REST & Mongo
## REST

* Refactor all routes
* Add oauth2
* Refactor some parts with Mongo (part touchable from the REST layer) but not directly Mongo operation

## Live Todo

Wed 7 nov 2018
- [x] {User} List all
- [x] {User} Create
- [x] {User} Update
- [x] {User} Delete
- [x] {User} Activate
- [x] {User} Deactivate
.
- [ ] {Page} List all
- [ ] {Page} Create
- [ ] {Page} Get
- [ ] {Page} Update
- [ ] {Page} Delete
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
* GET /page/:page_name

Response:
```
{
	"template": {
		id, name, filename, template
	},
	"data": {
		"title_text": "Title of...",
		=> data for fullfil abe tags
	},
}	
```

##### Get list of pages
* GET /pages (/:count/:page)

Response:
```
{
	"list": [
		page1-object,
		page2-object,
	],
	"count": 10,
}
```

##### Create a page from a template
* POST /page

Request:
```
{
	"template_id": "id",
	"page_name": "name",
	"page_url": "name.html",
}
```

##### Update the data of a page from the editor
* POST /page/data

Request:
```
{
	"page_id": "id",
	"data": {
		"title_text": "Title of...",
		=> new data
	}
}
```

##### Delete a page
* DELETE /page/:name


#### Resource "User"

A **User** is defined by:

* Full Name
* Username
* Email
* Password
* Role
* Actif

##### Create a user
* POST /users

Request:
```
{
	"fullname": "Full Name",
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
