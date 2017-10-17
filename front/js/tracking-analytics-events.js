/*-
 * Author: Alin Marcu 
 * Author URI: https://deconf.com 
 * Copyright 2013 Alin Marcu 
 * License: GPLv2 or later 
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

"use strict";

jQuery( window ).on( 'load', function () {

    function createSingleCallFunctionWithTimeout(callback, opt_timeout) {
        var called = false;
        function fn() {
            if (!called) {
                called = true;
                callback();
            }
        }
        setTimeout(fn, Math.max(1000, opt_timeout || 1000));
        return fn;
    }
    
	function processRedirectClick(e, target, urlToRedirectTo, category, action, label) {
	
		var useHitCallback = target != '_blank' && gadwpUAEventsData.options[ 'event_precision' ];
		var useNonInteraction = !!gadwpUAEventsData.options[ 'event_bouncerate' ]
	
		var gaArgs = {};
	
		if (useNonInteraction) {
			gaArgs.nonInteraction = 1;
		}
		if (useHitCallback) {
			e.preventDefault();
			
			gaArgs.hitCallback = createSingleCallFunctionWithTimeout(function () {
				document.location.href = urlToRedirectTo;
			}, gadwpUAEventsData.options['event_timeout'])
		}
	
		ga( 'send', 'event', category, action, label, gaArgs);
	
		if (useHitCallback) {
			return false;
		}
	}
	
	if ( gadwpUAEventsData.options[ 'event_tracking' ] ) {
		// Track Downloads
		jQuery( 'a' ).filter( function () {
			var reg = new RegExp( '.*\\.(' + gadwpUAEventsData.options[ 'event_downloads' ] + ')(\\?.*)?$' );
			return this.href.match( reg );
		} ).click( function ( e ) {
			var category = this.getAttribute( 'data-vars-ga-category' ) || 'download';
			var action = this.getAttribute( 'data-vars-ga-action' ) || 'click';
			var label = this.getAttribute( 'data-vars-ga-label' ) || this.href;
			if ( gadwpUAEventsData.options[ 'event_bouncerate' ] ) {
				ga( 'send', 'event', category, action, label, {
					'nonInteraction' : 1
				} );
			} else {
				ga( 'send', 'event', category, action, label );
			}
		} );

		// Track Mailto
		jQuery( 'a[href^="mailto"]' ).click( function ( e ) {
			var category = this.getAttribute( 'data-vars-ga-category' ) || 'email';
			var action = this.getAttribute( 'data-vars-ga-action' ) || 'send';
			var label = this.getAttribute( 'data-vars-ga-label' ) || this.href;
			if ( gadwpUAEventsData.options[ 'event_bouncerate' ] ) {
				ga( 'send', 'event', category, action, label, {
					'nonInteraction' : 1
				} );
			} else {
				ga( 'send', 'event', category, action, label );
			}
		} );

		// Track telephone calls
		jQuery( 'a[href^="tel"]' ).click( function ( e ) {
			var category = this.getAttribute( 'data-vars-ga-category' ) || 'telephone';
			var action = this.getAttribute( 'data-vars-ga-action' ) || 'call';
			var label = this.getAttribute( 'data-vars-ga-label' ) || this.href;
			if ( gadwpUAEventsData.options[ 'event_bouncerate' ] ) {
				ga( 'send', 'event', category, action, label, {
					'nonInteraction' : 1
				} );
			} else {
				ga( 'send', 'event', category, action, label );
			}

		} );

		if ( gadwpUAEventsData.options[ 'root_domain' ] ) {

			// Track Outbound Links
			jQuery( 'a[href^="http"]' ).filter( function () {
				var reg = new RegExp( '.*\\.(' + gadwpUAEventsData.options[ 'event_downloads' ] + ')(\\?.*)?$' );
				if ( !this.href.match( reg ) ) {
					if ( this.href.indexOf( gadwpUAEventsData.options[ 'root_domain' ] ) == -1 && this.href.indexOf( '://' ) > -1 )
						return this.href;
				}
			} ).click( function ( e ) {

				return processRedirectClick(
					e,
					this.target,
					this.href,
					this.getAttribute( 'data-vars-ga-category' ) || 'outbound',
					this.getAttribute( 'data-vars-ga-action' ) || 'click',
					this.getAttribute( 'data-vars-ga-label' ) || this.href);
	
			} );
		}
	}

	if ( gadwpUAEventsData.options[ 'event_affiliates' ] && gadwpUAEventsData.options[ 'aff_tracking' ] ) {

		// Track Affiliates
		jQuery( 'a' ).filter( function () {
			if ( gadwpUAEventsData.options[ 'event_affiliates' ] != '' ) {
				var reg = new RegExp( '(' + gadwpUAEventsData.options[ 'event_affiliates' ].replace( /\//g, '\/' ) + ')' );
				return this.href.match( reg );
			}
		} ).click( function (e) {
		
			return processRedirectClick(
				e,
				this.target,
				this.href,
				this.getAttribute( 'data-vars-ga-category' ) || 'affiliates',
				this.getAttribute( 'data-vars-ga-action' ) || 'click',
				this.getAttribute( 'data-vars-ga-label' ) || this.href);

		} );
	}

	if ( gadwpUAEventsData.options[ 'root_domain' ] && gadwpUAEventsData.options[ 'hash_tracking' ] ) {

		// Track Hashmarks
		jQuery( 'a' ).filter( function () {
			if ( this.href.indexOf( gadwpUAEventsData.options[ 'root_domain' ] ) != -1 || this.href.indexOf( '://' ) == -1 )
				return this.hash;
		} ).click( function ( e ) {
			var category = this.getAttribute( 'data-vars-ga-category' ) || 'hashmark';
			var action = this.getAttribute( 'data-vars-ga-action' ) || 'click';
			var label = this.getAttribute( 'data-vars-ga-label' ) || this.href;
			if ( gadwpUAEventsData.options[ 'event_bouncerate' ] ) {
				ga( 'send', 'event', category, action, label, {
					'nonInteraction' : 1
				} );
			} else {
				ga( 'send', 'event', category, action, label );
			}
		} );
	}

	if ( gadwpUAEventsData.options[ 'event_formsubmit' ] ) {

		// Track Form Submit
		jQuery( 'input[type="submit"]' ).click( function ( e ) {
			var gadwpSubmitObject = this;
			var category = gadwpSubmitObject.getAttribute( 'data-vars-ga-category' ) || 'form';
			var action = gadwpSubmitObject.getAttribute( 'data-vars-ga-action' ) || 'submit';
			var label = gadwpSubmitObject.getAttribute( 'data-vars-ga-label' ) || gadwpSubmitObject.name || gadwpSubmitObject.value;
			if ( gadwpUAEventsData.options[ 'event_formsubmit' ] ) {
				ga( 'send', 'event', category, action, label, {
					'nonInteraction' : 1
				} );
			} else {
				ga( 'send', 'event', category, action, label );
			}
		} );
	}

	if ( gadwpUAEventsData.options[ 'ga_pagescrolldepth_tracking' ] ) {
		// Track Page Scroll Depth
		jQuery.scrollDepth( {
			percentage : true,
			userTiming : false,
			pixelDepth : false,
			gtmOverride : true,
			nonInteraction : true,
		} );
	}

} );
