import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { UserResponses } from '../models/userResponses';

@inject(Router, EventAggregator)
export class Start{
    constructor(router, eventAggregator){
        this.router = router;
        console.log("eh?");
        this.ea = eventAggregator;
        this.userResponses = new UserResponses();
        console.log(this.eventAggregator);
    }

    attached(){
        console.log(this.ea);
    }
    next()
    {
        this.router.navigate("one");
        this.ea.publish('sendToOne', {userResponses: this.userResponses});
    }
}