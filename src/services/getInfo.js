import {KeyValuePair} from '../models/KeyValuePair';

export class GetInfo
{
    static getArtistsFromAlbums(json){

        var data = JSON.parse(json);
        var albums = data.albums;

        var artistsFromAlbums = [];
        for(var item in albums.items){
            var obj = albums.items[item];
            for(var i in obj.artists){
                artistsFromAlbums.push(obj.artists[i].name);
            }
        }
        return artistsFromAlbums;
    }

    static getGenres(json){

        var data = JSON.parse(json);
        var artists = data.artists;

        var genres =[];
        for(var item in artists.items){
            var obj = artists.items[item];
            for(var i in obj.genres){
                genres.push(obj.genres[i]);
            }
        }

        return genres;
    }    

    static getItemCounts(a)
    {
        var result = [];
        //loop through artists found
        for(var i = 0; i < a.length; ++i) {
            //get one artist
            var key = a[i];
            //find artist in result set
            var item = result.length > 0 ? result.filter(a=>{return a.key == key;}) : [];
            //if not found push in
            if(item.length == 0){
                result.push(new KeyValuePair(key, 0));
                item = result.length > 0 ? result.filter(a=>{return a.key == key;}) : [];
            }
            item[0].value += 1;
        }  

        result = result.sort((a,b)=>{
            return b.value - a.value;
        });  

        return result;    
    }

    static getArtistsFromTracks(json){

        var data = JSON.parse(json);
        var tracks = data.tracks;
        var result =[];

        for(var item in tracks.items){
            var obj = tracks.items[item];
            result.push({
                id: obj.id,
                name: obj.name,
                popularity: obj.popularity
            });
        }
        return result;
    }    
}