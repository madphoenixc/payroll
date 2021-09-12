import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';


function Payslip() {
  const [company,setcompany] = useState([])
  const [employee,setempDetails]=useState([])
  const [payslip,setpayslip]=useState([])
  const [earning,setearning]=useState([])
  const [reimbursment,setreimbursment]=useState([])

  const [month,setMonth] = useState('')
  var totEarning = 0
  var reimbursmentAmount = 0


  function calculteEarning(){
    earning.forEach((earn) => { 
      totEarning+= Number(earn.amount) 
    })
    
    reimbursment.forEach(reimbursments =>{
      if(reimbursments.status === "Approved"){
        reimbursmentAmount += Number(reimbursments.amount)
      }
    })
  }

    function getData(){
    // Update the document title using the browser API
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        };
        
        fetch('https://payroll-fastify.herokuapp.com/api/company/'+localStorage.getItem("emp_company_id"), requestOptions)
        .then(response => response.json())
        .then(data => {
            setcompany(data);
            setearning(data.earningsDocArray);
            console.log(earning);
        })

    const requestOptions1 = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      };
      
      fetch('https://payroll-fastify.herokuapp.com/api/employee/'+localStorage.getItem("employee_id"), requestOptions1)
      .then(response => response.json())
      .then(data => {
          setempDetails(data);
          // console.log(data)
      })
      
    }


  function dateConversion(){
    var date = new Date(month)
    console.log("date")
    var curr = (date.toLocaleString('default',{month:'long'}))
    var selectedMonth = curr + ' ' + date.getFullYear()

    console.log(selectedMonth)

    const requestOptions2 = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      };
      
      fetch('https://payroll-fastify.herokuapp.com/api/employeePayslip/'+localStorage.getItem("employee_id")+'/'+selectedMonth, requestOptions2)
      .then(response => response.json())
      .then(data => {
        console.log(data);
          if(data.length !== 0){
            setpayslip(data[0]);
            setreimbursment(data[0].reimbursment)
            console.log(data)
          }
          else{
            setcompany([])
            setempDetails([])
            setreimbursment([])
            setpayslip([])
            toast.error('No Payslip Found for Selected Month',{autoClose:2000})
            return
          }
    })

    getData()

  }

  function renderData(){
    console.log(payslip,company,employee,reimbursment)
    if(payslip.length !== 0 && company.length !== 0 && employee.length !== 0){
      console.log("data")
      return (
        <>
          {calculteEarning()}
          <div className="payslip-header d-flex justify-content-around">
            <div className="company-wrappe1r d-flex">
              
              <div className="company-details">
                <h5>{company.company}</h5>
                <h6>
                  {company.address}
                </h6>
              </div>
            </div>
            <div className="payslip-details">
            
              <h5>Payslip</h5>
              <h6>For the month of {payslip.payDate}</h6>
            </div>
          </div>

          <div className="employee container">
            <hr className="text-primary" style={{ height: '4px' }} />
            <h4 className="text-primary">EMPLOYEE PAY SUMMARY</h4>
            <div className="container d-flex justify-content-between">
              <table>
                <tbody>
                  <tr>
                    <th>Employee Name</th>
                    <td>: {employee.employeeName} </td>
                  </tr>
                  <tr>
                    <th>Designation</th>
                    <td>: {employee.role}</td>
                  </tr><tr>
                    <th>Employee Email</th>
                    <td>: {employee.employeeEmail} </td>
                  </tr>
                  <tr>
                    <th>Pay Date</th>
                    <td>: {company.payDate}</td>
                  </tr>
                  <tr>
                    <th>Account Number</th>
                    <td>: {employee.accNumber} </td>
                  </tr> 
                </tbody>
              </table>

              <div className="pay-details text-dark m-3">
                <p>Employee Net Pay</p>
                <h2>₹ {employee.salary}</h2>
                {/* <p>Paid Date 31 LOP: 0</p> */}
              </div>
            </div>
            <hr className="text-primary" style={{ height: '4px' }} /> 
            <table className="table table-borderless">
              <thead>
                <tr className="text-primary">
                  <th scope="col" className="text-start">EARNINGS</th>
                  <th scope="col" className="text-start">AMOUNT</th>
                  <th scope="col" className="text-start">YTD</th>
            
                </tr>
              </thead>
              <tbody>
                {
                    earning.map((items,index)=>{
                    return(
                    
                  
                      <tr key={index}>
                        <td className="text-start">{items.name}</td>
                        <td className="text-start">₹ {items.amount}</td>
                        <td className="text-start">₹ {items.amount*12}</td>
                      </tr>
                      
                
                  )})
                }   
                <tr>
                  <th scope="row"  className="text-start">Gross Pay</th>
                  <td  className="text-start">₹ {totEarning}</td>
                </tr>
              </tbody>
            </table>
            <hr className="text-primary" style={{ height: '4px'}} /> 
            <table className="table table-borderless">
              <thead>
                <tr className="text-primary">
                  <th scope="col" className="text-start">DEDUCTIONS</th>
                  <th scope="col" className="text-start">(-)AMOUNT</th>
                  <th scope="col" className="text-start">YTD</th>
              
                </tr>
          
              </thead>
              <tbody>
                <tr>
                  <td className="text-start">EPF CONTIBUTION</td>
                  <td className="text-start">₹ {employee.deductions}</td>
                  <td className="text-start">₹ {employee.deductions*12}</td>
                </tr>
              </tbody>
            </table>

            <hr className="text-primary" style={{ height: '4px'}} /> 
            <table className="table table-borderless">
              <thead>
                <tr className="text-primary">
                  <th scope="col" className="text-start">REIMBURSTMENTS</th>
                  <th scope="col" className="text-start">AMOUNT</th>
                  <th scope="col" className="text-start" >YTD</th>
              
                </tr>
      
              </thead>
              <tbody>
                {
                  reimbursment.map((items,index)=>{
                    if(items.status === "Approved"){
                      return(
                        <tr key={index}>
                            <td className="text-start">{items.type}</td>
                            <td className="text-start">₹ {items.amount}</td>
                            <td className="text-start">₹ {items.amount*12}</td>
                        </tr>    
                    )}
                    return (<></>)
                  })
                }  
                <tr>
                  <th scope="row"  className="text-start">Total Reimburstments</th>
                  <td className="text-start">₹ {reimbursmentAmount}</td>
                </tr>
              </tbody>
            </table>  

            <hr className="text-primary" style={{ height: '4px' }} /> 

            <div style={{background:"#cce2e8", color:"#0b8eb3"}} className="p-3 mt-5">
              <p>Net Pay((Gross Earnings - Deductions)+Reimburstments ) = <span>₹ {employee.salary}</span></p>
            </div>

            <div className="mt-5">
              <h3>Total Net Payable  <strong>₹ {employee.salary}</strong> </h3>
              <hr className="text-primary" style={{ height: '4px'}} /> 
            </div>
        
        </div>
      </>
      )
    }
    return (<p></p>)
  }


  return (
    <div className="payslip container p-4 d-flex flex-column" style={{marginLeft:"10%"}}>
      <ToastContainer />
      <div className="filter d-flex mb-4">
        <div className="icon">
          <i className="fas text-info fa-filter" />
        </div>
        &nbsp;
        <h5>Month</h5> &nbsp;
        <input className=" border-0" type="month" id="month" value={month} onChange={(event)=>setMonth(event.target.value)}/>
        <button type="submit" className="btn btn-primary ms-2" onClick={dateConversion}>Get Payslip</button>
      </div>

      {renderData()}
      
    </div>
  );
}
export default Payslip;