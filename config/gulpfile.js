const gulp          = require('gulp');
const browserSync   = require('browser-sync').create();
const eslint        = require('gulp-eslint');

const cleanHTML     = require('gulp-htmlclean');
const cleanCSS      = require('gulp-clean-css');
const sass          = require('gulp-sass');
const injectSource  = require('gulp-inject');
const inlineSource  = require('gulp-inline-source');
const fileInclude   = require('gulp-file-include');

const glslify       = require('gulp-glslify');

const browserify    = require('browserify');
const browserifyInc = require('browserify-incremental');
const babelify      = require('babelify');
const streamify     = require('gulp-streamify');
const uglify        = require('gulp-uglify');
const source        = require('vinyl-source-stream');

const svgSprite     = require('gulp-svg-sprite');
const imagemin      = require('gulp-imagemin');
const clean         = require('gulp-clean');


// --

const SRC    = ( path = '' ) =>    `../src/${path}`;
const STATIC = ( path = '' ) => `../static/${path}`;
const CONFIG = ( path = '' ) => `../config/${path}`;
const TMP    = ( path = '' ) =>   `../.tmp/${path}`;
const DIST   = ( path = '' ) =>   `../dist/${path}`;


// TEMPLATE --------------------------------------------------------------------

const TEMPLATE_SOURCE = [ SRC('template/**/[^_]*.html') ];

// --

gulp.task('template', () => {

    return gulp.src(TEMPLATE_SOURCE)
        .pipe(fileInclude({

            prefix   : '@@',
            basepath : SRC('template/'),
            indent   : true,
            context  : { LIVE: false }

        })).pipe(gulp.dest(TMP()));
});

gulp.task('template:dist', () => {

    return gulp.src(TEMPLATE_SOURCE)
        .pipe(fileInclude({

            prefix   : '@@',
            basepath : SRC('template/'),
            context  : { LIVE: true }

        })).pipe(cleanHTML())
           .pipe(gulp.dest(DIST()));
});


// STYLE -----------------------------------------------------------------------

const STYLE_SOURCE = [ SRC('style/**/[^_]*.scss') ];

// --

gulp.task('style', () => {

    return gulp.src(STYLE_SOURCE)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(TMP()))
        .pipe(browserSync.stream());
});

gulp.task('style:dist', () => {

    return gulp.src(STYLE_SOURCE)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest(DIST()));
});


// GLSL ------------------------------------------------------------------------

const GLSL_SOURCE = [ SRC('glsl/**/[^_]*.{vert,frag,glsl}') ];

// --

gulp.task('glsl', () => {

    return gulp.src(GLSL_SOURCE)
        .pipe(glslify())
        .pipe(gulp.dest(SRC('shaders/')));
});

gulp.task('glsl:dist', () => {

    return gulp.src(GLSL_SOURCE)
        .pipe(glslify())
        .pipe(gulp.dest(SRC('shaders/')));
});


// SYNTAX ----------------------------------------------------------------------

const SYNTAX_SOURCE = [ SRC('**/*.js'), '!' + SRC('libs/**') ];

// --

gulp.task('syntax', () => {

    return gulp.src(SYNTAX_SOURCE)
        .pipe(eslint({ configFile: CONFIG('.eslintrc') }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('syntax:dist', () => {

    return gulp.src(SYNTAX_SOURCE)
        .pipe(eslint({ configFile: CONFIG('.eslintrc') }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


// SCRIPT ----------------------------------------------------------------------

gulp.task('script', () => {

    return browserifyInc(bundle(true), { cacheFile: CONFIG('.cache.json') })
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest(TMP()));
});

gulp.task('script:dist', () => {

    return bundle(false)
        .bundle()
        .pipe(source('index.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(DIST()));
});

// --

const bundle = ( debug ) => {

    return browserify({

        entries      : SRC('index.js'),
        paths        : [ SRC() ],
        extensions   : [ '.js' ],
        debug        : debug,

        // incremental

        fullPaths    : true,

        cache        : {},
        packageCache : {}

    }).transform(babelify, {

        global  : true,
        only    : [ /src/ ],
        presets : [ '@babel/preset-env' ]
    });
};


// STATIC ----------------------------------------------------------------------

    // ROOT

    const ROOT_SOURCE = [ STATIC('**/[^_]*'), '!' + STATIC('{fonts,svg,img,models,audio}/**') ];

    // --

    gulp.task('static:root', () => {

        return gulp.src(ROOT_SOURCE, { dot: true })
            .pipe(gulp.dest(TMP()));
    });

    gulp.task('static:root:dist', () => {

        return gulp.src(ROOT_SOURCE, { dot: true })
            .pipe(gulp.dest(DIST()));
    });


    // FONTS

    const FONT_SOURCE = [ STATIC('fonts/**/[^_]*') ];

    // --

    gulp.task('static:fonts', () => {

        return gulp.src(FONT_SOURCE)
            .pipe(gulp.dest(TMP('fonts/')));
    });

    gulp.task('static:fonts:dist', () => {

        return gulp.src(FONT_SOURCE)
            .pipe(gulp.dest(DIST('fonts/')));
    });


    // SVG

    const SVG_SOURCE = [ STATIC('svg/**/[^_]*') ];
    const SVG_CONFIG = { mode: { symbol: { dest: './', sprite: 'icons.svg', inline: true } } };

    // --

    gulp.task('static:svg', () => {

        return gulp.src(SVG_SOURCE)
            .pipe(svgSprite(SVG_CONFIG))
            .pipe(gulp.dest(TMP('svg/')));
    });

    gulp.task('static:svg:dist', () => {

        return gulp.src(SVG_SOURCE)
            .pipe(svgSprite(SVG_CONFIG))
            .pipe(gulp.dest(DIST('svg/')));
    });


    // IMAGES

    const IMAGE_SOURCE = [ STATIC('img/**/[^_]*') ];

    // --

    gulp.task('static:images', () => {

        return gulp.src(IMAGE_SOURCE)
            .pipe(gulp.dest(TMP('img/')));
    });

    gulp.task('static:images:dist', () => {

        return gulp.src(IMAGE_SOURCE)
            .pipe(imagemin())
            .pipe(gulp.dest(DIST('img/')));
    });


    // MODELS

    const MODEL_SOURCE = [ STATIC('models/**/[^_]*') ];

    // --

    gulp.task('static:models', () => {

        return gulp.src(MODEL_SOURCE)
            .pipe(gulp.dest(TMP('models/')));
    });

    gulp.task('static:models:dist', () => {

        return gulp.src(MODEL_SOURCE)
            .pipe(gulp.dest(DIST('models/')));
    });


    // AUDIO

    const AUDIO_SOURCE = [ STATIC('audio/**/[^_]*') ];

    // --

    gulp.task('static:audio', () => {

        return gulp.src(AUDIO_SOURCE)
            .pipe(gulp.dest(TMP('audio/')));
    });

    gulp.task('static:audio:dist', () => {

        return gulp.src(AUDIO_SOURCE)
            .pipe(gulp.dest(DIST('audio/')));
    });


    // --

    gulp.task('static', gulp.series(

        'static:root',
        'static:fonts',
        'static:svg',
        'static:images',
        'static:models',
        'static:audio'
    ));

    gulp.task('static:dist', gulp.series(

        'static:root:dist',
        'static:fonts:dist',
        'static:svg:dist',
        'static:images:dist',
        'static:models:dist',
        'static:audio:dist'
    ));


// INLINE ----------------------------------------------------------------------

gulp.task('inline',      () => inline(TMP, false));
gulp.task('inline:dist', () => inline(DIST, true));

// --

const inline = ( DEST, compress ) => {

    return gulp.src(DEST('**/[^_]*.html'))
        .pipe(inlineSource({ rootpath: DEST(), compress: compress }))
        .pipe(gulp.dest(DEST()));
};


// INJECT ----------------------------------------------------------------------

gulp.task('inject',      () => inject(TMP));
gulp.task('inject:dist', () => inject(DIST));

// --

const inject = ( DEST ) => {

    const STYLE_SOURCE  = [ DEST('**/!(*critical).css') ];
    const SCRIPT_SOURCE = [ DEST('**/*.js'), '!' + DEST('draco/**') ];

    return gulp.src(DEST('**/[^_]*.html'))

        .pipe(injectSource(gulp.src(STYLE_SOURCE),  { relative: true }))
        .pipe(injectSource(gulp.src(SCRIPT_SOURCE), { relative: true }))

        .pipe(gulp.dest(DEST()));
};


// SERVER ----------------------------------------------------------------------

    // SERVE

    gulp.task('serve', ( done ) => {

        browserSync.init({ server: { baseDir: TMP() }, ui: false });
        done();
    });

    // RELOAD

    gulp.task('reload', ( done ) => {

        browserSync.reload();
        done();
    });


// CLEANUP ---------------------------------------------------------------------

    // SHADERS

    gulp.task('cleanup:shaders', () => {

        return gulp.src(SRC('shaders/'), { read: false, allowEmpty: true })
            .pipe(clean({ force: true }));
    });

    // .TMP

    gulp.task('cleanup:tmp', () => {

        return gulp.src(TMP(), { read: false, allowEmpty: true })
            .pipe(clean({ force: true }));
    });

    // .CACHE

    gulp.task('cleanup:cache', () => {

        return gulp.src(CONFIG('.cache.json'), { read: false, allowEmpty: true })
            .pipe(clean({ force: true }));
    });

    // DIST

    gulp.task('cleanup:dist', () => {

        return gulp.src(DIST(), { read: false, allowEmpty: true })
            .pipe(clean({ force: true }));
    });

    // DIST:SOURCES

    const DIST_SOURCE = [ DIST('critical.css'), DIST('svg/') ];

    gulp.task('cleanup:dist:source', () => {

        return gulp.src(DIST_SOURCE, { read: false, allowEmpty: true })
            .pipe(clean({ force: true }));
    });


// BUILD -----------------------------------------------------------------------

    // .TMP

    gulp.task('build:tmp', gulp.series(

        gulp.parallel('template', 'style', 'glsl'),

        'syntax',
        'script',
        'static',
        'inline',
        'inject'
    ));

    // DIST

    gulp.task('build:dist', gulp.series(

        gulp.parallel('template:dist', 'style:dist', 'glsl:dist'),

        'syntax:dist',
        'script:dist',
        'static:dist',
        'inline:dist',
        'inject:dist'
    ));


// WATCH -----------------------------------------------------------------------

    // TEMPLATE

    gulp.task('watch:template', () => {

        gulp.watch(SRC('template/**/*'),
            gulp.series('template', 'inline', 'inject', 'reload'));
    });

    // STYLE

    gulp.task('watch:style', () => {

        gulp.watch(SRC('style/**/*'),
            gulp.series('style', 'template', 'inline', 'inject'));
    });

    // GLSL

    gulp.task('watch:glsl', () => {

        gulp.watch(SRC('glsl/**/*'),
            gulp.series('cleanup:shaders', 'glsl', 'script', 'reload'));
    });

    // SCRIPT

    gulp.task('watch:script', () => {

        gulp.watch([ SRC('**/*.js'), '!' + SRC('shaders/**') ],
            gulp.series('script', 'reload', 'syntax'));
    });

    // STATIC

    gulp.task('watch:static', () => {

        gulp.watch(STATIC('**/*'),
            gulp.series('cleanup:tmp', 'build:tmp', 'reload'));
    });

    // --

    gulp.task('watch', gulp.parallel(

        'watch:template',
        'watch:style',
        'watch:glsl',
        'watch:script',
        'watch:static'
    ));


// TASKS -----------------------------------------------------------------------

    // DEVELOP

    gulp.task('dev', gulp.series(

        gulp.parallel('cleanup:shaders', 'cleanup:tmp'),

        'build:tmp',
        'serve',
        'watch'
    ));

    gulp.task('default', gulp.series('dev'));

    // BUILD

    gulp.task('build', gulp.series(

        gulp.parallel('cleanup:shaders', 'cleanup:dist'),
        'build:dist',
        'cleanup:dist:source'
    ));

    // CLEANUP

    gulp.task('cleanup', gulp.series(

        'cleanup:shaders',
        'cleanup:cache',
        'cleanup:tmp',
        'cleanup:dist'
    ));