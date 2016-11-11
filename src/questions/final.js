import {inject} from 'aurelia-framework';
import { Router } from 'aurelia-router';
import {Spotify} from 'Vheissu/aurelia-spotify';
import {KeyValuePair} from '../models/KeyValuePair';
import {GetInfo} from '../services/GetInfo';

@inject(Router, Spotify)
export class Final{
    constructor(router, spotify){
        this.router = router;
        this.spotify = spotify;
        this.singerResult = [];
        this.lookFor={
            genres:[],
            albumArtists:[]
        };
    }

    login(){
        this.spotify.login().then(data=>{
            console.log("Logged In", data);
            this.spotifyToken = data;   
            this.getResults();
        }).catch(e=>{console.log(e)});
    }

    next()
    {
        localStorage.setItem('userResponses', JSON.stringify(this.userResponses));
    }

    getResults(){
        console.log("Getting Results");

        this.getArtistResults();
        this.getAlbumResults();
    }

    getArtistResults(){


        Promise.all([
            this.search(this.userResponses.artist[0], 'artist'),
            this.search(this.userResponses.artist[1], 'artist'),
            this.search(this.userResponses.artist[2], 'artist')
        ]).then(json=>{

            var a=[];
            for(var i in json)
            {
                a = GetInfo.getGenres(json[i]);
                this.lookFor.genres = this.lookFor.genres.concat(a);
            }
            // var data = {};
            // data = JSON.parse(values[0]);
            // this.getGenres(data.artists);
            // data = JSON.parse(values[1]);
            // this.getGenres(data.artists);
            // data = JSON.parse(values[2]);
            // this.getGenres(data.artists);   

            this.lookFor.genresCounts = GetInfo.getItemCounts(this.lookFor.genres);                     

            //console.log(this.lookFor.genres);
            console.log(this.lookFor);
        });
    }

    getAlbumResults(){

        Promise.all([
            this.search(this.userResponses.album[0], 'album'),
            this.search(this.userResponses.album[1], 'album'),
            this.search(this.userResponses.album[2], 'album')
        ]).then(json=>{
                    
            var data = {};

            var a =[];
            a = GetInfo.getArtistsFromAlbums(json[0]);
            this.lookFor.albumArtists = this.lookFor.albumArtists.concat(a);
            a = GetInfo.getArtistsFromAlbums(json[1]);
            this.lookFor.albumArtists = this.lookFor.albumArtists.concat(a);
            a = GetInfo.getArtistsFromAlbums(json[2]);
            this.lookFor.albumArtists = this.lookFor.albumArtists.concat(a);                                                                    

            this.lookFor.albumArtistsCounts = GetInfo.getItemCounts(this.lookFor.albumArtists);

            var promises = [];
            for(var i in this.lookFor.albumArtistsCounts){
                var p = this.lookFor.albumArtistsCounts[i];
                promises.push(this.search(p.key, 'artist'));
            }
            //Now that we know the artists these albums belong to,  find out genres for the top three
            Promise.all(promises).then(json=>{

                var a=[];
                this.lookFor.genresFromAlbums = [];
                for(var i in json)
                {
                    a = GetInfo.getGenres(json[i]);
                    this.lookFor.genresFromAlbums = this.lookFor.genresFromAlbums.concat(a);
                }
                          
                this.lookFor.genresFromAlbumsCounts = GetInfo.getItemCounts(this.lookFor.genresFromAlbums);
                debugger;
                console.log(this.lookFor);
            })
        });
    }    

    // getTrackResults(){

    //     Promise.all([
    //         this.search(this.userResponses.track[0], 'track'),
    //         this.search(this.userResponses.track[1], 'track'),
    //         this.search(this.userResponses.track[2], 'track')
    //     ]).then(values=>{

    //         var data = {};
    //         data = JSON.parse(values[0]);
    //         this.getArtistsFromTracks(data.albums);
    //         data = JSON.parse(values[0]);
    //         this.getArtistsFromTracks(data.albums);
    //         data = JSON.parse(values[0]);
    //         this.getArtistsFromTracks(data.albums);                                               

    //         this.lookFor.artistOcurrenceFromAlbums = this.getItemCounts(this.lookFor.albumArtists);
    //         var count = this.lookFor.artistOcurrenceFromAlbums.length;


    //         var promises = [];
    //         for(var i in this.lookFor.artistOcurrenceFromAlbums){
    //             var p = this.lookFor.artistOcurrenceFromAlbums[i]
    //             promises.push(this.search(p.key, 'artist'));
    //         }
    //         //Now that we know the artists these albums belong to,  find out genres for the top three
    //         Promise.all(promises).then(values=>{
    //             var data = {};
    //             data = JSON.parse(values[0]);
    //             this.getGenres(data.artists);
    //             data = JSON.parse(values[1]);
    //             this.getGenres(data.artists);
    //             data = JSON.parse(values[2]);
    //             this.getGenres(data.artists);  

    //             console.log(this.lookFor);
    //         })
    //     });        
    // }


    


    attached(){
        this.userResponses = JSON.parse(localStorage.getItem('userResponses'));
        this.login();
    }

    search(searchTerm, type, result) {
        //https://developer.spotify.com/web-api/search-item/
        //this.searchTerm = this.userResponses.genres[0];

        return this.spotify.search(searchTerm, type).then(data => {
           // console.log(data.response);
            //result = JSON.parse(data.response);
            //console.log(this.result);
            this.artistCount++;
            return data.response;
        });
    }  
}