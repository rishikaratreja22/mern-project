import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";



export const newBooking = async (req, res, next) => {
    const { movie, date, seatNumber, user } = req.body;

    try {
        const existingMovie = await Movie.findById(movie);
        const existingUser = await User.findById(user);

        if (!existingMovie) {
            return res.status(404).json({ message: "Movie not found with given ID" });
        }
        if (!existingUser) {
            return res.status(404).json({ message: "User not found with given ID" });
        }

        const booking = new Bookings({
            movie: existingMovie._id,
            date: new Date(date),
            seatNumber,
            user: existingUser._id 
        });

        const session = await mongoose.startSession();
        session.startTransaction();

        existingUser.bookings.push(booking);
        existingMovie.bookings.push(booking);

        await existingUser.save({ session });
        await existingMovie.save({ session });
        await booking.save({ session });

        await session.commitTransaction();
        return res.status(201).json({ booking });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to create a booking", error: err.message });
    }
};
//------------------------------------------------------------------------------------------------
export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const booking = await Bookings.findById(id).populate("user movie");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
//-------------------------------------------------------------------------------------------------





//----------------------------------------------------------------------------------------------------
export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  console.log("Delete request for booking ID:", id);

  let booking; 
  try {
    booking = await Bookings.findById(id).populate("user movie");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (booking.user) {
        await User.updateOne(
          { _id: booking.user._id },
          { $pull: { bookings: booking._id } },
          { session }
        );
      }

      if (booking.movie) {
        await Movie.updateOne(
          { _id: booking.movie._id },
          { $pull: { bookings: booking._id } },
          { session }
        );
      } 

      await Bookings.findByIdAndDelete(id).session(session);

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to delete booking" });
  }
};

// export const deleteBooking = async (req, res, next) => {
//     const id = req.params.id;
//     let booking;

//     try {
//         booking = await Bookings.findByIdAndDelete(id).populate('user').populate('movie');
//         console.log(booking);

//         if (!booking) {
//             return res.status(500).json({ message: 'Unable to Delete' });
//         }

//         const session = await mongoose.startSession();
//         session.startTransaction();

//         // Make sure `booking.user` and `booking.movie` are populated
//         if (booking.user && booking.movie) {
//             pull(booking.user.bookings, booking._id);
//             pull(booking.movie.bookings, booking._id);

//             // Save the updated user and movie documents
//             await booking.movie.save({ session });
//             await booking.user.save({ session });

//             await session.commitTransaction();
//         } else {
//             throw new Error("User or Movie not populated correctly");
//         }

//         session.endSession();
//         return res.status(200).json({ message: 'Successfully Deleted' });

//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ message: 'Something went wrong' });
//     }
// };
