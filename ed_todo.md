
# How to do REST & Mongo
## REST

* Refactor all routes
* Add oauth2
* Refactor some parts with Mongo (part touchable from the REST layer) but not directly Mongo operation

## How to process
### 1) Define which routes are needed

400 		The request is malformed
401 		Unauthorized
403 		Forbidden
404 		Page or resource is not found
422 		Unprocessable entity
500 		We have a problem with our server. Please try again later.
Connection refused 		Most likely cause is not using HTTPS.

#### Resource "Template"

A template is defined by:

* id
* name
* filename
* template

Get list of templates
* GET /templates

Response:
```
{
	"list": [
		"id": {
			"id": "id",
			"filename": "file.html",
			"name": "blog-post",
			"template": "THE TEMPLATE",
		}
	],
	"count": 10,
}
```

Add a template
* POST /template

Get a template by id
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

Create a page from a template
* POST /pages

Request:
```
{
	"template_id": "id",
	"page_name": "name",
	"page_url": "name.html",
}
```

