const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const BabelRules = {
    test: /\.(js)$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    options: {
        presets: [
            [
                '@babel/preset-react',
                {
                    runtime: 'automatic',
                },
            ],
        ],
    },
}

const CSSRules = {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader'],
}

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    optimization: {
        minimize: false,
    },
    devServer: {
        port: 3000,
        historyApiFallback: true,
    },
    module: {
        rules: [BabelRules, CSSRules],
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            components: path.resolve(__dirname, 'src/components'),
            pages: path.resolve(__dirname, 'src/pages'),
            context: path.resolve(__dirname, 'src/context'),
            util: path.resolve(__dirname, 'src/util'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
}
