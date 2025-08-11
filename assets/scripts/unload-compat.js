/**
 * Unload to PageHide Compatibility Shim
 * 
 * This shim intercepts deprecated 'unload' event listeners and redirects them 
 * to the 'pagehide' event to eliminate browser deprecation warnings.
 * 
 * Must be loaded before other scripts to catch all unload usage.
 */
(function() {
    'use strict';
    
    // Store original methods
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    
    // Map to track unload listeners for cleanup
    const unloadListenerMap = new WeakMap();
    
    /**
     * Enhanced addEventListener that redirects 'unload' to 'pagehide'
     */
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'unload') {
            console.warn('Deprecated "unload" event redirected to "pagehide" for compatibility');
            
            // Create wrapper for pagehide that mimics unload behavior
            const pagehideWrapper = function(event) {
                // For send-on-exit scenarios, use sendBeacon or fetch with keepalive
                if (typeof listener === 'function') {
                    try {
                        listener.call(this, event);
                    } catch (e) {
                        console.error('Error in pagehide listener:', e);
                    }
                }
            };
            
            // Store mapping for cleanup
            if (!unloadListenerMap.has(this)) {
                unloadListenerMap.set(this, new Map());
            }
            unloadListenerMap.get(this).set(listener, pagehideWrapper);
            
            // Add pagehide listener instead
            return originalAddEventListener.call(this, 'pagehide', pagehideWrapper, options);
        }
        
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    /**
     * Enhanced removeEventListener that handles unload->pagehide mapping
     */
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
        if (type === 'unload') {
            const listenerMap = unloadListenerMap.get(this);
            if (listenerMap && listenerMap.has(listener)) {
                const pagehideWrapper = listenerMap.get(listener);
                listenerMap.delete(listener);
                return originalRemoveEventListener.call(this, 'pagehide', pagehideWrapper, options);
            }
        }
        
        return originalRemoveEventListener.call(this, type, listener, options);
    };
    
    // jQuery compatibility shim (if jQuery is loaded)
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof jQuery !== 'undefined') {
            const originalJQueryOn = jQuery.fn.on;
            const originalJQueryOff = jQuery.fn.off;
            
            // Override jQuery's .on() method
            jQuery.fn.on = function(events, selector, data, handler) {
                if (typeof events === 'string' && events.includes('unload')) {
                    console.warn('jQuery "unload" event redirected to "pagehide" for compatibility');
                    events = events.replace(/\bunload\b/g, 'pagehide');
                }
                return originalJQueryOn.call(this, events, selector, data, handler);
            };
            
            // Override jQuery's .off() method
            jQuery.fn.off = function(events, selector, handler) {
                if (typeof events === 'string' && events.includes('unload')) {
                    events = events.replace(/\bunload\b/g, 'pagehide');
                }
                return originalJQueryOff.call(this, events, selector, handler);
            };
            
            // Override jQuery's shorthand unload method
            if (jQuery.fn.unload) {
                jQuery.fn.unload = function(handler) {
                    console.warn('jQuery .unload() method redirected to .on("pagehide") for compatibility');
                    return this.on('pagehide', handler);
                };
            }
        }
    });
    
    console.log('Unload compatibility shim loaded - unload events will be redirected to pagehide');
})();