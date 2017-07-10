var gutil = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var startTime;

module.exports = {
    start: function (filepath) {
        startTime = process.hrtime();
        gutil.log(gutil.colors.green('started ' + filepath) + '...');
    },

    end: function (filepath) {
        var taskTime = process.hrtime(startTime);
        var prettyTime = prettyHrtime(taskTime);
        gutil.log(gutil.colors.green((filepath ? filepath : 'Task') + ' completed'), 'in', gutil.colors.magenta(prettyTime));
    }
};
