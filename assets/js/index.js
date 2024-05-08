// materialize code
document.addEventListener("DOMContentLoaded", function () {
	// Initialize Materialize select
	var elems = document.querySelectorAll("select");
	var instances = M.FormSelect.init(elems);
});

document.addEventListener("DOMContentLoaded", function () {
	const tabButtons = document.querySelectorAll(".tabButton");
	const tabContents = document.querySelectorAll(".tabContents");

	// Add event listener to each tab button
	tabButtons.forEach((button, index) => {
		button.addEventListener("click", function (e) {
			e.preventDefault();
			// Remove 'active' class from all buttons
			tabButtons.forEach((btn) => btn.classList.remove("active"));

			// Add 'active' class to the clicked button
			this.classList.add("active");

			// Hide all tab contents
			tabContents.forEach((content) => (content.style.display = "none"));

			// Display the corresponding content based on the button's index
			tabContents[index].style.display = "block";
		});
	});

	// Show the first tab content by default
	tabButtons[0].click();
});
