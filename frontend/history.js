// load history function
async function loadHistory() {
    const email = document.getElementById("historyEmail").value;
    const resultDiv = document.getElementById("historyResult");

    if (!email) {
        resultDiv.innerText = "Please enter an email.";
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

        data.bookings.forEach(booking => {
            const div = document.createElement("div");
            div.innerHTML = `
                <p>
                    <strong>Movie</strong>: ${booking.movie_title} <br>
                    <strong>Movie ID</strong>: ${booking.movie_id} <br>
                    <strong>Showtime</strong>: ${booking.showtime} <br>
                    <strong>Seat</strong>: ${booking.seat} <br><br>
                    <button onclick="deleteBooking('${booking._id}')">
                        Delete Booking
                    </button><br><br>
                </p>
                `;

            resultDiv.appendChild(div);

        });
    } catch (error) {
        console.error(error);
        resultDiv.innerText = "Error loading booking history.";
    }
}

// when rendering bookings, add a delete button
bookings.forEach(booking => {
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${booking.movie_title}</td>
    <td>${booking.showtime}</td>
    <td>${booking.seat}</td>
    <td>
        <button onclick="deleteBooking('${booking._id}')">
            Delete
        </button>
    </td>
    `
    tableBody.appendChild(row);
})

// delete booking function
async function deleteBooking(bookingId) {
    if (!confirm("Are you sure you want to delete this booking?")) {
        return;
    } 

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/booking/${bookingId}`,
        { method: "DELETE" }
    );

    const data = await response.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    alert("Booking deleted!");
    loadHistory();

    } catch (err) {
        console.error(err);
        alert("Failed to delete booking.");
    }
}