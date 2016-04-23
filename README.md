#Scrambler

**jQuery Plugin: Image Scrambler**

Would you like to create a puzzle out of your images? Scrambler 
uses Unsplash images to create a 16-square puzzle. 

Demo
----
Navigate to the project hosted on github.com [**here**](http://klammertime.github.io/Scrambler/)

**OR**

Navigate to the Scrambler [**about**](http://audreyklammer.com/scrambler.html) page.

Usage
-----
1. Clone the `dist` repository
2. Navigate to the index.html through your web browser to see a basic example 
4. Adjust the CSS/main.css file to fit your needs
5. Navigate to the `JS/main.js` file. On line 316, replace `#game_object` with the ID that corresponds to the tag you'd like Scrambler to show up in. Also, replace `130` with the size you'd like each individual square in pixels:
```$('#game_object').scrambler(130);```
6. Include the `CSS/main.css` and `JS/main.js` files in your project

##Resources
* **Basic 16 Square Game** The tutorial below gave me the initial code to create a grid from an image. I refactored the code and added the following functionality: shuffle, unshuffle, difficulty levels, score, and help.
  * [How to create a game using jQuery](https://www.script-tutorials.com/how-to-create-a-game-using-jquery/)
* **To create modal popups**: [Create a Fading Popup Modal with jQuery](http://demos.inspirationalpixels.com/popup-modal/)
* **Treehouse**: [jQuery Basics](https://teamtreehouse.com/library/jquery-basics)

##Technologies Used
jQuery, [HTML5 data-* attributes](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes), AJAX

##Potential New Features
* [CSS-Only Raindrops on Window Effect](https://blogs.adobe.com/dreamweaver/2015/06/css-only-raindrops-on-window-effect.html)
