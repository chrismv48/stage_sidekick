// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import {getAsyncInjectors} from 'utils/asyncInjectors';
import scenesSaga from 'containers/Scenes/sagas'
import characterSaga from 'containers/Character/sagas'
import charactersSaga from 'containers/Characters/sagas'

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  injectSagas(scenesSaga, characterSaga, charactersSaga)

  return [
    {
      path: '/',
      name: 'dashboard',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Dashboard'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/directory',
      name: 'directory',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/Directory/reducer'),
          import('containers/Directory/sagas'),
          import('containers/Directory'),
        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('directory', reducer.default);
          injectSagas(sagas.default); // Inject the saga
          renderRoute(component);
        });

        importModules.catch(errorLoading);

      },
    }, {
      path: '/characters',
      name: 'characters',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/Characters/reducer'),
          import('containers/Characters/sagas'),
          import('containers/Characters'),
        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('characters', reducer.default);
          injectSagas(sagas.default); // Inject the saga
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/scenes',
      name: 'scenes',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/Scenes/reducer'),
          import('containers/Scenes'),
        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('scenes', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/characters/:characterId',
      name: 'characters',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Character/reducer'),
          import('containers/Character/sagas'),
          import('containers/Character'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('character', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
