export class Questions {
  heading = 'Questions';

  configureRouter(config, router) {
    config.map([
      //{ route: ['', 'welcome'], name: 'welcome',       moduleId: 'welcome',       nav: true, title: 'Welcome' },
      //Default route always needs to be specified
      { route: ['','one'],      name: 'one',         moduleId: 'questions/one',         nav: true, title: 'One' }, 
      { route: ['two'],         name: 'two',         moduleId: 'questions/two',         nav: true, title: 'Two' }, 
      { route: ['three'],       name: 'three',       moduleId: 'questions/three',       nav: true, title: 'Three' }, 
      { route: ['four'],        name: 'four',         moduleId: 'questions/four',       nav: true, title: 'Four' } 
    ]);
    //console.log(router);
    this.router = router;
  }

  activate(params, navigationInstruction){
    this.currentRoute = navigationInstruction;
   // console.log(this.currentRoute);
    //console.log(this.currentRoute.navModel.name);
    //console.log(this.currentRoute.navModel.route);
  }

  next(){
    //switch()
    this.router.navigate("two");
  }
}