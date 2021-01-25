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
    /* Data of page 1 */
    axios.get('https://rickandmortyapi.com/api/episode').then((dataPage1) => {
        console.log(dataPage1);
        let page1Episodes = dataPage1.data.results;
        page1Episodes.forEach(episode => {
            $('.sectionContent-sidebar-listEpisodes').append(
                `<li>
                    <button class="btn-episode">Episode ${episode.id}</button>
                </li>`);
        });
        /* Data of page 2 */
        $('.sectionContent-sidebar-btnPages-next').on('click', () => {
            if(dataPage1.data.info.prev === null) {
                $('.sectionContent-sidebar-btnPages-back').show();
            }
            /* Return page 1 */
            $('.sectionContent-sidebar-btnPages-back').on('click',() => {
                console.log('como recupero la lista de capítulos de la página 1?')
            })
            /* Show the new episodes page 2*/
            let nextUrl = dataPage1.data.info.next;
            axios.get(nextUrl).then((dataPage2) => {
                console.log(dataPage2);
                $('.sectionContent-sidebar-listEpisodes')[0].textContent = '';
                const page2Episodes = dataPage2.data.results;
                page2Episodes.forEach(episode => {
                    $('.sectionContent-sidebar-listEpisodes').append(
                        `<li>
                            <button class="btn-episode">Episode ${episode.id}</button>
                        </li>`);
                });

                /* Data of page 3 */
                $('.sectionContent-sidebar-btnPages-next').on('click', () => {
                    /* Return page 2 */
                    $('.sectionContent-sidebar-btnPages-back').on('click',() => {
                        console.log('como recupero la lista de capítulos de la página 2?')
                    })
                    /* Show the new episodes page 3*/
                    let nextUrl = dataPage2.data.info.next;
                    axios.get(nextUrl).then((dataPage3) => {
                        console.log(dataPage3);
                        $('.sectionContent-sidebar-listEpisodes')[0].textContent = '';
                        if(dataPage3.data.info.next === null) {
                            $('.sectionContent-sidebar-btnPages-next').hide();
                        }
                        const page3Episodes = dataPage3.data.results;
                        page3Episodes.forEach(episode => {
                            $('.sectionContent-sidebar-listEpisodes').append(
                                `<li>
                                    <button class="btn-episode">Episode ${episode.id}</button>
                                </li>`);
                        });
                    })
                });
            });
        });
    $('.btn-episode').on('click', showInfoEpisode);
    });
}

function showInfoEpisode() {
    $('.sectionContent-main').css('background-image', 'none');
}