// load history function
async function loadHistory() {
    const email = document.getElementById("historyEmail").value;
    const resultDiv = document.getElementById("historyResult");

    if (!email) {
        resultDiv.innerText = "Please enter an email";
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/booking-history?email=${email}`);

        const data = await response.json();

        if (!data.bookings || data.bookings.length === 0) {
            resultDiv.innerText = "No bookings found.";
            return;
        }

        // clear previous results
        resultDiv.innerHTML = ""

        data.bookings.forEach(bookings => {
            const div = document.createElement("div");
            div.innerHTML = `
                <p>
                    <strong>Movie</strong>: ${bookings.movie_title} <br>
                    <strong>Movie ID</strong>: ${bookings.movie_id} <br>
                    <strong>Showtime</strong>: ${bookings.showtime} <br>
                    <strong>Seat</strong>: ${bookings.seat}
                <p>
                <hr>
                `;
            resultDiv.appendChild(div);
        });
    } catch (error) {
        console.error(error);
        resultDiv.innerText = "Error loading booking history.";
    }
}