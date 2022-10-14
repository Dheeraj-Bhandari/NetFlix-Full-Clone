import navbar from "../Components/navbar.js";

document.getElementById('header').innerHTML = navbar;



const apiKey = '9e997fe8c2efd000188bc88e3dda6d23';
// const youtubeApiKey = 'AIzaSyC7bWr31DArqVECDyRJbH-g106fKypGKRE'
const youtubeApiKey = 'AIzaSyBa770uGbngfNCOB2sg8ykjuXkWTGFZTxs'
const apiEndPoint = 'https://api.themoviedb.org/3'
const imgPath = "https://image.tmdb.org/t/p/original"
const apiPath = {
    fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
    fecthTrending: `${apiEndPoint}/trending/all/week?api_key=${apiKey}&language=en-US`,
    fetchMoviesList: (id) => `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fecthMovie: (id) => `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`,
    fecthTvshow: (id) => `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`,
    fecthSimilarMovie: (id) => `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}&language=en-US&page=1`,
    fecthSimilarTVShow: (id) => `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${apiKey}&language=en-US&page=1`,
    fecthCrewDetails: (id) => `${apiEndPoint}/movie/${id}/credits?api_key=${apiKey}&language=en-US`,
    fecthTvShowCrewDetails: (id) => `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}&language=en-US`,
    searchMovieTraileronYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtubeApiKey}`

}

fecthMovie();
async function fecthMovie() {
    const moviedetals = localStorage.getItem('movieId');

    const res = await fetch(apiPath.fecthMovie(moviedetals));
    const data = await res.json();
    const crewres = await fetch(apiPath.fecthCrewDetails(moviedetals));
    const crewdata = await crewres.json();
    console.log(data);
    console.log(crewdata);


    if (Array.isArray(crewdata.cast) && crewdata.cast) {

        const res = await fetch(apiPath.fecthMovie(moviedetals));
        const data = await res.json();


        const crewres = await fetch(apiPath.fecthCrewDetails(moviedetals));
        const crewdata = await crewres.json();

        const similarMovieres = await fetch(apiPath.fecthSimilarMovie(moviedetals));
        const similarMovieData = await similarMovieres.json();
        appenddataMovieSection(data, crewdata);
        appendVideo(data);
        appenddataCrewSection(data, crewdata);
        movieLikeThisSection(similarMovieData.results);
        console.log("yes is arary")
        console.log(data);
        console.log(crewdata);
        console.log(similarMovieData.results);
    }
    else {
        console.log("Inside Tv Show Condition")

        const similarMovieres = await fetch(apiPath.fecthSimilarTVShow(moviedetals));
        const similarMovieData = await similarMovieres.json();

        const res = await fetch(apiPath.fecthTvshow(moviedetals));
        const data = await res.json();


        const crewres = await fetch(apiPath.fecthTvShowCrewDetails(moviedetals));
        const crewdata = await crewres.json();
        appenddataMovieSection(data, crewdata);
        appendVideo(data);
        appenddataCrewSection(data, crewdata);
        movieLikeThisSection(similarMovieData.results);
        console.log(data);
        console.log(crewdata);
        console.log(similarMovieData.results);
    }


}


function appenddataMovieSection(data, crewdata) {
    if(crewdata.cast.length<2) return;
    const videoSectiondata = `
  
    <div id="videoSection" style="background-image: url(${imgPath}${data.backdrop_path});">
                <div class="movieimg">
                    <img class="movieImg"
                        src="${imgPath}${data.poster_path}" alt="Movie Poster">
                </div>
                <div class="movieDetails">
                    <div class="movenameandType">
                        <h3>${data.title || data.original_name}</h3>
                        <p>${data.release_date || data.first_air_date} (${data.original_language}) Action, Adventure, Thriller, Adventure RunTime || Episodes ${data.runtime || data.number_of_episodes} MIN || Episodes</p>
                    </div>
                    <div class="addToWacthList">
                        <i class="fa fa-list" aria-hidden="true"></i>
                        <span><i class="fa-solid fa-play"></i> Play Trailer</span>
                    </div>
    
                    <div class="movieOverView">
                        <h4>OverView</h4>
                        <p>${data.overview}</p>
                    </div>
    
                    <div class="movieDirectorName">
                        <div class="directorNmae">
                            <p>${crewdata.cast[0].original_name}</p>
                            <p>${crewdata.cast[0].character}</p>
                        </div>
                        <div class="screenplay">
                            <p>${crewdata.cast[1].original_name}</p>
                            <p>${crewdata.cast[1].character}</p>
                        </div>
                    </div>
    
                </div>
            </div>
    `

    document.getElementById('videoSectionParentDiv').innerHTML = videoSectiondata;
}

function appendVideo(data) {
    const movieName = data.title || data.original_name;
    
    if (!movieName) return;

    fetch(apiPath.searchMovieTraileronYoutube(movieName))
        .then(res => res.json())
        .then(res => {
            console.log(res.items[0]);
            const VideoId = res.items[0];
            const youtubeUrl = `https://www.youtube.com/watch?v=${VideoId.id.videoId}`
            console.log(youtubeUrl);
            // window.open(youtubeUrl, '_blank')
            const iframelement = document.getElementById('iframe')
            iframelement.src = `https://www.youtube.com/embed/${VideoId.id.videoId}?autoplay=1&mute=1`
            console.log(iframelement.src)
        }).catch(err => console.log(err))


}

function appenddataCrewSection(data, crewdata) {
    const min = Math.min(crewdata.cast.length, 15);

    for (var i = 0; i < min; i++) {

        const crewDatacard = `
            <div class="profile">
                    <img src="${imgPath}${crewdata.cast[i].profile_path}" alt="${crewdata.cast[i].original_name} avatar">
                    <p>${crewdata.cast[i].original_name}</p>
                    <p>${crewdata.cast[i].character}</p>
                </div>
            `

        const div = document.createElement('div');
        div.className = 'profile';
        const img = document.createElement('img');
        img.src = `${imgPath}${crewdata.cast[i].profile_path}`;

        const p1 = document.createElement('p');
        p1.innerText = `${crewdata.cast[i].original_name}`

        const p2 = document.createElement('p');
        p2.innerText = `${crewdata.cast[i].character}`

        div.append(img, p1, p2);

        document.getElementById('castsection').append(div);
    }


}

function movieLikeThisSection(data) {


    data.slice(0, 10).map((data) => {
        const div = document.createElement('div');
        div.className = 'movie';
        const img = document.createElement('img');
        img.src = `${imgPath}${data.backdrop_path}`;
        img.alt = "Movie img"
        img.addEventListener('click', function () {

            console.log(data.id);
            localStorage.setItem('movieId', data.id);

            location.reload();
        })
        div.append(img);

        document.getElementById('MovieLikeThisSection').append(div);
    })


}

// navbar js

window.addEventListener('load', function () {

    window.addEventListener('scroll', function () {
        //header color update
        const header = document.getElementById('header');
        if (window.screenY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg')
    })

})