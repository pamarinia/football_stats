export function general_stats(data,Player) {
    const player=data.filter(d=>d.Player === Player)[0]
    
    const general_stats = {
      "Technique":parseFloat(player["ToSuc%"])+5*parseFloat(player['ToSuc']),
      "Tir": parseFloat(player["SoT%"])/2+4*parseFloat(player["Goals"])+parseFloat(player["ShoPK"]),
      "Passe":parseFloat(player["PasTotCmp%"])+parseFloat(player["Assists"]),
      "Défense":parseFloat(player["TklDri%"])+parseFloat(player["TklWon"]),
      "Vista":parseFloat(player["AerWon%"])+parseFloat(player["ScaPassLive"]),
    };
    const general_stats_details={
      "Technique":{
        'Dribbles réussis':player['ToSuc'],
        'Touches de balle':player['Carries'],
        'Fautes subies':player['Fld'],
      },
      "Tir":{
        "Tirs":player["Shots"],
        "Tirs cadrés":player["SoT"],
        "But par frappe":player["G/Sh"],
        "Buts hors penalties":player["Goals"],
        "But sur pénalty":player["ShoPK"],
      },
      "Passe":{
        "Passes décisives":player["Assists"],
        "Passes tentées":player["PasTotAtt"],
        "Passes réussies":player["PasTotCmp"],
        "Taux passes courtes réussies":player["PasShoCmp%"],
        "Taux passes moyenne réussies":player["PasMedCmp%"],
        "Taux passes longues réussies":player["PasLonCmp%"],
      },
      "Défense":{
        "Tacles":player["Tkl"],
        "Tacles réussis":player["TklWon"],
        "Interceptions":player["Int"],
      },
      "Vista":{
        "Passes clés":player["ScaPassLive"],
      },
    }
    return node_link(general_stats,general_stats_details)
    }

function  node_link( data,data_detail, w = 250, h = 250 ) {
    const svg =
      d3
        .create("svg")
        .attr("viewBox", [0, 0, w, h])
        .attr("width", w)
        .attr("height", h);
  
    let margin = { top: 10, right: 10, bottom: 10, left: 10 };
  
    let width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;
  
    var graph = { nodes: [], links: [] };
    
    let k=0
    let number_att=Object.keys(data).length;
    for (const key in data) {
    if (data.hasOwnProperty(key)) { // Check if the property is directly on the object
      graph.nodes.push({x:50*Math.cos(k*(2*Math.PI/number_att)-Math.PI/2), y:50*Math.sin(k*(2*Math.PI/number_att)-Math.PI/2), attribut : key, value:data[key]/100
    });
      k+=1;
    }
  }
    
  
    for (let i = 0; i < number_att; i++) {
      graph.links.push({
        source: i,
        target: (i+1)%number_att,
      });
    }
  
   const circle_background=svg.append("circle");
    circle_background.attr("r", 60)
                     .attr("cx", i => 140)
                     .attr("cy", i => 140)
                     .attr("fill", 'grey')
                      
   svg.selectAll("#node")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 2)
      .attr("cx", i => 140+i.value*i.x)
      .attr("cy", i => 140+i.value*i.y)
      .attr("opacity",1)
      .attr("fill", '#0f0')
    
   svg.selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", i => 140+graph.nodes[i.source].value*graph.nodes[i.source].x)
      .attr("y1", i => 140+graph.nodes[i.source].value*graph.nodes[i.source].y)
      .attr("x2", i => 140+graph.nodes[i.target].value*graph.nodes[i.target].x)
      .attr("y2", i => 140+graph.nodes[i.target].value*graph.nodes[i.target].y)
      .style("stroke", "#0f0")
      .style("stroke-width", "5")
  
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("padding", "5px")
      .style("background", "white")
      .style("border", "1px solid black")
      .style("pointer-events", "none");
  
    // Lorsque la souris est sur l'attribut
    function mouseover(event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", 1);
          tooltip.html(JSON.stringify(data_detail[d.attribut]).replace("{","")
                                            .replace("}","")
                                            .replace(/,/g,"<br/>")
                       
                       
                      )
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY) + "px");
    }
    
    // Lorsque la souris quitte un département
    function mouseout(event, d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
  
    }
  
     svg.selectAll("text")
        .data(graph.nodes)
        .enter()
        .append("text")
        .attr("x",d=>140+2.1*d.x)
        .attr("y",d=>140+1.8*d.y+10)
        .text(d => d.attribut)
        .attr("text-anchor", "middle")
        .on("mousemove", mouseover)
        .on("mouseout", mouseout)
        .style('user-select', 'none') // Appliquer la propriété CSS pour rendre le texte non sélectionnable
        .style('-moz-user-select', 'none') // Prise en charge pour Firefox
        .style('-webkit-user-select', 'none') // Prise en charge pour Chrome, Safari, et Edge
        .style('-ms-user-select', 'none'); // Prise en charge pour Internet Explorer
      
    
    return svg.node();
  };

