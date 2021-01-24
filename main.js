'use strict';

loadHtml();

$('.btn-activeSidebar-icon').on('click', showSidebar);

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
                    <button class="sectionContent-sidebar-btnPages-back"><i class="fas fa-chevron-circle-left sectionContent-sidebar-btnPages-back-icon"></i></button>
                    <button class="sectionContent-sidebar-btnPages-next"><i class="fas fa-chevron-circle-right sectionContent-sidebar-btnPages-back-icon"></i></button>
                </section>
            </section>
            <section class="sectionContent-main">
                <section class="sectionContent-sidebar-info"></section>
                <section class="sectionContent-sidebar-list"></section>
            </section>
        </section>
        <footer class="footer">&copy; 2021 · Estefanía Cordeiro Brión</footer>`
    );
}

function showSidebar() {
    requestAPI();

    $('.sectionContent-sidebar').toggle(function() {
        $('sectionContent-main').css('left', 0);
    }, function() {
        $('sectionContent-main').css('left', '190px');
    });
}

function requestAPI() {
    axios.get('https://rickandmortyapi.com/api/episode').then((data) => {
        console.log(data);
        let page1Episodes = data.data.results;
        console.log(page1Episodes);
        page1Episodes.forEach(episode => {
            $('.sectionContent-sidebar-listEpisodes').append(
                `<li>
                    <button class="btn-episode">Episode ${episode.id}</button>
                </li>`);
            console.log(episode);
        });
    });
}
