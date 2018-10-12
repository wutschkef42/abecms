# How to use AbeCMS with Mongo

For use Mongo with Abe, you have to add the following "database" object in your abe.json config file :

"database": {
        "type": "mongo",
        "mongo": {
          "url": "mongodb://localhost:27017/abecms_dev"
        }
    },

- type : file / mongo

you have to choose how abe will store the json data