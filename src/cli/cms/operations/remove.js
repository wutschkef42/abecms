import fse from 'fs-extra'
import path from 'path'

import {
  config,
  abeExtend,
  cmsData,
  coreUtils,
  cmsOperations,
  Manager
} from '../../'

export function remove(postUrl) {
  postUrl = abeExtend.hooks.instance.trigger('beforeDeleteFile', postUrl)

  // TODO: Mongo - query pour recup toutes les versions d'un doc
  var revisions = cmsData.revision.getVersions(postUrl)

  console.log(revisions)

  Array.prototype.forEach.call(revisions, revision => {
    const postPath = cmsData.utils.getPostPath(revision.path)
    cmsOperations.remove.removeRevision(revision.path)
    // TODO: Ecrire une function pour remove revision
    cmsOperations.remove.removePost(postPath)
  })

  postUrl = abeExtend.hooks.instance.trigger('afterDeleteFile', postUrl, {})

  Manager.instance.removePostFromList(
    postUrl.replace(new RegExp('\\/', 'g'), path.sep)
  )
}

export function removeFile(file) {
  if (coreUtils.file.exist(file)) {
    fse.removeSync(file)
  }
}

export function removeRevision (jsonPath) {
  let paths = jsonPath.split('/');
  paths = paths.slice(0, -1);
  let pathMustStartWith = path.join(paths);
  console.log(paths)

  var { mongo } = require('../../');
  console.log(mongo.getDb());
  var db = mongo.getDb();
  var JSONs = db.collection('jsons');
  try {
    var mtime = Date.now();
    var jsonRemove = JSONs.remove({
      // TODO: Mongo string query
      jsonPath: new RegExp('^'+ pathMustStartWith +'')
    });
  }
  catch (e) {
    console.error(e);
    return false;
  }
  removeFile(jsonPath);
}

export function removePost (path) {
  removeFile(path);
}
