import React from 'react'
import '../../App.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth } from '../../Firebase/Firebase'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, query, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function SeePurchases() {

    const [name, setName] = useState('')

    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user.email)
            } else {
            }
            if (!user) {
                window.location = "/Login"
            }
        });
    })



    // for date 
    let forDayInWords = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursady', 'Friday', 'Saturday']
    let forMonthInWords = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octuber', 'November', 'December']

    let fullDate = new Date()
    let isDay = fullDate.getDay()
    let isDate = fullDate.getDate()
    let isMonth = fullDate.getMonth()
    let isYear = fullDate.getFullYear()

    let finalDay;
    let finalMonth;
    for (let i = 0; i < forMonthInWords.length; i++) {

        if (isDay === i) {
            finalDay = forDayInWords[i]
        }
        if (isMonth === i) {
            finalMonth = forMonthInWords[i]
        }
    }
    let fullFinalDate = `${finalDay}, ${finalMonth}-${isDate}-${isYear}`;


    // for timing  


    // Initial time
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // Function to update the time
        const updateTime = () => {
            setTime(new Date());
        };

        // Set interval to update time every second
        const intervalId = setInterval(updateTime, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Format time
    const isHours = time.getHours().toString().padStart(2, '0');
    const isMinutes = time.getMinutes().toString().padStart(2, '0');
    const isSeconds = time.getSeconds().toString().padStart(2, '0');
    let fullTime = `${isHours} : ${isMinutes} : ${isSeconds}`
    let logout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            window.location.href = "/Login"
        }).catch((error) => {
            // An error happened.
        });
    }


    async function GetPurchases() {
        const q = query(collection(db, "Purchase"));
        const querySnapshot = await getDocs(q);

        let rows = "";

        querySnapshot.forEach((doc) => {
            const Purchases = doc.data();

            // Create a unique identifier for each row to pass to OpenDetail
            const rowId = doc.id;

            // Add the row to the table

            rows += `
            <tr data-id="${rowId}">
                <td>${Purchases.VenderName}</td>
                <td className="mobile-header">${Purchases.VenderCode}</td>
                <td className="mobile-header">${Purchases.PurchaseDate}</td>
                <td className="mobile-header">${Purchases.PurchasedMoney}</td>
                <td className="mobile-header">${Purchases.Payment}</td>
            </tr>
            `;

        });

        // Insert rows into the table body
        const tableBody = document.getElementById("TableBody");
        tableBody.innerHTML = rows;

        // Attach event listeners to table rows
        tableBody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', () => {
                const rowId = row.getAttribute('data-id');
                OpenDetail(rowId);
            });
        });
    }

    async function OpenDetail(rowId) {
        // Fetch the specific vendor document based on the rowId
        const docRef = doc(db, "Purchase", rowId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const Customer = docSnap.data();

            Swal.fire({
                title: '<strong>Purchased Details</strong>',
                icon: 'success',
                html: `
                <div className="container">
    <div className="row" style="display: flex justify-content: center; align-items: center;; flex-wrap: wrap;">
    <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
    <h5 style="margin-right: 20px;"><strong>Purchased Code:</strong> ${Customer.PurchaseCode}</h5>
            <h5 style="margin-right: 20px;"><strong>VenderName:</strong> ${Customer.VenderName}</h5>
            <h5 style="margin-right: 20px;"><strong>VenderCode:</strong> ${Customer.VenderCode}</h5>
            <h5 style="margin-right: 20px;"><strong>PurchaseDate:</strong> ${Customer.PurchaseDate}</h5>
            <h5 style="margin-right: 20px;"><strong>PurchasedMoney:</strong> ${Customer.PurchasedMoney}</h5>
            <h5 style="margin-right: 20px;"><strong>Payment:</strong> ${Customer.Payment}</h5>
            <h5 style="margin-right: 20px;"><strong>AdvancePayment:</strong> ${Customer.AdvancePaymentOrNot}</h5>
            <h5 style="margin-right: 20px;"><strong>AdditionalNote:</strong> ${Customer.AdditionalNote}</h5>
        </div>
    </div>
</div>

                `,
                showCloseButton: true,
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Edit',
                confirmButtonColor: 'ref',
                cancelButtonColor: 'orange'

            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You want to delete this Purchase!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            const postRef = doc(db, "Purchase", rowId);
                            try {
                                await deleteDoc(postRef);
                            } catch (error) {
                                console.error("Error deleting document: ", error);
                            }
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Purchase has been deleted Successfully',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    window.location = `/EditPurchase/id/:${rowId}`

                }
            })
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No such document!',
                icon: 'error',
                confirmButtonText: 'Close',
                confirmButtonColor: '#3085d6'
            });
        }
    }



    GetPurchases();





    return (

        <main className="DashboardMain">
            <div className="DashboardleftSideBar">
                <h2>Dashboard</h2>
                <ul>
                    <Link to="/Dashboard"><li>Dashboard</li></Link>
                    <Link to="/Vendor"><li>Vendor</li></Link>
                    <Link to="/Customer"><li>Customer</li></Link>
                    <Link to="/Sale"><li>Sale</li></Link>
                    <Link to="/Purchase"><li>Purchase</li></Link>
                    <Link to="/Product"><li>Product</li></Link>
                    <Link to="/Invoice"><li>Invoice</li></Link>
                    <Link to="/UOM"><li>UOM</li></Link>
                    <Link to="/Attendance"><li>Attendance</li></Link>
                    <Link to="/Employee"><li>Employee</li></Link>
                    <Link to="/Salary"><li>Salary</li></Link>
                </ul>
                <div className="login_signup">
                    <ul>
                        <Link to="/login"><li>Login</li></Link>
                        <Link to="/signup"><li>Signup</li></Link>
                        <Link onClick={logout} ><li style={{ backgroundColor: 'red', color: 'white' }} >Logout</li></Link>

                    </ul>
                </div>
            </div>
            <div className="DashboardrightSideBar">
                <div className="header">
                    <div className="headerLeftSection">
                        <span id="one" style={{ fontSize: '15px' }}>{fullFinalDate} </span>
                        <span id="two">Time: {fullTime}</span>
                        <span id="three">Account</span>
                    </div>
                    <div className="headerRightSection">
                        <span>{name}</span>
                    </div>
                </div>
                <div className="Productbody">
                    {/* <div className="Productbody" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow:'hidden ' }}> */}
                    {/* <p>Click the names to see more data.</p> */}

                    <table style={{ width: '100%', cursor: 'alias' }}>
                        <thead>
                            <tr className="table-headers" style={{ fontSize: '12px', overflow: 'scroll' }}>
                                <th>Vender Name</th>
                                <th>Vender Code</th>
                                <th>Purchased Date</th>
                                <th>Purchased Price</th>
                                <th>Payment Method</th>
                            </tr>
                        </thead>
                        {/* <tbody style={{ overflow: 'scroll', height: '100px !important' }} id='TableBody' > */}
                        <tbody id='TableBody' >

                            {/* <tr>
      <td>Flex</td>
      <th className="mobile-header">Number</th><td>5478</td>
      <th className="mobile-header">Market rate</th><td>€42.68	</td>
      <th className="mobile-header">Weight</th><td>2%</td>
      <th className="mobile-header">Value</th><td>€4,676.02</td>
      <th className="mobile-header">Number</th><td>5478</td>
      <th className="mobile-header">Market rate</th><td>€42.68	</td>
      <th className="mobile-header">Weight</th><td>2%</td>
      <th className="mobile-header">Value</th><td>€4,676.02</td>
      <th className="mobile-header">Value</th><td>€4,676.02</td>
      <th className="mobile-header">Value</th><td>€4,676.02</td>
    </tr>
   */}
                            <h3>Loading...</h3>
                        </tbody>
                    </table>

                </div>

            </div>
        </main>


    )
}