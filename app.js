const playerCardsContainer = document.getElementById('player-cards');
const cartList = document.getElementById('cart-list');
const totalMembersSpan = document.getElementById('total-members');
const totalMaleSpan = document.getElementById('total-male');
const totalFemaleSpan = document.getElementById('total-female');

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchPlayers();
});

async function fetchPlayers(query = '') {
    let url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${query}`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        displayPlayers(data.player);
    } catch (error) {
        console.error('Error fetching players:', error);
    }
}

function displayPlayers(players) {
    playerCardsContainer.innerHTML = '';
    if (!players) return;
    players.slice(0, 10).forEach(player => {
        if (!player.strThumb) return;  // Skip player if no image source

        let playerCard = document.createElement('div');
        playerCard.className = 'col-md-4 player-card';
        let description = player.strDescriptionEN?.split(' ').slice(0, 20).join(' ') + '...';
        playerCard.innerHTML = `
            <div class="card">
                <img src="${player.strThumb}" class="card-img-top" alt="${player.strPlayer}">
                <div class="card-body">
                    <p><strong>Name:</strong> ${player.strPlayer}</p>
                    <p><strong>Nationality:</strong> ${player.strNationality}</p>
                    <p><strong>Date of Birth:</strong> ${player.dateBorn}</p>
                    <p><strong>Salary:</strong> ${player.strWage || 'N/A'}</p>
                    <p><strong>Team Name:</strong> ${player.strTeam}</p>
                    <p><strong>Position:</strong> ${player.strPosition}</p>
                    <p><strong>Sports Type:</strong> ${player.strSport}</p>
                    <p><strong>Country:</strong> ${player.strCountry}</p>
                    <p><strong>Gender:</strong> ${player.strGender}</p>
                    <p><strong>City:</strong> ${player.strBirthLocation}</p>
                    <p><strong>Email:</strong> ${player.strEmail || 'N/A'}</p>
                    <div class="social-icons">
                        <a href="${player.strFacebook}" target="_blank" class="mr-3"><i class="fab fa-facebook"></i></a>
                        <a href="${player.strTwitter}" target="_blank" class="mr-3"><i class="fab fa-twitter"></i></a>
                        <a href="${player.strInstagram}" target="_blank"><i class="fab fa-instagram"></i></a>
                    </div>
                    <button style="margin-top: 10px;" class="btn btn-primary" onclick="addToCart('${player.idPlayer}', '${player.strPlayer}', '${player.strGender}')">Add to Group</button>
                    <button style="margin-top: 10px;" class="btn btn-secondary" onclick="showDetails('${player.idPlayer}')">Details</button>
                </div>
            </div>
        `;
        playerCardsContainer.appendChild(playerCard);
    });
}

function addToCart(id, name, gender) {
    if (cart.some(player => player.id === id)) {
        alert('Player is already in the group');
        return;
    }

    if (cart.length >= 11) {
        alert('Cannot add more than 11 players to the group');
        return;
    }

    cart.push({ id, name, gender });
    updateCart();
}

function updateCart() {
    cartList.innerHTML = '';
    let totalMale = 0;
    let totalFemale = 0;
    cart.forEach(player => {
        let listItem = document.createElement('li');
        listItem.textContent = player.name;
        cartList.appendChild(listItem);
        if (player.gender === 'Male') totalMale++;
        else if (player.gender === 'Female') totalFemale++;
    });

    totalMembersSpan.textContent = cart.length;
    totalMaleSpan.textContent = totalMale;
    totalFemaleSpan.textContent = totalFemale;
}

async function showDetails(id) {
    let url = `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        let player = data.players[0];
        document.getElementById('player-details').innerHTML = `
            <div class="text-center">
                <img src="${player.strThumb || 'placeholder.jpg'}" class="img-fluid" alt="${player.strPlayer}">
            </div>
            <h5>${player.strPlayer}</h5>
            <p>${player.strDescriptionEN}</p>
            <div class="social-icons">
                <a href="${player.strFacebook}" target="_blank" class="mr-3"><i class="fab fa-facebook"></i></a>
                <a href="${player.strTwitter}" target="_blank" class="mr-3"><i class="fab fa-twitter"></i></a>
                <a href="${player.strInstagram}" target="_blank"><i class="fab fa-instagram"></i></a>
            </div>
        `;
        $('#playerDetailsModal').modal('show');
    } catch (error) {
        console.error('Error fetching player details:', error);
    }
}

document.getElementById('search-form').addEventListener('submit', event => {
    event.preventDefault();
    let query = document.getElementById('search-input').value;
    fetchPlayers(query);
});
