<?php

add_action( 'init', function() {
    wp_register_script( 'voce-wp-media-modal', plugins_url( 'wp-media-modal.js', __FILE__ ), array('jquery'), false, true );
} );