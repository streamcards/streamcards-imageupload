#Image Drag 'n Drop Upload 

This experiment lets you upload images into your browser via drag & drop.
It displays the uploaded images as `data:url` within an `<img>` tag.

Files upload is dependent on theese current html5 technologies:

- [Native drag-to-browser][0]
- [File API][1]
- [FileReader API][2]

Also, we're using [polymer][3] to get some basic layout support.

##Setting up

The setup is run by a [node][4] server and is using [grunt][5] and [bower][6].

Step 1 - clone the repository

````
git clone git://github.com/streamcards/imageupload.git
cd imageupload
````

Step 2 - install dependencies

````
npm install
bower install
````

Step 3 - fire up the server

````
grunt serve
````

That's it!

Navigate to `https://localhost:7000` and you'll see the experiment!

*Having trouble? Please feel free to throw me a line or report an github issue!*


[0]:http://www.html5rocks.com/en/tutorials/dnd/basics/
[2]:https://developer.mozilla.org/en-US/docs/Web/API/FileReader
[1]:https://developer.mozilla.org/en-US/docs/Web/API/File
[3]:http://www.polymer-project.org/docs/polymer/layout-attrs.html
[4]:http://nodejs.org/
[5]:http://gruntjs.com/
[6]:http://bower.io/
