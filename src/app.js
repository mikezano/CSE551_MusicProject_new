export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: 'welcome',      nav: true, title: 'Welcome' },
      { route: 'users',         name: 'users',        moduleId: 'users',        nav: true, title: 'Github Users' },
      { route: 'child-router',  name: 'child-router', moduleId: 'child-router', nav: true, title: 'Child Router' },
      { route: 'questions', name:'questions', moduleId:'Questions/questions', nav:true, title:'Questions' },
      { route: 'music', name:'music', moduleId:'music', nav:true, title:'Music' }
    ]);

    this.router = router;
  }
}
