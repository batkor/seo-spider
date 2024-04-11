const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const WatchExternalFilesPlugin = require('webpack-watch-external-files-plugin');
const Twig = require('twig');
const fs = require('node:fs');
console.log();

module.exports = {
  mode: process.env.NODE_ENV,
  watch: true,
  cache: false,
  entry: path.resolve(__dirname, 'src/js/index.js'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public/js'),
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new WatchExternalFilesPlugin({
      files: [
        './src/**/*.twig',
        './src/index.twig',
        './src/**/*.css',
      ]
    }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            { source: './node_modules/bootstrap/dist', destination: './public/assets/bootstrap' },
            { source: './src/css', destination: './public/css' },
          ],
        }
      }
    }),
    {
      apply(compiler) {
        compiler.hooks.afterCompile.tap('buildTwig', (params) => {
          Twig.cache(false);
          Twig.renderFile(path.join(__dirname, 'src/index.twig'), (e, html) => {
            if (e) {
              console.log('error:', e);
            }

            let indexPath = path.join(__dirname, 'public/index.html');
            fs.writeFile(indexPath, html, e => {
              if (e) {
                console.log(e);
              }
              else {
                console.log('TWIG update');
              }
            })
          })
        });
      },
    }
  ],
};
