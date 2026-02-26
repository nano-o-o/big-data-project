from fastapi import FastAPI, HTTPException
from users import create_user
from bookings import create_booking
from database import movies_collection, bookings_collection, users_collection
from pydantic import BaseModel
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Movie Booking API is running."}

# enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# get all movies
@app.get("/movies")
def get_movies():
    movies = list(movies_collection.find())
    # convert ObjectID into strings
    for movie in movies:
        movie["_id"] = str(movie["_id"])
    return movies

# user model
class User(BaseModel):
    name: str
    email: str
    phone: str

# register user
@app.post("/users")
def register_user(user: User):
    user_id = create_user(user.name, user.email, user.phone)

    if not user_id:
        return {"error": "Email already registered."}
    
    return {"message": "User created", "user_id": user_id}

# booking model
class Booking(BaseModel):
    user_id: str
    movie_id: str
    showtime: str
    seat: str

# book ticket
@app.post("/book")
def book_ticket(booking: Booking):
    try:
        create_booking(
            booking.user_id,
            booking.movie_id,
            booking.showtime,
            booking.seat
        )
        return {"message": "Booking successful."}
    except ValueError as e:
        return {"error": str(e)}
    
# booked seats
@app.get("/booked-seats")
def get_booked_seats(movie_id: str, showtime: str):
    bookings = list(bookings_collection.find(
        {"movie_id": movie_id, "showtime": showtime},
        {"_id": 0, "seat": 1}
    ))
    booked_seats = [b["seat"] for b in bookings]
    return {"booked_seats": booked_seats}

# booking history
@app.get("/booking-history")
def booking_history(email : str):
    # find user by email
    user = users_collection.find_one({"email": email})
    if not user:
        return {"bookings": []}
    
    user_id = str(user["_id"])

    bookings = list(bookings_collection.find({"user_id": user_id}))

    result = []

    for booking  in bookings:
        movie = movies_collection.find_one(
            {"_id": ObjectId(booking["movie_id"])}
        )

        result.append({
            "movie_title": movie["title"] if movie else "Unknown",
            "movie_id": booking["movie_id"],
            "showtime": booking["showtime"],
            "seat": booking["seat"]
        })

    return {"bookings": result}