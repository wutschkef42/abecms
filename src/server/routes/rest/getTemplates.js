import {config, abeExtend, Manager} from '../../../cli'

/**
 * This route returns filtered list of templates in JSON format
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var route = function(req, res, next) {
    const list = Manager.instance.getStructureAndTemplates();
    const templates = [...list.templates];
    res.json(templates);
}

export default route