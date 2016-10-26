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
        this.singerResult = [];
    }

    login(){
        this.spotify.login().then(data=>{
            console.log("Logged In", data);
            this.spotifyToken = data;
            console.log(this.spotifyToken);
            this.search('artist');

            //this.singerResults =[];
   
            this.getResults();
        }).catch(e=>{console.log(e)});

    }

    next()
    {
        localStorage.setItem('userResponses', JSON.stringify(this.userResponses));
    }

    getResults(){

        for(var i in this.userResponses.singers){
            console.log(this.userResponses.singers[i]);
            this.search(this.userResponses.singers[i], 'artist', this.singerResult[i]);
        }
        
    }
    
    attached(){
        this.userResponses = JSON.parse(localStorage.getItem('userResponses'));
        this.login();
    }

    search(searchTerm, type, result) {
        //https://developer.spotify.com/web-api/search-item/
        //this.searchTerm = this.userResponses.genres[0];
        
        this.spotify.search(searchTerm, type).then(data => {
            result = JSON.parse(data.response);
            console.log(this.singerResult);
            debugger;

        });
    }  
}