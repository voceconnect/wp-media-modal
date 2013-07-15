/***
 *
 * WordPress Media Modal - Create a WP 3.5+ modal window for media selection
 *
 * @module MediaModal
 * @requires jQuery
 * @author Chris Scott
 * @author Gary Smirny
 *
 ***
 *
 * @usage Example with multiple PDFs:
 *
 *   <a id="set-pdf" href="#" data-uploader_title="Select Report" 
 *     data-attachment_ids="[34,35,36]">Click here to attach reports</a>
 *   <input type="hidden" id="report-ids" name="report-ids" value="" />
 *
 *   <script>
 *   var mm = new MediaModal(
 *     {
 *       calling_selector : "#set-pdf",
 *       cb : function(attachments){
 *         var ids = jQuery.map(attachments, function(attachment){
 *           return attachment.id;
 *         });
 *         ids = JSON.stringify(ids);
 *         jQuery('#set-pdf').data('attachment_ids', ids);
 *         jQuery('#report-id').val(ids);
 *       }
 *     },
 *     {
 *       multiple: true,
 *       library : {
 *         type : "application/pdf"
 *       }
 *     }
 *   );
 *   </script>
 *
 ***
 *
 * @usage Example with single image:
 *
 *   <a id="set-image" data-attachment_ids="12" href="#">Choose an image</a>
 *   <img id="my-image" src="" />
 *   <input type="hidden" id="image-id" name="image-id" value="" />
 *
 *   <script>
 *   var mm = new MediaModal(
 *     {
 *       calling_selector : "#set-image",
 *       cb : function(attachments){
 *         var attachment = attachments[0];
 *         jQuery('#set-image').data('attachment_ids', attachment.id);
 *         jQuery('#my-image').attr('src', attachment.sizes.full.url);
 *         jQuery('#image-id').val(attachment.id);
 *       }
 *     },
 *     {
 *       title : 'Choose an Image',
 *       button : {
 *         text : 'Select Image'
 *       },
 *       library : {
 *         type : "image"
 *       }
 *     }
 *   );
 *   </script>
 *
 ***
 *
 * @global window
 * @global jQuery
 * @global wp
 *
 * @param {Object} settings  Settings for this class
 *   @param {String} calling_selector  The selector that is calling the modal
 *   @param {Function} cb  Callback function for processing the selected media
 *   item; accepts attachment object as argument
 * @param {Object} [render_options]  Rendering options to pass to the modal;
 * specifiying any option will override the default for that option
 *   @param {String} [render_options.title]  Title to display at the top of the
 *   modal; defaults to selector's 'uploader_title' data field
 *   ('data-uploader_title' attribute)
 *   @param {Object} [render_options.button]
 *     @param {String} [render_options.button.text]  Text to display in
 *     submission button; defaults to selector's 'uploader_button_text' data
 *     field ('data-uploader_button_text' attribute)
 *   @param {Bool} [render_options.multiple=false]  Whether users may select
 *   more than one item
 *   @param {Object} [render_options.library]
 *     @param {String} [render_options.library.type]  Only dispaly items of a
 *     specific MIME type (Ex: 'image', 'image/png', 'application/pdf')
 *     @param {Int} [render_options.library.uploadedTo]  Only display items
 *     uploaded to a specific post ID
 *     @param {String} [render_options.library.orderby='date']  Set the orderby
 *     for the items displayed
 *     @param {String} [render_options.library.order='DESC']  Set the order of
 *     the items displayed
 *
 ***/
var MediaModal = function (settings, render_options) {
  'use strict';
  this.settings = {
    calling_selector: false,
    cb: function (attachment) {}
  };
  var that = this,
  frame = wp.media.frames.file_frame;

  this.attachEvents = function attachEvents() {
    jQuery(this.settings.calling_selector).on('click', this.openFrame);
  };

  this.openFrame = function openFrame(e) {
    e.preventDefault();

    // Create the media frame.
    frame = wp.media.frames.file_frame = wp.media(
      jQuery.extend(true, {
		// Default values for rendering modal window (defined here so that
		// they're not parsed before the even fires)
        title: jQuery(this).data('uploader_title'),
        button: {
          text: jQuery(this).data('uploader_button_text')
        }
      }, that.render_options)
    );

    // Set filterable state to uploaded to get select to show (setting this
    // when creating the frame doesn't work)
    frame.on('toolbar:create:select', function(){
      frame.state().set('filterable', 'uploaded');
    });

    // When an image is selected, run the callback.
    frame.on('select', function () {
      var attachments = [];
      jQuery.each(frame.state().get('selection').models, function(){
        attachments.push(this.toJSON());
      });
      that.settings.cb(attachments);
    });

    frame.on('open activate', function() {
      // Get the link/button/etc that called us
      var $caller = jQuery(that.settings.calling_selector);

      // Select the attachments if we have any
      if ($caller.data('attachment_ids')) {        
        var Attachment = wp.media.model.Attachment;
        var selection = frame.state().get('selection');

        var attachments = $caller.data('attachment_ids');
        if (typeof attachments == 'object') {
          jQuery.each(attachments, function(){
            selection.add(Attachment.get(this));
          });
        }
        else {
          selection.add(Attachment.get(attachments));
        }
      }
    });

    frame.open();
  };

  this.init = function init() {
    jQuery.extend(this.settings, settings);
    this.render_options = render_options;
    this.attachEvents();
  };
  this.init();

  return this;
};