/**
 * @fileOverview Click to edit plugin
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

 /**
  * @name $.editor.plugin.clickToEdit
  * @augments $.ui.editor.defaultPlugin
  * @class Shows a message at the center of an editable block,
  * informing the user that they may click to edit the block contents
  */
$.ui.editor.registerPlugin('clickToEdit', /** @lends $.editor.plugin.clickToEdit.prototype */ {
    
    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        var plugin = this;
        var message = $(editor.getTemplate('clicktoedit.message', options)).appendTo('body');

        // Default options
        options = $.extend({}, {
            obscureLinks: false,
            position: {
                at: 'center center',
                of: editor.getElement(),
                my: 'center center',
                using: function(position) {
                    $(this).css({
                        position: 'absolute',
                        top: position.top,
                        left: position.left
                    });
                }
            }
        }, options);

        /**
         * Show the click to edit message
         */
        this.show = function() {
            if (editor.isEditing()) return;
            editor.getElement().addClass(options.baseClass + '-highlight');
            editor.getElement().addClass(options.baseClass + '-hover');
            message.position(options.position);
            message.stop().animate({ opacity: 1 });
        }

        /**
         * Hide the click to edit message
         */
        this.hide = function() {
            editor.getElement().removeClass(options.baseClass + '-highlight');
            editor.getElement().removeClass(options.baseClass + '-hover');
            message.stop().animate({ opacity: 0 });
        }

        /**
         * Hide the click to edit message and show toolbar
         */
        this.edit = function() {
            plugin.hide();
            if (!editor.isEditing()) editor.enableEditing();
            if (!editor.isToolbarVisible()) editor.showToolbar();
        }

        message.position(options.position);

        // Prevent disabling links if required
        if (!options.obscureLinks) {
            editor.getElement().find('a').bind('mouseenter.' + editor.widgetName, plugin.hide);
            editor.getElement().find('a').bind('mouseleave.' + editor.widgetName, plugin.show);
        }
        editor.getElement().bind('mouseenter.' + editor.widgetName, plugin.show);
        editor.getElement().bind('mouseleave.' + editor.widgetName, plugin.hide);
        editor.getElement().bind('click.' + editor.widgetName, function(event) {
            // Prevent disabling links if required
            if (options.obscureLinks || (!$(event.target).is('a') && !$(event.target).parents('a').length)) {
                plugin.edit();
            }
        });
        editor.bind('destroy', function() {
            message.remove();
            editor.getElement().unbind('mouseenter.' + editor.widgetName, plugin.show);
            editor.getElement().unbind('mouseleave.' + editor.widgetName, plugin.hide);
            editor.getElement().unbind('click.' + editor.widgetName, plugin.edit);
        })
    }
});