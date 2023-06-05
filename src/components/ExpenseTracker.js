import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import budgetpic from "../images/budget.webp";
import './ExpenseTracker.css';
import { db } from "../firebase.js";
import { uid } from "uid";
import { set, ref, onValue, remove } from "firebase/database";
import deleteIcon from "../images/deleteicon.png";
import * as current from './CurrentUser';

function Expensetracker() {
  const nameOfThePage = "expensetracker";
  const currentUser = current.useAuth()
	const [moneyInfo, setMoneyInfo] = useState([]);
	const [totalMoney, setTotalMoney] = useState(0);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  function handleDescChange(e) {
    setDesc(e.target.value);
  };

  function handleAmountChange(e) {
    setAmount(e.target.value);
  };

  function handleDateChange(e) {
    setDate(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        var dbRef = ref(db, `/${currentUser.uid}/${nameOfThePage}`)
        onValue(dbRef, (snapshot) => {
          setMoneyInfo([]);
          const data = snapshot.val();
          if (data !== null) {
          Object.values(data).map((money) => {
            setMoneyInfo((oldArray) => [...oldArray, money]);
          });
          }
      });
  }}
  fetchData()
  }, [currentUser]);

  useEffect(() => {
		let totalAmount = 0;
		for(let i = 0; i < moneyInfo.length; i++) {
			totalAmount += parseFloat(moneyInfo[i].amount);
		}
		setTotalMoney(totalAmount);
	}, [moneyInfo]);

  function handleSavingToDatabase(event) {
    event.preventDefault();
    const expenseId = uid();
    const dbReference = ref(db, `/${currentUser.uid}/${nameOfThePage}/${expenseId}`);
    set(dbReference, {
      desc: desc,
      amount: amount,
      date: date,
      expenseId: expenseId
    });
    clearFields();
  };

  function removeMoneyInfo(i) {
    remove(ref(db, `/${currentUser.uid}/${nameOfThePage}/${i}`));
  }

  function isNegativeNumber(number) {
    if (number.toString().includes("-")) {
      return true;
    } else {
      return false;
    }
  }

  function clearFields() {
    setDesc("");
    setAmount("");
    setDate("");
  }

	return (
		<div className="App">
      <Menu></Menu>
      <img src={budgetpic} alt="budget" className='budgetpic'></img>
			<div className='totalmoney' data-testid="totalMoney">You currently have {totalMoney}€.</div>
      <div className='desc'>Add your income as a positive, and your expense as a negative number.</div>

      <form className="inputContainer" onSubmit={handleSavingToDatabase}>
        <p>
          <label className='insidelabel' htmlFor="desc">Description</label>
          <input type="text" onChange={handleDescChange} value={desc} placeholder="Description..." id="desc"/>
        </p> 
        <p>
          <label className='insidelabel' htmlFor="amount">Amount</label>
          <input type="number" onChange={handleAmountChange} value={amount} placeholder="Price..." id="amount"/>
        </p>
        <p>
          <label className='insidelabel' htmlFor="date">Date</label>
          <input type="date" onChange={handleDateChange} value={date} className='inputitem' id="date"/>
        </p>
          <input type="submit" value="Add" id="expenseSubmit" alt='add'/>
      </form>

      <div className="expenses">
          {
              moneyInfo.map((value) => (
                <div className="expense-items" key={value.expenseId} style = {{ backgroundColor: isNegativeNumber(value.amount) ? 'salmon' : 'darkseagreen'}} data-testid="expense">
                  <div className="expenseitem">{((new Date(value.date)).getMonth()+1) + "/" + (new Date(value.date)).getDate() + "/" + (new Date(value.date)).getFullYear()} - </div>
                  <div className="expenseitem">{value.desc} - </div>
                  <div className="expenseitem">{value.amount}€</div>
                  <img className="expenseitem" id="removeicon" onClick={() => removeMoneyInfo(value.expenseId)} src={deleteIcon} alt="delete"></img>
                </div>
              ))
          }
      </div>

		</div>
	);
}

export default Expensetracker;
