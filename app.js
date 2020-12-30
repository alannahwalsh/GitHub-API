const APIURL = "https://api.github.com/users/";

getUser("alannahwalsh");

async function getUser(user) {
  const resp = await fetch(APIURL + user);
  const respData = await resp.json();
  createUserCard(respData);

  const gitHubURL = "https://github.com/" + user

  //console.log(gitHubURL)

  getRepos(user);
}

async function getRepos(user) {
  const resp = await fetch(APIURL + user + "/repos");
  const respData = await resp.json();
  console.log(respData);
  addReposToCard(respData);
  createLineChart(respData);
}

function createUserCard(user) {

  if (user === null) {
    alert("myProperty value is the special value `undefined`");
  }
  const cardHTML = `
  
    <div class="info-card"> 
        <div>
            <a href=${user.html_url} target="_blank"> 
            <img class="user-avatar" src="${user.avatar_url}" alt="${user.name}"/>
            </a>
            </div>
        <div class="user-info">
            <h2>${user.login}</h2>
            <ul> 
                <li>${user.public_repos} <strong>Repos </strong></li>
                <li>${user.followers} <strong>Followers </strong></li>
                <li>${user.following} <strong>Following </strong></li>
            </ul>
        
            <h4>${user.name ? user.name : ' <h4>No user name</h4>'}</h4>
            <p>${user.bio ? user.bio : ' <p class="no-bio"></p>'}</p>
            <h4> Repos: </h4>
            <div id="repos"></div>
        </div>
    </div>
`;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 15)
    .forEach((repo) => {
      const repoEl = document.createElement("a");
      repoEl.classList.add("repo");

      repoEl.href = repo.html_url;
      repoEl.target = "_blank";
      repoEl.innerText = repo.name;

      reposEl.appendChild(repoEl);
    });


}

function createLineChart(repos) {
  const data = [];
  repos.forEach((repo) => {
    data.push({ "repo_name": repo.name, "stars": repo.stargazers_count });
  })

  // set the dimensions and margins of the graph
  d3.select("#line_chart").select("*").remove();

  // append the svg object to the body of the page
  ///////////////////////////// Create SVG

  var w = 800;
  var h = 250;

  var margin = {
    top: 20,
    bottom: 20,
    left: 40,
    right: 20
  }

  var width = w - margin.left - margin.right
  var height = h - margin.top - margin.bottom

  var svg = d3.select("#line_chart").append("svg")
    .attr("id", "svg")
    .attr("width", w)
    .attr("height", h)

  var chart = svg.append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  ///////////////////////////// Create Scale  

  var x = d3.scaleBand()
    .range([0, width])


  var y = d3.scaleLinear()
    .rangeRound([height, 0])


  ///////////////////////////// Create Line

  var line = d3.line()

    .x(function (d) {
      console.log(d.repo_name)
      console.log(x.domain())
      return x(d.repo_name)
    })

    .y(function (d) {
      console.log(d.stars)
      console.log(y.domain())
      return y(d.stars)
    })

  x.domain(data.map(function (d) {
    return d.repo_name
  }));

  y.domain([0, d3.max(data, function (d) {
    return d.stars
  })]);

  chart.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);


  ///////////////////////////// Create Axis

  var xAxis = chart.append('g')
    .classed('x-axis', true)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  var yAxis = chart.append('g')
    .classed('y-axis', true)
    .call(d3.axisLeft(y))
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});