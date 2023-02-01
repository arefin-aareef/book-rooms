import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from 'sweetalert2'

function Bookingscreen({}) {
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [room, setroom] = useState();
  let { roomid, fromdate, todate } = useParams();
  const firstdate = moment(fromdate, "DD-MM-YYYY");
  const lastdate = moment(todate, "DD-MM-YYYY");
  const totaldays = moment.duration(lastdate.diff(firstdate)).asDays() + 1;
  const [totalamount, settotalamount] = useState();

  useEffect(() => {
    
    async function fetchData() {

      if(!localStorage.getItem('currentUser')){
        window.location.reload='/login'
      }

      try {
        setloading(true);
        const data = (await axios.post("/api/rooms/getroombyid", { roomid: roomid })).data;
        settotalamount(data.rentperday * totaldays);
        setroom(data);
        setloading(false);
      } catch (error) {
        setloading(false);
        seterror(true);
      }
    }
    fetchData();
  }, []);

  async function onToken(token) {
    console.log(token);

    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser")).data._id,
      fromdate,
      todate,
      totalamount,
      totaldays,
      token
    };
    try {
      setloading(true)
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setloading(false)
      Swal.fire('Congratulation' , 'Your room booked successfully' , 'success').then(result => {
        window.location.href='/profile'
      })
    } catch (error) {
      setloading(false)
      Swal.fire('Whoops' , 'Something went wrong' , 'error')
    }
    
  }

  return (
    <div className="m-5">
      {loading ? (
        <Loader />
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs container mx-auto">
            <div className="col-md-6">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" />
            </div>

            <div className="col-md-6">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>
                    Name :{" "}
                    {JSON.parse(localStorage.getItem("currentUser")).data.name}
                  </p>
                  <p>From Date : {fromdate}</p>
                  <p>To Date : {todate}</p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <h1>Amount</h1>
                <hr />
                <b>
                  <p>Total Days : {totaldays}</p>
                  <p>Rent Per Day : {room.rentperday}</p>
                  <p>Total Amount : {totalamount}</p>
                </b>
              </div>

              <div style={{ float: "right" }}>
                <StripeCheckout
                  amount={totalamount * 100}
                  token={onToken}
                  currency="BDT"
                  stripeKey="pk_test_51MW2SBSDIuxCNrHeDeft8ril9gI6gLYWmRp39CcFNIEfIOEHIvdaTYjkNcqdrLTdPTS2oAZp9slNdn9eAi4zdZdN00waHzwN82"
                >
                  <button className="btn btn-primary">
                    Pay Now
                  </button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;
