import {inject} from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class Three{
    constructor(router){
        this.router = router;
    }

    next()
    {
        this.router.navigate("four");
    }
}