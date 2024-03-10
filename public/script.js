import {Histogramme} from './histogramme.js'
import {general_stats} from './general_stats.js'

import {stats_buts} from './stats.js'
import {stats_passes} from './stats.js'
import {stats_dribble} from './stats.js'
var index_league=0;
var index_team=0;

var list_leagues;
var list_teams;
var list_players;
var player;
var data;

// Chargement des données
async function process() {
    try {
        if (!data) {
            data = await d3.dsv(";", "data/football_stat.csv")
        }
        console.log(data)
        // On récupère les ligues 
        list_leagues = getListeLigues(data);
        // On affiche le nom de la ligue
        var league = document.querySelector('.league-name');
        league.innerHTML=list_leagues[(index_league%list_leagues.length+list_leagues.length)%list_leagues.length]// positive modulo
        // On affiche le logo de la ligue
        var league_logo = document.querySelector('.league-logo');
        let img_league_logo = document.createElement('img');
        img_league_logo.src="data/logos_leagues/"+list_leagues[(index_league%list_leagues.length+list_leagues.length)%list_leagues.length]+".png"
        while (league_logo.firstChild) {
            league_logo.removeChild(league_logo.firstChild);
        }
        league_logo.appendChild(img_league_logo);

        // On récupère les équipes pour une ligue spécifique
        list_teams = getEquipesPourLigue(data, league.innerHTML);
        // On affiche le nom de l'équipe
        var team = document.querySelector('.team-name');
        team.innerHTML=list_teams[(index_team%list_teams.length+list_teams.length)%list_teams.length]
        // On affiche le logo de l'équipe
        var team_logo = document.querySelector('.team-logo');
        let img_team_logo = document.createElement('img');
        img_team_logo.src="data/logos_teams/"+list_leagues[(index_league%list_leagues.length+list_leagues.length)%list_leagues.length]+"/"+list_teams[(index_team%list_teams.length+list_teams.length)%list_teams.length]+".png"
        while (team_logo.firstChild) {
            team_logo.removeChild(team_logo.firstChild);
        }
        team_logo.appendChild(img_team_logo);
        // idem pour extended
        var team_logo_ext = document.querySelector('.team-logo_ext');
        let img_team_logo_ext = document.createElement('img');
        img_team_logo_ext.src="data/logos_teams/"+list_leagues[(index_league%list_leagues.length+list_leagues.length)%list_leagues.length]+"/"+list_teams[(index_team%list_teams.length+list_teams.length)%list_teams.length]+".png"
        while (team_logo_ext.firstChild) {
            team_logo_ext.removeChild(team_logo_ext.firstChild);
        }

        team_logo_ext.appendChild(img_team_logo_ext);

        // On récupère les joueurs pour une équipe spécifique
        list_players = getPlayers(data, team.innerHTML);
        
        // On affiche la liste des joueurs
        var list_players_ul = document.querySelector('.player-choice');
        // remove children
        while (list_players_ul.firstChild) {
            list_players_ul.removeChild(list_players_ul.firstChild);
        }
        // add new children
        list_players.forEach(item => {
            const li = document.createElement('li'); 
            li.textContent = item; 
            li.addEventListener('click', function() {
                // change background color of previously selected player
                if (list_players_ul.querySelector('.selected')) {
                    list_players_ul.querySelector('.selected').style.backgroundColor = 'white';
                    list_players_ul.querySelector('.selected').classList.remove('selected');
                }
                // change background color of selected player
                this.style.backgroundColor = 'rgb(189, 180, 180)';
                this.classList.add('selected');
                // set selected player
                player = this.textContent;
                display_player_info(player, data);

                let selectedElement = document.getElementById('stat-select')
                let selectedStat = selectedElement.value
                let pool_element = document.getElementById('pool-select')
                let selectedPool = pool_element.value
                let div_thresholds_value = document.getElementById('thresholds_value')
                let thresholds_value = div_thresholds_value.value
                let histogramme = Histogramme(data, player, {
                    attribute : selectedStat,
                    pool_choice : selectedPool,
                    title : "Classement du joueur",
                    x_label: selectedStat,
                    thresholds_value: thresholds_value,
                    height : 400,
                    width : 500,
                })
            
                let div_histogramme = document.getElementById('histogramme')
                while (div_histogramme.firstChild) {
                    div_histogramme.removeChild(div_histogramme.firstChild);
                }
                div_histogramme.appendChild(histogramme)
                });
                list_players_ul.appendChild(li);
            });
        // choose player
        list_players_ul.firstElementChild.style.backgroundColor='rgb(189, 180, 180)';
        list_players_ul.firstElementChild.classList.add('selected');
        player=list_players[0];

        // On affiche les données du joueur
        display_player_info(player, data)

        // On affiche l'histogramme
        let selectedElement = document.getElementById('stat-select')
        let selectedStat = selectedElement.value
        
        let pool_element = document.getElementById('pool-select')
        let selectedPool = pool_element.value
        
        let div_thresholds_value = document.getElementById('thresholds_value')
        let thresholds_value = div_thresholds_value.value

        let histogramme = Histogramme(data, player, {
            attribute : selectedStat,
            pool_choice : selectedPool,
            title : "Classement du joueur",
            x_label: selectedStat,
            thresholds_value: thresholds_value,
            height : 400,
            width : 500,})
        let div_histogramme = document.getElementById('histogramme')

        if (div_histogramme.hasChildNodes()) {
            div_histogramme.removeChild(div_histogramme.firstChild);
        } 
        div_histogramme.appendChild(histogramme)


    } catch(error){
        console.log(error);
    }
}

process()


// Fonction pour extraire les noms des ligues (Compétitions)
function getListeLigues(data) {
    let ligues = [];

    // Parcourir chaque objet dans le tableau de données
    data.forEach((item) => {
        // Vérifier si la ligue est déjà dans la liste
        if (!ligues.includes(item.Comp)) {
            // Si non, l'ajouter à la liste
            ligues.push(item.Comp);
        }
    });
    return ligues;
}

// Fonction pour extraire les équipes pour une ligue spécifique
function getEquipesPourLigue(data, ligue) {
    let equipes = [];

    // Parcourir chaque objet dans le tableau de données
    data.forEach((item) => {
        // Vérifier si la ligue correspond à celle spécifiée
        if (item.Comp === ligue) {
            if (!equipes.includes(item.Squad)) {
                // Ajouter l'équipe à la liste
                equipes.push(item.Squad);
            }
        }
    });

return equipes;
}

// Fonction pour extraire les joueurs d'une équipe spécifique
function getPlayers(data, squad) {
    let players = [];

    // Parcourir chaque objet dans le tableau de données
    data.forEach((item) => {
        // Vérifier si la ligue correspond à celle spécifiée
        if (item.Squad === squad)
            if (!players.includes(item.Player)) {
                // Ajouter l'équipe à la liste
                players.push(item.Player);
            }
        })
    return players;
}

// ---- buttons for the choices of teams ----
// choice of league

function index_league_droite() {
    index_team=0
    index_league+=1
    process()
}
document.getElementById('selector-league-right').addEventListener('click', index_league_droite)

function index_league_gauche() {
    index_team=0
    index_league-=1
    process()
}
document.getElementById('selector-league-left').addEventListener('click', index_league_gauche)

// choice of team

function index_team_droite() {
    index_team+=1
    process()
}
document.getElementById('selector-team-right').addEventListener('click', index_team_droite)

function index_team_gauche() {
    index_team-=1
    process()
}
document.getElementById('selector-team-left').addEventListener('click', index_team_gauche)

// more info display
function more_info() {
    // Cachez les trois blocs
    document.querySelectorAll('.card').forEach(function(element) {
    element.style.display = 'none';
    });
    // Affichez le bloc unique
    let extended_card=document.getElementById('container_extended')
    extended_card.style.display = 'flex';
}

document.getElementById('info_button_more').addEventListener('click', more_info)

    // more info display
function less_info() {
    document.getElementById('container_extended').style.display = 'none';
    document.querySelectorAll('.card').forEach(function(element) {
    element.style.display = 'block';
    });
}
document.getElementById('info_button_less').addEventListener('click', less_info)


// on récupere la largeur
var slider_ = document.querySelector('.slider');
console.log(slider_.style.width)
document.getElementById('prev').addEventListener('click', function() {
    var slider_witdh = document.querySelector('.slider').clientWidth;
    document.querySelector('.slider').scrollBy({ left: -slider_witdh, behavior: 'smooth' });
  });
  
document.getElementById('next').addEventListener('click', function() {
    var slider_witdh = document.querySelector('.slider').clientWidth;
document.querySelector('.slider').scrollBy({ left: slider_witdh, behavior: 'smooth' });
});


function getPlayerInfo(playerName, data) {
    // Trouver le joueur dans les données
    let player = data.find(p => p.Player === playerName);

    // Si le joueur est trouvé, retourner ses informations
    if (player) {
        return {
            age: player.Age,
            origin: player.Nation,
            position: player.Pos,
            goals: player.Goals,
            assists: player.Assists,
            matchesPlayed: player.MP
        };
    }

    // Si le joueur n'est pas trouvé, retourner null
    return null;
}

function display_player_info(playerName, data) {
    // fonction getPlayerInfo qui renvoie les informations d'un joueur
    let playerInfo = getPlayerInfo(playerName, data)

    // Sélectionnez chaque élément de la liste et définissez son contenu textuel sur la valeur correspondante
    document.querySelector('.player-name').textContent = playerName,
    document.querySelector('.player-general-info li:nth-child(1)').textContent = 'Age : ' + playerInfo.age;
    document.querySelector('.player-general-info li:nth-child(2)').textContent = 'Origine : ' + playerInfo.origin;
    document.querySelector('.player-general-info li:nth-child(3)').textContent = 'Poste : ' + playerInfo.position;

    document.querySelector('.player-stats-info li:nth-child(1)').textContent = 'Buts : ' + playerInfo.goals;
    document.querySelector('.player-stats-info li:nth-child(2)').textContent = 'Passes décisives : ' + playerInfo.assists;
    document.querySelector('.player-stats-info li:nth-child(3)').textContent = 'Matchs joués : ' + playerInfo.matchesPlayed;

    // Sélectionnez chaque élément de la liste et définissez son contenu textuel sur la valeur correspondante
    document.querySelector('.player-name_ext').textContent = playerName,
    document.querySelector('.player-general-info_ext li:nth-child(1)').textContent = 'Age : ' + playerInfo.age;
    document.querySelector('.player-general-info_ext li:nth-child(2)').textContent = 'Origine : ' + playerInfo.origin;
    document.querySelector('.player-general-info_ext li:nth-child(3)').textContent = 'Poste : ' + playerInfo.position;

    document.querySelector('.player-stats-info_ext li:nth-child(1)').textContent = 'Buts : ' + playerInfo.goals;
    document.querySelector('.player-stats-info_ext li:nth-child(2)').textContent = 'Passes décisives : ' + playerInfo.assists;
    document.querySelector('.player-stats-info_ext li:nth-child(3)').textContent = 'Matchs joués : ' + playerInfo.matchesPlayed;


    // affichage stats
    let general_stats_visu1 = stats_buts(data,player)
    let div_general_stats1 = document.getElementById('slide1')
    if (div_general_stats1.hasChildNodes()) {
        div_general_stats1.removeChild(div_general_stats1.firstChild);
    } 
    div_general_stats1.appendChild(general_stats_visu1)

    let general_stats_visu2 = stats_passes(data,player)
    let div_general_stats2 = document.getElementById('slide2')
    if (div_general_stats2.hasChildNodes()) {
        div_general_stats2.removeChild(div_general_stats2.firstChild);
    } 
    div_general_stats2.appendChild(general_stats_visu2)

    let general_stats_visu3 = stats_dribble(data,player)
    let div_general_stats3 = document.getElementById('slide3')
    if (div_general_stats3.hasChildNodes()) {
        div_general_stats3.removeChild(div_general_stats3.firstChild);
    } 
    div_general_stats3.appendChild(general_stats_visu3)

    // on affiche le graphe des stats generales
    let graphe_general_stats = general_stats(data,player)
    let div_graphe_general_stats = document.getElementById('graphe_general_stats')
    if (div_graphe_general_stats.hasChildNodes()) {
        div_graphe_general_stats.removeChild(div_graphe_general_stats.firstChild);
    } 
    div_graphe_general_stats.appendChild(graphe_general_stats)

}

let pool_element = document.getElementById('pool-select')
pool_element.addEventListener('change', function() {
    process()
})

let selectedElement = document.getElementById('stat-select')
selectedElement.addEventListener('change', function() {
    process()
});

let div_thresholds_value = document.getElementById('thresholds_value')
div_thresholds_value.addEventListener('change', function() {
    process()
});


