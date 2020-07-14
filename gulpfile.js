const { src, parallel, watch, dest, series } = require('gulp');
const browserSync = require('browser-sync');
const uglify = require('gulp-uglify-es').default; // plugin
const concat = require('gulp-concat'); // plugin
const less = require('gulp-less'); // plugin
const cleanCSS = require('gulp-clean-css'); // plugin
const autoPrefixer = require('gulp-autoprefixer'); // plugin
const imagemin = require('gulp-imagemin'); // plugin
const newer = require('gulp-newer'); // plugin
const clean = require('gulp-clean'); // plugin

exports.browsersync = function browsersync() {
    browserSync.init({
        server: { baseDir: 'src' },
        notify: false,
        online: true,
    })
};

exports.scripts = function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap/dist/js/*.js',
        'src/js/app.js'
    ])
        .pipe(concat('app.min.js'))//completing to the one file
        .pipe(uglify())//squeeze file
        .pipe(dest('src/js/'))//load finished file to dir
        .pipe(browserSync.stream());//reactivity for browser updating after changing in any file
};

exports.startWatcher = function startWatcher() {
    watch(['src/**/*.js', '!src/**/*.min.js'], exports.scripts);
    watch('src/images/*.js', exports.images);
    watch(`src/less/*.less`, exports.styles);
    watch('src/**/*.html').on('change', browserSync.reload);
};

exports.styles = function styles() {
    return src([
        `src/less/*.less`,
        'node_modules/bootstrap-less/bootstrap/bootstrap.less'
    ])
        .pipe(less())
        .pipe(concat('app.min.css'))
        .pipe(autoPrefixer({ overrideBrowsersList: ['last 10 versions']}))// last 10 browser's versions
        .pipe(cleanCSS({ level: 1, compatibility: 'ie8'}))
        .pipe(dest('src/css/'))
        .pipe(browserSync.stream());//refresh page
};

exports.images = function images() {
    return src('src/images/*.jpg')
        .pipe(newer('src/images/'))
        .pipe(imagemin({
            optimizationLevel: 9,
        }))
        .pipe(dest('src/images/'))
};

exports.cleandist = function cleandist () {
    return src('dist/')
        .pipe(clean({force: true}));
};

function moveFilesToDist() {
    return src([
        'src/css/**/*.min.css',
        'src/js/**/*.min.js',
        'src/images/*.jpg',
        'src/**/*.html'
    ], { base: 'src' })
        .pipe(dest('dist'));
}

exports.build = series(
    exports.cleandist,
    exports.styles,
    exports.scripts,
    exports.images,
    moveFilesToDist
);

exports.default = parallel(
    exports.styles,
    exports.scripts,
    exports.images,
    exports.browsersync,
    exports.startWatcher
);