import {inject} from 'aurelia-framework';
import { Router } from 'aurelia-router';
import {Spotify} from 'Vheissu/aurelia-spotify';

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

        var p1 = this.search(this.userResponses.artist[0], 'artist');
        var p2 = this.search(this.userResponses.artist[1], 'artist');
        var p3 = this.search(this.userResponses.artist[2], 'artist');

        Promise.all([p1,p2,p3]).then(values=>{
            var data = {};
            data = JSON.parse(values[0]);
            this.getGenres(data.artists);
            data = JSON.parse(values[1]);
            this.getGenres(data.artists);
            data = JSON.parse(values[2]);
            this.getGenres(data.artists);                        

            console.log(this.lookFor.genres);
        });
    }

    getAlbumResults(){

        var p1 = this.search(this.userResponses.album[0], 'album');
        var p2 = this.search(this.userResponses.album[1], 'album');
        var p3 = this.search(this.userResponses.album[2], 'album');

        Promise.all([p1,p2,p3]).then(values=>{
            var data = {};
            data = JSON.parse(values[0]);
            this.getArtistsFromAlbums(data.albums);
            data = JSON.parse(values[0]);
            this.getArtistsFromAlbums(data.albums);
            data = JSON.parse(values[0]);
            this.getArtistsFromAlbums(data.albums);                                               

            console.log(this.lookFor.albumArtists);

            var result = {};
            var a = this.lookFor.albumArtists;
            for(var i = 0; i < a.length; ++i) {
                if(!result[a[i]])
                    result[a[i]] = 0;
                ++result[a[i]];
            }            
            console.log(result);

        });
    }    
    
    getGenres(artists){
        for(var item in artists.items){
            var obj = artists.items[item];
            for(var i in obj.genres){
                this.lookFor.genres.push(obj.genres[i]);
            }
        }
    }

    getArtistsFromAlbums(albums){

        for(var item in albums.items){
            var obj = albums.items[item];

            for(var i in obj.artists){
                this.lookFor.albumArtists.push(obj.artists[i].name);
            }
        }
    }

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