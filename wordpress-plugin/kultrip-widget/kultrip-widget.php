<?php
/**
 * Plugin Name: Kultrip Travel Widget
 * Plugin URI: https://kultrip.com
 * Description: Embed the Kultrip AI-powered travel widget on your WordPress site. Supports Spanish and English with automatic language detection.
 * Version: 1.0.0
 * Author: Kultrip
 * Author URI: https://kultrip.com
 * License: GPL v2 or later
 * Text Domain: kultrip-widget
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('KULTRIP_WIDGET_VERSION', '1.0.0');
define('KULTRIP_WIDGET_PLUGIN_URL', plugin_dir_url(__FILE__));
define('KULTRIP_WIDGET_PLUGIN_PATH', plugin_dir_path(__FILE__));

class KultripWidget {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
    }
    
    public function init() {
        // Enqueue scripts and styles
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        
        // Register shortcode
        add_shortcode('kultrip_widget', array($this, 'shortcode'));
        
        // Register Gutenberg block
        add_action('init', array($this, 'register_block'));
        
        // Add admin menu
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Register settings
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    public function enqueue_scripts() {
        // Only enqueue if widget is used on the page
        if ($this->is_widget_on_page()) {
            wp_enqueue_style(
                'kultrip-widget-css',
                'https://widget.kultrip.com/kultrip-widget.css',
                array(),
                KULTRIP_WIDGET_VERSION
            );
            
            wp_enqueue_script(
                'kultrip-widget-js',
                'https://widget.kultrip.com/kultrip-widget.umd.js',
                array(),
                KULTRIP_WIDGET_VERSION,
                true
            );
            
            // Add initialization script
            $this->add_init_script();
        }
    }
    
    private function is_widget_on_page() {
        global $post;
        if (is_object($post)) {
            return has_shortcode($post->post_content, 'kultrip_widget') || 
                   has_block('kultrip/widget', $post->post_content);
        }
        return false;
    }
    
    private function add_init_script() {
        $agency_id = get_option('kultrip_agency_id', 'DEMO_AGENCY');
        $language = get_option('kultrip_language', 'auto');
        
        $language_option = ($language === 'auto') ? '' : ", language: '{$language}'";
        
        $init_script = "
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize all Kultrip widgets on the page
            document.querySelectorAll('[data-kultrip-widget]').forEach(function(container) {
                if (window.KultripWidget) {
                    const containerId = container.id;
                    const userId = container.getAttribute('data-user-id') || '{$agency_id}';
                    
                    try {
                        window.KultripWidget.init(containerId, {
                            userId: userId{$language_option}
                        });
                    } catch (error) {
                        console.error('Kultrip widget init failed for', containerId, error);
                    }
                }
            });
        });
        ";
        
        wp_add_inline_script('kultrip-widget-js', $init_script);
    }
    
    public function shortcode($atts) {
        $atts = shortcode_atts(array(
            'user_id' => get_option('kultrip_agency_id', 'DEMO_AGENCY'),
            'height' => '600px',
            'width' => '100%',
            'language' => get_option('kultrip_language', 'auto'),
            'id' => 'kultrip-widget-' . uniqid()
        ), $atts, 'kultrip_widget');
        
        $language_attr = ($atts['language'] === 'auto') ? '' : ' data-language="' . esc_attr($atts['language']) . '"';
        
        return sprintf(
            '<div id="%s" data-kultrip-widget data-user-id="%s"%s style="width:%s;height:%s;border:1px solid #ddd;border-radius:8px;"></div>',
            esc_attr($atts['id']),
            esc_attr($atts['user_id']),
            $language_attr,
            esc_attr($atts['width']),
            esc_attr($atts['height'])
        );
    }
    
    public function register_block() {
        if (function_exists('register_block_type')) {
            wp_register_script(
                'kultrip-widget-block',
                KULTRIP_WIDGET_PLUGIN_URL . 'block.js',
                array('wp-blocks', 'wp-element', 'wp-editor'),
                KULTRIP_WIDGET_VERSION
            );
            
            register_block_type('kultrip/widget', array(
                'editor_script' => 'kultrip-widget-block',
                'render_callback' => array($this, 'render_block'),
                'attributes' => array(
                    'userId' => array(
                        'type' => 'string',
                        'default' => get_option('kultrip_agency_id', 'DEMO_AGENCY')
                    ),
                    'height' => array(
                        'type' => 'string',
                        'default' => '600px'
                    ),
                    'language' => array(
                        'type' => 'string',
                        'default' => 'auto'
                    )
                )
            ));
        }
    }
    
    public function render_block($attributes) {
        $user_id = isset($attributes['userId']) ? $attributes['userId'] : get_option('kultrip_agency_id', 'DEMO_AGENCY');
        $height = isset($attributes['height']) ? $attributes['height'] : '600px';
        $language = isset($attributes['language']) ? $attributes['language'] : 'auto';
        $id = 'kultrip-widget-block-' . uniqid();
        
        $language_attr = ($language === 'auto') ? '' : ' data-language="' . esc_attr($language) . '"';
        
        return sprintf(
            '<div id="%s" data-kultrip-widget data-user-id="%s"%s style="width:100%%;height:%s;border:1px solid #ddd;border-radius:8px;"></div>',
            esc_attr($id),
            esc_attr($user_id),
            $language_attr,
            esc_attr($height)
        );
    }
    
    public function add_admin_menu() {
        add_options_page(
            'Kultrip Widget Settings',
            'Kultrip Widget',
            'manage_options',
            'kultrip-widget',
            array($this, 'admin_page')
        );
    }
    
    public function register_settings() {
        register_setting('kultrip_widget_settings', 'kultrip_agency_id');
        register_setting('kultrip_widget_settings', 'kultrip_language');
    }
    
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>Kultrip Widget Settings</h1>
            
            <form method="post" action="options.php">
                <?php settings_fields('kultrip_widget_settings'); ?>
                <?php do_settings_sections('kultrip_widget_settings'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">Agency ID</th>
                        <td>
                            <input type="text" name="kultrip_agency_id" value="<?php echo esc_attr(get_option('kultrip_agency_id', 'DEMO_AGENCY')); ?>" class="regular-text" />
                            <p class="description">Your Kultrip agency ID. Leads will be associated with this ID.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Default Language</th>
                        <td>
                            <select name="kultrip_language">
                                <option value="auto" <?php selected(get_option('kultrip_language', 'auto'), 'auto'); ?>>Auto-detect from browser</option>
                                <option value="en" <?php selected(get_option('kultrip_language', 'auto'), 'en'); ?>>English</option>
                                <option value="es" <?php selected(get_option('kultrip_language', 'auto'), 'es'); ?>>Spanish</option>
                            </select>
                            <p class="description">Default language for the widget. Auto-detect uses the visitor's browser language.</p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
            
            <hr>
            
            <h2>Usage</h2>
            
            <h3>Shortcode</h3>
            <p>Use this shortcode to embed the widget anywhere:</p>
            <code>[kultrip_widget]</code>
            
            <h4>Shortcode Options:</h4>
            <ul>
                <li><code>user_id</code> - Override the agency ID for this widget</li>
                <li><code>height</code> - Widget height (default: 600px)</li>
                <li><code>width</code> - Widget width (default: 100%)</li>
                <li><code>language</code> - Force language: "en", "es", or "auto"</li>
            </ul>
            
            <h4>Examples:</h4>
            <code>[kultrip_widget height="500px"]</code><br>
            <code>[kultrip_widget user_id="AGENCY_123" language="es"]</code>
            
            <h3>Gutenberg Block</h3>
            <p>In the block editor, search for "Kultrip Widget" and add it to your page.</p>
            
            <h3>PHP Template</h3>
            <p>In your theme files, use:</p>
            <code>&lt;?php echo do_shortcode('[kultrip_widget]'); ?&gt;</code>
        </div>
        <?php
    }
}

// Initialize the plugin
new KultripWidget();

// Activation hook
register_activation_hook(__FILE__, 'kultrip_widget_activate');
function kultrip_widget_activate() {
    // Set default options
    add_option('kultrip_agency_id', 'DEMO_AGENCY');
    add_option('kultrip_language', 'auto');
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'kultrip_widget_deactivate');
function kultrip_widget_deactivate() {
    // Clean up if needed
}
?>