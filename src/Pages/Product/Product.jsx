import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth } from '../../Firebase/Firebase'
import { onAuthStateChanged, signOut } from "firebase/auth";
function Product() {
    
    const [name, setName] = useState('')

    const [Name, SetName] = useState('')
    const [ImportOrLocal, SetImportOrLocal] = useState('')
    const [ProductNature, SetProductNature] = useState('')
    const [AdditionalInfo, SetAdditionalInfo] = useState('')

    const VenderRandomCode = Math.floor(Math.random() * 100000)
    const VenderGlCode = Math.floor(Math.random() * 100000)
    const VenderGlCodeFull = "PK" + VenderGlCode
    

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setName(user.email)
        } else {
        }
    });

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

    return (
        <main className="DashboardMain">
            <div className="DashboardleftSideBar">
                <h2>Dashboard</h2>
                <ul>
                    <Link to="/Dashboard"><li>Dashboard</li></Link>
                    <Link to="/Vendor"><li>Add Vendor</li></Link>
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
                <div className="Productbody" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                    <main class="main">
                        <h2>Product Infomation</h2>
                        <div class="formGroup">
                            {/* code auto generate krna hy  */}
                            <input type="text" name="Code" id="Code" placeholder="Code Will Be Generate Auto" disabled />
                            <input type="text" name="Name" id="Name" placeholder=" Name" onChange={(e)=>{SetName(e.target.value)}} />
                        </div>

                        <div class="formGroup">
                            {/* <label for="select"> Product Type</label> */}
                            <br />
                            <select name="" id="select" onChange={(e)=>{SetImportOrLocal(e.target.value)}}>
                                <option value=""> Local </option>
                                <option value=""> import </option>
                            </select>
                            <label for="Nature"> Product Nature</label>
                            <br />
                            <select name="" id="Nature" onChange={(e)=>{SetProductNature(e.target.value)}}>
                                <option value=""> Consumeable </option>
                                <option value=""> Assests </option>
                                <option value=""> Etc... </option>
                            </select>
                        </div>
                        <div class="formGroup">
                            <input type="text" name="additionalNote" id="additionalNote" placeholder="Additional Info" />
                        </div>
                        <button type="submit" id="submit" onclick="addProduct()"> Save </button>
                    </main>


                </div>
            </div>
        </main>

    )
}

export default Product
