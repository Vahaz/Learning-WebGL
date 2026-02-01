const path = require('path');

module.exports = {
    entry: './src/main.ts',
    mode: 'development',
    devtool: 'inline-source-map',

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(glsl|vert|frag)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'asset/shaders/[name][ext]'
                }
            },
            {
                test: /\.(gltf|bin)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'asset/models/[name][ext]'
                }
            },
            {
                test: /\.png$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'asset/img/[name][ext]'
                }
            },
        ],
    },

    devServer: {
        static: {
            directory: path.join(__dirname, '.'),
        },
    },

    resolve: {
        extensions: ['.ts', '.js'],
    },

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'lib',
                    chunks: 'all',
                },
            },
        },
    }
};
