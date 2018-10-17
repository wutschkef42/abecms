import {config, abeExtend, Manager} from '../../../cli'

/**
 * This route returns filtered list of templates in JSON format
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 * 
 * REST-4-ALPHA : MUST BE CHECKED, AUTHORIZATIONS
 */
var route = function(req, res, next) {
    var list = Manager.instance.getStructureAndTemplates();
    var templates = [...list.templates];
    res.json(templates);
}

export default route 