/**
 * A very simple static site generator.
 */

const fs = require('fs')
const path = require('path')

const Mustache = require('mustache')

const tidy = require('./tidy')

const htmlPath = path.resolve(__dirname, 'html')
const dataPath = path.resolve(__dirname, 'data')
const templatesPath = path.resolve(__dirname, 'templates')

/**
 * The Pages to build
 */

const pages = ['index', 'cranes', 'scheduler']

/**
 * The Partial Templates
 */

const navbar = readPartial('navbar')
const footer = readPartial('footer')
const header = readPartial('header')

/**
 * The Master Template
 */

const master = readPartial('master')

/**
 * Build each page. Use json for data and mustache for templates.
 */

pages.forEach(function (name) {
  /**
   * Load the json data file for the page
   */

  const jsonPath = path.resolve(dataPath, name + '.json')

  fs.readFile(jsonPath, 'utf8', function (err, json) {
    if (err) { return console.log('Json Error: ' + err) }

    /**
     * The page data parsed and ready for template injection
     */

    const data = JSON.parse(json)

    /**
     * Load the mustache template file for the page
     */

    const templatePath = path.resolve(templatesPath, name + '.mustache')

    fs.readFile(templatePath, 'utf8', function (err, template) {
      if (err) { return console.log('Mustache Error: ' + err) }

      /**
       * The Partials Object expected by the master template
       */

      const partials = {
        header: header,
        navbar: navbar,
        page: template,
        footer: footer
      }

      /**
       * The rendered html from mustache
       */

      const html = Mustache.render(master, data, partials)

      /**
       * Clean up the html to make it look pretty
       */

      tidy(html, function (err, html) {
        if (err) { console.log('Tidy Error: ' + err) }

        /**
         * Write the finished html to the public folder
         */

        const outputPath = path.resolve(htmlPath, name + '.html')

        fs.writeFile(outputPath, html, 'utf8', function (err) {
          if (err) { return console.log('Save Error: ' + err) }
          console.log(name + '.html build success')
        })
      })
    })
  })
})

function readPartial (name) {
  const partialPath = path.resolve(templatesPath, '_' + name + '.mustache')
  return fs.readFileSync(partialPath, 'utf8')
}
