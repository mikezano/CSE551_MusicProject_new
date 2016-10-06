import {inject} from 'aurelia-framework';
import {Spotify} from 'Vheissu/aurelia-spotify';

//var s = new Spotify();

@inject(Element,  Spotify)
export class Music {

    //public spotifyToken;
    constructor(element,  spot){

       console.log(spot)
        this.element = element;
        console.log(element);
        this.randomNumber = 0;
        this.spotify = spot;
        this.data=null;
        this.searchTerm = null;
        //console.log(this.spotify);
        this.selectedType = null;
        this.types = ['album', 'artist','playlist', 'track'];
        this.songId=null;
        this.spotifyToken = null;
      
    }
    login(){
        this.spotify.login().then(data=>{
            console.log("Logged In", data);
            this.spotifyToken = data;
            console.log(this.spotifyToken);
        }).catch(e=>{console.log(e)});
    }
    
    attached(){
         //var spot = SpotifyWebApi();
        this.randomNumber = Math.random() * 100;
        console.log(this.randomNumber);
    }

    topTracks(){
        this.spotify.getTopTracks("6tE5glPdOD3IW3GoLY87Dc").then(data=>{
            this.data = data.response;
        });
    }

    exampleGetAlbum() {
        this.spotify.getAlbum('6tE5glPdOD3IW3GoLY87Dc').then(data => {
            this.data = data.response;
        });
    }

    songInfo() {
        this.spotify.getAudioFeatures(this.songId).then(data => {
            this.data = data.response;
        });
    }    


    exampleGetArtist() {
        this.spotify.getArtist('1L3hqVCHSL1Ajy3m0z1bAT').then(data => {
            this.data = data;
        }).error((e)=>{
            console.log(e);
        });
    } 

    getPlaylists(){
        this.spotify.getUserPlaylists('mikezano').then(data=>{
            this.data = data.response;
        });
    }

    getPlaylistTracks(){
        this.spotify.getPlaylistTracks('mikezano', '2i8KbUTxnt8ACq0LEDbLmY').then(data=>{
            this.data = data.response;
        });
    }

    search() {
        this.spotify.search(this.searchTerm, this.selectedType).then(data => {
            this.data = data.response;
        });
    }      
     activated() {
        console.log("activated");
    }
 
    created() {
        console.log("created");
        //console.log(this.myDiv);    
      
    }
 
    activate() {
        console.log("activate");
    }
 
    canActivate() {
        console.log("canActivate");
    }    
}