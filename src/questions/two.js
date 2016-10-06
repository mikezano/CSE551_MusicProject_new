import {inject} from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class Two{
    constructor(router){
        this.router = router;
    }

    next()
    {
        this.router.navigate("three");
    }
}