import {inject} from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserResponses } from '../models/userResponses';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Router, EventAggregator)
export class One{
    constructor(router, eventAggregator){
        this.router = router;
        this.ea = eventAggregator;
        this.userResponses = new UserResponses();
        console.log("constructed");

    }

    next()
    {
        localStorage.setItem('userResponses', JSON.stringify(this.userResponses));
        this.router.navigate("two");
    }

    attached(){
        console.log("at this point");
        // this.ea.subscribe('sendToOne', (userResponses)=>{
        //      this.userResponses = userResponses;
        //      console.log("sent over");
        //      console.log(this.userResponses);
        //  });
        // this.userResponses.test = "Hello";
    }
    
    check(){
        console.log(this.userResponses.genres);
    }
}