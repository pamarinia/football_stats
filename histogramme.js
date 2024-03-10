export function Histogramme(data, selectedPlayer, {
    attribute,
    pool_choice,
    height = 300,
    width = 500,
    margin = ({top: 40, right: 40, bottom: 40, left: 40}),
    
    thresholds_value,
    title, // given d in data, returns the title text
    x_label,
  
    h = height - margin.top - margin.bottom,
    w = width - margin.left - margin.right
} = {}) {
    // création svg
    const svg = d3.create("svg")
        .attr("width", width) 
        .attr("height", height) 

    let pool_joueur = getAttribut(data, selectedPlayer, pool_choice)
    let joueursFiltres = data.filter(d => d[pool_choice] === pool_joueur)
    
    // select the attribute
    const data_attribute=joueursFiltres.map(d=>parseInt(d[attribute]))
    
    // bining operator
    const bin1 = d3.bin().domain([d3.min(data_attribute), d3.max(data_attribute)]).thresholds(thresholds_value);
    
    // applying bin1
    const buckets1 = bin1(data_attribute) 

    // longueur pour chaque instance 
    let buckets1_length = buckets1.map(d=> d.length)
    // abscisse de chaque bande
    let buckets1_band = [buckets1[0].x0,...buckets1.map(d=> d.x1)]

    // création X scaler
    const x = d3.scaleBand()
        .domain(buckets1_band)
        .range([margin.left, width - margin.right])

    // création Y scaler
    const y = d3.scaleLinear()
        .domain([0, d3.max(buckets1_length)+5])
        .range([h,  0])

    const c = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(d3.range(data.length))

    // element g
    const g = svg.append("g")
    
    g.selectAll("rect").data(buckets1_length).enter()
        .append("rect")
        .attr("x", (d, i) =>x(buckets1_band[i])+x.bandwidth()/2)
        .attr("y", (d, i) =>y(d)+margin.top)
        .attr("width", x.bandwidth())
        .attr("height", (d, i) => h - y(d))
        .attr("fill", (d, i) => {
            let x = getAttribut(data, selectedPlayer, attribute)
            if (x >= buckets1_band[i] && x < buckets1_band[i+1]) {
                return 'white'
            } else {
                return 'grey'
            }
        })
        .attr("stroke", "black")

    // ajout des axes
    const xAxis = g => g
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom(x))

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(y))
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text, line")  // Sélectionne tous les textes et les lignes de l'axe
        .attr("stroke", "black")  // Change la couleur des lignes en blanc
        .attr("fill", "black");   // Change la couleur du texte en blanc;
    
    svg.selectAll(".x.axis path")  // Sélectionne le chemin de l'axe x
        .attr("stroke", "black");  // Change la couleur du chemin en blanc

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text, line")  // Sélectionne tous les textes et les lignes de l'axe
        .attr("stroke", "black")  // Change la couleur des lignes en blanc
        .attr("fill", "black");   // Change la couleur du texte en blanc  

    svg.selectAll(".y.axis path")  // Sélectionne le chemin de l'axe y
        .attr("stroke", "black");  // Change la couleur du chemin en blanc

    svg.append("text")             
        .attr("transform", `translate(${width-margin.right-20},${height - margin.bottom+35})`)
        .style("text-anchor", "middle")
        .style("font-size", "1em")
        .attr("fill", "black")
        .text(x_label); 

    // ajout du titre
    svg.append("text")             
        .attr("x", width/2-70)
        .attr("y", 25)
        .attr("fill", "black")
        .attr("font-size", "1.5em")
        .text(title);

    return svg.node() 
}

function getAttribut(data, playerName, attribute) {
    let player = data.find(p => p.Player === playerName);
    if (player) {
        return player[attribute];
    }
    return null;
}

