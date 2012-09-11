jquery.dropdownLite
===================

Make a div behave like a dropdown. Does exactly what you would expect. Leaves it up to you to fill the div with content.

There is also a dropdownLiteHover plugin that extends the dropdown functionality to show the div on hover instead of on click.

## Requires
jQuery 1.7.x
jQuery UI Position

## Usage
    $('.my-elements').dropdownLite(options)

## Options
dropdownLite() takes an optional hash of options.

- *body* function() - return the div which will be the dropdown body **required**
- *positionOffset* string - see http://jqueryui.com/demos/position/#option-offset
- *onShowBody* function($body) - fired after body div is shown
- *onHideBody* function($body) - fired after body div is hidden
- *positionBodyAt* string - see http://jqueryui.com/demos/position/ default:  'left bottom'
- *positionBodyMy* string - see http://jqueryui.com/demos/position/ default: 'left top'
- *positionCollision* string - see http://jqueryui.com/demos/position/ default: 'flip flip'
- *hideBodyOnWidgetClick* boolean - if they click on the widget, do we toggle the body visibility? default falsee 
- *showFn: function($body) - override the show in a fancy way. You must show body in the function.
- *hideFn* function($body) - override the hide in a fancy way. You must hide body in the function.
- *positionOf function($widget) - we position around this element, see the 'of' property in the position plugin. override if needed.

In the above $body is the dropdown body div and $widget is the element on which the plugin was ran.

## Supported Browsers
I have tested using the built-in test cases on IE7, IE8, IE9, Firefox 7, and Chrome 14. NOT tested on IE6.
