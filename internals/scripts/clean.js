require('shelljs/global');
const addCheckMark = require('./helpers/checkmark.js');

if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}

if (!test('-e', 'internals/templates')) {
  echo('The example is deleted already.');
  exit(1);
}

process.stdout.write('Cleanup started...');

// Reuse existing LanguageProvider and i18n tests
mv('client/containers/LanguageProvider/tests', 'internals/templates/containers/LanguageProvider');
cp('client/tests/i18n.test.js', 'internals/templates/tests/i18n.test.js');

// Cleanup components/
rm('-rf', 'client/components/*');

// Handle containers/
rm('-rf', 'client/containers');
mv('internals/templates/containers', 'client');

// Handle tests/
mv('internals/templates/tests', 'client');

// Handle translations/
rm('-rf', 'client/translations')
mv('internals/templates/translations', 'client');

// Handle utils/
rm('-rf', 'client/utils');
mv('internals/templates/utils', 'client')

// Replace the files in the root client/ folder
cp('internals/templates/app.js', 'client/app.js');
cp('internals/templates/global-styles.js', 'client/global-styles.js');
cp('internals/templates/i18n.js', 'client/i18n.js');
cp('internals/templates/index.html', 'client/index.html');
cp('internals/templates/reducers.js', 'client/reducers.js');
cp('internals/templates/routes.js', 'client/routes.js');
cp('internals/templates/store.js', 'client/store.js');

// Remove the templates folder
rm('-rf', 'internals/templates');

addCheckMark();

// Commit the changes
if (exec('git add . --all && git commit -qm "Remove default example"').code !== 0) {
  echo('\nError: Git commit failed');
  exit(1);
}

echo('\nCleanup done. Happy Coding!!!');
