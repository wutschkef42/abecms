/*global document, json, window, CONFIG, alert, location */

import Nanoajax from 'nanoajax'
import qs from 'qs'
import {Promise} from 'bluebird'
import on from 'on'
let singleton = Symbol()
let singletonEnforcer = Symbol()

export default class Json {
  constructor(enforcer) {
    this._headers = {}
    this._data = json
    this._ajax = Nanoajax.ajax
    this.canSave = true

    this.saving = on(this)
    this.headersSaving = on(this)

    if (enforcer != singletonEnforcer) throw 'Cannot construct Json singleton'
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new Json(singletonEnforcer)
      window.formJson = this[singleton]
    }
    return this[singleton]
  }

  save(
    type = 'draft',
    url = '/abe/api/pages/save/',
    tplPath = null,
    filePath = null
  ) {
    this.saving._fire({type: type})
    var p = new Promise(resolve => {
      if (!this.canSave) {
        resolve({})
        this.canSave = true
        return
      }
      var jsonSave = JSON.parse(
        JSON.stringify(this.data).replace(/&quote;/g, "'")
      )

      if (typeof json.abe_source !== 'undefined' && json.abe_source !== null) {
        delete json.abe_source
      }

      tplPath = tplPath != null ? tplPath : window.CONFIG.TPLPATH
      filePath = filePath != null ? filePath : window.CONFIG.FILEPATH

      var toSave = qs.stringify({
        json: jsonSave,
        type: type,
      })

      this.headersSaving._fire({url: document.location.origin + '/' + type})

      var ajaxUrl = document.location.origin + url + type + filePath
      console.log(document.location.origin, url, filePath, toSave)

      if (type === 'publish') {
        ajaxUrl = '/abe/api/pages/publish'
      }
      else if (type == 'reject') {
        ajaxUrl = '/abe/api/pages/reject' + filePath
      }
      else if (type == 'save') {
        var realType = jsonSave.abe_meta.status || 'draft'
        ajaxUrl = '/abe/api/pages/save/' + realType + filePath
      }
      else {
        ajaxUrl = '/abe/api/pages/save/' + type + filePath
      }

      this._ajax(
        {
          url: ajaxUrl,
          body: toSave,
          headers: this._headers,
          method: 'post'
        },
        (code, responseText) => {
          try {
            var jsonRes = JSON.parse(responseText)
            if (
              typeof jsonRes.error !== 'undefined' &&
              jsonRes.error !== null
            ) {
              alert(jsonRes.error)
              return
            }
            if (jsonRes.success == 1) {
              this.data = jsonRes.json
              location.reload()
            } else {
              alert(jsonRes.message)
            }
          } catch (e) {
            alert(
              'The following error happened : \n' +
                e +
                '\n if it persist, reload your web page tab.'
            )
            jsonRes = {}
          }
          resolve(jsonRes)
        }
      )
    })

    return p
  }

  set data(obj) {
    this._data = obj
  }

  get data() {
    return this._data
  }
}
