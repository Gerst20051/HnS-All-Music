(function($,i,j){$.fn.jScrollPane=function(h){function JScrollPane(f,s){var g,jsp=this,pane,paneWidth,paneHeight,container,contentWidth,contentHeight,percentInViewH,percentInViewV,isScrollableV,isScrollableH,verticalDrag,dragMaxY,verticalDragPosition,horizontalDrag,dragMaxX,horizontalDragPosition,verticalBar,verticalTrack,scrollbarWidth,verticalTrackHeight,verticalDragHeight,arrowUp,arrowDown,horizontalBar,horizontalTrack,horizontalTrackWidth,horizontalDragWidth,arrowLeft,arrowRight,reinitialiseInterval,originalPadding,originalPaddingTotalWidth,previousContentWidth,wasAtTop=true,wasAtLeft=true,wasAtBottom=false,wasAtRight=false,originalElement=f.clone(false,false).empty(),mwEvent=$.fn.mwheelIntent?'mwheelIntent.jsp':'mousewheel.jsp';originalPadding=f.css('paddingTop')+' '+f.css('paddingRight')+' '+f.css('paddingBottom')+' '+f.css('paddingLeft');originalPaddingTotalWidth=(parseInt(f.css('paddingLeft'),10)||0)+(parseInt(f.css('paddingRight'),10)||0);function initialise(s){var a,lastContentX,lastContentY,hasContainingSpaceChanged,originalScrollTop,originalScrollLeft,maintainAtBottom=false,maintainAtRight=false;g=s;if(pane===j){originalScrollTop=f.scrollTop();originalScrollLeft=f.scrollLeft();f.css({overflow:'hidden',padding:0});paneWidth=f.innerWidth()+originalPaddingTotalWidth;paneHeight=f.innerHeight();f.width(paneWidth);pane=$('<div class="jspPane" />').css('padding',originalPadding).append(f.children());container=$('<div class="jspContainer" />').css({'width':paneWidth+'px','height':paneHeight+'px'}).append(pane).appendTo(f)}else{f.css('width','');maintainAtBottom=g.stickToBottom&&isCloseToBottom();maintainAtRight=g.stickToRight&&isCloseToRight();hasContainingSpaceChanged=f.innerWidth()+originalPaddingTotalWidth!=paneWidth||f.outerHeight()!=paneHeight;if(hasContainingSpaceChanged){paneWidth=f.innerWidth()+originalPaddingTotalWidth;paneHeight=f.innerHeight();container.css({width:paneWidth+'px',height:paneHeight+'px'})}if(!hasContainingSpaceChanged&&previousContentWidth==contentWidth&&pane.outerHeight()==contentHeight){f.width(paneWidth);return}previousContentWidth=contentWidth;pane.css('width','');f.width(paneWidth);container.find('>.jspVerticalBar,>.jspHorizontalBar').remove().end()}pane.css('overflow','auto');if(s.contentWidth){contentWidth=s.contentWidth}else{contentWidth=pane[0].scrollWidth}contentHeight=pane[0].scrollHeight;pane.css('overflow','');percentInViewH=contentWidth/paneWidth;percentInViewV=contentHeight/paneHeight;isScrollableV=percentInViewV>1;isScrollableH=percentInViewH>1;if(!(isScrollableH||isScrollableV)){f.removeClass('jspScrollable');pane.css({top:0,width:container.width()-originalPaddingTotalWidth});removeMousewheel();removeFocusHandler();removeKeyboardNav();removeClickOnTrack()}else{f.addClass('jspScrollable');a=g.maintainPosition&&(verticalDragPosition||horizontalDragPosition);if(a){lastContentX=contentPositionX();lastContentY=contentPositionY()}initialiseVerticalScroll();initialiseHorizontalScroll();resizeScrollbars();if(a){scrollToX(maintainAtRight?(contentWidth-paneWidth):lastContentX,false);scrollToY(maintainAtBottom?(contentHeight-paneHeight):lastContentY,false)}initFocusHandler();initMousewheel();initTouch();if(g.enableKeyboardNavigation){initKeyboardNav()}if(g.clickOnTrack){initClickOnTrack()}observeHash();if(g.hijackInternalLinks){hijackInternalLinks()}}if(g.autoReinitialise&&!reinitialiseInterval){reinitialiseInterval=setInterval(function(){initialise(g)},g.autoReinitialiseDelay)}else if(!g.autoReinitialise&&reinitialiseInterval){clearInterval(reinitialiseInterval)}originalScrollTop&&f.scrollTop(0)&&scrollToY(originalScrollTop,false);originalScrollLeft&&f.scrollLeft(0)&&scrollToX(originalScrollLeft,false);f.trigger('jsp-initialised',[isScrollableH||isScrollableV])}function initialiseVerticalScroll(){if(isScrollableV){container.append($('<div class="jspVerticalBar" />').append($('<div class="jspCap jspCapTop" />'),$('<div class="jspTrack" />').append($('<div class="jspDrag" />').append($('<div class="jspDragTop" />'),$('<div class="jspDragBottom" />'))),$('<div class="jspCap jspCapBottom" />')));verticalBar=container.find('>.jspVerticalBar');verticalTrack=verticalBar.find('>.jspTrack');verticalDrag=verticalTrack.find('>.jspDrag');if(g.showArrows){arrowUp=$('<a class="jspArrow jspArrowUp" />').bind('mousedown.jsp',getArrowScroll(0,-1)).bind('click.jsp',nil);arrowDown=$('<a class="jspArrow jspArrowDown" />').bind('mousedown.jsp',getArrowScroll(0,1)).bind('click.jsp',nil);if(g.arrowScrollOnHover){arrowUp.bind('mouseover.jsp',getArrowScroll(0,-1,arrowUp));arrowDown.bind('mouseover.jsp',getArrowScroll(0,1,arrowDown))}appendArrows(verticalTrack,g.verticalArrowPositions,arrowUp,arrowDown)}verticalTrackHeight=paneHeight;container.find('>.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow').each(function(){verticalTrackHeight-=$(this).outerHeight()});verticalDrag.hover(function(){verticalDrag.addClass('jspHover')},function(){verticalDrag.removeClass('jspHover')}).bind('mousedown.jsp',function(e){$('html').bind('dragstart.jsp selectstart.jsp',nil);verticalDrag.addClass('jspActive');var a=e.pageY-verticalDrag.position().top;$('html').bind('mousemove.jsp',function(e){positionDragY(e.pageY-a,false)}).bind('mouseup.jsp mouseleave.jsp',cancelDrag);return false});sizeVerticalScrollbar()}}function sizeVerticalScrollbar(){verticalTrack.height(verticalTrackHeight+'px');verticalDragPosition=0;scrollbarWidth=g.verticalGutter+verticalTrack.outerWidth();pane.width(paneWidth-scrollbarWidth-originalPaddingTotalWidth);try{if(verticalBar.position().left===0){pane.css('margin-left',scrollbarWidth+'px')}}catch(err){}}function initialiseHorizontalScroll(){if(isScrollableH){container.append($('<div class="jspHorizontalBar" />').append($('<div class="jspCap jspCapLeft" />'),$('<div class="jspTrack" />').append($('<div class="jspDrag" />').append($('<div class="jspDragLeft" />'),$('<div class="jspDragRight" />'))),$('<div class="jspCap jspCapRight" />')));horizontalBar=container.find('>.jspHorizontalBar');horizontalTrack=horizontalBar.find('>.jspTrack');horizontalDrag=horizontalTrack.find('>.jspDrag');if(g.showArrows){arrowLeft=$('<a class="jspArrow jspArrowLeft" />').bind('mousedown.jsp',getArrowScroll(-1,0)).bind('click.jsp',nil);arrowRight=$('<a class="jspArrow jspArrowRight" />').bind('mousedown.jsp',getArrowScroll(1,0)).bind('click.jsp',nil);if(g.arrowScrollOnHover){arrowLeft.bind('mouseover.jsp',getArrowScroll(-1,0,arrowLeft));arrowRight.bind('mouseover.jsp',getArrowScroll(1,0,arrowRight))}appendArrows(horizontalTrack,g.horizontalArrowPositions,arrowLeft,arrowRight)}horizontalDrag.hover(function(){horizontalDrag.addClass('jspHover')},function(){horizontalDrag.removeClass('jspHover')}).bind('mousedown.jsp',function(e){$('html').bind('dragstart.jsp selectstart.jsp',nil);horizontalDrag.addClass('jspActive');var a=e.pageX-horizontalDrag.position().left;$('html').bind('mousemove.jsp',function(e){positionDragX(e.pageX-a,false)}).bind('mouseup.jsp mouseleave.jsp',cancelDrag);return false});horizontalTrackWidth=container.innerWidth();sizeHorizontalScrollbar()}}function sizeHorizontalScrollbar(){container.find('>.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow').each(function(){horizontalTrackWidth-=$(this).outerWidth()});horizontalTrack.width(horizontalTrackWidth+'px');horizontalDragPosition=0}function resizeScrollbars(){if(isScrollableH&&isScrollableV){var a=horizontalTrack.outerHeight(),verticalTrackWidth=verticalTrack.outerWidth();verticalTrackHeight-=a;$(horizontalBar).find('>.jspCap:visible,>.jspArrow').each(function(){horizontalTrackWidth+=$(this).outerWidth()});horizontalTrackWidth-=verticalTrackWidth;paneHeight-=verticalTrackWidth;paneWidth-=a;horizontalTrack.parent().append($('<div class="jspCorner" />').css('width',a+'px'));sizeVerticalScrollbar();sizeHorizontalScrollbar()}if(isScrollableH){pane.width((container.outerWidth()-originalPaddingTotalWidth)+'px')}contentHeight=pane.outerHeight();percentInViewV=contentHeight/paneHeight;if(isScrollableH){horizontalDragWidth=Math.ceil(1/percentInViewH*horizontalTrackWidth);if(horizontalDragWidth>g.horizontalDragMaxWidth){horizontalDragWidth=g.horizontalDragMaxWidth}else if(horizontalDragWidth<g.horizontalDragMinWidth){horizontalDragWidth=g.horizontalDragMinWidth}horizontalDrag.width(horizontalDragWidth+'px');dragMaxX=horizontalTrackWidth-horizontalDragWidth;_positionDragX(horizontalDragPosition)}if(isScrollableV){verticalDragHeight=Math.ceil(1/percentInViewV*verticalTrackHeight);if(verticalDragHeight>g.verticalDragMaxHeight){verticalDragHeight=g.verticalDragMaxHeight}else if(verticalDragHeight<g.verticalDragMinHeight){verticalDragHeight=g.verticalDragMinHeight}verticalDrag.height(verticalDragHeight+'px');dragMaxY=verticalTrackHeight-verticalDragHeight;_positionDragY(verticalDragPosition)}}function appendArrows(a,p,b,c){var d="before",p2="after",aTemp;if(p=="os"){p=/Mac/.test(navigator.platform)?"after":"split"}if(p==d){p2=p}else if(p==p2){d=p;aTemp=b;b=c;c=aTemp}a[d](b)[p2](c)}function getArrowScroll(a,b,c){return function(){arrowScroll(a,b,this,c);this.blur();return false}}function arrowScroll(a,b,c,d){c=$(c).addClass('jspActive');var e,scrollTimeout,isFirst=true,doScroll=function(){if(a!==0){jsp.scrollByX(a*g.arrowButtonSpeed)}if(b!==0){jsp.scrollByY(b*g.arrowButtonSpeed)}scrollTimeout=setTimeout(doScroll,isFirst?g.initialDelay:g.arrowRepeatFreq);isFirst=false};doScroll();e=d?'mouseout.jsp':'mouseup.jsp';d=d||$('html');d.bind(e,function(){c.removeClass('jspActive');scrollTimeout&&clearTimeout(scrollTimeout);scrollTimeout=null;d.unbind(e)})}function initClickOnTrack(){removeClickOnTrack();if(isScrollableV){verticalTrack.bind('mousedown.jsp',function(e){if(e.originalTarget===j||e.originalTarget==e.currentTarget){var b=$(this),offset=b.offset(),direction=e.pageY-offset.top-verticalDragPosition,scrollTimeout,isFirst=true,doScroll=function(){var a=b.offset(),pos=e.pageY-a.top-verticalDragHeight/2,contentDragY=paneHeight*g.scrollPagePercent,dragY=dragMaxY*contentDragY/(contentHeight-paneHeight);if(direction<0){if(verticalDragPosition-dragY>pos){jsp.scrollByY(-contentDragY)}else{positionDragY(pos)}}else if(direction>0){if(verticalDragPosition+dragY<pos){jsp.scrollByY(contentDragY)}else{positionDragY(pos)}}else{cancelClick();return}scrollTimeout=setTimeout(doScroll,isFirst?g.initialDelay:g.trackClickRepeatFreq);isFirst=false},cancelClick=function(){scrollTimeout&&clearTimeout(scrollTimeout);scrollTimeout=null;$(document).unbind('mouseup.jsp',cancelClick)};doScroll();$(document).bind('mouseup.jsp',cancelClick);return false}})}if(isScrollableH){horizontalTrack.bind('mousedown.jsp',function(e){if(e.originalTarget===j||e.originalTarget==e.currentTarget){var b=$(this),offset=b.offset(),direction=e.pageX-offset.left-horizontalDragPosition,scrollTimeout,isFirst=true,doScroll=function(){var a=b.offset(),pos=e.pageX-a.left-horizontalDragWidth/2,contentDragX=paneWidth*g.scrollPagePercent,dragX=dragMaxX*contentDragX/(contentWidth-paneWidth);if(direction<0){if(horizontalDragPosition-dragX>pos){jsp.scrollByX(-contentDragX)}else{positionDragX(pos)}}else if(direction>0){if(horizontalDragPosition+dragX<pos){jsp.scrollByX(contentDragX)}else{positionDragX(pos)}}else{cancelClick();return}scrollTimeout=setTimeout(doScroll,isFirst?g.initialDelay:g.trackClickRepeatFreq);isFirst=false},cancelClick=function(){scrollTimeout&&clearTimeout(scrollTimeout);scrollTimeout=null;$(document).unbind('mouseup.jsp',cancelClick)};doScroll();$(document).bind('mouseup.jsp',cancelClick);return false}})}}function removeClickOnTrack(){if(horizontalTrack){horizontalTrack.unbind('mousedown.jsp')}if(verticalTrack){verticalTrack.unbind('mousedown.jsp')}}function cancelDrag(){$('html').unbind('dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp');if(verticalDrag){verticalDrag.removeClass('jspActive')}if(horizontalDrag){horizontalDrag.removeClass('jspActive')}}function positionDragY(a,b){if(!isScrollableV){return}if(a<0){a=0}else if(a>dragMaxY){a=dragMaxY}if(b===j){b=g.animateScroll}if(b){jsp.animate(verticalDrag,'top',a,_positionDragY)}else{verticalDrag.css('top',a);_positionDragY(a)}}function _positionDragY(a){if(a===j){a=verticalDrag.position().top}container.scrollTop(0);verticalDragPosition=a;var b=verticalDragPosition===0,isAtBottom=verticalDragPosition==dragMaxY,percentScrolled=a/dragMaxY,destTop=-percentScrolled*(contentHeight-paneHeight);if(wasAtTop!=b||wasAtBottom!=isAtBottom){wasAtTop=b;wasAtBottom=isAtBottom;f.trigger('jsp-arrow-change',[wasAtTop,wasAtBottom,wasAtLeft,wasAtRight])}updateVerticalArrows(b,isAtBottom);pane.css('top',destTop);f.trigger('jsp-scroll-y',[-destTop,b,isAtBottom]).trigger('scroll')}function positionDragX(a,b){if(!isScrollableH){return}if(a<0){a=0}else if(a>dragMaxX){a=dragMaxX}if(b===j){b=g.animateScroll}if(b){jsp.animate(horizontalDrag,'left',a,_positionDragX)}else{horizontalDrag.css('left',a);_positionDragX(a)}}function _positionDragX(a){if(a===j){a=horizontalDrag.position().left}container.scrollTop(0);horizontalDragPosition=a;var b=horizontalDragPosition===0,isAtRight=horizontalDragPosition==dragMaxX,percentScrolled=a/dragMaxX,destLeft=-percentScrolled*(contentWidth-paneWidth);if(wasAtLeft!=b||wasAtRight!=isAtRight){wasAtLeft=b;wasAtRight=isAtRight;f.trigger('jsp-arrow-change',[wasAtTop,wasAtBottom,wasAtLeft,wasAtRight])}updateHorizontalArrows(b,isAtRight);pane.css('left',destLeft);f.trigger('jsp-scroll-x',[-destLeft,b,isAtRight]).trigger('scroll')}function updateVerticalArrows(a,b){if(g.showArrows){arrowUp[a?'addClass':'removeClass']('jspDisabled');arrowDown[b?'addClass':'removeClass']('jspDisabled')}}function updateHorizontalArrows(a,b){if(g.showArrows){arrowLeft[a?'addClass':'removeClass']('jspDisabled');arrowRight[b?'addClass':'removeClass']('jspDisabled')}}function scrollToY(a,b){var c=a/(contentHeight-paneHeight);positionDragY(c*dragMaxY,b)}function scrollToX(a,b){var c=a/(contentWidth-paneWidth);positionDragX(c*dragMaxX,b)}function scrollToElement(a,b,c){var e,eleHeight,eleWidth,eleTop=0,eleLeft=0,viewportTop,viewportLeft,maxVisibleEleTop,maxVisibleEleLeft,destY,destX;try{e=$(a)}catch(err){return}eleHeight=e.outerHeight();eleWidth=e.outerWidth();container.scrollTop(0);container.scrollLeft(0);while(!e.is('.jspPane')){eleTop+=e.position().top;eleLeft+=e.position().left;e=e.offsetParent();if(/^body|html$/i.test(e[0].nodeName)){return}}viewportTop=contentPositionY();maxVisibleEleTop=viewportTop+paneHeight;if(eleTop<viewportTop||b){destY=eleTop-g.verticalGutter}else if(eleTop+eleHeight>maxVisibleEleTop){destY=eleTop-paneHeight+eleHeight+g.verticalGutter}if(destY){scrollToY(destY,c)}viewportLeft=contentPositionX();maxVisibleEleLeft=viewportLeft+paneWidth;if(eleLeft<viewportLeft||b){destX=eleLeft-g.horizontalGutter}else if(eleLeft+eleWidth>maxVisibleEleLeft){destX=eleLeft-paneWidth+eleWidth+g.horizontalGutter}if(destX){scrollToX(destX,c)}}function contentPositionX(){return-pane.position().left}function contentPositionY(){return-pane.position().top}function isCloseToBottom(){var a=contentHeight-paneHeight;return(a>20)&&(a-contentPositionY()<10)}function isCloseToRight(){var a=contentWidth-paneWidth;return(a>20)&&(a-contentPositionX()<10)}function initMousewheel(){container.unbind(mwEvent).bind(mwEvent,function(a,b,c,d){var e=horizontalDragPosition,dY=verticalDragPosition;jsp.scrollBy(c*g.mouseWheelSpeed,-d*g.mouseWheelSpeed,false);return e==horizontalDragPosition&&dY==verticalDragPosition})}function removeMousewheel(){container.unbind(mwEvent)}function nil(){return false}function initFocusHandler(){pane.find(':input,a').unbind('focus.jsp').bind('focus.jsp',function(e){scrollToElement(e.target,false)})}function removeFocusHandler(){pane.find(':input,a').unbind('focus.jsp')}function initKeyboardNav(){var b,elementHasScrolled,validParents=[];isScrollableH&&validParents.push(horizontalBar[0]);isScrollableV&&validParents.push(verticalBar[0]);pane.focus(function(){f.focus()});f.attr('tabindex',0).unbind('keydown.jsp keypress.jsp').bind('keydown.jsp',function(e){if(e.target!==this&&!(validParents.length&&$(e.target).closest(validParents).length)){return}var a=horizontalDragPosition,dY=verticalDragPosition;switch(e.keyCode){case 40:case 38:case 34:case 32:case 33:case 39:case 37:b=e.keyCode;keyDownHandler();break;case 35:scrollToY(contentHeight-paneHeight);b=null;break;case 36:scrollToY(0);b=null;break}elementHasScrolled=e.keyCode==b&&a!=horizontalDragPosition||dY!=verticalDragPosition;return!elementHasScrolled}).bind('keypress.jsp',function(e){if(e.keyCode==b){keyDownHandler()}return!elementHasScrolled});if(g.hideFocus){f.css('outline','none');if('hideFocus'in container[0]){f.attr('hideFocus',true)}}else{f.css('outline','');if('hideFocus'in container[0]){f.attr('hideFocus',false)}}function keyDownHandler(){var a=horizontalDragPosition,dY=verticalDragPosition;switch(b){case 40:jsp.scrollByY(g.keyboardSpeed,false);break;case 38:jsp.scrollByY(-g.keyboardSpeed,false);break;case 34:case 32:jsp.scrollByY(paneHeight*g.scrollPagePercent,false);break;case 33:jsp.scrollByY(-paneHeight*g.scrollPagePercent,false);break;case 39:jsp.scrollByX(g.keyboardSpeed,false);break;case 37:jsp.scrollByX(-g.keyboardSpeed,false);break}elementHasScrolled=a!=horizontalDragPosition||dY!=verticalDragPosition;return elementHasScrolled}}function removeKeyboardNav(){f.attr('tabindex','-1').removeAttr('tabindex').unbind('keydown.jsp keypress.jsp')}function observeHash(){if(location.hash&&location.hash.length>1){var e,retryInt,hash=escape(location.hash.substr(1));try{e=$('#'+hash+', a[name="'+hash+'"]')}catch(err){return}if(e.length&&pane.find(hash)){if(container.scrollTop()===0){retryInt=setInterval(function(){if(container.scrollTop()>0){scrollToElement(e,true);$(document).scrollTop(container.position().top);clearInterval(retryInt)}},50)}else{scrollToElement(e,true);$(document).scrollTop(container.position().top)}}}}function hijackInternalLinks(){if($(document.body).data('jspHijack')){return}$(document.body).data('jspHijack',true);$(document.body).delegate('a[href*=#]','click',function(a){var b=this.href.substr(0,this.href.indexOf('#')),locationHref=location.href,hash,element,container,jsp,scrollTop,elementTop;if(location.href.indexOf('#')!==-1){locationHref=location.href.substr(0,location.href.indexOf('#'))}if(b!==locationHref){return}hash=escape(this.href.substr(this.href.indexOf('#')+1));element;try{element=$('#'+hash+', a[name="'+hash+'"]')}catch(e){return}if(!element.length){return}container=element.closest('.jspScrollable');jsp=container.data('jsp');jsp.scrollToElement(element,true);if(container[0].scrollIntoView){scrollTop=$(i).scrollTop();elementTop=element.offset().top;if(elementTop<scrollTop||elementTop>scrollTop+$(i).height()){container[0].scrollIntoView()}}a.preventDefault()})}function initTouch(){var c,startY,touchStartX,touchStartY,moved,moving=false;container.unbind('touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick').bind('touchstart.jsp',function(e){var a=e.originalEvent.touches[0];c=contentPositionX();startY=contentPositionY();touchStartX=a.pageX;touchStartY=a.pageY;moved=false;moving=true}).bind('touchmove.jsp',function(a){if(!moving){return}var b=a.originalEvent.touches[0],dX=horizontalDragPosition,dY=verticalDragPosition;jsp.scrollTo(c+touchStartX-b.pageX,startY+touchStartY-b.pageY);moved=moved||Math.abs(touchStartX-b.pageX)>5||Math.abs(touchStartY-b.pageY)>5;return dX==horizontalDragPosition&&dY==verticalDragPosition}).bind('touchend.jsp',function(e){moving=false}).bind('click.jsp-touchclick',function(e){if(moved){moved=false;return false}})}function destroy(){var a=contentPositionY(),currentX=contentPositionX();f.removeClass('jspScrollable').unbind('.jsp');f.replaceWith(originalElement.append(pane.children()));originalElement.scrollTop(a);originalElement.scrollLeft(currentX);if(reinitialiseInterval){clearInterval(reinitialiseInterval)}}$.extend(jsp,{reinitialise:function(s){s=$.extend({},g,s);initialise(s)},scrollToElement:function(a,b,c){scrollToElement(a,b,c)},scrollTo:function(a,b,c){scrollToX(a,c);scrollToY(b,c)},scrollToX:function(a,b){scrollToX(a,b)},scrollToY:function(a,b){scrollToY(a,b)},scrollToPercentX:function(a,b){scrollToX(a*(contentWidth-paneWidth),b)},scrollToPercentY:function(a,b){scrollToY(a*(contentHeight-paneHeight),b)},scrollBy:function(a,b,c){jsp.scrollByX(a,c);jsp.scrollByY(b,c)},scrollByX:function(a,b){var c=contentPositionX()+Math[a<0?'floor':'ceil'](a),percentScrolled=c/(contentWidth-paneWidth);positionDragX(percentScrolled*dragMaxX,b)},scrollByY:function(a,b){var c=contentPositionY()+Math[a<0?'floor':'ceil'](a),percentScrolled=c/(contentHeight-paneHeight);positionDragY(percentScrolled*dragMaxY,b)},positionDragX:function(x,a){positionDragX(x,a)},positionDragY:function(y,a){positionDragY(y,a)},animate:function(a,b,c,d){var e={};e[b]=c;a.animate(e,{'duration':g.animateDuration,'easing':g.animateEase,'queue':false,'step':d})},getContentPositionX:function(){return contentPositionX()},getContentPositionY:function(){return contentPositionY()},getContentWidth:function(){return contentWidth},getContentHeight:function(){return contentHeight},getPercentScrolledX:function(){return contentPositionX()/(contentWidth-paneWidth)},getPercentScrolledY:function(){return contentPositionY()/(contentHeight-paneHeight)},getIsScrollableH:function(){return isScrollableH},getIsScrollableV:function(){return isScrollableV},getContentPane:function(){return pane},scrollToBottom:function(a){positionDragY(dragMaxY,a)},hijackInternalLinks:$.noop,destroy:function(){destroy()}});initialise(s)}h=$.extend({},$.fn.jScrollPane.defaults,h);$.each(['mouseWheelSpeed','arrowButtonSpeed','trackClickSpeed','keyboardSpeed'],function(){h[this]=h[this]||h.speed});return this.each(function(){var a=$(this),jspApi=a.data('jsp');if(jspApi){jspApi.reinitialise(h)}else{jspApi=new JScrollPane(a,h);a.data('jsp',jspApi)}})};$.fn.jScrollPane.defaults={showArrows:false,maintainPosition:true,stickToBottom:false,stickToRight:false,clickOnTrack:true,autoReinitialise:false,autoReinitialiseDelay:500,verticalDragMinHeight:0,verticalDragMaxHeight:99999,horizontalDragMinWidth:0,horizontalDragMaxWidth:99999,contentWidth:j,animateScroll:false,animateDuration:300,animateEase:'linear',hijackInternalLinks:false,verticalGutter:4,horizontalGutter:4,mouseWheelSpeed:0,arrowButtonSpeed:0,arrowRepeatFreq:50,arrowScrollOnHover:false,trackClickSpeed:0,trackClickRepeatFreq:70,verticalArrowPositions:'split',horizontalArrowPositions:'split',enableKeyboardNavigation:true,hideFocus:false,keyboardSpeed:0,initialDelay:300,speed:30,scrollPagePercent:.8}})(jQuery,this);