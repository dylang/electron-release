'use strict'
const exec = require('child_process').exec
const publishRelease = require('publish-release')
const got = require('got')
const Promise = require('bluebird')
const loadJsonFile = require('load-json-file')
const writeJsonFile = require('write-json-file')

class Publish {

  constructor (opts) {
    this.opts = (opts) ? opts : {}
    if (!opts.repo) opts.repo = this._getRepo()
    if (!opts.tag) opts.tag = this._getTag()
    if (!opts.name) opts.name = opts.tag
    if (!opts.output) opts.output = opts.app + '.zip'

    if (!opts.tag || !opts.repo || !opts.app || !opts.token) {
      console.log('Missing required options.')
      process.exit()
    }

    this._releaseUrl = null
  }

  // Zip compress .app
  compress () {
    let self = this

    return new Promise(function (resolve, reject) {
      let cmd = 'ditto -c -k --sequesterRsrc --keepParent ' + self.opts.app + ' ' + self.opts.output
      exec(cmd, function (err) {
        if (!err) {
          resolve()
        }
      })
    })
  }

  // Create new release with zip as asset.
  release () {
    let self = this

    return new Promise(function (resolve, reject) {
      publishRelease({
        token: self.opts.token,
        owner: self.opts.repo.split('/')[0],
        repo: self.opts.repo.split('/')[1],
        tag: self.opts.tag,
        name: self.opts.name,
        assets: [self.opts.output]
      }, function (err, release) {
        if (!err) {
          got(release.assets_url).then(function (res) {
            var jsonBody = JSON.parse(res.body)
            self._releaseUrl = jsonBody[0].browser_download_url
            resolve()
          })
        }
      })
    })
  }

  // Update auto_update.json file with latest url.
  updateUrl () {
    let self = this
    return new Promise(function (resolve) {
      loadJsonFile('./auto_updater.json').then(function (content) {
        content.url = self._releaseUrl
        writeJsonFile('./auto_updater.json', content).then(function () {
          resolve()
        })
      })
    })
  }

  // Get repo from package.json
  _getRepo () {
    let pkg = loadJsonFile.sync('./package.json')
    let url = pkg.repository.url.split('/')
    return url[3] + '/' + url[4].replace(/\.[^/.]+$/, '')
  }

  // Get tag (version) from package.json
  _getTag () {
    let pkg = loadJsonFile.sync('./package.json')
    let version = pkg.version
    return 'v' + version
  }

}

module.exports = Publish
