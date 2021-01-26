'use strict';

let count = 1;
let episodes = [];
let nextPage = '';
let prevPage = '';
let showEpisodes = [];

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
                    <section class="containerlist"></section>
                </section>
            </section>
        </section>
        <footer class="footer">&copy; 2021 · Estefanía Cordeiro Brión</footer>`
    );
}

/* CONTENT SIDEBAR */

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
            showEpisodes = episodes[count - 1];
            nextPage = res.data.info.next;
            prevPage = res.data.info.prev;
            printSidebarItems();
        });
    } else {
        showEpisodes = episodes[count - 1];
        printSidebarItems();
    }
    if(count === totalPages) {
        btnNext.classList.add('hidden');
    } else {
        btnNext.classList.remove('hidden');
    }
}

function printSidebarItems() {
    $('.sectionContent-sidebar-listEpisodes')[0].innerHTML = '';
    showEpisodes.forEach(episode => {
        $('.sectionContent-sidebar-listEpisodes').append(
            `<li>
                <button id=${episode.id} class="btn-episode">Episode ${episode.id}</button>
            </li>`);
    });
}

/* CONTENT MAIN FOR EACH EPISODE*/

function showInfoEpisode(event) {
    let infoEpisode = {};
    let numEpisodeClicked = parseInt(event.target.id);
    $('.nameCharacter').off('click', showInfoEpisode);
    $('.sectionContent-main-info')[0].innerHTML = '';
    $('.containerlist')[0].innerHTML = '';
    $('.sectionContent-main').css('background-image', 'none');

    episodes[count-1].forEach(episode => {
        if(numEpisodeClicked === episode.id) {
            infoEpisode = episode;
        }
    })
    printEpisodesItems(infoEpisode);

    $('.sectionContent-main-info').children().css('padding', '30px');
    $('.sectionContent-main-info').children('h1').css('font-size', '30px');

    getInfoCharactersOfEpisode(infoEpisode.characters);
}

function printEpisodesItems(infoEpisode) {
    $('.sectionContent-main-info').append(
        `<h1>Episode ${infoEpisode.id}</h1>
        <h2>${infoEpisode.name}</h2>
        <time>Air date: ${infoEpisode.air_date}</time>
        <p>Episode code: ${infoEpisode.episode}</p>
        `);
}

function getInfoCharactersOfEpisode(urlCharacters) {
    let arrayCharacters = [];
    let linkCharacters = urlCharacters;
    linkCharacters.forEach(linkCharacter => {
        axios.get(linkCharacter).then((res) => {
            let infoCharacter = res.data;
            arrayCharacters.push(infoCharacter);

            printCharactersItemsEpisode(infoCharacter);

            $('.sectionContent-main-list-infoSection-details').children().css('padding', '10px');
            $(`.sectionContent-main-list-infoSection${infoCharacter.id}`).css({
                'display':'flex',
                'flex-direction': 'row',
                'padding-bottom': '30px'
            });
            $('.imageCharacter').css('cursor', 'pointer');
            $('.nameCharacter').css('cursor','pointer');

            $(`.sectionContent-main-list-infoSection${infoCharacter.id}`).on('click', function () {
                showInfoCharacter(infoCharacter);
            });
        });
    });
}

function printCharactersItemsEpisode(infoCharacter) {
    $('.containerlist').append(
        `<section class=sectionContent-main-list-infoSection${infoCharacter.id}>
            <img class="imageCharacter" src=${infoCharacter.image} alt=${infoCharacter.name}>
            <section class="sectionContent-main-list-infoSection-details">
                <h2 class="nameCharacter">${infoCharacter.name}</h2>
                <p>${infoCharacter.status}</p>
                <p>${infoCharacter.species}</p>
            </section>
        </section>
        `)
}

/* CONTENT MAIN FOR EACH CHARACTER*/

function showInfoCharacter(infoCharacter) {
    $(`.sectionContent-main-list-infoSection${infoCharacter.id}`).off('click', function () {
        showInfoCharacter(infoCharacter);
    });
    $('.sectionContent-main-info')[0].innerHTML = '';
    $('.containerlist')[0].innerHTML = '';

    printCharacterItem(infoCharacter);

    $('.sectionContent-main-info').children().css('padding', '10px');
    $('.sectionContent-main-info').children('h1').css('font-size', '30px');
    $('.imageCharacter').css('width', '60%');
    $(`.location${infoCharacter.id}`).css('cursor', 'pointer');

    getInfoEpisodesOfCharacter(infoCharacter.episode);

    $(`.location${infoCharacter.id}`).on('click', function () {
        showInfoLocation(infoCharacter);
    });
}

function printCharacterItem(infoCharacter) {
    $('.sectionContent-main-info').append(
        `<img id=${infoCharacter.id} class=imageCharacter src=${infoCharacter.image} alt=${infoCharacter.name}>
        <h1 id=${infoCharacter.id}>${infoCharacter.name}</h1>
        <p>Status: ${infoCharacter.status}</p>
        <p>Species: ${infoCharacter.species}</p>
        <p>Gender: ${infoCharacter.gender}</p>
        <p class=origin>Origin: ${infoCharacter.origin.name}</p>
        <p class=location${infoCharacter.id}>Location: ${infoCharacter.location.name}</p>
        `);
}

function getInfoEpisodesOfCharacter(urlEpisodes) {
    let linkEpisodes = urlEpisodes;
    linkEpisodes.forEach(linkCharacter => {
        axios.get(linkCharacter).then((res) => {
            let infoEpisode = res.data;

            printEpisodesItemsCharacter(infoEpisode);

            $('.sectionContent-main-list-infoSection-details').children().css('padding', '10px');
            $('.sectionContent-main-list-infoSection').css({
                'display':'flex',
                'flex-direction': 'row',
                'padding-bottom': '30px'
            });
            $(`.nameCharacter${infoEpisode.id}`).css('cursor', 'pointer');

            $(`.nameCharacter${infoEpisode.id}`).on('click', showInfoEpisode);
        });
    });
}

function printEpisodesItemsCharacter(infoEpisode) {
    $('.containerlist').append(
        `<section class="sectionContent-main-list-infoSection">
            <h2 id=${infoEpisode.id} class=nameCharacter${infoEpisode.id}>Episode ${infoEpisode.id}</h2>
            <section class="sectionContent-main-list-infoSection-details">
                <p>${infoEpisode.name}</p>
                <p>${infoEpisode.episode}</p>
            </section>
        </section>
        `);
}

/* CONTENT MAIN FOR EACH LOCATION*/

function showInfoLocation(infoCharacter) {
    $(`.location${infoCharacter.id}`).off('click', showInfoLocation);
    $('.sectionContent-main-info')[0].innerHTML = '';
    $('.containerlist')[0].innerHTML = '';
    axios.get(infoCharacter.location.url).then((res) => {
        let infoLocation = res.data;

        printLocationItem(infoLocation);

        $('.sectionContent-main-info').children().css('padding', '10px');
        $('.sectionContent-main-info').children('h1').css('font-size', '30px');

        getResidentsOfLocation(infoLocation);
    });
}

function printLocationItem(infoLocation) {
    $('.sectionContent-main-info').append(
        `<h1 id=${infoLocation.id}>${infoLocation.name}</h1>
        <p>Status: ${infoLocation.type}</p>
        <p>Species: ${infoLocation.dimension}</p>
        `);
}

function getResidentsOfLocation(infoLocation) {
    let arrayResidents = [];
    $('.containerlist').prepend('<h1>Residents:</h1>')
    infoLocation.residents.forEach(resident => {
        axios.get(resident).then((res) => {
            let infoResidents = res.data;
            arrayResidents.push(infoResidents);

            printLocationItemsCharacter(infoResidents);

            $('.containerlist').children('h1').css({'font-size':'24px', 'padding-bottom':'20px'});
            $('.sectionContent-main-list-infoSection-details').children().css('padding', '10px');
            $(`.sectionContent-main-list-infoSection${infoResidents.id}`).css({
                'display':'flex',
                'flex-direction': 'row',
                'padding-bottom': '30px'
            });
            $('.imageResident').css('width', '35%');
            $('.imageResident').css('cursor', 'pointer');
            $('.nameResident').css('cursor', 'pointer');

            $(`.sectionContent-main-list-infoSection${infoResidents.id}`).on('click', function () {
                showInfoCharacter(infoResidents);
            });
        });
    });
}

function printLocationItemsCharacter(infoResidents) {
    $('.containerlist').append(
        `<section class=sectionContent-main-list-infoSection${infoResidents.id}>
            <img class="imageResident" src=${infoResidents.image} alt=${infoResidents.name}>
            <section class="sectionContent-main-list-infoSection-details">
                <h2 class="nameResident">${infoResidents.name}</h2>
                <p>${infoResidents.status}</p>
                <p>${infoResidents.species}</p>
            </section>
        </section>
        `);
}
