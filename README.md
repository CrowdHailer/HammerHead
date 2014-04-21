# HammerheadJS

#### A minimal JavaScript utility to help view SVG's on webpages

# Features

### Current
- Small ~ 5kb
- Drag support with mouse and touch
- Pinch support for zoom
- Dependancy on [hammer.js](http://eightmedia.github.io/hammer.js/)

### Planned
- Support for zooming with mousewheel
- minified code
- key zoom and pan support
- temporarily disable
- zoom to point

# Usage
- Add [hammerhead.js](https://raw.githubusercontent.com/CrowdHailer/HammerHead/master/hammerhead.js) and [hammerhead.css](https://raw.githubusercontent.com/CrowdHailer/HammerHead/master/hammerhead.css) to your project directory
- Include *hammer.min.js* and *hammerhead.js* in you html
- Include *hammerhead.css* (This disables native scrolling and can effect other areas of your site)
- Optionally include *hammer.fakemultitouch.js* and/or *hammer.showtouches.js*
- Activate with the following script passing the SVG's id
```js
Hammer.plugins.fakeMultitouch(); // If including fake multitouch
Hammer.plugins.showTouches();    // If including show touches
viewer = new Viewer(svgIdString);
```

# Credits
Built on top of [Hammerjs](http://eightmedia.github.io/hammer.js/)
