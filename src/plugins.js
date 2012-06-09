// jQuery
window.$||function(){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src","jquery.js");(document.getElementsByTagName("head")[0]||document.documentElement).appendChild(a)}();

// jScrollPane
(function($,i,j){$.fn.jScrollPane=function(h){function JScrollPane(f,s){var g,jsp=this,pane,paneWidth,paneHeight,container,contentWidth,contentHeight,percentInViewH,percentInViewV,isScrollableV,isScrollableH,verticalDrag,dragMaxY,verticalDragPosition,horizontalDrag,dragMaxX,horizontalDragPosition,verticalBar,verticalTrack,scrollbarWidth,verticalTrackHeight,verticalDragHeight,arrowUp,arrowDown,horizontalBar,horizontalTrack,horizontalTrackWidth,horizontalDragWidth,arrowLeft,arrowRight,reinitialiseInterval,originalPadding,originalPaddingTotalWidth,previousContentWidth,wasAtTop=true,wasAtLeft=true,wasAtBottom=false,wasAtRight=false,originalElement=f.clone(false,false).empty(),mwEvent=$.fn.mwheelIntent?'mwheelIntent.jsp':'mousewheel.jsp';originalPadding=f.css('paddingTop')+' '+f.css('paddingRight')+' '+f.css('paddingBottom')+' '+f.css('paddingLeft');originalPaddingTotalWidth=(parseInt(f.css('paddingLeft'),10)||0)+(parseInt(f.css('paddingRight'),10)||0);function initialise(s){var a,lastContentX,lastContentY,hasContainingSpaceChanged,originalScrollTop,originalScrollLeft,maintainAtBottom=false,maintainAtRight=false;g=s;if(pane===j){originalScrollTop=f.scrollTop();originalScrollLeft=f.scrollLeft();f.css({overflow:'hidden',padding:0});paneWidth=f.innerWidth()+originalPaddingTotalWidth;paneHeight=f.innerHeight();f.width(paneWidth);pane=$('<div class="jspPane" />').css('padding',originalPadding).append(f.children());container=$('<div class="jspContainer" />').css({'width':paneWidth+'px','height':paneHeight+'px'}).append(pane).appendTo(f)}else{f.css('width','');maintainAtBottom=g.stickToBottom&&isCloseToBottom();maintainAtRight=g.stickToRight&&isCloseToRight();hasContainingSpaceChanged=f.innerWidth()+originalPaddingTotalWidth!=paneWidth||f.outerHeight()!=paneHeight;if(hasContainingSpaceChanged){paneWidth=f.innerWidth()+originalPaddingTotalWidth;paneHeight=f.innerHeight();container.css({width:paneWidth+'px',height:paneHeight+'px'})}if(!hasContainingSpaceChanged&&previousContentWidth==contentWidth&&pane.outerHeight()==contentHeight){f.width(paneWidth);return}previousContentWidth=contentWidth;pane.css('width','');f.width(paneWidth);container.find('>.jspVerticalBar,>.jspHorizontalBar').remove().end()}pane.css('overflow','auto');if(s.contentWidth){contentWidth=s.contentWidth}else{contentWidth=pane[0].scrollWidth}contentHeight=pane[0].scrollHeight;pane.css('overflow','');percentInViewH=contentWidth/paneWidth;percentInViewV=contentHeight/paneHeight;isScrollableV=percentInViewV>1;isScrollableH=percentInViewH>1;if(!(isScrollableH||isScrollableV)){f.removeClass('jspScrollable');pane.css({top:0,width:container.width()-originalPaddingTotalWidth});removeMousewheel();removeFocusHandler();removeKeyboardNav();removeClickOnTrack()}else{f.addClass('jspScrollable');a=g.maintainPosition&&(verticalDragPosition||horizontalDragPosition);if(a){lastContentX=contentPositionX();lastContentY=contentPositionY()}initialiseVerticalScroll();initialiseHorizontalScroll();resizeScrollbars();if(a){scrollToX(maintainAtRight?(contentWidth-paneWidth):lastContentX,false);scrollToY(maintainAtBottom?(contentHeight-paneHeight):lastContentY,false)}initFocusHandler();initMousewheel();initTouch();if(g.enableKeyboardNavigation){initKeyboardNav()}if(g.clickOnTrack){initClickOnTrack()}observeHash();if(g.hijackInternalLinks){hijackInternalLinks()}}if(g.autoReinitialise&&!reinitialiseInterval){reinitialiseInterval=setInterval(function(){initialise(g)},g.autoReinitialiseDelay)}else if(!g.autoReinitialise&&reinitialiseInterval){clearInterval(reinitialiseInterval)}originalScrollTop&&f.scrollTop(0)&&scrollToY(originalScrollTop,false);originalScrollLeft&&f.scrollLeft(0)&&scrollToX(originalScrollLeft,false);f.trigger('jsp-initialised',[isScrollableH||isScrollableV])}function initialiseVerticalScroll(){if(isScrollableV){container.append($('<div class="jspVerticalBar" />').append($('<div class="jspCap jspCapTop" />'),$('<div class="jspTrack" />').append($('<div class="jspDrag" />').append($('<div class="jspDragTop" />'),$('<div class="jspDragBottom" />'))),$('<div class="jspCap jspCapBottom" />')));verticalBar=container.find('>.jspVerticalBar');verticalTrack=verticalBar.find('>.jspTrack');verticalDrag=verticalTrack.find('>.jspDrag');if(g.showArrows){arrowUp=$('<a class="jspArrow jspArrowUp" />').bind('mousedown.jsp',getArrowScroll(0,-1)).bind('click.jsp',nil);arrowDown=$('<a class="jspArrow jspArrowDown" />').bind('mousedown.jsp',getArrowScroll(0,1)).bind('click.jsp',nil);if(g.arrowScrollOnHover){arrowUp.bind('mouseover.jsp',getArrowScroll(0,-1,arrowUp));arrowDown.bind('mouseover.jsp',getArrowScroll(0,1,arrowDown))}appendArrows(verticalTrack,g.verticalArrowPositions,arrowUp,arrowDown)}verticalTrackHeight=paneHeight;container.find('>.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow').each(function(){verticalTrackHeight-=$(this).outerHeight()});verticalDrag.hover(function(){verticalDrag.addClass('jspHover')},function(){verticalDrag.removeClass('jspHover')}).bind('mousedown.jsp',function(e){$('html').bind('dragstart.jsp selectstart.jsp',nil);verticalDrag.addClass('jspActive');var a=e.pageY-verticalDrag.position().top;$('html').bind('mousemove.jsp',function(e){positionDragY(e.pageY-a,false)}).bind('mouseup.jsp mouseleave.jsp',cancelDrag);return false});sizeVerticalScrollbar()}}function sizeVerticalScrollbar(){verticalTrack.height(verticalTrackHeight+'px');verticalDragPosition=0;scrollbarWidth=g.verticalGutter+verticalTrack.outerWidth();pane.width(paneWidth-scrollbarWidth-originalPaddingTotalWidth);try{if(verticalBar.position().left===0){pane.css('margin-left',scrollbarWidth+'px')}}catch(err){}}function initialiseHorizontalScroll(){if(isScrollableH){container.append($('<div class="jspHorizontalBar" />').append($('<div class="jspCap jspCapLeft" />'),$('<div class="jspTrack" />').append($('<div class="jspDrag" />').append($('<div class="jspDragLeft" />'),$('<div class="jspDragRight" />'))),$('<div class="jspCap jspCapRight" />')));horizontalBar=container.find('>.jspHorizontalBar');horizontalTrack=horizontalBar.find('>.jspTrack');horizontalDrag=horizontalTrack.find('>.jspDrag');if(g.showArrows){arrowLeft=$('<a class="jspArrow jspArrowLeft" />').bind('mousedown.jsp',getArrowScroll(-1,0)).bind('click.jsp',nil);arrowRight=$('<a class="jspArrow jspArrowRight" />').bind('mousedown.jsp',getArrowScroll(1,0)).bind('click.jsp',nil);if(g.arrowScrollOnHover){arrowLeft.bind('mouseover.jsp',getArrowScroll(-1,0,arrowLeft));arrowRight.bind('mouseover.jsp',getArrowScroll(1,0,arrowRight))}appendArrows(horizontalTrack,g.horizontalArrowPositions,arrowLeft,arrowRight)}horizontalDrag.hover(function(){horizontalDrag.addClass('jspHover')},function(){horizontalDrag.removeClass('jspHover')}).bind('mousedown.jsp',function(e){$('html').bind('dragstart.jsp selectstart.jsp',nil);horizontalDrag.addClass('jspActive');var a=e.pageX-horizontalDrag.position().left;$('html').bind('mousemove.jsp',function(e){positionDragX(e.pageX-a,false)}).bind('mouseup.jsp mouseleave.jsp',cancelDrag);return false});horizontalTrackWidth=container.innerWidth();sizeHorizontalScrollbar()}}function sizeHorizontalScrollbar(){container.find('>.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow').each(function(){horizontalTrackWidth-=$(this).outerWidth()});horizontalTrack.width(horizontalTrackWidth+'px');horizontalDragPosition=0}function resizeScrollbars(){if(isScrollableH&&isScrollableV){var a=horizontalTrack.outerHeight(),verticalTrackWidth=verticalTrack.outerWidth();verticalTrackHeight-=a;$(horizontalBar).find('>.jspCap:visible,>.jspArrow').each(function(){horizontalTrackWidth+=$(this).outerWidth()});horizontalTrackWidth-=verticalTrackWidth;paneHeight-=verticalTrackWidth;paneWidth-=a;horizontalTrack.parent().append($('<div class="jspCorner" />').css('width',a+'px'));sizeVerticalScrollbar();sizeHorizontalScrollbar()}if(isScrollableH){pane.width((container.outerWidth()-originalPaddingTotalWidth)+'px')}contentHeight=pane.outerHeight();percentInViewV=contentHeight/paneHeight;if(isScrollableH){horizontalDragWidth=Math.ceil(1/percentInViewH*horizontalTrackWidth);if(horizontalDragWidth>g.horizontalDragMaxWidth){horizontalDragWidth=g.horizontalDragMaxWidth}else if(horizontalDragWidth<g.horizontalDragMinWidth){horizontalDragWidth=g.horizontalDragMinWidth}horizontalDrag.width(horizontalDragWidth+'px');dragMaxX=horizontalTrackWidth-horizontalDragWidth;_positionDragX(horizontalDragPosition)}if(isScrollableV){verticalDragHeight=Math.ceil(1/percentInViewV*verticalTrackHeight);if(verticalDragHeight>g.verticalDragMaxHeight){verticalDragHeight=g.verticalDragMaxHeight}else if(verticalDragHeight<g.verticalDragMinHeight){verticalDragHeight=g.verticalDragMinHeight}verticalDrag.height(verticalDragHeight+'px');dragMaxY=verticalTrackHeight-verticalDragHeight;_positionDragY(verticalDragPosition)}}function appendArrows(a,p,b,c){var d="before",p2="after",aTemp;if(p=="os"){p=/Mac/.test(navigator.platform)?"after":"split"}if(p==d){p2=p}else if(p==p2){d=p;aTemp=b;b=c;c=aTemp}a[d](b)[p2](c)}function getArrowScroll(a,b,c){return function(){arrowScroll(a,b,this,c);this.blur();return false}}function arrowScroll(a,b,c,d){c=$(c).addClass('jspActive');var e,scrollTimeout,isFirst=true,doScroll=function(){if(a!==0){jsp.scrollByX(a*g.arrowButtonSpeed)}if(b!==0){jsp.scrollByY(b*g.arrowButtonSpeed)}scrollTimeout=setTimeout(doScroll,isFirst?g.initialDelay:g.arrowRepeatFreq);isFirst=false};doScroll();e=d?'mouseout.jsp':'mouseup.jsp';d=d||$('html');d.bind(e,function(){c.removeClass('jspActive');scrollTimeout&&clearTimeout(scrollTimeout);scrollTimeout=null;d.unbind(e)})}function initClickOnTrack(){removeClickOnTrack();if(isScrollableV){verticalTrack.bind('mousedown.jsp',function(e){if(e.originalTarget===j||e.originalTarget==e.currentTarget){var b=$(this),offset=b.offset(),direction=e.pageY-offset.top-verticalDragPosition,scrollTimeout,isFirst=true,doScroll=function(){var a=b.offset(),pos=e.pageY-a.top-verticalDragHeight/2,contentDragY=paneHeight*g.scrollPagePercent,dragY=dragMaxY*contentDragY/(contentHeight-paneHeight);if(direction<0){if(verticalDragPosition-dragY>pos){jsp.scrollByY(-contentDragY)}else{positionDragY(pos)}}else if(direction>0){if(verticalDragPosition+dragY<pos){jsp.scrollByY(contentDragY)}else{positionDragY(pos)}}else{cancelClick();return}scrollTimeout=setTimeout(doScroll,isFirst?g.initialDelay:g.trackClickRepeatFreq);isFirst=false},cancelClick=function(){scrollTimeout&&clearTimeout(scrollTimeout);scrollTimeout=null;$(document).unbind('mouseup.jsp',cancelClick)};doScroll();$(document).bind('mouseup.jsp',cancelClick);return false}})}if(isScrollableH){horizontalTrack.bind('mousedown.jsp',function(e){if(e.originalTarget===j||e.originalTarget==e.currentTarget){var b=$(this),offset=b.offset(),direction=e.pageX-offset.left-horizontalDragPosition,scrollTimeout,isFirst=true,doScroll=function(){var a=b.offset(),pos=e.pageX-a.left-horizontalDragWidth/2,contentDragX=paneWidth*g.scrollPagePercent,dragX=dragMaxX*contentDragX/(contentWidth-paneWidth);if(direction<0){if(horizontalDragPosition-dragX>pos){jsp.scrollByX(-contentDragX)}else{positionDragX(pos)}}else if(direction>0){if(horizontalDragPosition+dragX<pos){jsp.scrollByX(contentDragX)}else{positionDragX(pos)}}else{cancelClick();return}scrollTimeout=setTimeout(doScroll,isFirst?g.initialDelay:g.trackClickRepeatFreq);isFirst=false},cancelClick=function(){scrollTimeout&&clearTimeout(scrollTimeout);scrollTimeout=null;$(document).unbind('mouseup.jsp',cancelClick)};doScroll();$(document).bind('mouseup.jsp',cancelClick);return false}})}}function removeClickOnTrack(){if(horizontalTrack){horizontalTrack.unbind('mousedown.jsp')}if(verticalTrack){verticalTrack.unbind('mousedown.jsp')}}function cancelDrag(){$('html').unbind('dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp');if(verticalDrag){verticalDrag.removeClass('jspActive')}if(horizontalDrag){horizontalDrag.removeClass('jspActive')}}function positionDragY(a,b){if(!isScrollableV){return}if(a<0){a=0}else if(a>dragMaxY){a=dragMaxY}if(b===j){b=g.animateScroll}if(b){jsp.animate(verticalDrag,'top',a,_positionDragY)}else{verticalDrag.css('top',a);_positionDragY(a)}}function _positionDragY(a){if(a===j){a=verticalDrag.position().top}container.scrollTop(0);verticalDragPosition=a;var b=verticalDragPosition===0,isAtBottom=verticalDragPosition==dragMaxY,percentScrolled=a/dragMaxY,destTop=-percentScrolled*(contentHeight-paneHeight);if(wasAtTop!=b||wasAtBottom!=isAtBottom){wasAtTop=b;wasAtBottom=isAtBottom;f.trigger('jsp-arrow-change',[wasAtTop,wasAtBottom,wasAtLeft,wasAtRight])}updateVerticalArrows(b,isAtBottom);pane.css('top',destTop);f.trigger('jsp-scroll-y',[-destTop,b,isAtBottom]).trigger('scroll')}function positionDragX(a,b){if(!isScrollableH){return}if(a<0){a=0}else if(a>dragMaxX){a=dragMaxX}if(b===j){b=g.animateScroll}if(b){jsp.animate(horizontalDrag,'left',a,_positionDragX)}else{horizontalDrag.css('left',a);_positionDragX(a)}}function _positionDragX(a){if(a===j){a=horizontalDrag.position().left}container.scrollTop(0);horizontalDragPosition=a;var b=horizontalDragPosition===0,isAtRight=horizontalDragPosition==dragMaxX,percentScrolled=a/dragMaxX,destLeft=-percentScrolled*(contentWidth-paneWidth);if(wasAtLeft!=b||wasAtRight!=isAtRight){wasAtLeft=b;wasAtRight=isAtRight;f.trigger('jsp-arrow-change',[wasAtTop,wasAtBottom,wasAtLeft,wasAtRight])}updateHorizontalArrows(b,isAtRight);pane.css('left',destLeft);f.trigger('jsp-scroll-x',[-destLeft,b,isAtRight]).trigger('scroll')}function updateVerticalArrows(a,b){if(g.showArrows){arrowUp[a?'addClass':'removeClass']('jspDisabled');arrowDown[b?'addClass':'removeClass']('jspDisabled')}}function updateHorizontalArrows(a,b){if(g.showArrows){arrowLeft[a?'addClass':'removeClass']('jspDisabled');arrowRight[b?'addClass':'removeClass']('jspDisabled')}}function scrollToY(a,b){var c=a/(contentHeight-paneHeight);positionDragY(c*dragMaxY,b)}function scrollToX(a,b){var c=a/(contentWidth-paneWidth);positionDragX(c*dragMaxX,b)}function scrollToElement(a,b,c){var e,eleHeight,eleWidth,eleTop=0,eleLeft=0,viewportTop,viewportLeft,maxVisibleEleTop,maxVisibleEleLeft,destY,destX;try{e=$(a)}catch(err){return}eleHeight=e.outerHeight();eleWidth=e.outerWidth();container.scrollTop(0);container.scrollLeft(0);while(!e.is('.jspPane')){eleTop+=e.position().top;eleLeft+=e.position().left;e=e.offsetParent();if(/^body|html$/i.test(e[0].nodeName)){return}}viewportTop=contentPositionY();maxVisibleEleTop=viewportTop+paneHeight;if(eleTop<viewportTop||b){destY=eleTop-g.verticalGutter}else if(eleTop+eleHeight>maxVisibleEleTop){destY=eleTop-paneHeight+eleHeight+g.verticalGutter}if(destY){scrollToY(destY,c)}viewportLeft=contentPositionX();maxVisibleEleLeft=viewportLeft+paneWidth;if(eleLeft<viewportLeft||b){destX=eleLeft-g.horizontalGutter}else if(eleLeft+eleWidth>maxVisibleEleLeft){destX=eleLeft-paneWidth+eleWidth+g.horizontalGutter}if(destX){scrollToX(destX,c)}}function contentPositionX(){return-pane.position().left}function contentPositionY(){return-pane.position().top}function isCloseToBottom(){var a=contentHeight-paneHeight;return(a>20)&&(a-contentPositionY()<10)}function isCloseToRight(){var a=contentWidth-paneWidth;return(a>20)&&(a-contentPositionX()<10)}function initMousewheel(){container.unbind(mwEvent).bind(mwEvent,function(a,b,c,d){var e=horizontalDragPosition,dY=verticalDragPosition;jsp.scrollBy(c*g.mouseWheelSpeed,-d*g.mouseWheelSpeed,false);return e==horizontalDragPosition&&dY==verticalDragPosition})}function removeMousewheel(){container.unbind(mwEvent)}function nil(){return false}function initFocusHandler(){pane.find(':input,a').unbind('focus.jsp').bind('focus.jsp',function(e){scrollToElement(e.target,false)})}function removeFocusHandler(){pane.find(':input,a').unbind('focus.jsp')}function initKeyboardNav(){var b,elementHasScrolled,validParents=[];isScrollableH&&validParents.push(horizontalBar[0]);isScrollableV&&validParents.push(verticalBar[0]);pane.focus(function(){f.focus()});f.attr('tabindex',0).unbind('keydown.jsp keypress.jsp').bind('keydown.jsp',function(e){if(e.target!==this&&!(validParents.length&&$(e.target).closest(validParents).length)){return}var a=horizontalDragPosition,dY=verticalDragPosition;switch(e.keyCode){case 40:case 38:case 34:case 32:case 33:case 39:case 37:b=e.keyCode;keyDownHandler();break;case 35:scrollToY(contentHeight-paneHeight);b=null;break;case 36:scrollToY(0);b=null;break}elementHasScrolled=e.keyCode==b&&a!=horizontalDragPosition||dY!=verticalDragPosition;return!elementHasScrolled}).bind('keypress.jsp',function(e){if(e.keyCode==b){keyDownHandler()}return!elementHasScrolled});if(g.hideFocus){f.css('outline','none');if('hideFocus'in container[0]){f.attr('hideFocus',true)}}else{f.css('outline','');if('hideFocus'in container[0]){f.attr('hideFocus',false)}}function keyDownHandler(){var a=horizontalDragPosition,dY=verticalDragPosition;switch(b){case 40:jsp.scrollByY(g.keyboardSpeed,false);break;case 38:jsp.scrollByY(-g.keyboardSpeed,false);break;case 34:case 32:jsp.scrollByY(paneHeight*g.scrollPagePercent,false);break;case 33:jsp.scrollByY(-paneHeight*g.scrollPagePercent,false);break;case 39:jsp.scrollByX(g.keyboardSpeed,false);break;case 37:jsp.scrollByX(-g.keyboardSpeed,false);break}elementHasScrolled=a!=horizontalDragPosition||dY!=verticalDragPosition;return elementHasScrolled}}function removeKeyboardNav(){f.attr('tabindex','-1').removeAttr('tabindex').unbind('keydown.jsp keypress.jsp')}function observeHash(){if(location.hash&&location.hash.length>1){var e,retryInt,hash=escape(location.hash.substr(1));try{e=$('#'+hash+', a[name="'+hash+'"]')}catch(err){return}if(e.length&&pane.find(hash)){if(container.scrollTop()===0){retryInt=setInterval(function(){if(container.scrollTop()>0){scrollToElement(e,true);$(document).scrollTop(container.position().top);clearInterval(retryInt)}},50)}else{scrollToElement(e,true);$(document).scrollTop(container.position().top)}}}}function hijackInternalLinks(){if($(document.body).data('jspHijack')){return}$(document.body).data('jspHijack',true);$(document.body).delegate('a[href*=#]','click',function(a){var b=this.href.substr(0,this.href.indexOf('#')),locationHref=location.href,hash,element,container,jsp,scrollTop,elementTop;if(location.href.indexOf('#')!==-1){locationHref=location.href.substr(0,location.href.indexOf('#'))}if(b!==locationHref){return}hash=escape(this.href.substr(this.href.indexOf('#')+1));element;try{element=$('#'+hash+', a[name="'+hash+'"]')}catch(e){return}if(!element.length){return}container=element.closest('.jspScrollable');jsp=container.data('jsp');jsp.scrollToElement(element,true);if(container[0].scrollIntoView){scrollTop=$(i).scrollTop();elementTop=element.offset().top;if(elementTop<scrollTop||elementTop>scrollTop+$(i).height()){container[0].scrollIntoView()}}a.preventDefault()})}function initTouch(){var c,startY,touchStartX,touchStartY,moved,moving=false;container.unbind('touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick').bind('touchstart.jsp',function(e){var a=e.originalEvent.touches[0];c=contentPositionX();startY=contentPositionY();touchStartX=a.pageX;touchStartY=a.pageY;moved=false;moving=true}).bind('touchmove.jsp',function(a){if(!moving){return}var b=a.originalEvent.touches[0],dX=horizontalDragPosition,dY=verticalDragPosition;jsp.scrollTo(c+touchStartX-b.pageX,startY+touchStartY-b.pageY);moved=moved||Math.abs(touchStartX-b.pageX)>5||Math.abs(touchStartY-b.pageY)>5;return dX==horizontalDragPosition&&dY==verticalDragPosition}).bind('touchend.jsp',function(e){moving=false}).bind('click.jsp-touchclick',function(e){if(moved){moved=false;return false}})}function destroy(){var a=contentPositionY(),currentX=contentPositionX();f.removeClass('jspScrollable').unbind('.jsp');f.replaceWith(originalElement.append(pane.children()));originalElement.scrollTop(a);originalElement.scrollLeft(currentX);if(reinitialiseInterval){clearInterval(reinitialiseInterval)}}$.extend(jsp,{reinitialise:function(s){s=$.extend({},g,s);initialise(s)},scrollToElement:function(a,b,c){scrollToElement(a,b,c)},scrollTo:function(a,b,c){scrollToX(a,c);scrollToY(b,c)},scrollToX:function(a,b){scrollToX(a,b)},scrollToY:function(a,b){scrollToY(a,b)},scrollToPercentX:function(a,b){scrollToX(a*(contentWidth-paneWidth),b)},scrollToPercentY:function(a,b){scrollToY(a*(contentHeight-paneHeight),b)},scrollBy:function(a,b,c){jsp.scrollByX(a,c);jsp.scrollByY(b,c)},scrollByX:function(a,b){var c=contentPositionX()+Math[a<0?'floor':'ceil'](a),percentScrolled=c/(contentWidth-paneWidth);positionDragX(percentScrolled*dragMaxX,b)},scrollByY:function(a,b){var c=contentPositionY()+Math[a<0?'floor':'ceil'](a),percentScrolled=c/(contentHeight-paneHeight);positionDragY(percentScrolled*dragMaxY,b)},positionDragX:function(x,a){positionDragX(x,a)},positionDragY:function(y,a){positionDragY(y,a)},animate:function(a,b,c,d){var e={};e[b]=c;a.animate(e,{'duration':g.animateDuration,'easing':g.animateEase,'queue':false,'step':d})},getContentPositionX:function(){return contentPositionX()},getContentPositionY:function(){return contentPositionY()},getContentWidth:function(){return contentWidth},getContentHeight:function(){return contentHeight},getPercentScrolledX:function(){return contentPositionX()/(contentWidth-paneWidth)},getPercentScrolledY:function(){return contentPositionY()/(contentHeight-paneHeight)},getIsScrollableH:function(){return isScrollableH},getIsScrollableV:function(){return isScrollableV},getContentPane:function(){return pane},scrollToBottom:function(a){positionDragY(dragMaxY,a)},hijackInternalLinks:$.noop,destroy:function(){destroy()}});initialise(s)}h=$.extend({},$.fn.jScrollPane.defaults,h);$.each(['mouseWheelSpeed','arrowButtonSpeed','trackClickSpeed','keyboardSpeed'],function(){h[this]=h[this]||h.speed});return this.each(function(){var a=$(this),jspApi=a.data('jsp');if(jspApi){jspApi.reinitialise(h)}else{jspApi=new JScrollPane(a,h);a.data('jsp',jspApi)}})};$.fn.jScrollPane.defaults={showArrows:false,maintainPosition:true,stickToBottom:false,stickToRight:false,clickOnTrack:true,autoReinitialise:false,autoReinitialiseDelay:500,verticalDragMinHeight:0,verticalDragMaxHeight:99999,horizontalDragMinWidth:0,horizontalDragMaxWidth:99999,contentWidth:j,animateScroll:false,animateDuration:300,animateEase:'linear',hijackInternalLinks:false,verticalGutter:4,horizontalGutter:4,mouseWheelSpeed:0,arrowButtonSpeed:0,arrowRepeatFreq:50,arrowScrollOnHover:false,trackClickSpeed:0,trackClickRepeatFreq:70,verticalArrowPositions:'split',horizontalArrowPositions:'split',enableKeyboardNavigation:true,hideFocus:false,keyboardSpeed:0,initialDelay:300,speed:30,scrollPagePercent:.8}})(jQuery,this);

// Mouse Wheel
(function($){var c=['DOMMouseScroll','mousewheel'];if($.event.fixHooks){for(var i=c.length;i;){$.event.fixHooks[c[--i]]=$.event.mouseHooks}}$.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var i=c.length;i;){this.addEventListener(c[--i],handler,false)}}else{this.onmousewheel=handler}},teardown:function(){if(this.removeEventListener){for(var i=c.length;i;){this.removeEventListener(c[--i],handler,false)}}else{this.onmousewheel=null}}};$.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}});function handler(a){var b=a||window.event,args=[].slice.call(arguments,1),delta=0,returnValue=true,deltaX=0,deltaY=0;a=$.event.fix(b);a.type="mousewheel";if(b.wheelDelta){delta=b.wheelDelta/120}if(b.detail){delta=-b.detail/3}deltaY=delta;if(b.axis!==undefined&&b.axis===b.HORIZONTAL_AXIS){deltaY=0;deltaX=-1*delta}if(b.wheelDeltaY!==undefined){deltaY=b.wheelDeltaY/120}if(b.wheelDeltaX!==undefined){deltaX=-1*b.wheelDeltaX/120}args.unshift(a,delta,deltaX,deltaY);return($.event.dispatch||$.event.handle).apply(this,args)}})(jQuery);

// SWFObject v2.2
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+encodeURI(O.location).toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();

$.fn.setData = function(obj){
	if (typeof obj != "object") return this;
	return this.each(function(){
		for (key in obj) {
			$(this).data(key, obj[key]);
		}
	});
};

$.fn.center = function(){
	var w = $(window);
	return this.each(function(){
		$(this).css("position","absolute");
		$(this).css("top",((w.height() - $(this).outerHeight()) / 2) + w.scrollTop() + "px");
		$(this).css("left",((w.width() - $(this).outerWidth()) / 2) + w.scrollLeft() + "px");
	});
};

Object.toType = (function toType(global){
	return function(obj){
		if (obj === global) return "global";
		return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
	}
})(this);

function sls(){
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

function getRandomInt(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getHash(){ return decodeURIComponent(window.location.hash.substring(1)); }
function clearHash(){ window.location.replace("#"); }
function setHash(hash){ window.location.replace("#" + encodeURI(hash)); }

Array.prototype.diff = function(a){ return this.filter(function(i){return!(a.indexOf(i)>-1)}); };
Array.prototype.random = function(){ return this[getRandomInt(0,this.length-1)]; };

window.keys = {
BACKSPACE: 8,
DOWN_ARROW: 40,
DOWN_ARROW2: 63233,
END: 35,
END2: 63275,
ENTER: 13,
ESCAPE: 27,
HOME: 36,
HOME2: 63273,
LEFT_ARROW: 37,
LEFT_ARROW2: 63234,
NEXT: 176,
NUMPAD_ENTER: 108,
PAGE_DOWN: 34,
PAGE_DOWN2: 63277,
PAGE_UP: 33,
PAGE_UP2: 63276,
PAUSE: 19,
PAUSE2: 63250,
PLAY: 179,
PREV: 177,
RIGHT_ARROW: 39,
RIGHT_ARROW2: 63235,
SPACE: 32,
TAB: 9,
UP_ARROW: 38,
UP_ARROW2: 63232
};

tfObjSort={
	init:function(){
		Array.prototype.objSort=function(){
			tfObjSort.setThings(this);
			var a=arguments;
			var x=tfObjSort;
			x.a=[];x.d=[];
			for(var i=0;i<a.length;i++){
				if(typeof a[i]=="string"){x.a.push(a[i]);x.d.push(1)};
				if(a[i]===-1){x.d[x.d.length-1]=-1}
			}
			return this.sort(tfObjSort.sorter);
		};
		Array.prototype.strSort=function(){
			tfObjSort.setThings(this);
			return this.sort(tfObjSort.charSorter)
		}
	},
	sorter:function(x,y){
		var a=tfObjSort.a
		var d=tfObjSort.d
		var r=0
		for(var i=0;i<a.length;i++){
			if(typeof x+typeof y!="objectobject"){return typeof x=="object"?-1:1};
			var m=x[a[i]]; var n=y[a[i]];
			var t=typeof m+typeof n;
			if(t=="booleanboolean"){m*=-1;n*=-1}
			else if(t.split("string").join("").split("number").join("")!=""){continue};
			r=m-n;
			if(isNaN(r)){r=tfObjSort.charSorter(m,n)};
			if(r!=0){return r*d[i]}
		}
		return r
	},
	charSorter:function(x,y){
		if(tfObjSort.ignoreCase){x=x.toLowerCase();y=y.toLowerCase()};
		var s=tfObjSort.chars;
		if(!s){return x>y?1:x<y?-1:0};
		x=x.split("");y=y.split("");l=x.length>y.length?y.length:x.length;
		var p=0;
		for(var i=0;i<l;i++){
			p=s.indexOf(x[i])-s.indexOf(y[i]);
			if(p!=0){break};
		};
		if(p==0){p=x.length-y.length};
		return p
	},
	setThings:function(x){
		this.ignoreCase=x.sortIgnoreCase;
		var s=x.sortCharOrder;
		if(!s){this.chars=false;return true};
		if(!s.sort){s=s.split(",")};
		var a="";
		for(var i=1;i<1024;i++){a+=String.fromCharCode(i)};
		for(var i=0;i<s.length;i++){
			z=s[i].split("");
			var m=z[0]; var n=z[1]; var o="";
			if(z[2]=="_"){o=n+m} else {o=m+n};
			a=a.split(m).join("").split(n).join(o);
		};
		this.chars=a
	}
};
tfObjSort.init();

yt={
	ps: {
		unstarted: -1,
		ended: 0,
		playing: 1,
		paused: 2,
		buffering: 3,
		cued: 5
	},
	size: {
		small: {h:240,w:320},
		medium: {h:360,w:640},
		large: {h:480,w:853},
		hd720: {h:720,w:1280},
		hd1080: {h:1080,w:1920}
	},
	devkey: "AI39si6-KJa9GUrvoNKGEh0rZWfJ2yFrPOxIN79Svnz9zAhosYHrbZfpADwJhd3v6TNl9DbvTtUS_deOcoNCodgvTqq3kxcflw",
	setQuality: function(a){if (ytplayer) ytplayer.setPlaybackQuality(a)},
	loadVideo: function(a){if (ytplayer) ytplayer.loadVideoById(a,aC.playbackQuality)},
	cueVideo: function(a){if (ytplayer) ytplayer.cueVideoById(a,aC.playbackQuality)},
	playVideo: function(){if (ytplayer) ytplayer.playVideo()},
	pauseVideo: function(){if (ytplayer) ytplayer.pauseVideo()},
	stopVideo: function(){if (ytplayer) ytplayer.stopVideo()},
	setVolume: function(v){if (ytplayer) ytplayer.setVolume(v)},
	getDuration: function(){if (ytplayer) return ytplayer.getDuration()},
	getCurrentTime: function(){if (ytplayer) return ytplayer.getCurrentTime()},
	setSize: function(w,h){if (ytplayer) return ytplayer.setSize(w,h)},
	seekTo: function(s){if (ytplayer) return ytplayer.seekTo(s,false)}
};