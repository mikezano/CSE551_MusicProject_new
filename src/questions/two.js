import {inject} from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserResponses } from '../models/userResponses';

@inject(Router)
export class Two{
    
    constructor(router){
        this.router = router;
    }

    next()
    {
        localStorage.setItem('userResponses', JSON.stringify(this.userResponses));
        this.router.navigate("three");
    }

    attached(){
        this.userResponses = JSON.parse(localStorage.getItem('userResponses'));
    }
}