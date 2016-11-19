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

    startOver(){
        this.router.navigate("");
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

            return this.doWorkGenres();
        }).then(()=>{

            this.filterRecommendations();
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
        // return new Promise((resolve)=>{
        //     this.getTracksFromGenres(resolve);
        // });
        return new Promise((resolve)=>{
            this.getTracksFromGenres().then(()=>{

                return this.getTop3Items();
            }).then(()=>{
                
                return this.filterRecommendations();
           
            }).then(()=>{
                resolve();
            });
        });

    }      

    filterRecommendations(){

        return new Promise((resolve)=>{

            var artist_ids = "";

            this.lookFor.recommended.forEach(item=>{
                artist_ids += item.artist_id+",";
            });
            artist_ids = artist_ids.slice(0, -1);

            this.spotify.getArtists(artist_ids).then((result)=>{

                var data = JSON.parse(result.response);

                data.artists.forEach((item,i)=>{

                    this.lookFor.recommended[i].remove = false;
                    var artist_genres = item.genres;
                    artist_genres.forEach(genre=>{
                        var isInFinalGenreCount = this.lookFor.finalGenreCount.findIndex((i)=>{
                            return i.key==genre;
                        });
                        if(isInFinalGenreCount<0)
                            this.lookFor.recommended[i].remove = true;
                    })
                });

                this.lookFor.recommended = this.lookFor.recommended.filter(i=>{
                    return !i.remove;
                });
                resolve();
            });   

        });

    }

    getTop3Items(){

        return new Promise((resolve)=>{

            var options ={
                seed_tracks : [],
                seed_genres : [],
                target_popularity:70,
                target_speechiness:this.lookFor.instrumentalness,
                target_energy:this.lookFor.energyVal,
                target_danceability:this.lookFor.danceability
            };      

            options.seed_tracks = this.lookFor.tracks[0].id+","+this.lookFor.tracks[1].id+","+this.lookFor.tracks[2].id;
            options.seed_genres = this.lookFor.finalGenreCount[0].key+","+this.lookFor.finalGenreCount[1].key;
            options.seed_genres = options.seed_genres.replace(" ", "+");
            this.spotify.recommendations(options).then(result=>{
                var data = JSON.parse(result.response);

                this.lookFor.recommended = [];
                data.tracks.forEach(track=>{
                    this.lookFor.recommended.push({
                        id:track.id,
                        name:track.name,
                        popularity:track.popularity,
                        preview_url:track.preview_url,
                        artist_url:track.artists[0].href,
                        artist_id:track.artists[0].id
                    });
                });

                this.lookFor.recommended = this.lookFor.recommended.sort((a,b)=>{
                    return b.popularity-a.popularity;
                });
                resolve();
            });
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

        var promises
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

            //remove genres that appear only once...they may be one offs
            var promises=[];
            this.lookFor.finalGenreCount.forEach(i=>{
                if(i.value >4){
                    var encode = 'genre:"'+i.key+'"';
                    promises.push(this.search(encode, 'track'));
                }
            });


            Promise.all(promises).then(spotifyResult=>{

                spotifyResult.forEach(json=>{
                    this.lookFor.tracks = this.lookFor.tracks.concat(GetInfo.getArtistsFromTracks(json));
                });

                this.lookFor.tracks = this.lookFor.tracks.sort((a,b)=>{
                    return b.popularity-a.popularity;
                });     
                
                //filter duplicate tracks
                var removeDupes = [];
                this.lookFor.tracks.forEach(track=>{
                    var index = removeDupes.findIndex(i=>i.name == track.name);
                    if(index<0)
                        removeDupes.push(track);
                });
                this.lookFor.tracks = removeDupes;
                resolve();
            });
        });

    }

    attached(){
        this.userResponses = JSON.parse(localStorage.getItem('userResponses'));
        this.login();
    }

    search(searchTerm, type) {
        //https://developer.spotify.com/web-api/search-item/
        //this.searchTerm = this.userResponses.genres[0];

        return this.spotify.search(searchTerm, type).then(data => {

            //this.artistCount++;
            return data.response;
        });
    } 

    recommendations(searchTerm, type, result) {
        //https://developer.spotify.com/web-api/get-recommendations/
        //this.searchTerm = this.userResponses.genres[0];

        return this.spotify.recommendations(searchTerm, type).then(data => {
           // console.log(data.response);
            //result = JSON.parse(data.response);
            //console.log(this.result);
            //this.artistCount++;
            return data.response;
        });
    }      
}