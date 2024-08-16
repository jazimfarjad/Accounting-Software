import React from 'react'
import '../../App.css'
import { Link } from 'react-router-dom'
import { useState, useEffect , createContext } from 'react'
import { auth } from '../../Firebase/Firebase'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, query, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function SeeVenders() {

  const [name, setName] = useState('')
  const [Vender, SetVenders] = useState([])

<<<<<<< HEAD
  const VenderRandomCode = Math.floor(Math.random() * 100000)
  const VenderGlCode = Math.floor(Math.random() * 100000)
  const VenderGlCodeFull = "PK" + VenderGlCode
=======

    const VenderRandomCode = Math.floor(Math.random() * 100000)
    const VenderGlCode = Math.floor(Math.random() * 100000)
    const VenderGlCodeFull = "PK" + VenderGlCode
>>>>>>> 191a482225850831a031903e45b0f92e3f5edf9a


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


  async function getVenders() {
    const q = query(collection(db, "Venders"));
    const querySnapshot = await getDocs(q);

    let rows = "";

    querySnapshot.forEach((doc) => {
      const Vender = doc.data();

      // Create a unique identifier for each row to pass to OpenDetail
      const rowId = doc.id;

      // Add the row to the table

      rows += `
            <tr data-id="${rowId}">
                <td>${Vender.Name}</td>
                <td className="mobile-header">${Vender.Email}</td>
                <td className="mobile-header">${Vender.Contact}</td>
                <td className="mobile-header">${Vender.Cnic}</td>
                <td className="mobile-header">${Vender.Adress}</td>
                <td className="mobile-header">${Vender.AdditionalInfo}</td>
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
    const docRef = doc(db, "Venders", rowId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const Vender = docSnap.data();

      Swal.fire({
        title: '<strong>Vender Details</strong>',
        icon: 'success',
        html: `
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h5><strong>Vender Name:</strong> ${Vender.Name}</h5>
                            <h5><strong>Product Code:</strong> ${Vender.Code}</h5>
                            <h5><strong>GLCode:</strong> ${Vender.GLCode}</h5>
                            <h5><strong>Email:</strong> ${Vender.Email}</h5>
                            <h5><strong>Contact:</strong> ${Vender.Contact}</h5>
                            <h5><strong>Contact Person:</strong> ${Vender.ContactPerson}</h5>
                            <h5><strong>CNIC:</strong> ${Vender.Cnic}</h5>
                            <h5><strong>NTN Number:</strong> ${Vender.NtnNumber}</h5>
                            <h5><strong>STN Number:</strong> ${Vender.StnNumber}</h5>
                            <h5><strong>Address:</strong> ${Vender.Adress}</h5>
                            <h5><strong>Additional Info:</strong> ${Vender.AdditionalInfo}</h5>
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
            text: "You want to delete this Vender!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(async (result) => {
            if (result.isConfirmed) {
              const postRef = doc(db, "Venders", rowId);
              try {
                await deleteDoc(postRef);
              } catch (error) {
                console.error("Error deleting document: ", error);
              }
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Vender has been deleted Successfully',
                showConfirmButton: false,
                timer: 1500
              })
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: 'Are you Sure ?',
            text: 'You Want to Edit This Vender',
            icon: 'success',
            confirmButtonText: 'Close',
            confirmButtonColor: '#3085d6',
            showCloseButton: true,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: 'ref',
            cancelButtonColor: 'orange'
          }).then(async (EditResult) => {
            if (EditResult.isConfirmed) {

              await Swal.fire({
                title: "Select Your Updating Field",
                input: "select",
                inputOptions: {
                  Venders: {
                    Name: 'Name',
                    Email: 'Email',
                    Contact: 'Contact',
                    ContactPerson: 'ContactPerson',
                    Cnic: 'Cnic',
                    NtnNumber: 'NtnNumber',
                    StnNumber: 'StnNumber',
                    Adress: 'Adress',
                    AdditionalInfo: 'AdditionalInfo'
                  },
                },
                inputPlaceholder: "Select a Field that you want to edit",
                showCancelButton: true,
                inputValidator: (value) => {
                  return new Promise(async (resolve) => {
                    if (value === "Name") {
                      const { value: firstname } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Vender Name',
                        inputPlaceholder: 'Enter New Vender Name Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Vender Name Here'
                        },
                        showCancelButton: true
                      })
                      if (firstname) {
                        const postRef = doc(db, "Venders", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

<<<<<<< HEAD
                        try {
                          await updateDoc(postRef, {
                            Name: firstname,
                          });
                          window.location.reload()
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "Email") {
                      const { value: email } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Vender Email',
                        inputPlaceholder: 'Enter New Vender Email Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Vender Email Here'
                        },
                        showCancelButton: true
                      })
                      if (email) {
                        const postRef = doc(db, "Venders", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            Email: email,
                          });
                          window.location.reload()
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "Contact") {
                      const { value: Contact } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Vender Contact1',
                        inputPlaceholder: 'Enter New Vender Contact1 Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Vender Contact1 Here'
                        },
                        showCancelButton: true
                      })
                      if (Contact) {
                        const postRef = doc(db, "Venders", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            Contact: Contact,
                          });
                          window.location.reload()
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "ContactPerson") {
                      const { value: ContactPerson } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Vender Contact2',
                        inputPlaceholder: 'Enter New Vender Contact2 Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Vender Contact1 Here'
                        },
                        showCancelButton: true
                      })
                      if (ContactPerson) {
                        const postRef = doc(db, "Venders", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            ContactPerson: ContactPerson,
                          });
                          window.location.reload()
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "Cnic") {
                      const { value: Cnic } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Vender CNIC',
                        inputPlaceholder: 'Enter New Vender CNIC Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Vender CNIC Here'
                        },
                        showCancelButton: true
                      })
                      if (Cnic) {
                        const postRef = doc(db, "Venders", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            Cnic: Cnic,
                          });
                          window.location.reload()
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "NtnNumber") {
                      const { value: NtnNumber } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Vender NTN Number',
                        inputPlaceholder: 'Enter New Vender NTN Number Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Vender NTN Number Here'
                        },
                        showCancelButton: true
                      })
                      if (NtnNumber) {
                        const postRef = doc(db, "Venders", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            NtnNumber: NtnNumber,
                          });
                          window.location.reload()
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "StnNumber") {
                      const { value: StnNumber } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Vender STN Number',
                        inputPlaceholder: 'Enter New Vender STN Number Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Vender STN Number Here'
                        },
                        showCancelButton: true
                      })
                      if (StnNumber) {
                        const postRef = doc(db, "Venders", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            StnNumber: StnNumber,
                          });
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "Adress") {
                      const { value: Adress } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Vender Address',
                        inputPlaceholder: 'Enter New Vender Address Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Vender Address Here'
                        },
                        showCancelButton: true
                      })
                      if (Adress) {
                        const postRef = doc(db, "Venders", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            Adress: Adress,
                          });
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "AdditionalInfo") {
                      const { value: AdditionalInfo } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Vender Additional Info',
                        inputPlaceholder: 'Enter New Vender Additional Info Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Vender Additional Info Here'
                        },
                        showCancelButton: true
                      })
                      if (AdditionalInfo) {
                        const postRef = doc(db, "Venders", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            AdditionalInfo: AdditionalInfo,
                          });
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else {
                      resolve("Please Select Any One Field");
                    }
                  });
=======
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You want to delete this Vender!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            const postRef = doc(db, "Venders", rowId);
                            try {
                                await deleteDoc(postRef);
                            } catch (error) {
                                console.error("Error deleting document: ", error);
                            }
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Vender has been deleted Successfully',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        } 
                    })
                }else if(result.dismiss === Swal.DismissReason.cancel) {
                   window.location=`/EditVenders/id/:${rowId}`
>>>>>>> 191a482225850831a031903e45b0f92e3f5edf9a
                }
              });

            }
          })
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



  getVenders();

  console.log(Vender);




<<<<<<< HEAD
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
            <Link onClick={logout} ><li style={{ backgroundColor: 'red', color: 'white' }} >Logout</li></Link>
=======
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
>>>>>>> 191a482225850831a031903e45b0f92e3f5edf9a

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
                <th>Name</th>
                <th>Email</th>
                <th>Contact1</th>
                <th>CNIC</th>
                <th>Adress</th>
                <th>Additional Info</th>
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

<<<<<<< HEAD
      </div>
    </main>


  )
=======
            </div>
        </main>
    )
>>>>>>> 191a482225850831a031903e45b0f92e3f5edf9a
}