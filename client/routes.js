// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import {getAsyncInjectors} from 'utils/asyncInjectors';
import apiSaga from 'api/sagas'

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  injectSagas(apiSaga)

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
          import('containers/Directory/Directory'),
        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);

      },
    }, {
      path: '/characters',
      name: 'characters',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/Characters/Characters'),
        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/scenes',
      name: 'scenes',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/Scenes/Scenes'),
        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/scenes/:sceneId',
      name: 'scene',
      getComponent(location, cb) {
        import('containers/Scene/Scene')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/characters/:characterId',
      name: 'characters',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Character/Character'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/costumes',
      name: 'costumes',
      getComponent(location, cb) {
        import('containers/Costumes/Costumes')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/costumes/:costumeId',
      name: 'costume',
      getComponent(location, cb) {
        import('containers/Costume/Costume')
          .then(loadModule(cb))
          .catch(errorLoading);
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
