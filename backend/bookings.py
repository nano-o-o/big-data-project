from database import bookings_collection

def create_booking(user_id, movie_id, showtime, seat):
    # check if seat already booked
    existing = bookings_collection.find_one({
        "movie_id": movie_id,
        "showtime": showtime,
        "seat": seat
    })
    if existing:
        raise ValueError("Seat already booked!")
    
    booking = {
        "user_id": user_id,
        "movie_id": movie_id,
        "showtime": showtime,
        "seat": seat
    }
    bookings_collection.insert_one(booking)
