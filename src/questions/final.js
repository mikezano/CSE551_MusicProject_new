import {inject} from 'aurelia-framework';
import { Router } from 'aurelia-router';
import {Spotify} from 'Vheissu/aurelia-spotify';

@inject(Router, Spotify)
export class Final{
    constructor(router, spotify){
        this.router = router;
        this.spotify = spotify;
        //this.login();
        //debugger;
    }

    login(){
        this.spotify.login().then(data=>{
            console.log("Logged In", data);
            this.spotifyToken = data;
            console.log(this.spotifyToken);
            this.search('artist');
        }).catch(e=>{console.log(e)});
    }

    next()
    {
        localStorage.setItem('userResponses', JSON.stringify(this.userResponses));
        this.router.navigate("final");
    }
    
    attached(){
        this.userResponses = JSON.parse(localStorage.getItem('userResponses'));
        this.login();
    }

    search(type) {
        //https://developer.spotify.com/web-api/search-item/
        this.searchTerm = this.userResponses.genres[0];
        this.spotify.search(this.searchTerm, type).then(data => {
            this.data = JSON.parse(data.response);
            debugger;
        });
    }  
}