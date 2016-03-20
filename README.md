# Tumblr custom theme development Gulp workflow

### Introduction
This repository contains the source code and description of my frontend development workflow for creating custom Tumblr themes. Since Tumblr development cannot be done fully locally, my workflow is a little different than with other webdevelopment projects.

For HTML editing, I use Tumblr's theme HTML editor at https://www.tumblr.com/customize/tumblrname. And I keep the Tumblr itself open in another browser tab. Changes to the HTML I copy back to a local file to be able to commit to git. I host the stylesheet and javascripts assets on a separate server to speed up development. When the theme is ready to launch, I upload these assets to Tumblr using the [theme assets tool](http://developers.tumblr.com/post/66702077097/hey-there-cool-theme-developers-we-added-a). This ensures good loading times, as Tumblr has a great global content distribution network (CDN).

For all other tasks regarding CSS/Javascript/image compilation, compression, FTP'ing and browser refreshing, I have two Gulp tasks running simultaniously. This way local changes to my styleheets or javascript are compiled instantaneously, synced with the development server and your browser refreshes after that. Actually pretty sweet given the circumstances :-)

As a HTML boilerplate, I recommend the fine [Tumblrplate](https://github.com/justalever/tumbleplate)

### Structure

The assets for this theme are compiled using the NodeJS plugin Gulp and some other plugins. This means that the files in the `/src` are compiled into a `/dist` folder that contains everything for the theme. This `/dist` directory is not part of the source, you need to compile it yourself.

### Installation
NodeJS is required. Using your console, run `npm install && bower install`. This will install all NodeJS dependancies and Bower dependancies.

### Gulp tasks
The most important gulp tasks are:

- `gulp` - This task will create a new clean build in the `/dist` folder.
- `gulp watch` - This task will keep running, watch for changes, and compile the changed files into the `/dist` folder
- `gulp deploy-ftp` - This task will upload the `/dist` folder once to the development server.
- `gulp watch-sync-ftp` - This task will keep running, watch for changes in the `/dist` folder, and upload changed files to the development server so it stays in sync. It will also trigger a livereload event.

### FTP credentials for development server
To use the FTP functions, an `.env` file has to be added manually that contains the FTP credentials. For security reasons it is not part of the repository. Use the following structure:

    FTP_HOST = ftp.example.com
    FTP_USR = example-user
    FTP_PWD = example-password
