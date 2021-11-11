export const createHighlightPlugin = () => {
    return {
        customStyleMap: {
            YELLOW_HIGHLIGHT: {
                background: '#fffe0d',
                padding: '0 .3em',
            },
            PURPLE_HIGHLIGHT: {
                background: '#7c7ce1',
                padding: '0 .3em',
            },
            BLUE_HIGHLIGHT: {
                background: '#45cdfa',
                padding: '0 .3em',
            },
            RED_HIGHLIGHT: {
                background: '#cb2b20d3',
                padding: '0 .3em',
                color: '#fff',
            },
        },
    }
}
