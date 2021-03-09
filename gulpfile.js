const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');

const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');

function browsersync() {
    browserSync.init({
        server : {
            baseDir: 'src/'
        }
    });
}

function cleanDist() {
    return del('dist')
}

function images() {
    return src('src/images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/images'))
}

function styles() {
    return src([
        'node_modules/normalize.css/normalize.css',
        'src/scss/style.scss'
    ])
        .pipe(scss({outputStyle: 'expanded'}))
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 3 versions'],
            grid: true
        }))
        .pipe(dest('src/css')) 

        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 3 versions'],
            grid: true
        }))
        .pipe(dest('src/css')) 

        .pipe(browserSync.stream());
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'src/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js')) 
    .pipe(browserSync.stream());
}

function conv_otf2ttf() {
    return src('src/fonts/**/*.ttf')
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest('src/fonts'))
}

function conv_ttf2woff() {
    src('src/fonts/**/*.ttf')
        .pipe(ttf2woff())
        .pipe(dest('src/fonts')) 
    return src('src/fonts/**/*.ttf')
        .pipe(ttf2woff2())
        .pipe(dest('src/fonts'))
}

function build() {
    return src([
        'src/css/style.min.css',
        'src/css/style.css',
        'src/fonts/**/*',
        'src/js/main.min.js',
        'src/*.html'
    ], {base:'src'})
    .pipe(dest('dist'))
}

function watching() {
    watch(['src/scss/**/*.scss'], styles);
    watch(['src/js/**/*.js', '!src/js/main.min.js'], scripts);
    watch(['src/*.html']).on('change', browserSync.reload);
}


exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browserSync = browsersync;
exports.images = images;
exports.cleanDist = cleanDist;

exports.conv_otf2ttf = conv_otf2ttf;
exports.conv_ttf2woff = conv_ttf2woff;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching);