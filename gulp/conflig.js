var src = './src';
var dist = './dist';


module.exports = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: src + '/index.html',
        js: src + '/**/*.js',
        libs: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/bootstrap-material-design/dist/js/material.js',
            'node_modules/bootstrap-material-design/dist/js/ripples.js'
        ],
        images: src + '/images/*',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            //'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
            'node_modules/bootstrap-material-design/dist/css/bootstrap-material-design.css',
            'node_modules/bootstrap-material-design/dist/css/ripples.css',
            'node_modules/toastr/toastr.css'
        ],
        less: [
            src + '/styles/less/**/*less'
        ],
        dist: dist,
        mainJs: src + '/main.js'
    }
};