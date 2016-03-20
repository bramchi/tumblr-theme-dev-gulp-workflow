# Tumblr custom theme development Gulp workflow

### Introduction

This repository contains the source code and description of my frontend development workflow for creating custom Tumblr themes. Since  Tumblr theme development has to be done in-browser, my workflow is a little different than with other webdevelopment projects. After learning a lot from doing some projects, I now have a pretty decent setup that I would like to share with you.

For HTML editing, I use Tumblr's theme HTML editor at https://www.tumblr.com/customize/tumblrname. Which is actually pretty good. I keep the Tumblr itself open in another browser tab. Once in a while I copy changes to the HTML back to the local tumblr-template.html file to be able to commit to git, accompanied by the other changes. The supplied HTML template in this repo is from the fine [Tumblrplate](https://github.com/justalever/tumbleplate). This HTML template is also part of the build and gets uploaded too. This way the assets always are accompanied by the HTML as means of documentation.

I host the stylesheet, javascripts and webfonts on a separate server to speed up development. When the theme is ready to launch, I upload these assets to Tumblr using the [theme assets tool](http://developers.tumblr.com/post/66702077097/hey-there-cool-theme-developers-we-added-a). This ensures good loading times for the live site, as Tumblr has a great global content distribution network (CDN). Sadly, Tumblr doesn't add good CORS headers to uploaded webfonts, so for now I use webfont services or use a good CDN for them.

For all other tasks regarding CSS/Javascript/image compilation, compression, FTP'ing and browser refreshing, I have two Gulp tasks running simultaniously. This way local changes to my styleheets or javascript are compiled instantaneously, synced with the development server and the browser refreshes after that. Make sure you have installed and enabled the [LiveReload browser extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei/reviews) for this to work. This usually all takes place within a few seconds, so it almost feels as fast as full local development.

All in all a pretty sweet setup given the circumstances!

Oh and I really like a [Neat](http://neat.bourbon.io) [Bourbon](http://bourbon.io) with [Bitters](http://bitters.bourbon.io), so that is part of this setup too.

### Installation

With [NodeJS](https://nodejs.org) installed. run `npm install && bower install` in your console. This will install all NodeJS and Bower dependancies.

### Gulp tasks

The important gulp tasks are:

- `gulp` - This task will create a new clean build in the `/dist` folder.
- `gulp watch` - This task will keep running, watch for changes, and compile the changed files into the `/dist` folder
- `gulp deploy-ftp` - This task will upload the `/dist` folder once to the development server.
- `gulp watch-sync-ftp` - This task will keep running, watch for changes in the `/dist` folder, and upload changed files to the development server so it stays in sync. It will also trigger a livereload event.

### Compilation

The assets for this theme are compiled using [Gulp](http://gulpjs.com/) and a bunch of other Gulp plugins. Gulp compiles the files in the `/src` directory into a `/dist` folder that contains everything for the theme. This `/dist` directory is not part of the source, you need to compile it yourself.

### FTP credentials for your development server

To use the FTP functions, an `.env` file has to be added manually to the project root that contains the FTP credentials. For security reasons it is not part of the repository. Use the following structure:

    FTP_HOST = ftp.example.com
    FTP_USR = example-user
    FTP_PWD = example-password
