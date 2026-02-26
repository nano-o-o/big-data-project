let moviesData = [];
let seatRequestVersion = 0;
let selectedSeat = null;

// load movies from backend
async function loadMovies() {
    const response = await fetch("http://127.0.0.1:8000/movies");
    const movies = await response.json();

    moviesData = movies;

    const movieSelect = document.getElementById("movieSelect");

    // add placeholder option
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.text = "--- Select a Movie ---";
    placeholder.disabled = true;
    placeholder.selected = true;
    movieSelect.appendChild(placeholder);

    // add real movies
    movies.forEach(movie => {
        const option = document.createElement("option");
        option.value = movie._id;
        option.text = movie.title;
        movieSelect.appendChild(option);
    });

    // load showtimes for first movie
    updateShowtimes();
}

// showtimes dropdown function
function updateShowtimes() {
    const movieSelect = document.getElementById("movieSelect");
    const showtimeSelect = document.getElementById("showtime");

    const selectedMovieId = movieSelect.value;

    // stop if placeholder is selected
    if (!selectedMovieId) {
        showtimeSelect.innerHTML = "";
        return;
    }

    // clear previous showtimes
    showtimeSelect.innerHTML = "";

    // find selected movie
    const selectedMovie = moviesData.find(
        movie => movie._id === selectedMovieId
    );

    // safety guard
    if (!selectedMovie) return;

    // add its showtimes to dropdown
    selectedMovie.showtimes.forEach(time => {
        const option = document.createElement("option");
        option.value = time;
        option.text = time;
        showtimeSelect.appendChild(option);
    });
}

// run when page loads
loadMovies();
// run when movie changes
document.getElementById("movieSelect").addEventListener("change", updateShowtimes);

// booking function
async function bookTicket() {
    try {
        const movie_id = document.getElementById("movieSelect").value;
        const showtime = document.getElementById("showtime").value;
        const seat = selectedSeat;

        if (!seat) {
            document.getElementById("result").innerText =
                "Please select a seat.";
                return;
        }

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        // create or reuse user
        const userResponse = await fetch("http://127.0.0.1:8000/users", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, email, phone })
    });

    const userData = await userResponse.json();

    if (!userData.user_id) {
        document.getElementById("result").innerText =
            userData.error || "User creation failed.";
        return;
    }

    const user_id = userData.user_id

    // create booking
    const bookingResponse = await fetch("http://127.0.0.1:8000/book", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id,
            movie_id,
            showtime,
            seat
        })
    });

    const bookingData = await bookingResponse.json();
    console.log(bookingData);

    if (bookingData.error) {
        document.getElementById("result").innerText = bookingData.error;
        return;
    }

    // success message
    const selectedMovie = moviesData.find(m => m._id === movie_id);

    document.getElementById("result").innerText =
    `Booking successful!
    Movie: ${selectedMovie ? selectedMovie.title : "Unknown"}
    Showtime: ${showtime}
    Seat: ${seat}`;

    } catch (err) {
        console.error(err);
        document.getElementById("result").innerText =
            "Network error. Please try again.";
    }
}

// update seats function
async function updateSeats() {
    const movie_id = document.getElementById("movieSelect").value;
    const showtime = document.getElementById("showtime").value;
    const seatGrid = document.getElementById("seatGrid");

    if (!movie_id || !showtime) {
        seatGrid.innerHTML = "";
        return;
    }

    const currentVersion = ++seatRequestVersion;

    // clear old seats
    seatGrid.innerHTML = "";
    selectedSeat = null;

    // fetch booked seats
    const response = await fetch(
        `http://127.0.0.1:8000/booked-seats?movie_id=${movie_id}&showtime=${showtime}`
    );
    const data = await response.json();

    // ignore outdated responses
    if (currentVersion !== seatRequestVersion) return;

    const bookedSeats = data.booked_seats;

    // generate seat layout
    const rows = ["A", "B", "C"];
    const cols = [1, 2, 3, 4 ,5];

    rows.forEach(row => {
        cols.forEach(col => {
            const seat = row + col;
            const btn = document.createElement("button");

            btn.innerText = seat;
            btn.classList.add("seat-btn");

            // mark booked seats
            if (bookedSeats.includes(seat)) {
                btn.classList.add("booked");
                btn.disabled = true;
            } else {
                // click to select seat
                btn.onclick = () => {
                    document.querySelectorAll(".seat-btn").forEach(b =>
                        b.classList.remove("selected")
                    );
                    btn.classList.add("selected");
                    selectedSeat = seat;

                    validateForm();
                };
            }

            seatGrid.appendChild(btn);
        });
    });
}

validateForm();

// "book ticket" button validation function
function validateForm() {
    const movie = document.getElementById("movieSelect").value;
    const showtime = document.getElementById("showtime").value;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const bookBtn = document.getElementById("bookBtn");

    if (movie && showtime && selectedSeat && name && email && phone) {
        bookBtn.disabled = false;
    } else {
        bookBtn.disabled = true;
    }
}

document.getElementById("movieSelect").addEventListener("change", () => {
    updateShowtimes();
    updateSeats();
    validateForm();
});

document.getElementById("showtime").addEventListener("change", () => {
    updateSeats();
    validateForm();
});

document.getElementById("name").addEventListener("input", validateForm);

document.getElementById("email").addEventListener("input", validateForm);

document.getElementById("phone").addEventListener("input", validateForm);
