/**
 * modalEffects.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 * 
 * 
 * 
 */
(function (window) {

	'use strict';
  
	// class helper functions from bonzo https://github.com/ded/bonzo
  
	function classReg(className) {
	  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}
  
	// classList support for class management
	// altho to be fair, the api sucks because it won't accept multiple classes at once
	var hasClass, addClass, removeClass;
  
	if ('classList' in document.documentElement) {
	  hasClass = function (elem, c) {
		return elem.classList.contains(c);
	  };
	  addClass = function (elem, c) {
		elem.classList.add(c);
	  };
	  removeClass = function (elem, c) {
		elem.classList.remove(c);
	  };
	}
	else {
	  hasClass = function (elem, c) {
		return classReg(c).test(elem.className);
	  };
	  addClass = function (elem, c) {
		if (!hasClass(elem, c)) {
		  elem.className = elem.className + ' ' + c;
		}
	  };
	  removeClass = function (elem, c) {
		elem.className = elem.className.replace(classReg(c), ' ');
	  };
	}
  
	function toggleClass(elem, c) {
	  var fn = hasClass(elem, c) ? removeClass : addClass;
	  fn(elem, c);
	}
  
	var classie = {
	  // full names
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass,
	  toggleClass: toggleClass,
	  // short names
	  has: hasClass,
	  add: addClass,
	  remove: removeClass,
	  toggle: toggleClass
	};
  
	// transport
	if (typeof define === 'function' && define.amd) {
	  // AMD
	  define(classie);
	} else {
	  // browser global
	  window.classie = classie;
	}
  
  })(window);


  function getAppInfo(appUrl, iconPicture, platform, leftMarginPercent = "0%"){ 
	  var myvar = '<section style="display:block; overflow: hidden;  padding:5px; width: 150px; margin-left: '+ leftMarginPercent +';">'+
  '                        <div style="width: 150px;  ">'+
  '                            <a href=" '+ appUrl  + '" target="_blank">'+
  '                                <img style="margin:auto; height: 100px;"'+
  '                                    src=" '+ iconPicture +'">'+
  '                                <h1 style="color: white; vertical-align: center; text-align: center; margin-top: 5px;"> '+platform+'</h1>'+
  '                            </a>'+
  '                        </div>'+
  '                    </section>';
  return myvar;
}
	  
  

var ModalEffects = (function() {

	function init() {

		var overlay = document.querySelector( '.md-overlay' );

		[].slice.call( document.querySelectorAll( '.md-trigger' ) ).forEach( function( el, i )
		 {

			var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) ),
				close = modal.querySelector( '.md-close' );

			function removeModal( hasPerspective )
			 {
				classie.remove( modal, 'md-show' );

				if( hasPerspective )
				 {
					classie.remove( document.documentElement, 'md-perspective' );
				}
			}

			function removeModalHandler() 
			{
				removeModal( classie.has( el, 'md-setperspective' ) ); 
			}

			el.addEventListener( 'click', function( ev )
			 {
				classie.add( modal, 'md-show' );
				var aElem = el;
				var blur = document.getElementById("containerBlurId");
				blur.classList.add("containerBlurStyle");
				

				var jsonData = this.getAttribute('data-platform');
				var json = JSON.parse(jsonData);
				var index = 0;
				var appList = "";
				for(var p in json){
					var app = (json[index]);
					var pic = "";
					var url = app.Store;
					if(url.startsWith("https://www.microsoft.com")){
						pic = "https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg";
					    appList += getAppInfo(url, pic, "Windows");
					}
					else if(url.startsWith("https://play.google.com/store/apps/details")){
					    pic = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Android_robot.svg/1200px-Android_robot.svg.png";
						appList += getAppInfo(url, pic, "Android");
					}
					
					index++;
				}

				var appContainer = document.getElementById("appContainer");
                appContainer.innerHTML = appList;

				overlay.removeEventListener( 'click', removeModalHandler );
				overlay.addEventListener( 'click', removeModalHandler );

				if( classie.has( el, 'md-setperspective' ) ) 
				{
					setTimeout( function() {
						classie.add( document.documentElement, 'md-perspective' );
					}, 25 );
				}
			});

			close.addEventListener( 'click', function( ev )
			 {
				ev.stopPropagation();
				removeModalHandler();
				var aElem = document.getElementById("a1");
				var blur = document.getElementById("containerBlurId");
				blur.classList.remove("containerBlurStyle");
			});

		} );

	}

	init();

})();