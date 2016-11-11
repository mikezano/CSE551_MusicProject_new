import {inject} from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserResponses } from '../models/userResponses';
import { KeyValuePair } from '../models/keyValuePair';

@inject(Router)
export class Two{
    
    constructor(router){
        this.router = router;
        this.lyricVal=null;
        this.danceabilityVal=null;
        this.energyVal=null;


        this.lyricOptions=[
            {value:1, name:'I prefer instrumental music'},
            {value:2, name:'A normal amount of lyrics is fine'},
            {value:3, name:'I love music with a lot of singing'}
        ]
        this.danceabilityOptions=[
            {value:'l', name:'I hate dancing.'},
            {value:'m', name:'Sometimes'},
            {value:'h', name:'I am always dancing!'}
        ]
        this.energyOptions=[
            {value:'l', name:'I just like to relax to music'},
            {value:'m', name:'Average amount of energy'},
            {value:'h', name:'HIGH ENERGY'}
        ]
    }

    next()
    {      
        console.log(this.lyricVal);
        this.userResponses.instrumentalness = this.lyricVal.value;
        this.userResponses.danceability = this.danceabilityVal.value;
        this.userResponses.energyVal = this.energyVal.value;

        localStorage.setItem('userResponses', JSON.stringify(this.userResponses));
        this.router.navigate("three");
    }

    attached(){
        this.userResponses = JSON.parse(localStorage.getItem('userResponses'));
    }
      
}