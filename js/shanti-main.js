(function ($) {

  // *** Common Functions for Shanti Sarvaka ***
  Drupal.ShantiSarvaka = {};

  //** Function to check width of Extruder and resize content accordingly */
  Drupal.ShantiSarvaka.checkWidth = function() {
  var panelWidth = $(".text").width();
    if( panelWidth > 275 ) {
        $(".extruder-content").css("width","100%");
      } else
    if( panelWidth <= 275 ) {
        $(".extruder-content").css("width","100% !important");
      }
  };


  // *** SEARCH *** adapt search panel height to viewport
  Drupal.ShantiSarvaka.searchTabHeight = function() {    
    var height = $(window).height();
    var srchtab = (height) - 88;
    var viewheight = (height) - 216;
    // var advHeight = $(".advanced-view").show().height();
    // var comboHeight = (viewheight) - 370;


    srchtab = parseInt(srchtab) + 'px';
    $("#search-flyout").find(".text").css('height',srchtab);

    viewheight = parseInt(viewheight) + 'px';
    // comboHeight = parseInt(comboHeight) + 'px';
    $(".view-wrap").css('height', viewheight);
    // $(".view-wrap.short-wrap").css('height', comboHeight);
  };

  /**
   *  Settings for the theme
   */
  Drupal.behaviors.shantiSarvaka = {
    attach: function (context, settings) {
    	if(context == document) {
	      // Initialize settings.
	      settings.shanti_sarvaka = $.extend({
	        kmapsUrl: "http://subjects.kmaps.virginia.edu",
	        mmsUrl: "http://mms.thlib.org",
	        placesUrl: "http://places.kmaps.virginia.edu",
	        ftListSelector: "ul.facetapi-mb-solr-facet-tree, ul.fancy-tree", // should change "mb-solr" to "fancy" for universality
	        fancytrees: [],
	        flyoutWidth: 310,
	        topLinkOffset: 420,
	        topLinkDuration: 500,
	      }, settings.shanti_sarvaka || {});

	      $.fn.popover.Constructor.DEFAULTS.trigger = 'hover';
	      $.fn.popover.Constructor.DEFAULTS.placement = 'auto';
	      $.fn.popover.Constructor.DEFAULTS.html = true;
	      $.fn.popover.Constructor.DEFAULTS.delay = { "show": 100, "hide": 60000 };
	      $.fn.popover.Constructor.DEFAULTS.template = '<div class="popover related-resources-popover" role="tooltip"><div class="arrow"></div><h5 class="popover-title"></h5><div class="popover-content"></div></div>';
			}
    }
  };

  /**
   * Back to Top Link functionality
   */
  Drupal.behaviors.shantiSarvakaToplink = {
    attach: function (context, settings) {
    	if(context == document) {
	      var offset = settings.shanti_sarvaka.topLinkOffset;
	      var duration = settings.shanti_sarvaka.topLinkDuration;
	      jQuery(window).scroll(function() {
	        if (jQuery(this).scrollTop() > offset) {
	          jQuery('.back-to-top').fadeIn(duration);
	        } else {
	          jQuery('.back-to-top').fadeOut(duration);
	        }
	      });
	      jQuery('.back-to-top').click(function(event) {
	        event.preventDefault();
	        jQuery('html, body').animate({scrollTop: 0}, duration);
	        return false;
	      });
	    }
    }
  };

  /**
   * ICheck init
   */
  Drupal.behaviors.shantiSarvakaIcheck = {
    attach: function (context, settings) {
      $("input[type='checkbox'], input[type='radio']", context).not($('.jstree input')).once('icheck').each(function () {
        var self = $(this),
        label = self.next('label');
        if(label.length == 1) {
          self = $(this).detach();
          label.prepend(self);
        }
        if(typeof(self.icheck) != "undefined") {
          self.icheck({
            checkboxClass: "icheckbox_minimal-red",
            radioClass: "iradio_minimal-red",
            insert: "<div class='icheck_line-icon'></div>",
            checkedClass: 'checked',
          });
          // In MB /my-content/collections/ Icheck is not show check when clicked fixing this here
          /*$('div.icheck-item').once('icheckfix').on('mousedown', function() {
          	if($(this).hasClass('checked')) {
          		$(this).addClass('rm-icheck');
          		setTimeout(function() { $('.rm-icheck').removeClass('checked rm-icheck'); }, 500);
          	} else {
          		$(this).addClass('checked');
          	}
          });*/
        }
      });
    }
  };

  /**
   * Select Picker
   */
  Drupal.behaviors.shantiSarvakaSelect = {
    attach: function (context, settings) {
      $(".selectpicker:not(#search-flyout .selectpicker)", context).selectpicker({
        dropupAuto: false
      }); // initiates jq-bootstrap-select

    }
  };

  /**
   * Multi Level Push Menu
   */
  Drupal.behaviors.shantiSarvakaMlpMenu = {
    attach: function (context, settings) {
    	if(context == document) {
	      // Rearrange the button divs so that they are in the order blocks are added with a float-right css
	      var buttons = $('div.navbar-buttons ul.navbar-right', context).detach();
	      buttons.each(function() {
	        $('div.navbar-buttons').prepend($(this));
	      });
	      // Initialize the multilevel main menu
	      $( '#menu' ).multilevelpushmenu({
	        menuWidth: 250,
	        menuHeight: '32em', // this height is determined by tallest menu, Preferences
	        mode: 'cover',
	        direction: 'rtl',
	        backItemIcon: 'fa fa-angle-left',
	        groupIcon: 'fa fa-angle-right',
	        collapsed: false,
	        preventItemClick: false,
	      });

	      // --- align the text
	      $('#menu ul>li, #menu h2').css('text-align','left');
	      $('#menu ul>li.levelHolderClass.rtl').css('text-align','right');

	      // --- close the menu on outside click except button
	      $('.menu-toggle').click( function(event){
	          event.stopPropagation();
	          $('#menu').slideToggle(200);
	          $('.menu-toggle').toggleClass('show-topmenu');
	          $('.collections').slideUp(200);
	          $('.menu-exploretoggle').removeClass('show-topmenu');
	       });

	      // --- close the menu on outside click except button
	       $('.menu-exploretoggle').click( function(event){
	           event.stopPropagation();
	           $('.collections').slideToggle(200);
	       });

	      $(document).click( function(){
	          $('.menu-toggle').removeClass('show-topmenu');
	          $('#menu').hide(100);
	      });

	      /* Initialize Language Buttons */

				// Language menu drop down init
				$('#block-locale-language .dropdown-toggle').dropdown();

	      // Language Chooser Functionality with ICheck
	      $('body').on('ifChecked', 'input.optionlang', function() {
	        var newLang = $(this).val().replace('lang:','');
	        var oldLang = Drupal.settings.pathPrefix;
	        var currentPage = window.location.pathname;
	        if(oldLang.length > 0) {
	          // remove any current lang in url (format = "zh/")
	          var currentPage = currentPage.replace(RegExp(oldLang + "?$"), ''); // Take care of home page (no slash at end of line)
	          currentPage = currentPage.replace(oldLang, ''); // All other pages
	          }
	        // Create New URL with new Lang Prefix
	        var newUrl = (Drupal.settings.basePath + newLang + currentPage).replace(/\/\//g, '/');
	        window.location.pathname = newUrl;
	      });
	    }
    }
  };

  /**
   * Responsive Menus with MbExtruder
   */
  Drupal.behaviors.shantiSarvakaRespMenu = {
    attach: function (context, settings) {
      $(".menu-exploretoggle", context).click(function () {
          if($("#menu-collections.extruder").hasClass("isOpened")){
            $(".menu-exploretoggle").removeClass("show-topmenu");
          } else {
            $(".menu-collections").css('display','block');
            $(".menu-collections").addClass("active");
            $(".menu-collections > ul").addClass("in");
            $("#search-flyout").closeMbExtruder();
            $(".menu-exploretoggle").addClass("show-topmenu");
            return false;
          }
      });
    }
  };

  /**
   * Popovers Init
   */
  Drupal.behaviors.shantiSarvakaPopovers = {
    attach: function (context, settings) {

      $('.popover-link', context).each(function() {
        var content = $(this).next('div.popover').html();
        var title = $(this).next('div.popover').attr('data-title');
        $(this).popover({'title': title, 'content': content});
      });
      $('div.popover', context).remove(); // remove hidden popover content once they have all been initialized
      // show.bs called immediately upon click. Hide all other popovers.
      $('.popover-link', context).on('show.bs.popover', function(){
      	$('div.popover').hide();
      });
      // shown.bs is after popup is rendered. Move footer outside of content
      /*
      $('.popover-link').on('shown.bs.popover', function(){
      	var pophtml = $(this).next('div.popover');
      	var popfooter = pophtml.find('.popover-footer').detach();
      	pophtml.find('.popover-content').after(popfooter);
      	popfooter.show();
      });*/
      if(context == document) {
	       // Hide popovers if anything but a popover is clicked
	       $('body').click(function(e) {
	          var target = $(e.target);
	          if(target.parents('div.popover').length == 0 && !target.hasClass('popover')) {
	            $('div.popover').hide();
	          }
	       });
	    }
    }
  };

  /**
   * Miscellaneous Init
   */
  Drupal.behaviors.shantiSarvakaMiscinit = {
    attach: function (context, settings) {
    	if(context == document) {

	      // Shanti-filters title keyword search field: use description for placeholder text
    		$('.shanti-filters .views-exposed-form .form-item input.form-text').each(function() {
    			var desc = $(this).parent().parent().next('.description');
    			$(this).attr({'placeholder': $.trim(desc.text()), 'size':'15'});
    			desc.remove();
    		});

	      // conditional IE message
	      $(".progressive").delay( 2000 ).slideDown( 400 ).delay( 5000 ).slideUp( 400 );
	      
	      // set the sidebar heigth
	      // $('div#sidebar-second').height($('div#sidebar-second').parent().height()); 






	      /* ACCORDION Change collapsible div icon from +/- depending on state
	      $('div.panel-collapse').on('hide.bs.collapse', function () {
	        $(this).prev('div.panel-heading').find('.ss-fieldset-toggle').text('+');
	        $(this).prev('div.panel-heading').find('.ss-fieldset-toggle').removeClass('open');
	      });
	      $('div.panel-collapse').on('show.bs.collapse', function () {
	        $(this).prev('div.panel-heading').find('.ss-fieldset-toggle').text('-');
	        $(this).prev('div.panel-heading').find('.ss-fieldset-toggle').addClass('open');
	      });
        */




	      // NOTE: mark commented this out since other css is need to set custom color on these tabs, like the pointer arrow - 11/5/2014
	      // Add class and event handler to bootstrap tabs for formatting
	      // $('ul.ss-full-tabs li.active a[data-toggle="tab"]').addClass('basebg');
	      // $('ul.ss-full-tabs a[data-toggle="tab"]').on('show.bs.tab', function (e) {
	      //   var el = e.target;
	      //   $(el).parents('ul.ss-full-tabs').find('.basebg').each(function() {
	      //     $(this).removeClass('basebg');
	      //   });
	      //   $(el).addClass('basebg');
	      // });

	      // Turn dev menu in admin footer into select
	      if($('#admin-footer #block-menu-devel ul.menu').length > 0) {
	        var devmenu = $('#admin-footer #block-menu-devel ul.menu').clone();
	        $('#admin-footer #block-menu-devel ul.menu').replaceWith('<select class="devmenu"></select>');
	        var sel = $('#block-menu-devel select.devmenu');
	        sel.append('<option>Choose an option...</option>');
	        $.each(devmenu.children('li'), function() {
	          var opt = $('<option>' + $(this).text() + '</option>').attr('value', $(this).find('a').attr('href'));
	          sel.append(opt);
	        });
	        sel.change(function() { window.location.pathname = $(this).val(); });
	      }
	      // Adjust height of blocks in admin footer
	      $('#admin-footer div.block').each(function() {
	        $(this).height($(this).parent().height());
	      });

	      // Collapse/Expand All Buttons For Bootstrap Collapsible Divs
	      // Assumes Buttons are in a child div that is a sibling of the collapsible divs.
	      $('div.expcoll-btns button').click(function() {
	        var divs = $(this).parent().parent().find('div.collapse');
	        if($(this).hasClass('expand')) {
	          $(divs).addClass('in');
	        } else {
	          $(divs).removeClass('in');
	        }
	      });

	      // call Check Width
	      Drupal.ShantiSarvaka.checkWidth();

	      // Carousel Init and controls
	      // Gets speed from setting associated with block so that admins can customize speed.
	      $('.carousel').each(function() {
	      	var speed = $(this).data('speed') * 1000;
	      	$(this).carousel({
		        interval: speed,
				  	pause: false
		      });
		    });


	  //    $('.carousel .control-box-2 .carousel-pause').click(function () {
	  //        var carousel = $(this).parents('.carousel');
	  //        if($(this).hasClass('paused')) {
	  //          carousel.carousel('next');
	  //          carousel.carousel('cycle');
	  //        } else {
	  //          carousel.carousel('pause');
	  //        }
	  //        $(this).toggleClass('paused');
	  //        $(this).find('span').toggleClass('glyphicon-pause glyphicon-play');
	  //    });

	    }
    }
  };

  /**
   * Gallery: Initialize a gallery of images
   */
  Drupal.behaviors.shantiSarvakaGalleryInit = {
    attach: function (context, settings) {
    	//console.log(context, settings);
      $('.shanti-gallery', context).imagesLoaded(function() {
          // Prepare layout options.
          var options = {
          	align: 'left',
            itemWidth: 160, // Optional min width of a grid item
            autoResize: true, // This will auto-update the layout when the browser window is resized.
            container: $('.shanti-gallery'), // Optional, used for some extra CSS styling
            offset: 15, // Optional, the distance between grid items
            outerOffset: 0, // Optional the distance from grid to parent
            flexibleWidth: '30%', // Optional, the maximum width of a grid item
            ignoreInactiveItems: false,
          };
          // Get a reference to your grid items.
          var handler = $('.shanti-gallery li');

          var $window = $(window);
          $window.resize(function() {
            var windowWidth = $window.width(),
                newOptions = { flexibleWidth: '30%' };

            // Breakpoint
            if (windowWidth < 1024) {
              newOptions.flexibleWidth = '100%';
            }

            handler.wookmark(newOptions);
          });

          // Call the layout function.
          handler.wookmark(options);
      });
    }
  };

  /**
   * Accordion Init: only called on document load
   */
  Drupal.behaviors.shantiSarvakaAccordion = {
    attach: function (context, settings) {

        // Open first accordion if none opened
        $("#av-details .field-accordion").each(function(index, element){
				  $(element).addClass(index == 0 ? "in" : "").once();
				  $(element).has(".in").find(".glyphicon").toggleClass('glyphicon-plus glyphicon-minus');
				});

        // Icon toggling with accordions
				$.fn.accordionFx = function() {
				    return this.each(function(span, accordion) {
				        $(".accordion-toggle", accordion).click(function(ev) {
				            var link = ev.target;
				            var header = $(link).closest(".panel-heading");
				            var chevState = $(".glyphicon", header).toggleClass('glyphicon-plus glyphicon-minus');

				            $(".glyphicon", accordion)
				                .not(chevState)
				                .removeClass("glyphicon-minus")
				                .addClass("glyphicon-plus");
				        });
				    });
				};

				$('.field-accordion, #accordion').accordionFx();

        // Shiva site gets doubly glypicons. So need to be removed
        $(".glyphicon-plus + .glyphicon-plus, .glyphicon-minus + .glyphicon-minus").remove();


        /* - mark hide 12/24 - Select only accordions not in vertical tabs
  			var accorddivs = $('.panel-group').not($('.vertical-tabs-panes .panel-group'));
        var $active = accorddivs.find('.panel-collapse.in').prev().addClass('active');

        $active.find('a').prepend('<span class="glyphicon glyphicon-minus"></span>');

        accorddivs.find('.panel-heading').once('expgylph').not($active).find('a').prepend('<span class="glyphicon glyphicon-plus"></span>');

        accorddivs.on('show.bs.collapse', function (e) {
  					var accorddivs = $('.panel-group').not($('.vertical-tabs-panes .panel-group'));
            accorddivs.find('.panel-heading.active').removeClass('active').find('.glyphicon').toggleClass('glyphicon-plus glyphicon-minus');
            $(e.target).prev().addClass('active').find('.glyphicon').toggleClass('glyphicon-plus glyphicon-minus');
        });

        accorddivs.on('hide.bs.collapse', function (e) {
            $(this).find('.panel-heading.active').removeClass('active').find('.glyphicon').toggleClass('glyphicon-plus glyphicon-minus');
        });
				*/

        /*-- toggle icon on accordions -- */
        $('.btn-toggle-accordion').click(function () {

          $(this).toggleClass('expand');

          if($('.btn-toggle-accordion').hasClass('expand')) {

              $(this).text('Expand All');
              $('.panel-collapse').collapse('hide');
              $('.panel-heading.active').removeClass('active').find('.glyphicon').toggleClass('glyphicon-plus glyphicon-minus');
            } else {
              $(this).text('Collapse All');
              $('.panel-collapse').collapse('show');
              $('.panel-heading').addClass('active').find('.glyphicon').toggleClass('glyphicon-plus glyphicon-minus');
          }
        });

    }
  };

  /**
   * Other: All of below if from Mark's separate Jquery() functions
   */
  Drupal.behaviors.shantiSarvakaOtherInit = {
    attach: function (context, settings) {
    	if(context == document) {
	      $('.shanti-field-group-audience > div').find('a:eq(1)').addClass('icon-link');

	      $('.shanti-field-title a').hover( function() {
	            $(this).closest('.shanti-thumbnail').addClass('title-hover');
	            },
	              function () {
	            $(this).closest('.shanti-thumbnail').removeClass('title-hover');
	            }
	       );

	      // $('table.sticky-header').css('width','100%');


	      // hide responsive column for resources
	      $('[data-toggle=offcanvas]').click(function () {
	        $('.row-offcanvas').toggleClass('active');
	      });

	      // IE10 viewport hack for Surface/desktop Windows 8 bug http://getbootstrap.com/getting-started/#support-ie10-width
	      (function () {
	        'use strict';
	        if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
	          var msViewportStyle = document.createElement('style');
	          msViewportStyle.appendChild(
	            document.createTextNode(
	              '@-ms-viewport{width:auto!important}'
	            )
	          );
	          document.querySelector('head').appendChild(msViewportStyle);
	        }
	      })();


	      var myElement = document.getElementById('.carousel.slide');
	      if(myElement) {
	        // create a simple instance
	        // by default, it only adds horizontal recognizers
	        var mc = new Hammer(myElement);

	        // let the pan gesture support all directions.
	        // this will block the vertical scrolling on a touch-device while on the element
	        mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

	        // listen to events...
	        mc.on("panleft panright panup pandown tap press", function(ev) {
	            myElement.textContent = ev.type +" gesture detected.";
	        });
	      }
	    }
    }
  };

  /**
   * Format numbers with ssfmtnum class
   */
  Drupal.behaviors.shantiSarvakaFormatNumbers = {
    attach: function (context, settings) {
      $('.ssfmtnum', context).each(function() {
      	if($(this).text().indexOf(',') == -1) {
      		var txt = $(this).text(),
      				len = txt.length,
      				i = len - 1,
      				fmtnum = '';
      		while(i >= 0) {
		        fmtnum = txt.charAt(i) + fmtnum;
		        if ((len - i) % 3 === 0 && i > 0) {
		        	fmtnum = "," + fmtnum;
		        }
		        --i;
			    }
			    $(this).text(fmtnum);
      	}
      });
    }
  };


  Drupal.behaviors.kmapsExplorer = {
    attach: function (context, settings) {
      var $selected_li = $('#carousel-feature-slides > li');
      $selected_li.children('a').bind('click', function (e) {
          e.preventDefault();
          $selected_li.removeClass('active');
          $(this).parent().addClass('active');
      });

      $('#carousel-feature-slides.bx-large-slides').bxSlider({
        slideMargin:10,
        pager:true,
        controls:true,
        autoReload: true,
        moveSlides: 1,
        infiniteLoop: false,
				hideControlOnEnd: true,
        breaks: [{screen:0, slides:1, pager:false},{screen:380, slides:1},{screen:450, slides:2},{screen:768, slides:3},{screen:1200, slides:4}]
      });

      $('#carousel-feature-slides.bx-small-slides').bxSlider({
        slideMargin:10,
        pager:true,
        controls:true,
        autoReload: true,
        moveSlides: 1,
        infiniteLoop: false,
				hideControlOnEnd: true,
			  breaks: [{screen:0, slides:1, pager:false},{screen:400, slides:2},{screen:550, slides:3},{screen:768, slides:4},{screen:1050, slides:5}]
      });

    }
  };


   Drupal.behaviors.shantiSarvakaKalturaLoading = {
    attach: function (context, settings) {
    	if(context == document) {
    		// The player on the node edit form cannot be made responsive thru this script.
    		// Because it causes the player not to appear until resize happens (ndg, 2015-01-30)
			  if (typeof kWidget != 'undefined' && !$('body').hasClass('page-node-edit')) {
					kWidget.addReadyCallback(function(playerId) {
						function calcPlayerSize() {
					    var elm = document.getElementById(playerId);
							elm.style.width = "auto";
							elm.style.height = (elm.clientWidth/16.0)*9+"px";
						}
						window.addEventListener("resize", calcPlayerSize, false);
						calcPlayerSize();
					});
				}
	    }
    }
  };



  Drupal.behaviors.shantiSarvakaMbTranscriptSearchToggle = {
    attach: function (context, settings) {
      if(context == window.document) {
	        $('.searchtrans').click( function(){
	                $('.transcript-search-wrapper').slideToggle();
	        });
      }
    }
  };


  Drupal.behaviors.shantiSarvakaMbTranscriptLanguageDropdownIcon = {
    attach: function (context, settings) {
      if(context == window.document) {
          $('.tier-selector .filter-option').replaceWith('<span class="fa fa-comments-o"></span>');
      }
    }
  };


	Drupal.behaviors.shantiSarvakaMbTrimDesc = {
	  attach: function (context, settings) {
	  	// Pb core description trimming
			if($('.field-name-field-pbcore-description .field-item').length > 1) {
				var items = $('.field-name-field-pbcore-description > .field-items > .field-item');
				if(items.length > 1 ) {
					items.first().nextAll().hide();
					items.last().after('<p id="pb-core-desc-readmore" class="show-more"><a href="#">' + Drupal.t('Show More') + '</a></p>');
					if(!$(".avdesc").hasClass("show-more-height")) { $(".avdesc").addClass("show-more-height"); }
					$(".show-more > a").click(function (e) {
						var items = $('.field-name-field-pbcore-description > .field-items > .field-item');
						items.first().nextAll('.field-item').slideToggle();
						//console.log($(".avdesc").attr('class'));
				     if($(".avdesc").hasClass("show-more-height")) {
				         $(this).text(Drupal.t('Show Less'));
				     } else {
				         $(this).text(Drupal.t('Show More'));
				     }
				     $(".avdesc").toggleClass("show-more-height");
						 e.preventDefault();
					});
				}
			}

			// Description Trimming
			/* This makes there be multiple "Show More"s on Dreams page
				Could perhaps use } else { if needed for other situations

			$('.description.trim').each(function() {
			 	if($(this).text().length > 1000 && $(this).find('p').length > 1 && $(this).find('div.show-more').length == 0) {
			 		var p1 = $(this).find('p').first();
			 		p1.siblings('p').hide();
			 		$(this).append('<div class="show-more"><a href="#">Show more</a></div>');
			 	}
			});
			$('.description.trim .show-more a').each(function() {
				$(this).click(function(event) {
					event.preventDefault();
					$(this).parent('.show-more').toggleClass('less');
					var parent = $(this).parents('.description.trim');
					var ps = parent.find('p').first().siblings('p');
					ps.slideToggle();
					var txt = $(this).text();
					txt = (txt.indexOf('more') > -1) ? 'Show less' : 'Show more';
					$(this).text(txt);
				});
			});
			*/
		}
	};

	// Applies wookmark js to related videos tab div by calling Drupal behaviors
	Drupal.behaviors.shantiSarvakaMbRelatedTab = {
		attach: function (context, settings) {
			if(context == window.document) {
				$('a#related-tab').on('shown.bs.tab', function(e) {
					Drupal.attachBehaviors('#related');
				});
			}
	  }
	};




  Drupal.behaviors.kmapsOffCanvasToggle = {
	  attach: function (context, settings) {
			$(".view-resources.btn-default").click( function() { 		// show-hide resource side-column
			  $(this).toggleClass( "show",'fast' );
			});
	  }
	};

	Drupal.behaviors.kmapsOffCanvasButton = {
	  attach: function (context, settings) {
			if($(".feature-carousel-tabpanel").length ) {
				$("button.view-resources").remove();
			}
	  }
	};


	// --- unhiding breadcrumbs: inline styles keeps the breadcrumbs markup from flash on load when at homepages where we do not want them
	Drupal.behaviors.breadcrumbsFlickrControl = {
	  attach: function (context, settings) {
			$('.breadwrap').show( "fast" );
	  }
	};
	
	
	Drupal.behaviors.advancedToggleClassHeightChange = {
		attach: function (context, settings) {
	    // --- sets class for height change in flyout, see comboheight below in ShantiSarvaka.searchTabHeight     
    $(".advanced-link").bind("click", function (e) { 
      $(".view-wrap").toggleClass('short-wrap');
    });
	  }
	};
	

//	Drupal.behaviors.kmapsOpenlayersMenuFlickrControl = {
//	  attach: function (context, settings) {
//			if($(".openlayermap").length ) {
//				$(".openlayermap #sidebar_wrapper").css('display','block !important');
//			}
//	  }
//	};

//	Drupal.behaviors.kmapsPageNotFound = {
//	  attach: function (context, settings) {
//			if($('.page-title-text:contains("Page not found")').length ) {
//				$('button.view-resources').css('display','none');
//			}
//	  }
//	};


}(jQuery));
