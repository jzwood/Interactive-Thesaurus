//  Jake Wood   8/28/15
//  D3 Force diagram used by "visual thesaurus.html"

function main() {
  
    var newHead = enteredWord();
    
    var width = 960,
        height = 500;
    
    //sets div #body to the right width w/ border
    document
      .getElementById("body")
      .setAttribute("style","border:3px dashed #AAA;width:"+String(width)+"px","height:500px");
    
    var color = d3.scale.category20();
    
    //clears the div of previous svg objects
    d3.select("#body").selectAll("svg").remove();
    
    var svg = d3.select("#body").append("svg")
      .attr("width", width)
      .attr("height", height);
    
    //init layout of force diagram
    var force = d3.layout.force()
        .charge(-400)
        .linkStrength(1)
        .linkDistance(175)
        .size([width, height]);
    
    //generates new force diagram by re-filtering synonym data
    function newJson(word) {
      d3.json("synonyms.json", function(error, graph) {
        if (error) throw error;
        var big_word = word.toUpperCase() + ".";
        var headGroup = undefined;
        var synGroup = undefined;
        graph.nodes.filter(function(d){
          if (d.name == word){ synGroup = d.group;}
          else if (d.name == big_word){ headGroup = d.group;}
        });
        //clears svg of content
        d3.select("#body").selectAll("svg > *").remove();
        
        if (headGroup != undefined) {
          update(graph,headGroup);
        }else{
          update(graph,synGroup);
        }
        
      }); 
    }
    
    //updates force diagram filtered with new group/tag number 
    function update(graph, group_tag){
      //selects only the nodes/links we want to see
      var graphNodes = graph.nodes.filter(function(d){ return d.group == group_tag});
      var graphLinks = graph.links.filter(function(d){ return d.tag == group_tag});
      
      //code snippet taken from D3 tips-and-tricks, indexes links from names instead of numbers
      var nodeMap = {};
      graphNodes.forEach(function(x) { nodeMap[x.name] = x; });
      graphLinks = graphLinks.map(function(x) {
        return {
          source: nodeMap[x.source],
          target: nodeMap[x.target],
          tag: x.tag
        };
      });
      
      force
          .nodes(graphNodes)
          .links(graphLinks)
          .on("tick",tick)
          .start();
    
      var link = svg.selectAll(".link")
          .data(graphLinks)
          .enter().append("g")
          .attr("class", "link")
          
      link.append("line")
          .style("stroke-width", 5);
    
      var node = svg.selectAll(".node")
          .data(graphNodes)
          .enter().append("g")
          .attr("class", "node")
          .on("click",click)
          .on("dblclick", dblclick)
          .call(force.drag);
      
      node.append("circle")
          .attr("r", function(d) { if (d.head){ return 35;} else {return 25;}})
          .style("fill", function(d) { return color(d.name); });
          
      node.append("text")
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.name; });
    
       function tick() {
        link.selectAll("line")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    
        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
            
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      };
      
      }
      
      newJson(newHead); //initial entry
      
      //reloads/updates graph if child node clicked
      function dblclick(d) {
        if (!d.head) {
          newJson(d.name);
        }
      }
      
      //shows definition of clicked node
      function click(d) {
        document.getElementById("myText").value = d.name;
        displayDefinition();
      }
}

//returns text user input
function enteredWord() {
  return document.getElementById("myText").value;
}

//triggers main only if user pressed "enter"
function enterMain(){
  if (event.keyCode == 13){main();}
}

//defines endsWith fxn, returns boolean
String.prototype.endsWith = function(str) 
{return (this.match(str+"$")==str);}

//json that holds all all dictionary definitions
var allDefinitions;  
d3.json("webster dictionary.json", function(error,data){
  if (error) throw error;
  allDefinitions = data;
  });

//updates definitions in textarea
function displayDefinition(){
  var word  = enteredWord().toUpperCase();
  if (word.endsWith(".")){
    word = word.substring(0,word.length-1);//removes "."
  }
  word = allDefinitions[word];
  if (word == undefined) {
    document.getElementById('definition').value = "undefined";
  }else{
    document.getElementById('definition').value = word;
  }
}