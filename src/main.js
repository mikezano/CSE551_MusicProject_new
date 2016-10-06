import 'bootstrap';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  aurelia.use.plugin('Vheissu/aurelia-spotify', config => {
      config.setClientId('670e55c1f57d48a8bd087cb648ce1a67');
      config.setRedirectUri('http://localhost:9000/src/callback.html');
      config.setScope('playlist-read-private');
  }); 
  //Uncomment the line below to enable animation.
  //aurelia.use.plugin('aurelia-animator-css');
  //if the css animator is enabled, add swap-order="after" to all router-view elements

  //Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  //aurelia.use.plugin('aurelia-html-import-template-loader')

  aurelia.start().then(() => aurelia.setRoot());
}
