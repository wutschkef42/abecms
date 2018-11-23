import getMain from './get-main'
import postListUrlSave from './post-list-url-save'
import getListUrl from './get-list-url'
import getListWorkflow from './get-list-workflow'
import getListHooks from './get-list-hooks'
import getPage from './get-page'
import postPage from './post-page'
import getGeneratePost from './get-generate-posts'
import getSaveConfig from './get-save-config'
import postUpload from './post-upload'
import postSqlRequest from './post-sql-request'
import postReference from './post-reference'
import getReference from './get-reference'
import postStructure from './post-structure'
import getStructure from './get-structure'
import getPaginate from './get-paginate'
import getThumbs from './get-thumbs'
import getImage from './get-image'
import getHome from './get-home'
import getThemes from './get-themes'
import getBuildTemplate from './get-build-template'
import postBuildTemplate from './post-build-template'
import postThemes from './post-themes'
import * as users from './users'
import * as operations from './operations'
import * as rest from './rest'

import express from 'express'
import * as abe from '../../cli'

import userRoutes from '../rest/users/userRoutes'

import {abeExtend, Handlebars, config} from '../../cli'

var router = express.Router()
abeExtend.hooks.instance.trigger('afterHandlebarsHelpers', Handlebars)
abeExtend.hooks.instance.trigger('beforeAddRoute', router)

// REST API routes
import { controllers } from './../rest/indexRoutes'

const {
	workflowController,
	statController,
	userController,
	urlController,
	themeController,
	templateController,
	structureController,
	roleController,
	referenceController,
	pageController,
	imageController,
	hookController,
	configController,
  activitiesController,
  searchController,
} = controllers

/* REST /users */
router.get('/abe/api/users', userController.getUsers)
router.get('/abe/api/users/me', userController.getMe)
router.post('/abe/api/users', userController.createUser)
router.put('/abe/api/users', userController.updateUser)
router.delete('/abe/api/users', userController.removeUser)
router.delete('/abe/api/users/:id', userController.removeUser)
router.put('/abe/api/users/activate', userController.activateUser)
router.put('/abe/api/users/deactivate', userController.deactivateUser)
router.post('/abe/api/users/login', userController.tryLogin)
router.get('/abe/api/users/profile', userController.getProfile)
router.post('/abe/api/users/profile', userController.postProfile)
router.get('/abe/api/users/logout', userController.logout)
router.post('/abe/api/users/askreset', userController.askPasswordReset)
router.post('/abe/api/users/reset', userController.resetPassword)
router.post('/abe/api/users/forgot', userController.forgotPassword)

/* REST /workflows */
router.get('/abe/api/workflows', workflowController.getWorkflows)
router.get('/abe/api/workflows/full', function(req, res, next) {
	workflowController.getFullWorkflows(router, req, res, next)
})
/* REST /urls    #permissions */
router.get('/abe/api/urls', function(req, res, next) {
	urlController.getUrls(router, req, res, next)
})
router.post('/abe/api/urls', urlController.saveUrls)

/* REST /theme */
router.get('/abe/api/theme', themeController.getThemes)
router.post('/abe/api/theme', themeController.postThemes)
router.delete('/abe/api/theme', themeController.deleteTheme)

/* REST /stats */
router.get('/abe/api/stats/users/total', statController.getTotalUsers)
router.get('/abe/api/stats/users/connected', statController.getConnectedUsers)
router.get('/abe/api/stats/pages/total', statController.getTotalPages)
router.get('/abe/api/stats/pages/published', statController.getPublishedPage)

/* REST /templates */
router.get('/abe/api/templates/', templateController.getTemplatesList)
router.get('/abe/api/templates/:name', templateController.getTemplate)
router.post('/abe/api/templates/', templateController.buildTemplate)

/* REST /structures */
router.get('/abe/api/structures', structureController.getStructures)
router.post('/abe/api/structures', structureController.postStructure)
router.delete('/abe/api/structures', structureController.deleteStructure)

/* REST /roles */
router.get('/abe/api/roles', roleController.getRoles)

/* REST /references */
router.get('/abe/api/references', referenceController.getReferences)
router.get('/abe/api/references/:name', referenceController.getReference)
router.delete('/abe/api/references/:name', referenceController.removeReference)
router.post('/abe/api/references', referenceController.saveReferences)

/* REST /pages */
router.get('/abe/api/pages', pageController.getPage)
router.post('/abe/api/pages', pageController.createPage)
router.post('/abe/api/pages/save*', pageController.savePage)
router.put('/abe/api/pages/*', pageController.updatePage) 
router.post('/abe/api/pages/draft*', pageController.draftPage)
router.post('/abe/api/pages/edit*', pageController.editPage)
router.delete('/abe/api/pages/*', pageController.removePage)
router.post('/abe/api/pages/duplicate', pageController.duplicatePage)
router.get('/abe/api/pages/paginate', pageController.paginate)
router.post('/abe/api/pages/publish', pageController.publish)
router.get('/abe/api/pages/unpublish/*', pageController.unpublish)
router.post('/abe/api/pages/reject*', pageController.reject)

/* REST /images */
router.get('/abe/api/images', imageController.getImage)
router.get('/abe/api/images/thumbs', imageController.getThumbs)
router.post('/abe/api/images', imageController.uploadImage)

/* REST /activities */
router.get('/abe/api/activities', activitiesController.getActivities)

/* REST /hooks */
router.get('/abe/api/hooks', hookController.getHooks)

/* REST /config */
router.get('/abe/api/config', configController.getConfig)
router.post('/abe/api/config', configController.saveConfig)

/* REST /search */
router.post('/abe/api/search', searchController.saveSearch)
router.delete('/abe/api/search', searchController.removeSearch)

/* END OF REST API ROUTES */




router.use('/api/call/users', userRoutes);

router.post('/abe/rest/authenticate', rest.authenticate)

router.get('/abe/users/forgot', users.getForgot)
router.get('/abe/users/list', users.getList)
router.get('/abe/users/login', users.getLogin)
router.get('/abe/users/logout', users.getLogout)
router.get('/abe/users/reset', users.getReset)
router.get('/abe/users/profile', users.getProfile)

router.get('/abe/reference', getReference)
router.get('/abe/structure', getStructure)
router.get('/abe/editor*', getMain)
router.get('/abe/themes', getThemes)
router.get('/abe/build-template', getBuildTemplate)

router.get('/abe/list-workflow*', function(req, res, next) {
  getListWorkflow(router, req, res, next)
})
router.get('/abe/permissions', function(req, res, next) {
  getListUrl(router, req, res, next)
})
router.get('/abe/list-hooks*', getListHooks)

/*
router.get('/abe/rest/posts*', rest.posts)
router.get('/abe/rest/post*', rest.post)
router.get('/abe/rest/activity-stream', rest.activityStream)
*/

/*
router.post('/abe/users/activate', users.postActivate)
router.post('/abe/users/add', users.postAdd)
router.post('/abe/users/deactivate', users.postDeactivate)
router.post('/abe/users/login', users.postLogin)
router.post('/abe/users/remove', users.postRemove)
router.post('/abe/users/reset', users.postReset)
router.post('/abe/users/update', users.postUpdate)
router.post('/abe/users/profile', users.postProfile)
router.post('/abe/users/save-search', users.postSaveSearch)
router.post('/abe/users/remove-search', users.postRemoveSearch)
*/
/*
router.get('/abe/paginate', getPaginate)
router.post('/abe/sql-request*', postSqlRequest)
router.post('/abe/page/*', postPage)
router.get('/abe/page/*', getPage)
router.get('/abe/generate-posts', getGeneratePost)
router.get('/abe/save-config', getSaveConfig)

router.get('/abe/thumbs/*', getThumbs)
router.get('/abe/image/*', getImage)
router.post('/abe/upload/*', postUpload)
router.post('/abe/reference/*', postReference)
router.post('/abe/structure/*', postStructure)

router.post('/abe/list-url/save*', postListUrlSave)

router.post('/abe/themes', postThemes)

router.post('/abe/build-template', postBuildTemplate)
*/


/**
 * Operations
 * - create : create a post
 * - update : update a post, changing its name (or path or template)
 * - delete : delete a post
 * - duplicate : duplicate a revision
 * - reject : reject a workflow step (else but the publish)
 * - unpublish : unpublish a published post (=== reject a published post)
 * - submit : submit a workflow step (including draft and publish)
 * - edit : save a post keeping it in its status
 */

 /*
router.post('/abe/operations/create*', operations.postCreate)
router.post('/abe/operations/duplicate*', operations.postDuplicate)
router.post('/abe/operations/update*', operations.postUpdate)

var workflows = config.users.workflow
Array.prototype.forEach.call(workflows, workflow => {
  router.get(`/abe/operations/delete/${workflow}*`, operations.getDelete)

  if (workflow != 'draft' && workflow != 'publish') {
    router.post(`/abe/operations/reject/${workflow}*`, operations.postReject)
  } else if (workflow == 'publish') {
    router.get('/abe/operations/unpublish*', operations.getUnpublish)
  }

  router.post(`/abe/operations/submit/${workflow}*`, operations.postSubmit)
  router.post(`/abe/operations/edit/${workflow}*`, operations.postEdit)
})
*/

/*
Question importantes :
où placer les routes

système de plugins ci-dessous ? j'intègre ?
si oui (for sure) : 
- placer le systeme dans chaque fichier de routes, ou charger toutes les routes ici,
- ou tout dupliquer le système dans indexRoutes de l'api REST (< premier choix)
- ok

*/

var routes = abeExtend.plugins.instance.getRoutes()
Array.prototype.forEach.call(routes, route => {
  if (typeof route.get !== 'undefined' && route.get !== null) {
    Array.prototype.forEach.call(route.get, routeGet => {
      try {
        var pluginRoot = require(routeGet.path)
        if (typeof pluginRoot.default === 'object') {
          if (typeof pluginRoot.middleware === 'function') {
            router.get(
              routeGet.routePath,
              pluginRoot.middleware,
              pluginRoot.default
            )
          } else {
            router.get(routeGet.routePath, pluginRoot.default)
          }
        } else {
          if (typeof pluginRoot.middleware === 'function') {
            router.get(
              routeGet.routePath,
              pluginRoot.middleware,
              (req, res, next) => {
                pluginRoot.default(req, res, next, abe)
              }
            )
          } else {
            router.get(routeGet.routePath, (req, res, next) => {
              pluginRoot.default(req, res, next, abe)
            })
          }
        }
      } catch (e) {
        // statements
        console.log(e)
      }
    })
  }
  if (typeof route.post !== 'undefined' && route.post !== null) {
    Array.prototype.forEach.call(route.post, routePost => {
      //console.log(routePost.path)
      try {
        var pluginRoot = require(routePost.path)
        if (typeof pluginRoot.default === 'object') {
          if (typeof pluginRoot.middleware === 'function') {
            router.post(
              routePost.routePath,
              pluginRoot.middleware,
              pluginRoot.default
            )
          } else {
            router.post(routePost.routePath, pluginRoot.default)
          }
        } else {
          if (typeof pluginRoot.middleware === 'function') {
            router.post(
              routePost.routePath,
              pluginRoot.middleware,
              (req, res, next) => {
                pluginRoot.default(req, res, next, abe)
              }
            )
          } else {
            router.post(routePost.routePath, (req, res, next) => {
              pluginRoot.default(req, res, next, abe)
            })
          }
        }
      } catch (e) {
        // statements
        console.log(e)
      }
    })
  }
})

// TODO - DEBUG - Waiting solution for get the good router untill full refactoring
import store from '../rest/store'
store.routers.push(router)

abeExtend.hooks.instance.trigger('afterAddRoute', router)

export default router
