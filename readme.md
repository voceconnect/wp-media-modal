=== WordPress Media Modal ===

Contributors: chrisscott, banderon, voceplatforms
Tags: wordpress, media, attachment
Requires at least: 3.5
Tested up to: 3.5.1
Stable tag: 1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

== Description ==

Creates a modal window for media selection in WordPress 3.5+

== Expected Parameters ==

```
 @global window
 @global jQuery
 @global wp

 @param {Object} settings  Settings for this class
   @param {String} calling_selector  The selector that is calling the modal
   @param {Function} cb  Callback function for processing the selected media
   item; accepts attachment object as argument
 @param {Object} [render_options]  Rendering options to pass to the modal;
 specifiying any option will override the default for that option
   @param {String} [render_options.title]  Title to display at the top of the
   modal; defaults to selector's 'uploader_title' data field
   ('data-uploader_title' attribute)
   @param {Object} [render_options.button]
     @param {String} [render_options.button.text]  Text to display in
     submission button; defaults to selector's 'uploader_button_text' data
     field ('data-uploader_button_text' attribute)
   @param {Bool} [render_options.multiple=false]  Whether users may select
   more than one item
   @param {Object} [render_options.library]
     @param {String} [render_options.library.type]  Only dispaly items of a
     specific MIME type (Ex: 'image', 'image/png', 'application/pdf')
     @param {Int} [render_options.library.uploadedTo]  Only display items
     uploaded to a specific post ID
     @param {String} [render_options.library.orderby='date']  Set the orderby
     for the items displayed
     @param {String} [render_options.library.order='DESC']  Set the order of
     the items displayed
```

== Examples ==

With multiple PDFs:

```
   <a id="set-pdf" href="#" data-uploader_title="Select Report" 
        data-attachment_ids="[34,35,36]">Click here to attach reports</a>
   <input type="hidden" id="report-ids" name="report-ids" value="" />

   <script>
   var mm = new MediaModal(
     {
       calling_selector : "#set-pdf",
       cb : function(attachments){
         var ids = jQuery.map(attachments, function(attachment){
           return attachment.id;
         });
         ids = JSON.stringify(ids);
         jQuery('#set-pdf').data('attachment_ids', ids);
         jQuery('#report-id').val(ids);
       }
     },
     {
       multiple: true,
       library : {
         type : "application/pdf"
       }
     }
   );
   </script>
```

With single image:

```
   <a id="set-image" data-attachment_ids="12" href="#">Choose an image</a>
   <img id="my-image" src="" />
   <input type="hidden" id="image-id" name="image-id" value="" />

   <script>
   var mm = new MediaModal(
     {
       calling_selector : "#set-image",
       cb : function(attachments){
         var attachment = attachments[0];
         jQuery('#set-image').data('attachment_ids', attachment.id);
         jQuery('#my-image').attr('src', attachment.sizes.full.url);
         jQuery('#image-id').val(attachment.id);
       }
     },
     {
       title : 'Choose an Image',
       button : {
         text : 'Select Image'
       },
       library : {
         type : "image"
       }
     }
   );
   </script>
```

== Changelog ==

= 1.0 =

* Initial release