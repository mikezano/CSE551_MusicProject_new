import {inject} from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserResponses } from '../models/userResponses';

@inject(Router)
export class Start{
    constructor(router){
        this.router = router;
        this.userResponses = new UserResponses();
    }

    attached(){
        localStorage.clear('userResponses');
    }
    next()
    {
        this.router.navigate("one");
    }
}