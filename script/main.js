/*
	Traccia:

	Copiamo la griglia fatta ieri nella nuova repo e aggiungiamo la logica del gioco (attenzione: non bisogna copiare
	tutta la cartella dell'esercizio ma solo l'index.html, e le cartelle js/ css/ con i relativi script e fogli di stile,
	per evitare problemi con l'inizializzazione di git).
	Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe.
	Attenzione: nella stessa cella può essere posizionata al massimo una bomba, perciò nell’array delle bombe
	non potranno esserci due numeri uguali. In seguito l'utente clicca su una cella: se il numero è presente nella
	lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina.
	Altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.
	La partita termina quando il giocatore clicca su una bomba o quando raggiunge il numero massimo possibile di
	numeri consentiti (ovvero quando ha rivelato tutte le celle che non sono bombe).
	Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente
	ha cliccato su una cella che non era una bomba.

	BONUS:
	Aggiungere una select accanto al bottone di generazione, che fornisca una scelta tra tre diversi livelli di difficoltà:
	- difficoltà 1 ⇒ 100 caselle, con un numero compreso tra 1 e 100, divise in 10 caselle per 10 righe;
	- difficoltà 2 ⇒ 81 caselle, con un numero compreso tra 1 e 81, divise in 9 caselle per 9 righe;
	- difficoltà 3 ⇒ 49 caselle, con un numero compreso tra 1 e 49, divise in 7 caselle per 7 righe;

	Superbonus 1
	Quando si clicca su una bomba e finisce la partita, evitare che si possa cliccare su altre celle.

	Superbonus 2
	Quando si clicca su una bomba e finisce la partita, il software scopre tutte le bombe nascoste.
*/

// Generate button
let generateFieldBtn = document.querySelector("button[name='generateField']");

generateFieldBtn.addEventListener("click", generateField);

// Difficulty selector
let difficultySelector = document.querySelector("select[name='difficulty']");
difficultySelector.addEventListener("change", changeDifficulty);

// Change difficulty based on the current selector state
function changeDifficulty() {
	// Easy mode
	if (difficultySelector.value == 1) {
		document.querySelector("input[name='fieldColumns']").value = 10;
		document.querySelector("input[name='fieldRows']").value = 10;
	}
	// Medium mode
	else if (difficultySelector.value == 2) {
		document.querySelector("input[name='fieldColumns']").value = 9;
		document.querySelector("input[name='fieldRows']").value = 9;
	}
	// Hard mode
	else if (difficultySelector.value == 3) {
		document.querySelector("input[name='fieldColumns']").value = 7;
		document.querySelector("input[name='fieldRows']").value = 7;
	}
}

// Main function
function generateField() {
	// Getter for the section of the fields
	let fieldSettings = document.getElementById("fieldSettings");
	let tableSection = document.getElementById("field");

	tableSection.innerHTML = "";

	// Get board size
	let board = {
		// Round the number, converted into number data type, obtained from the raw html input
		columns: Math.round(
			Number(
				fieldSettings.querySelector("input[name='fieldColumns']").value
			)
		),
		// Round the number, converted into number data type, obtained from the raw html input
		rows: Math.round(
			Number(
				fieldSettings.querySelector("input[name='fieldRows']").value
			)
		)
	};

	// Constant for modify the number of the bombs
	let bombNum = 16;

	// Generate bombs
	let bombs = new Array();

	// Check input data
	if (board.columns > 1 && board.rows > 1 && board.columns < 100 && board.rows < 100) {
		// Input is OK
		// Remove listener
		generateFieldBtn.removeEventListener("click", generateField);

		// Loading message
		fieldSettings.innerHTML = "Generating the field...";

		console.log("Generating the field...");

		// Creates a table element 
		let tableElement = document.createElement('table');
		
		// Creates a table body element 
		let tableBody = document.createElement('tbody');

		// Defines the cell number
		let cellId = 1;

		let totalCells = board.rows*board.columns;

		let gameEnd = false;

		// In case the number of bombs pre-setted is greater than the number of the cells
		// Change the bomb number to the total cell number -1
		// Good luck :)
		if(totalCells <= bombNum)
			bombNum = totalCells-1;

		// Generate the bomb position
		// For the number of bombs in the field
		for (let i = 0; i < bombNum; i++) {
			// Generate a random id of the cell 1 < bombCell < Total cell
			let bombCell = Math.round(Math.random() * totalCells-1) + 1;

			// If the bombCell is not alreay taken
			if(!bombs.includes(bombCell)){
				// Put the cell in the bombs array
				bombs.push(bombCell);
			}
			else{
				// Do again the cycle
				i--;
			}
		}

		console.log(bombs);

		// For each row
		for (let i = 0; i < board.rows; i++) {
			// Create a table row
			let tableRow = document.createElement('tr');

			// For each column
			for (let j = 0; j < board.columns; j++) {

				// Create a cell with the data inside
				let tableCell = document.createElement('td');

				// Sets the table cell id attribute
				tableCell.setAttribute('id', cellId);
				
				// Sets the table cell id attribute
				tableCell.setAttribute('class', 'cell');
				
				// Prints the counter
				tableCell.innerHTML = cellId;
				
				// At the click it logs the id and sets the style of the cell to background blue
				tableCell.onclick = function() {
					if(!gameEnd)
						if(bombs.includes(Number(this.id))) {
							gameEnd = true;

							document.getElementById("game").innerHTML = "<h3 class='text-center'>Game Over</h3>";

							bombs.forEach(cell => {
								document.getElementById(cell).setAttribute('style', 'background-color: orange;');
							});

							this.setAttribute('style', 'background-color: red;');
						}
						else
							this.setAttribute('style', 'background-color: aqua;');
				}
				
				// Appends the newly created cell to the end of the row
				tableRow.appendChild(tableCell);
				
				// Updates the counter
				cellId++;
			}
			
			// Adds the newly created row to the table
			tableBody.appendChild(tableRow);
		}
		
		// Adds the newly created body to the table
		tableElement.appendChild(tableBody);
		
		// Adds the newly created table to the table
		tableSection.appendChild(tableElement);

		// Clear the message
		fieldSettings.innerHTML = "";
	} else {
		// Print error messagge
		tableSection.innerHTML = "Field settings are not correct. ";
	}
}
