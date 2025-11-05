(function() {
    const { registerBlockType } = wp.blocks;
    const { createElement } = wp.element;
    const { InspectorControls } = wp.editor;
    const { PanelBody, TextControl, SelectControl } = wp.components;

    registerBlockType('kultrip/widget', {
        title: 'Kultrip Travel Widget',
        description: 'Embed the AI-powered Kultrip travel widget',
        icon: 'airplane',
        category: 'widgets',
        
        attributes: {
            userId: {
                type: 'string',
                default: 'DEMO_AGENCY'
            },
            height: {
                type: 'string',
                default: '600px'
            },
            language: {
                type: 'string',
                default: 'auto'
            }
        },
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { userId, height, language } = attributes;
            
            return createElement('div', null, [
                // Inspector Controls (sidebar)
                createElement(InspectorControls, { key: 'inspector' }, [
                    createElement(PanelBody, { 
                        title: 'Widget Settings',
                        key: 'settings'
                    }, [
                        createElement(TextControl, {
                            label: 'Agency ID',
                            value: userId,
                            onChange: function(value) {
                                setAttributes({ userId: value });
                            },
                            help: 'Your Kultrip agency ID for lead tracking',
                            key: 'userId'
                        }),
                        createElement(TextControl, {
                            label: 'Height',
                            value: height,
                            onChange: function(value) {
                                setAttributes({ height: value });
                            },
                            help: 'Widget height (e.g., 600px, 50vh)',
                            key: 'height'
                        }),
                        createElement(SelectControl, {
                            label: 'Language',
                            value: language,
                            options: [
                                { label: 'Auto-detect', value: 'auto' },
                                { label: 'English', value: 'en' },
                                { label: 'Spanish', value: 'es' }
                            ],
                            onChange: function(value) {
                                setAttributes({ language: value });
                            },
                            key: 'language'
                        })
                    ])
                ]),
                
                // Block preview in editor
                createElement('div', {
                    style: {
                        width: '100%',
                        height: height,
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f9f9f9',
                        color: '#666',
                        fontSize: '16px',
                        textAlign: 'center',
                        padding: '20px'
                    },
                    key: 'preview'
                }, [
                    createElement('div', null, [
                        createElement('div', { 
                            style: { fontSize: '24px', marginBottom: '10px' } 
                        }, '✈️'),
                        createElement('div', { 
                            style: { fontWeight: 'bold', marginBottom: '5px' } 
                        }, 'Kultrip Travel Widget'),
                        createElement('div', { 
                            style: { fontSize: '14px' } 
                        }, `Agency: ${userId} | Language: ${language} | Height: ${height}`),
                        createElement('div', { 
                            style: { fontSize: '12px', marginTop: '10px', opacity: 0.7 } 
                        }, 'This preview shows in the editor. The actual widget will appear on your published page.')
                    ])
                ])
            ]);
        },
        
        save: function() {
            // Return null - we use PHP render callback
            return null;
        }
    });
})();