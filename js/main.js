const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const loadMore150Button = document.getElementById("loadMore150Button");
const URL = "https://pokeapi.co/api/v2/pokemon/";
let currentPage = 1;

// Load initial 150 Pokémon
function loadInitialPokemons() {
    const startIdx = (currentPage - 1) * 150 + 1;
    const endIdx = currentPage * 150;

    for (let i = startIdx; i <= endIdx; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => mostrarPokemon(data));
    }
}

// Load more 150 Pokémon
function loadMore150Pokemons() {
    currentPage++;
    loadInitialPokemons();
}

function mostrarPokemon(poke) {

    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }


    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {

                if(botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }

            })
    }
}))

// Call the function to load the initial 150 Pokémon
loadInitialPokemons();

// Event listener for the "Load More" button
loadMore150Button.addEventListener("click", loadMore150Pokemons);

// Function to filter and display Pokémon by name
function filterPokemonsByName(pokemonName) {
    listaPokemon.innerHTML = "";

    fetch(`${URL}${pokemonName}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Pokemon not found");
            }
            return response.json();
        })
        .then(data => mostrarPokemon(data))
        .catch(error => {
            console.error(error);
        });
}

const searchBar = document.getElementById("searchBar");
const searchButton = document.getElementById("searchButton");

// Event listener for the search button
searchButton.addEventListener("click", () => {
    const searchTerm = searchBar.value.toLowerCase().trim();
    if (searchTerm.length >= 3) {
        filterPokemonsByName(searchTerm);
    } else {
        // Reset to display all Pokémon
        loadInitialPokemons();
    }
});

// Call the function to load the initial 150 Pokémon
loadInitialPokemons();

// Event listener for the "Load More" button
loadMore150Button.addEventListener("click", loadMore150Pokemons);

const openSidebarButton = document.getElementById("openSidebar");
const closeSidebarButton = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");

openSidebarButton.addEventListener("click", () => {
    sidebar.classList.add("active");
});

closeSidebarButton.addEventListener("click", () => {
    sidebar.classList.remove("active");
});
