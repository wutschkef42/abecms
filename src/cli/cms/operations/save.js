import fse from 'fs-extra'
import mkdirp from 'mkdirp'
import xss from 'xss'
import path from 'path'

import {config} from '../../'
var { mongo } = require('../../');

export async function saveJson(jsonPath, json) {

  let result = false;
  if (config.database.type == "file") {
    result = saveJsonFile(jsonPath, json);
  }
  else if (config.database.type == "mongo") {
    result = await saveJsonMongo(jsonPath, json);
  }

  return result
}

export function saveJsonFile(jsonPath, json) {
  mkdirp.sync(path.dirname(jsonPath))

  if (json.abe_source != null) delete json.abe_source
  if (json.abeEditor != null) delete json.abeEditor

  var eachRecursive = function(obj) {
    for (var k in obj) {
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        eachRecursive(obj[k])
      } else if (typeof obj[k] !== 'undefined' && obj[k] !== null) {
        if (config.xss) {
          obj[k] = xss(obj[k].toString().replace(/&quot;/g, '"'), {
            whiteList: config.htmlWhiteList
          })
        } else {
          obj[k] = obj[k].toString().replace(/&quot;/g, '"')
        }
      }
    }
  }

  eachRecursive(json)

  fse.writeJsonSync(jsonPath, json, {
    space: 2,
    encoding: 'utf-8'
  })

  return true
}

export async function saveJsonMongo (jsonPath, json) {
  var { mongo } = require('../../');
  var db = mongo.getDb();
  var JSONs = db.collection('jsons');

  var pathArray = jsonPath.split('/').slice(0, -1);
  var filename = pathArray[pathArray.length - 1];

  try {
    var mtime = Date.now();
    var jsonUpdate = await JSONs.updateOne({
      jsonPath
    },
    {
      $set: {
        json,
        jsonPath,
        mtime,
        pathArray,
        filename 
      }
    },
    {
      upsert: true
    });
  }
  catch (e) {
    console.error(e);
    return false;
  }
  console.log('saved', jsonPath, json);
  return true;
}

// create mongo function

export function saveHtml(pathFile, html) {
  mkdirp.sync(path.dirname(pathFile))
  fse.writeFileSync(pathFile, html)

  return true
}
