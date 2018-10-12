import path from 'path'
import mkdirp from 'mkdirp'
import fse from 'fs-extra'
import moment from 'moment'

import {abeExtend, coreUtils, cmsData, config, Manager} from '../../'

export function getAbeMeta(fileObject, json) {
  if (json.name != null) {
    fileObject.name = json.name
  }

  if (json.abe_meta != null) {
    var date = null

    if (json.abe_meta.updatedDate != null) {
      fileObject.date = json.abe_meta.updatedDate
      date = json.abe_meta.updatedDate
    } else if (
      json.abe_meta.latest != null &&
      json.abe_meta.latest.date != null
    ) {
      fileObject.date = json.abe_meta.latest.date
      date = json.abe_meta.latest.date
    } else if (json.abe_meta.date !== null) {
      date = json.abe_meta.date
    }

    fileObject.abe_meta = {
      date: date,
      link: json.abe_meta.link != null ? json.abe_meta.link : null,
      template: json.abe_meta.template != null ? json.abe_meta.template : null,
      status: json.abe_meta.status != null ? json.abe_meta.status : null
    }
  }

  return fileObject
}

// TODO: Mongo - Facade - getAllWithKeys_mongo & _file

export async function getAllWithKeys(withKeys) {
    let filesArr;

    if (config.database.type == "file") {
      filesArr = getAllWithKeys_fs(withKeys);

    }
    else if (config.database.type == "mongo") {
      filesArr = await getAllWithKeys_mongo(withKeys);
    }
  
  console.log('test')
  console.log(filesArr)
  var merged = cmsData.revision.getFilesMerged(filesArr)
  // #DEBUG console.log(merged)
  abeExtend.hooks.instance.trigger('afterGetAllFiles', merged)

  return merged
}


export function getAllWithKeys_fs(withKeys) {
  const extension = '.json'

  const files = coreUtils.file.getFilesSync(
    Manager.instance.pathData,
    true,
    extension
  )

  let filesArr = []

  Array.prototype.forEach.call(files, async pathFile => {
    const json = cmsData.file.get(pathFile);

    let fileObject = cmsData.file.getFileObject(pathFile) // name, path, date
    fileObject = cmsData.file.getAbeMeta(fileObject, json) // add meta to fileObject

    Array.prototype.forEach.call(withKeys, key => {
      fileObject[key] = json[key]
    })

    filesArr.push(fileObject)
  })

  return filesArr
}

export async function getAllWithKeys_mongo(withKeys) {
  var { mongo } = require('../../');
  var db = mongo.getDb();
  var JSONs = db.collection('jsons');

  let files = await JSONs.find({
    jsonPath: new RegExp(`^${Manager.instance.pathData}`)
  }).toArray();

  let filesArr = [];

  for (var i in files) {
    let fjson = files[i].json;
    let fileObject = {
      date: '' + (files[i].mtime).toString() + '',
      name: fjson.name + '.json',
      path: files[i].jsonPath
    }
    console.log(fjson);
    fileObject = cmsData.file.getAbeMeta(fileObject, fjson)
    console.log('fileobject',fileObject)

    filesArr.push(fileObject)
  }

  return filesArr
}

// TODO: Mongo - facade it
export async function get(pathJson) {
  let json
  pathJson = abeExtend.hooks.instance.trigger('beforeGetJson', pathJson)

  if (config.database.type == "file") {
    json = getFile(pathJson);
  }
  else if (config.database.type == "mongo") {
    json = await getMongo(pathJson);
  }

  console.log('get json', json)

  json = abeExtend.hooks.instance.trigger('afterGetJson', json)
  return json
}

export function getFile (pathJson) {
  let json

  try {
    var stat = fse.statSync(pathJson)
    if (stat) {
      json = fse.readJsonSync(pathJson)
    }
  } catch (e) {
    json = {}
  }

  return json
}

export async function getMongo(pathJson) {
  let json

  var { mongo } = require('../../');
  var db = mongo.getDb();
  var JSONs = db.collection('jsons');

  var pathArray = pathJson.split('/').slice(0, -1);
  var filename = pathArray[pathArray.length - 1];

  try {
    var docJson = await JSONs.findOne({
      jsonPath: pathJson,
    });
    console.log('pathJson', pathJson)
    console.log(docJson)
    if (docJson) {
      json = docJson.json;
      json.path = pathJson;
    } else {
      json = {err: true};
    }
  }
  catch (e) {
    console.error(e);
    return {};
  }

  console.log(json)

  return json
}

export function getFilesByType(pathFile, type = null) {
  const extension = '.' + config.files.templates.extension
  let result = []

  try {
    var directory = fse.lstatSync(pathFile)
    if (!directory.isDirectory()) {
      mkdirp.sync(pathFile)
    }
  } catch (e) {
    mkdirp.sync(pathFile)
  }
  const files = coreUtils.file.getFilesSync(pathFile, true, extension)

  Array.prototype.forEach.call(files, file => {
    var val = cmsData.fileAttr.get(file).s
    if (type === null || val === type) result.push(file)
  })

  return result
}

export function getFileObject(revisionPath) {
  let name = path.basename(revisionPath)
  const fileData = cmsData.fileAttr.get(name)
  name = cmsData.fileAttr.delete(name)

  let date
  if (fileData.d) {
    date = fileData.d
  } else {
    const stat = fse.statSync(revisionPath)
    date = stat.mtime
  }

  const fileObject = {
    name: name,
    path: revisionPath,
    date: date
  }

  return fileObject
}
