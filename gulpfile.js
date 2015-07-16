var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    eventStream = require('event-stream'),
    tslint = require('gulp-tslint');




gulp.task('compile', function () {
    
    var tsResult = gulp.src(['./**/*.ts', '!./node_modules/**', '!./**/typings/**', '!./**/*.d.ts'])
        .pipe(ts({
        declarationFiles: true,
        target: 'ES5',
        module: 'commonjs'
    }));
    return eventStream.merge(
        tsResult.js
            .pipe(gulp.dest('./'))
    );

});

gulp.task('bundle', ['tslint'] , function () {
    
    var tsResult = gulp.src(['./**/*.ts', '!./node_modules/**', '!./**/typings/**', '!./**/*.d.ts', '!./_release/**'])
        .pipe(ts({
        declarationFiles: true,
        target: 'ES5',
        module: 'commonjs'
    })
         .pipe(tslint())
         .on('error', function (err) {
        gutil.log('**************** TypeScript Compilation Error *******************************')
        gutil.log('****************        Stopping build        *******************************')
        process.exit('1');
    }));
    
    return eventStream.merge(
        tsResult.js
            .pipe(removeLines({ 'filters': [/\.d\.ts\"/] }))
            .pipe(removeLines({ 'filters': [/\.ts\"/] }))
            .pipe(gulp.dest('_release'))
    );

});


/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', function () {
    return gulp.src(['./**/*.ts', '!./node_modules/**', '!./**/typings/**', '!./**/*.d.ts', '!./_release/**'])
        .pipe(tslint())
        .pipe(tslint.report('prose', {
        emitError : true
    }));
});