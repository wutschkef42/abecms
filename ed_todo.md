
# How to do REST & Mongo
## REST

* Refactor all routes
* Add oauth2
* Refactor some parts with Mongo (part touchable from the REST layer) but not directly Mongo operation

## Live Todo

UPDATE Fri 9 nov 2018
- [x] {User} Create
- [x] {User} Update
- [x] {User} Delete
- [x] {User} Activate
- [x] {User} Deactivate
- [x] {User} Get (me)
- [ ] {User} Get by id
- [ ] {User} List all

.
- [x] {Page} Paginate
- [x] {Page} Create
- [x] {Page} Get
- [x] {Page} Update
- [x] {Page} Publish
- [x] {Page} Unpublish
- [ ] {Page} Save Page (with helper)
- [ ] {Page} Get Fields
- [ ] {Page} Delete
- [ ] {Page} Get for editor
.
- [x] {Template} List all
- [x] {Template} Get by name
- [ ] {Template} Create
- [ ] {Template} Update
- [ ] {Template} Delete
.
- [x] {Role} List
.
##### Mon 12 Nov
Themes
- [x] {Themes} Get Theme
- [x] {Themes} Post Theme
- [x] {Themes} Delete Theme
.
- [ ] {User} ask Password Reset
- [ ] {User} reset Password
.
Autres
- [x] {Other} Get Activities
- [x] {Other} Save Config
- [x] {Other} Get list hooks
- [x] {Other} Get list workflow
- [x] {Other} Get References
- [x] {Other} Save References
- [x] {Other} Get Image
- [x] {Other} Get structure
- [x] {Other} Get Thumbs
- [x] {Other} Get Themes
- [x] {Other} Post Upload

- [x] {Other} Post Structure

- [ ] {Other} Post list url save
- [ ] {Other} Post build template

##### TODO - from Mon 12 2018
- Validate all functions (is it working)
- Tests
- Data / params validations
- Check check check
- Add oAuth2

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
* path
* template

##### Get list of templates
* GET /templates

Response: (direct json array)
```
[
	{
		"path":"/yourpath/my-abe/themes/default/templates/blog.html",
		"name":"blog"
	},
	...
]
```


##### Get a template by name
* GET /template/:name

Response:
```
{
	"templateData": {
		"type": "Buffer",
		"data": "[Array of bytes]"
	}
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
