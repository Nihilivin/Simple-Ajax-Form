/**
 * @file Simple AJAX Form
 * @description  jQuery extension to make forms AJAX enabled. Mainly used in WordPress projects
 * @author tcbarrett
 *
 * @version 2.0
 */

/**
 * See the {@link http://jquery.com/|jQuery Library} for full details.  This just documents the function and classes that are added to jQuery by this plug-in.
 * @see {@link http://jquery.com/|jQuery} for details about jQuery.
 * @external "jQuery"
 * @borrows external:"jQuery".fn.simpleAjaxForm as external:"jQuery".simpleAjaxForm
 */
/**
 * See the {@link http://jquery.com/|jQuery Library} for full details.  This just documents the function and classes that are added to jQuery by this plug-in.
 * @see {@link http://jquery.com/|jQuery} for details about jQuery.
 * @name external:"jQuery".fn
 * @class
 */
(function(){
    jQuery.fn.extend({
        /**
         * Send a form through ajax
		 * @method	external:"jQuery".fn.simpleAjaxForm
         * @param	{object}	opts	Options to be merged with { validate: false } and jQuery elements selected attributes ["target","callback","validate"]
         * @returns	{array}		Forms handlers
         */
        simpleAjaxForm: function( opts ){
            var defaults = { validate: false };
            var options  = jQuery.extend( defaults, opts );
            return this.each(function(){
                var $form = jQuery(this);
                var formopts = jQuery.extend({
                    target:   $form.data('target'),
                    callback: $form.data('callback'),
                    validate: $form.data('validate')
                }, options);
                if( formopts.target && jQuery('#'+formopts.target).length ){
                    jQuery('#'+formopts.target).html('').hide();
                }

                $form.ajaxForm({
                    beforeSubmit: function(formData, jqForm, options) {
                        //if( !jqForm.valid() ) return false;
                        if( formopts.target && jQuery('#'+formopts.target).length ){
                            jQuery('#'+formopts.target).html('<p>Updating, please wait...</p>').removeClass('updated').addClass('updating').fadeTo(100,1);
                        }
                        return true;
                    },
                    success: function(responseText, statusText, xhr, jQForm){
                        if( typeof(jQForm) === 'undefined' )
                            jQForm = xhr;

                        if( typeof(jQForm) === 'undefined' ){
                            $form.append('<div class="error"><p>Cannot handle response properly</p></div>');
                            return;
                        }

                        try{
                            var res = JSON.parse(responseText);
                            if(!res.valid){
                                if( formopts.target && jQuery('#'+formopts.target).length ){
                                    jQuery('#'+formopts.target).removeClass('updating').removeClass("updated").addClass('error').html(res.text);
                                }
                            } else {
                                if(res.reload){
                                    window.location.href = window.location.href + "&json-res-txt=" + window.encodeURI(res.text);
                                }

                                if( formopts.target && jQuery('#'+formopts.target).length ){
                                    jQuery('#'+formopts.target).removeClass('updating').removeClass("error").addClass('updated').html(res.text);
                                }
                            }
                        } catch(e){
                            jQuery('#'+formopts.target).removeClass('updating').removeClass("updated").addClass('error').html("<p>Invalid server response</p>");
                        }
                    }	
                });
            });
        }
    });
})();

(function(){
    jQuery(document).ready(function(){
        jQuery('.simpleajaxform').simpleAjaxForm();
    });
})();
