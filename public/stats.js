
export function stats_buts(data,player_name){

  const player=data.filter(d=>d.Player === player_name)[0];
  const ligue_player=data.filter(d=>d.Comp === player["Comp"]);
  const max_ligue_but=Math.max(...ligue_player.map(d=>d['Goals']))
  const max_ligue_tirs=Math.max(...ligue_player.map(d=>d['Shots']))

  const graph = {"attribute1":["Buts",player['Goals'],player['Goals']/max_ligue_but],"attribute2":["Buts par tir",player['G/Sh'],player['G/Sh']],"attribute3":["Tirs par match",player['Shots'],player['Shots']/max_ligue_tirs],"attribute4":["Tirs cadrés par tir",player['SoT%']/100,player['SoT%']/100]}

  return stats_(graph)
}

export function stats_passes(data,player_name){

  const player=data.filter(d=>d.Player === player_name)[0];
  const ligue_player=data.filter(d=>d.Comp === player["Comp"]);
  const max_ligue_passe_d=Math.max(...ligue_player.map(d=>d['Assists']*d["MP"]))
  const max_ligue_passe_reussi=Math.max(...ligue_player.map(d=>d['PasTotCmp']))
  const max_ligue_passe_cle=Math.max(...ligue_player.map(d=>d['ScaPassLive']))
  const graph = {"attribute1":["Passes décisives",player['Assists']*player["MP"],player['Assists']*player["MP"]/max_ligue_passe_d],"attribute2":["Passes réussies / m",player['PasTotCmp'],player['PasTotCmp']/max_ligue_passe_reussi],"attribute3":["Tx passes réussies",(player['PasTotCmp%']*0.01).toFixed(2),player['PasTotCmp%']/100],"attribute4":["Passes clé / match",player['ScaPassLive'],player['ScaPassLive']/max_ligue_passe_cle]}

  return stats_(graph)
}

export function stats_dribble(data,player_name){

  const player=data.filter(d=>d.Player === player_name)[0];
  const ligue_player=data.filter(d=>d.Comp === player["Comp"]);
  const max_ligue_dribble_reussi=Math.max(...ligue_player.map(d=>d['ToSuc']))
  
  const max_ligue_Carries=Math.max(...ligue_player.map(d=>d['Carries']))
  const max_ligue_Fld=Math.max(...ligue_player.map(d=>d['Fld']))
  
  const graph = {"attribute1":["Dribbles réussis / match",player['ToSuc'],player['ToSuc']/max_ligue_dribble_reussi],"attribute2":["Tx dribble  réussies",(player['ToSuc%']/100).toFixed(2),(player['ToSuc%']/100).toFixed(2)],"attribute3":["Touches de balle",(player['Carries']),player['Carries']/max_ligue_Carries],"attribute4":["Fautes reçues",player['Fld'],player['Fld']/max_ligue_Fld]}

  return stats_(graph)
}


function stats_(graph, w = 350, h = 300 ){
  
  const svg =
    d3
      .create("svg")
      .attr("viewBox", [0, 0, w, h])
      .attr("width", w)
      .attr("height", h);

  let margin = { top: 10, right: 10, bottom: 10, left: 10 };

  let width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;
 
// Échelle linéaire pour le score de la jauge
const scale = d3.scaleLinear()
  .domain([0, 100])  // Valeurs min et max
  .range([- Math.PI/2, Math.PI/2]); // Demi-cercle


  // arc pour la jauge
const arc = d3.arc()
  .innerRadius(70)  // Rayon intérieur
  .outerRadius(70 + 15) // Rayon extérieur 
  .startAngle(-Math.PI/2)  // Angle de départ 
  .endAngle(d=>scale(d));  // Angle de fin 

// Ajouter l'arc à l'élément SVG
svg.append("path")
  .datum(100)  // La valeur à afficher
  .style("fill", "grey")
  .attr("d", arc)  
  .attr("transform", `translate(${width / 2},${height/2})`); 

// Ajouter l'arc à l'élément SVG
svg.append("path")
  .datum(graph["attribute1"][2]*100)  
  .style("fill", "#0f0") 
  .attr("d", arc)  
  .attr("transform", `translate(${width / 2},${height/2})`);

  // Ajouter le texte pour le score
  svg.append("text")
  .attr("x", width /2)
  .attr("y", height /2) 
  .attr("text-anchor", "middle") 
  .text(graph["attribute1"][1])  
  .style("font-size", "50px") 
  .style("fill", "black"); 

 // Ajouter le texte pour le score
  svg.append("text")
  .attr("x", width /2)
  .attr("y", height /2 -95 ) 
  .attr("text-anchor", "middle") 
  .text(graph["attribute1"][0])  
  .style("font-size", "20px") 
  .style("fill", "black"); 

// Fond de la barre de progression
svg.append("rect")
  .attr("width", width-100)
  .attr("height", 10)
  .attr("fill", "#111") // Couleur du fond
  .attr("x", 50)
  .attr("y", height /2 +40 ) ;
// Barre de progression (valeur actuelle)
svg.append("rect")
  .attr("width", (width-100) * (graph["attribute2"][2]))
  .attr("height", 10)
  .attr("fill", "#0f0") // Couleur de la barre de progression
  .attr("x", 50)
  .attr("y", height /2 +40 ) ;

  // Texte pour le label à gauche
svg.append("text")
  .attr("x", 50) 
  .attr("y", height / 2+25) 
  .attr("dy", ".35em") 
  .attr("fill", "black")
  .text(graph["attribute2"][0]); 

  // Texte pour la valeur à droite
svg.append("text")
  .attr("x", width - 50) // Position horizontale du texte à partir de la droite
  .attr("y", height / 2 +25) // Position verticale pour centrer le texte
  .attr("dy", ".35em") // Décalage pour aligner verticalement
  .attr("fill", "black") // Couleur du texte
  .attr("text-anchor", "end") // Ancrer le texte à la fin pour l'alignement à droite
  .text(graph["attribute2"][1]); // Texte à afficher


  // Fond de la barre de progression
svg.append("rect")
  .attr("width", width-100)
  .attr("height", 10)
  .attr("fill", "#111") // Couleur du fond
    .attr("x", 50)
  .attr("y", height /2 +80 ) ;
// Barre de progression (valeur actuelle)
svg.append("rect")
  .attr("width", (width-100)* (graph["attribute3"][2]))
  .attr("height", 10)
  .attr("fill", "#0f0") // Couleur de la barre de progression
  .attr("x", 50)
  .attr("y", height /2 +80 ) ;


  // Texte pour le label à gauche
svg.append("text")
  .attr("x", 50) 
  .attr("y", height / 2+65) 
  .attr("dy", ".35em") 
  .attr("fill", "black")
  .text(graph["attribute3"][0]); 

  // Texte pour la valeur à droite
svg.append("text")
  .attr("x", width - 50) // Position horizontale du texte à partir de la droite
  .attr("y", height / 2 +65) // Position verticale pour centrer le texte
  .attr("dy", ".35em") // Décalage pour aligner verticalement
  .attr("fill", "black") // Couleur du texte
  .attr("text-anchor", "end") // Ancrer le texte à la fin pour l'alignement à droite
  .text(graph["attribute3"][1]); // Texte à afficher


    // Fond de la barre de progression
svg.append("rect")
  .attr("width", width-100)
  .attr("height", 10)
  .attr("fill", "#111") // Couleur du fond
    .attr("x", 50)
  .attr("y", height /2 +120 ) ;
// Barre de progression (valeur actuelle)
svg.append("rect")
  .attr("width", (width-100)*graph["attribute4"][2])
  .attr("height", 10)
  .attr("fill", "#0f0") // Couleur de la barre de progression
  .attr("x", 50)
  .attr("y", height /2 +120 ) ;


  // Texte pour le label à gauche
svg.append("text")
  .attr("x", 50) 
  .attr("y", height / 2+105) 
  .attr("dy", ".35em") 
  .attr("fill", "black")
  .text(graph["attribute4"][0]); 

  // Texte pour la valeur à droite
svg.append("text")
  .attr("x", width - 50) // Position horizontale du texte à partir de la droite
  .attr("y", height / 2 +105) // Position verticale pour centrer le texte
  .attr("dy", ".35em") // Décalage pour aligner verticalement
  .attr("fill", "black") // Couleur du texte
  .attr("text-anchor", "end") // Ancrer le texte à la fin pour l'alignement à droite
  .text(graph["attribute4"][1]); // Texte à affichervv
  return svg.node();
};