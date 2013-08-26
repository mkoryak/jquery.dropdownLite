/**
 * version 1.0 - 9/11/2012
 * 
 * @requires: jquery 1.7.x
 * Create a widget, that when clicked will cause a "body" element to appear beneath it. You can have multiple widgets share a single body, 
 * and you can add new widgets to share a body after plugin creation.
 * 
 * initilization: You must pass in a map with init params. "body" function is required to return a jQuery object referencing the element to be used as the body
 * 
 * the body element gets the following useful data bound to it: ($body.data(....))
 * $body.data('ddl-for') = returns the jQuery object reference to the widget that was clicked, and for which the body is shown
 * $body.data('ddl').addWidget($newWidget) = this is the function you would use to add new widgets to share the body element
 * 
 * each widget gets the following map attached as:
 * var ddl = $widget.data('ddl');
 * ddl.getBody() = returns the body element jquery ref
 * ddl.showBody() = shows the body for the current widget as if the widget was clicked
 * ddl.hideBody() = hides the body
 */ 
 
 /**
 * @preserve jQuery.dropdownLite 1.0.1
 * Copyright (c) 2013 Misha Koryak - https://github.com/mkoryak/jquery.dropdownLite
 * Licensed under Creative Commons Attribution-NonCommercial 3.0 Unported - http://creativecommons.org/licenses/by-sa/3.0/
 */
(function ($) {
    
var globalId = 1; //keep this in the closure, assign a global id each widget body created, to keep track of them
     
$.fn.dropdownLite = function(map) {
    var opts = $.extend({}, {
        body: function() {
            return $("<div>Please define a body</div>")
        },
        positionOffset: "", //see http://jqueryui.com/demos/position/#option-offset
        onShowBody: function($widget, $body) {},
        onHideBody: function($body) {}, //this happens when body is hidden
        positionBodyAt: "left bottom", //postion the body here relative to the widget
        positionBodyMy: 'left top', //postion 'my'
        positionCollision: 'flip flip', //postion 'my'
        hideBodyOnWidgetClick:false, //if they click on the widget, do we toggle the body visibility? default NO 
        showFn: function($body){ //override this if you want to show the body in some fancy way. (just make sure you show it)
            $body.show();
        },
        hideFn: function($body){ //override to hide in a fancy way
            $body.hide();
        }, 
        positionOf: function($widget){ //we position around this element, see the 'of' property in the position plugin. override if needed
            return $widget;
        },
        positionFn: function($widget, $body, pos){ //override what happens when $body is positioned. you must set top/left in this function
            $body.css({top: pos.top, left:pos.left});
        }
    }, map || {});
    
    if(this.length == 0){ //we arent attaching it to anything
        return this;
    }

    var $body = opts.body().hide();
    if($body.length == 0){
        return this;
    }
    $body.css({'position':'absolute'}).addClass('ddl-body');
    var showingBodyFor = -1;
    var numberWidgets = this.length;
    
    if($body.data('ddl-global-id')){ //the widget has already been bound to this body, abort widgetizing again.
        return this;
    }
      
    $body.data('ddl-global-id', globalId++);
    
    if($body.parent().length == 0){
    	$("body").append($body);
    }
    
    var showBody = function($this) {
        if(!$body.is(":visible") || showingBodyFor != $this.data("ddl-id")){
            showingBodyFor = $this.data('ddl-id');
            opts.showFn($body);
            $body.position({
                'of':opts.positionOf($this),
                'my':opts.positionBodyMy,
                'at': opts.positionBodyAt,
                'offset': opts.positionOffset,
                'collision': opts.positionCollision,
                'using': function(pos){
                    opts.positionFn($this, $body, pos);
                }
            });
            $body.data('ddl-for', $this);
        }
        opts.onShowBody($this, $body);
    };

    var hideBody = function() {
        opts.hideFn($body);
        opts.onHideBody($body);
    };

    $(document).bind("click.ddl", function(e) {
        var $target = $(e.target);
        var is = $body.data('ddl-for') == $target;
        var has = $target.closest($body.data('ddl-for')).length > 0; 
        if (!$target.is('.ddl-body') && !$target.parents(".ddl-body").length && !(is || has)) {
            hideBody();
        }
    }).bind('ddl-hide-body-global', function(e, hideAllBut){ //if we create a bunch of seperate widgets, we still expect to only have one body showing at a time
        if($body.data('ddl-global-id') != hideAllBut){
           hideBody(); 
        }
    });

    var addWidget = function($this, i) {
        $this.data('ddl-id', i).addClass('ddl-widget');
        $this.on("click.ddl", function(e) {
            if(opts.hideBodyOnWidgetClick){
                if ($body.is(":visible")) {
                    hideBody();
                } else {
                    showBody($this);
                }  
            } else { 
                showBody($this);
            }
            $(document).trigger("ddl-hide-body-global", [$body.data('ddl-global-id')]);
         //TODO: why is this here?   e.stopPropagation();;
        });

        $this.data("ddl", {
            getBody: function() {
                return $body;
            },
            "showBody":function() {
                showBody($this);
            },
            "hideBody":hideBody
        });
    };
    $body.data('ddl', {"addWidget":function($widgets) {
        $widgets.each(function(){
           numberWidgets++;
           addWidget($(this), numberWidgets); 
        });
    }});

    this.each(function(i) {
        addWidget($(this), i);
    });
    return this;
};
$.fn.hoverDropdownLite = function(map) {
    var opts = $.extend({}, {
        delayMs: 10
    }, map || {});
    

    this.each(function(){ 
        var $this = $(this);
        var hideTimer = 0;
        var showTimer = 0;
        var hideFn = map.hideFn || function($body){
            $body.hide();
        };
        map.hideFn = function($body){
            hideTimer = setTimeout(function(){
                hideFn($body);
            }, 100);
        };
        
        $this.dropdownLite(map);
        var hideBody = $this.data('ddl').hideBody;
        var showBody = $this.data('ddl').showBody;
        var $body = $this.data('ddl').getBody();
        
        $this.unbind('click.ddl').on('mouseover', function(e){
            showTimer = setTimeout(showBody, opts.delayMs);
            clearTimeout(hideTimer);
        }).on('mouseout', function(e){
            clearTimeout(showTimer);    
            hideBody();
        });
        $body.mouseenter(function(){
           clearTimeout(hideTimer);
        }).mouseleave(function(){
           hideBody();
        });
    });
    return this;
};
$.fn.collisionAwareDropdown = function(map){
    var opts = $.extend({}, {
        positionBodyAt: "left bottom",
        positionBodyMy: 'left top', 
        positionCollision: 'flip flip' 
    }, map || {});
    if(opts.positionBodyAt == 'left bottom' && opts.positionBodyMy == 'left top' && opts.positionCollision == 'flip flip'){
        opts = $.extend({}, {
            positionFn: function($widget, $body, pos){ //override what happens when $body is positioned. you must set top/left in this function
                var offset = $widget.offset();
                offset.left = ~~offset.left;
                offset.top = ~~offset.top;
                if(offset.left > pos.left){ //the left of the dropdown should be under the left of the link, if not, there was a collision with the edge of the screen so we need to reposition the little arrow thingy by adding a class
                    $body.addClass('collision-x');
                } else {
                    $body.removeClass('collision-x');
                }
                if(offset.top > pos.top){ //the left of the dropdown should be under the left of the link, if not, there was a collision with the edge of the screen so we need to reposition the little arrow thingy by adding a class
                    $body.addClass('collision-y');
                } else {
                    $body.removeClass('collision-y');
                }
                $body.css({top: pos.top, left:pos.left});
            }
        }, opts);
    } 
    return this.dropdownLite(opts);
};
}(jQuery));
