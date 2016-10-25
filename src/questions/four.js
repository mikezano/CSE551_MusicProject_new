import {inject} from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class Four{
    constructor(router){
        this.router = router;
    }

    next()
    {
        localStorage.setItem('userResponses', JSON.stringify(this.userResponses));
        this.router.navigate("final");
    }
    
    attached(){
        this.userResponses = JSON.parse(localStorage.getItem('userResponses'));
    }
}