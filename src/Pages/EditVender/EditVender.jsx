import React, { useState, useEffect } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import { auth } from '../../Firebase/Firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../Firebase/Firebase';
import Swal from 'sweetalert2';

export default function EditVenders() {

    const [name, setName] = useState('');

    // State variables for vendor data
    const [Name, SetName] = useState('');
    const [Email, SetEmail] = useState('');
    const [Contact, SetContact] = useState('');
    const [ContactPerson, SetContactPerson] = useState('');
    const [Cnic, SetCnic] = useState('');
    const [NtnNumber, SetNtnNumber] = useState('');
    const [StnNumber, SetStnNumber] = useState('');
    const [Adress, SetAdress] = useState('');
    const [AdditionalInfo, SetAdditionalInfo] = useState('');

    // Get the current URL from the browser
    const url = window.location.href;

    // Extract the ID from the URL
    const id = url.split('/').pop();

    // Remove the leading colon if it exists
    const VenderId = id.startsWith(':') ? id.slice(1) : id;

    console.log(VenderId);

    // Check authentication status
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user.email);
            } else {
                window.location = "/Login";
            }
        });
    }, []);

    // Fetch vendor details from Firestore
    useEffect(() => {
        if (VenderId) {
            const fetchVenderDetails = async () => {
                const docRef = doc(db, "Venders", VenderId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    SetName(data.Name);
                    SetEmail(data.Email);
                    SetContact(data.Contact);
                    SetContactPerson(data.ContactPerson);
                    SetCnic(data.Cnic);
                    SetNtnNumber(data.NtnNumber);
                    SetStnNumber(data.StnNumber);
                    SetAdress(data.Adress);
                    SetAdditionalInfo(data.AdditionalInfo);
                    console.log(data);
                } else {
                    console.log("No such document!");
                }
            };
            fetchVenderDetails();
        }
    }, [VenderId]);

    // Function to handle form submission and update the vendor details
    const handleUpdate = async () => {
        const docRef = doc(db, "Venders", VenderId);
        try {
            await updateDoc(docRef, {
                Name,
                Email,
                Contact,
                ContactPerson,
                Cnic,
                NtnNumber,
                StnNumber,
                Adress,
                AdditionalInfo,
            });
            Swal.fire({
                title: 'Vendor Updated Successfully',
                text: 'Vendor information has been updated.',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
            window.location = "/SeeVenders"
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while updating the vendor.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            console.error("Error updating document: ", error);
        }
    };

    // Get current date and time
    const forDayInWords = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const forMonthInWords = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const fullDate = new Date();
    const isDay = fullDate.getDay();
    const isDate = fullDate.getDate();
    const isMonth = fullDate.getMonth();
    const isYear = fullDate.getFullYear();

    const finalDay = forDayInWords[isDay];
    const finalMonth = forMonthInWords[isMonth];
    const fullFinalDate = `${finalDay}, ${finalMonth}-${isDate}-${isYear}`;

    // Manage time
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const updateTime = () => setTime(new Date());
        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const isHours = time.getHours().toString().padStart(2, '0');
    const isMinutes = time.getMinutes().toString().padStart(2, '0');
    const isSeconds = time.getSeconds().toString().padStart(2, '0');
    const fullTime = `${isHours} : ${isMinutes} : ${isSeconds}`;

    const logout = () => {
        signOut(auth).then(() => {
            window.location.href = "/Login";
        }).catch((error) => {
            console.error("Error during sign out:", error);
        });
    };

    return (
        <main className="DashboardMain">
            <div className="DashboardleftSideBar">
                <h2>Dashboard</h2>
                <ul>
                    <Link to="/Dashboard"><li>Dashboard</li></Link>
                    <Link to="/Vendor"><li>Vendor</li></Link>
                    <Link to="/Customer"><li>Customer</li></Link>
                    <Link to="/Product"><li>Product</li></Link>
                    <Link to="/UOM"><li>UOM</li></Link>
                    <Link to="/Purchase"><li>Purchase</li></Link>
                    <Link to="/Invoice"><li>Invoice</li></Link>
                    <Link to="/Sale"><li>Sale</li></Link>
                    <Link to="/Attendance"><li>Attendance</li></Link>
                    <Link to="/Employee"><li>Employee</li></Link>
                    <Link to="/Salary"><li>Salary</li></Link>
                </ul>
                <div className="login_signup">
                    <ul>
                        <Link to="/login"><li>Login</li></Link>
                        <Link to="/signup"><li>Signup</li></Link>
                        <Link onClick={logout}><li style={{ backgroundColor: 'red', color: 'white' }}>Logout</li></Link>
                    </ul>
                </div>
            </div>
            <div className="DashboardrightSideBar">
                <div className="header">
                    <div className="headerLeftSection">
                        <span id="one" style={{ fontSize: '15px' }}>{fullFinalDate}</span>
                        <span id="two">Time: {fullTime}</span>
                        <span id="three">Account</span>
                    </div>
                    <div className="headerRightSection">
                        <span>{name}</span>
                    </div>
                </div>
                <div className="Productbody" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <main className="main">
                        <h2>Edit Vendor Info</h2>
                        <div className="formGroup">
                            <input className='input' value={Name} type="text" name="Name" id="Name" placeholder="Name" onChange={(e) => SetName(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <input className='input' value={Email} type="email" name="email" id="email" placeholder="Email Address" onChange={(e) => SetEmail(e.target.value)} />
                            <input className='input' value={Contact} type="tel" name="contactNumber" id="contactNumber" placeholder="Contact Number" onChange={(e) => SetContact(e.target.value)} />
                            <input className='input' value={ContactPerson} type="text" name="contactPerson" id="contactPerson" placeholder="Contact Person" onChange={(e) => SetContactPerson(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <input className='input' value={Cnic} type="text" name="CNICnumber" id="CNICnumber" placeholder="CNIC Number" onChange={(e) => SetCnic(e.target.value)} />
                            <input className='input' value={NtnNumber} type="text" name="NTNnumber" id="NTNnumber" placeholder="NTN Number" onChange={(e) => SetNtnNumber(e.target.value)} />
                            <input className='input' value={StnNumber} type="text" name="STNnumber" id="STNnumber" placeholder="STN Number" onChange={(e) => SetStnNumber(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <input className='input' value={Adress} type="text" name="address" id="address" placeholder="Address" onChange={(e) => SetAdress(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <input className='input' value={AdditionalInfo} type="text" name="additionalNote" id="additionalNote" placeholder="Additional Info" onChange={(e) => SetAdditionalInfo(e.target.value)} />
                        </div>
                        <button type="submit" id="submit" onClick={handleUpdate} style={{ backgroundColor: 'orange', width: '150px', color: 'white' }}>Update Vendor</button>
                    </main>
                </div>
            </div>
        </main>
    );
}
