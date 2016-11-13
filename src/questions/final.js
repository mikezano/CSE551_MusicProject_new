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
            albumArtists:[],
            finalGenreCount:[],
            tracks:[]
        };
    }

    login(){
        this.spotify.login().then(data=>{
            console.log("Logged In", data);
            this.spotifyToken = data;   
            this.getResults();
        }).catch(e=>{console.log(e)});
    }

    next(){
        localStorage.setItem('userResponses', JSON.stringify(this.userResponses));
    }

    getResults(){
        console.log("Getting Results");

        Promise.all([
            this.doWorkArtist(),
            this.doWorkAlbum(),
            this.doWorkTrack()
        ]).then(()=>{
            console.log(this.lookFor);
            this.doWorkGenres();
        });
    }

    doWorkArtist(){
        return new Promise((resolve)=>{
            this.getArtistResults(resolve);
        });
    }

    doWorkAlbum(){
        return new Promise((resolve)=>{
            this.getAlbumResults(resolve);
        });
    }

    doWorkTrack(){
        return new Promise((resolve)=>{
            this.getTrackResults(resolve);
        });
    }  

    doWorkGenres(){
        return new Promise((resolve)=>{
            this.getTracksFromGenres(resolve);
        });
    }      

    getArtistResults(resolve){

        Promise.all([
            this.search(this.userResponses.artist[0], 'artist'),
            this.search(this.userResponses.artist[1], 'artist'),
            this.search(this.userResponses.artist[2], 'artist')
        ]).then(spotifyResult=>{

            if(!this.lookFor.genresFromArtists)
                this.lookFor.genresFromArtists = [];

            spotifyResult.forEach(result=>{
                this.lookFor.genresFromArtists = 
                    this.lookFor.genresFromArtists.concat(GetInfo.getGenres(result));
            });

            this.lookFor.genresFromArtistsCounts = GetInfo.getItemCounts(this.lookFor.genresFromArtists);   
            resolve();                  
        });
    }

    getAlbumResults(resolve){

        Promise.all([
            this.search(this.userResponses.album[0], 'album'),
            this.search(this.userResponses.album[1], 'album'),
            this.search(this.userResponses.album[2], 'album')
        ]).then(spotifyResult=>{

            if(!this.lookFor.albumArtists)
                this.lookFor.albumArtists = [];

            spotifyResult.forEach(result=>{
                this.lookFor.albumArtists =
                    this.lookFor.albumArtists.concat(GetInfo.getArtistsFromAlbums(result));
            });                                                                   

            this.lookFor.albumArtistsCounts = GetInfo.getItemCounts(this.lookFor.albumArtists);
            //build promises to look for all genres related to artists from albums
            var promises = [];
            this.lookFor.albumArtistsCounts.forEach(item=>{
                promises.push(this.search(item.key, 'artist'));
            });

            //Find genres
            Promise.all(promises).then(spotifyResult=>{

                if(!this.lookFor.genresFromAlbums)
                    this.lookFor.genresFromAlbums = [];

                spotifyResult.forEach(result=>{                    
                    this.lookFor.genresFromAlbums =
                        this.lookFor.genresFromAlbums.concat(GetInfo.getGenres(result));
                });

                 //remove genres that don't fit what the artist search had
                 this.lookFor.genresFromAlbums = this.lookFor.genresFromAlbums.filter(i=>{
                     return this.lookFor.genresFromArtists.indexOf(i) >= 0;
                 });
                
                this.lookFor.genresFromAlbumsCounts = GetInfo.getItemCounts(this.lookFor.genresFromAlbums);

                resolve();
            })
        });
    }    

    getTrackResults(resolve){

        Promise.all([
            this.search(this.userResponses.track[0], 'track'),
            this.search(this.userResponses.track[1], 'track'),
            this.search(this.userResponses.track[2], 'track')
        ]).then(values=>{

            this.lookFor.tracks = this.lookFor.tracks.concat(GetInfo.getArtistsFromTracks(values[0]));
            this.lookFor.tracks = this.lookFor.tracks.concat(GetInfo.getArtistsFromTracks(values[1]));
            this.lookFor.tracks = this.lookFor.tracks.concat(GetInfo.getArtistsFromTracks(values[2]));

            this.lookFor.tracks = this.lookFor.tracks.sort((a,b)=>{
                return b.popularity-a.popularity;
            });
            resolve();
        });        
    }

    getTracksFromGenres(resolve){
        return new Promise((resolve)=>{

            this.lookFor.overallGenreCounts = 
                this.lookFor.genresFromAlbumsCounts.concat(this.lookFor.genresFromArtistsCounts);
           
            this.lookFor.finalGenreCount=[];
            this.lookFor.overallGenreCounts.forEach(item=>{

                var index = this.lookFor.finalGenreCount.findIndex(i=>{return i.key == item.key;});

                if( index < 0)
                    this.lookFor.finalGenreCount.push(item);
                else{            
                    this.lookFor.finalGenreCount[index].value += item.value;
                }
            });

            var promises=[];
            this.lookFor.finalGenreCount.forEach(i=>{
                var encode = encodeURIComponent('genre:"'+i.key+'"');
                debugger;
                promises.push(this.search(encode, 'track'));
            });

            Promise.all(promises).then(spotifyResult=>{

                this.lookFor.tracks = this.lookFor.tracks.concat(GetInfo.getArtistsFromTracks(spotifyResult[0]));
                this.lookFor.tracks = this.lookFor.tracks.concat(GetInfo.getArtistsFromTracks(spotifyResult[1]));
                this.lookFor.tracks = this.lookFor.tracks.concat(GetInfo.getArtistsFromTracks(spotifyResult[2]));                
                this.lookFor.tracks = this.lookFor.tracks.concat(GetInfo.getArtistsFromTracks(spotifyResult[3]));                
                this.lookFor.tracks = this.lookFor.tracks.concat(GetInfo.getArtistsFromTracks(spotifyResult[4]));                
                this.lookFor.tracks = this.lookFor.tracks.concat(GetInfo.getArtistsFromTracks(spotifyResult[5]));                
                this.lookFor.tracks = this.lookFor.tracks.concat(GetInfo.getArtistsFromTracks(spotifyResult[6]));                
                this.lookFor.tracks = this.lookFor.tracks.concat(GetInfo.getArtistsFromTracks(spotifyResult[7]));  
                this.lookFor.tracks = this.lookFor.tracks.sort((a,b)=>{
                    return b.popularity-a.popularity;
                });     

                resolve();
            });
        });

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