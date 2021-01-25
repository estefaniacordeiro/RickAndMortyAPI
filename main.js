'use strict';

let count = 1;
let episodes = [];
let nextPage = '';
let prevPage = '';
let showEpisodes = [];

/* $('.title').on('click', function() {
    console.log('hola');
});
 */
$(document).ready(function() {
    loadHtml();

    $('.btn-activeSidebar-icon').on('click', showSidebar);
    let btnNext = $('.sectionContent-sidebar-btnPages-next')[0];
    let btnPrev = $('.sectionContent-sidebar-btnPages-back')[0];
    $(btnNext).on('click', function() {
        if(nextPage !== null) {
            count++;
            requestAPI(nextPage);
        }
        if(count > 1) {
            btnPrev.classList.remove('hidden');
        } else {
            btnPrev.classList.add('hidden');
        }
    })
    $(btnPrev).on('click', function() {
        if(prevPage !== null) {
            count--;
            if(count === 1) {
                btnPrev.classList.add('hidden');
            }
            requestAPI(prevPage);
        }
    })
    $('.sectionContent-sidebar-listEpisodes').on('click', showInfoEpisode);
})

function loadHtml() {
    $('body').append(
        `<header class="header">
            <nav class="btn-activeSidebar"><i class="fas fa-bars btn-activeSidebar-icon"></i></nav>
            <img class="title" src="assets/img/title.png" alt="Title Rick and Morty">
        </header>
        <section class="sectionContent">
            <section class="sectionContent-sidebar">
                <ul class="sectionContent-sidebar-listEpisodes">
                </ul>
                <section class="sectionContent-sidebar-btnPages">
                    <button class="sectionContent-sidebar-btnPages-back hidden"><i class="fas fa-chevron-circle-left sectionContent-sidebar-btnPages-back-icon"></i></button>
                    <button class="sectionContent-sidebar-btnPages-next"><i class="fas fa-chevron-circle-right sectionContent-sidebar-btnPages-back-icon"></i></button>
                </section>
            </section>
            <section class="sectionContent-main">
                <section class="sectionContent-main-info"></section>
                <section class="sectionContent-main-list">
                    <section class="containerlistCharacter"></section>
                </section>
            </section>
        </section>
        <footer class="footer">&copy; 2021 · Estefanía Cordeiro Brión</footer>`
    );
}

function showSidebar() {
    const baseUrl = 'https://rickandmortyapi.com/api/episode';
    requestAPI(baseUrl);

    $('.sectionContent-sidebar').toggle(function() {
        $('sectionContent-main').css('left', 0);
    }, function() {
        $('sectionContent-main').css('left', '190px');
    });
}

function requestAPI(url) {
    let totalPages = 0;
    let btnNext = $('.sectionContent-sidebar-btnPages-next')[0];
    if(episodes.length === 0 || episodes[count-1] === undefined) {
        axios.get(url).then((res) => {
            totalPages = res.data.info.pages;
            episodes.push(res.data.results);
            /* console.log(episodes); */
            showEpisodes = episodes[count - 1];
            nextPage = res.data.info.next;
            prevPage = res.data.info.prev;
            sidebarItems();
        });
    } else {
        showEpisodes = episodes[count - 1];
        sidebarItems();
    }
    if(count === totalPages) {
        btnNext.classList.add('hidden');
    } else {
        btnNext.classList.remove('hidden');
    }
}

function sidebarItems() {
    $('.sectionContent-sidebar-listEpisodes')[0].innerHTML = '';
    showEpisodes.forEach(episode => {
        $('.sectionContent-sidebar-listEpisodes').append(
            `<li>
                <button id=${episode.id} class="btn-episode">Episode ${episode.id}</button>
            </li>`);
    });
}

function showInfoEpisode(event) {
    let infoEpisode = {};
    let numEpisodeClicked = parseInt(event.target.id);
    $('.sectionContent-main-info')[0].innerHTML = '';
    $('.containerlistCharacter')[0].innerHTML = '';
    $('.sectionContent-main').css('background-image', 'none');
    $('.sectionContent-main-info').css('border', '1px solid var(--second-color)');
    $('.sectionContent-main-list').css('border', '1px solid var(--second-color)');

    episodes[count-1].forEach(episode => {
        if(numEpisodeClicked === episode.id) {
            infoEpisode = episode;
        }
    })

    $('.sectionContent-main-info').append(
        `<h1>Episode ${infoEpisode.id}</h1>
        <h2>${infoEpisode.name}</h2>
        <time>Air date: ${infoEpisode.air_date}</time>
        <p>Episode code: ${infoEpisode.episode}</p>
        `);
    $('.sectionContent-main-info').children().css('padding', '30px');
    $('.sectionContent-main-info').children('h1').css('font-size', '30px');

    getInfoCharacters(infoEpisode.characters);
}

function getInfoCharacters(urlCharacters) {
    urlCharacters.forEach(urlCharacter => {
        axios.get(urlCharacter).then((res) => {
            let infoCharacter = res.data;

            $('.containerlistCharacter').append(
                `<section class="sectionContent-main-list-infoCharacter">
                    <img src=${infoCharacter.image} alt=${infoCharacter.name}>
                    <section class="sectionContent-main-list-infoCharacter-details">
                        <h2 class="nameCharacter">${infoCharacter.name}</h2>
                        <p>${infoCharacter.status}</p>
                        <p>${infoCharacter.species}</p>
                    </section>
                </section>
                `)
            $('.sectionContent-main-list-infoCharacter-details').children().css('padding', '10px');
        })
    })
}
