import {inject} from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { KeyValuePair } from '../models/userResponses';

@inject(Router)
export class Three{
    constructor(router){
        this.router = router;
        this.keyVal = ""; 
        this.keys=[
            {value:1, name:'C major'},
            {value:2, name:'A minor'}
        ]        
    }

    next()
    {
        this.userResponses.key=1;
        localStorage.setItem('userResponses', JSON.stringify(this.userResponses));
        this.router.navigate("final");
    }
    
    attached(){
        this.userResponses = JSON.parse(localStorage.getItem('userResponses'));
    }
}