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

var synonymHeadList = ["abase","abash","abate","alleviate","abbreviation","abridgment","abet","abhor","abide","abolish","exterminate","abomination","abridgment","abbreviation","absolute","absolve","pardon","absorb","abstinence","abstracted","absurd","abuse","accessory","accident","acquaintance","acrimony","active","acumen","add","addicted","adequate","adherent","adhesive","adjacent","admire","adorn","affront","agent","agree","agriculture","aim","air","airy","alarm","alert","alike","alive","allay","allege","allegiance","allegory","alleviate","allay","alliance","allot","allow","alloy","allude","allure","also","alternative","amass","amateur","amazement","ambition","amend","amiable","amid","amplify","analogy","anger","animal","announce","answer","anticipate","anticipation","antipathy","antique","anxiety","apathy","apiece","apology","apparent","appear","appendage","appetite","apportion","approximation","arms","army","arraign","array","arrest","artifice","artist","ask","associate","association","assume","assurance","pride","astute","attachment","attain","attitude","augur","authentic","auxiliary","avaricious","avenge","revenge","avow","awful","awkward","axiom","babble","banish","bank","banter","barbarous","barrier","battle","beat","beautiful","because","becoming","beginning","behavior","bend","benevolence","bind","bitter","blemish","blow","bluff","body","both","every","boundary","brave","break","brutish","burn","business","but","notwithstanding","by","cabal","calculate","esteem","calm","cancel","candid","caparison","dress","capital","care","career","caress","caricature","carry","catastrophe","catch","cause","reason","cease","celebrate","center","chagrin","character","characteristic","charming","chasten","cherish","choose","circumlocution","circumstance","class","cleanse","amend","clear","clever","collision","comfortable","commit","company","compel","complain","complex","condemn","reprove","confess","confirm","congratulate","conquer","conscious","consequence","console","contagion","continual","contract","contrast","conversation","convert","convey","convoke","criminal","daily","danger","dark","decay","deception","defense","defile","definition","delegate","deliberate","delicious","delightful","delightful","delicious","delusion","insanity","demolish","break","demonstration","induction","design","desire","appetite","despair","dexterity","diction","language","die","difference","difficult","direction","discern","discover","disease","disparage","displace","do","transaction","docile","doctrine","dogmatic","draw","dream","dress","drive","duplicate","duty","eager","ease","education","effrontery","egotism","emblem","emigrate","employ","design","endure","enemy","enmity","entertain","entertainment","entertain","enthusiasm","entrance","envious","equivocal","love","eternal","event","every","evident","example","excess","execute","exercise","expense","explicit","extemporaneous","exterminate","faint","faith","faithful","fame","fanaticism","fanciful","fancy","farewell","fear","feminine","fetter","feud","fiction","fierce","financial","fine","fire","flock","fluctuate","fluid","follow","food","formidable","fortification","fortitude","fortunate","fraud","friendly","friendship","love","frighten","frugality","prudence","garrulous","circumlocution","gender","general","generous","genius","get","gift","give","govern","graceful","grief","habit","happen","happiness","comfort","happy","fortunate","harmony","harvest","hatred","have","hazard","healthy","help","heretic","heterogeneous","hide","high","hinder","history","holy","home","honest","justice","horizontal","humane","hunt","hypocrisy","hypocrite","hypothesis","idea","ideal","idiocy","insanity","idle","ignorant","imagination","immediately","immerse","imminent","impediment","impudence","incongruous","induction","industrious","industry","infinite","eternal","influence","inherent","injury","injustice","injustice","innocent","inquisitive","insanity","interpose","involve","journey","judge","justice","keep","restrain","kill","kin","knowledge","language","large","law","liberty","light","likely","listen","literature","lock","look","love","make","marriage","masculine","massacre","meddlesome","melody","memory","mercy","meter","mind","minute","misfortune","mob","model","modesty","money","morose","motion","mourn","mutual","mysterious","name","native","nautical","neat","necessary","necessity","predestination","neglect","new","nimble","normal","oath","obscure","obsolete","obstinate","obstruct","impediment","old","operation","order","ostentation","ought","oversight","pain","palliate","hide","particle","patience","people","perceive","perfect","permanent","permission","allow","pernicious","perplexity","persuade","pertness","perverse","obstinate","physical","pique","pitiful","pity","plant","plead","pleasant","plentiful","poetry","polite","polity","portion","poverty","power","praise","pray","precarious","precedent","predestination","prejudice","injury","pretense","prevent","previous","price","pride","primeval","profit","utility","progress","prohibit","promote","propitiation","propitious","proposal","propose","protract","proverb","prowess","prudence","purchase","pure","put","queer","quicken","quote","racy","radical","rare","reach","real","reasoning","rebellious","record","recover","refinement","refute","reliable","religion","reluctant","remark","rend","break","renounce","repentance","report","reproof","reprove","requite","rest","restive","restrain","retirement","revelation","revenge","revolution","revolve","rise","robber","royal","rustic","sacrament","sagacious","sale","sample","example","satisfy","scholar","science","literature","security","send","sensation","sensibility","severe","shake","fluctuate","shelter","sign","sin","criminal","sing","skeptic","sketch","skilful","slander","slang","slow","sneer","socialism","sound","speak","speech","spontaneous","spy","stain","state","steep","storm","story","stupidity","stupor","subjective","subsidy","subvert","succeed","suggestion","supernatural","support","suppose","surrender","synonymous","system","taciturn","tasteful","teach","education","temerity","term","terse","testimony","therefore","throng","time","tip","tire","tool","topic","trace","characteristic","transact","transaction","transcendental","transient","union","usual","normal","utility","profit","vacant","vain","venal","venerate","veneration","venerate","venial","venal","veracity","verbal","victory","vigilant","alert","virtue","religion","wander","way","wisdom","wit","work","yet","youthful"];
var headListLength = synonymHeadList.length;
//updates synonym diagram with random central node
function getRandom() {
    //assigns entered text area to a random head
    document.getElementById("myText").value = synonymHeadList[Math.floor(Math.random() * headListLength)];
    main();
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