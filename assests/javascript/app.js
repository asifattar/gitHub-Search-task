const cl = console.log;

const firstNameControler = document.getElementById(`firstName`);
const lastNameControler = document.getElementById(`lastName`);
const emailNameControler = document.getElementById(`email`);
const contactControler = document.getElementById(`contact`);
const streetAddControler = document.getElementById(`streetAdd`);
const zipCodeControler = document.getElementById(`zipCode`);
const cityControler = document.getElementById(`city`);
const stateControler = document.getElementById(`state`);
const submitBtn = document.getElementById(`submitBtn`);
const updateBtn = document.getElementById(`updateBtn`);
const formSubmit = document.getElementById(`formSubmit`)
const dataTemp = document.getElementById(`dataTemp`);

let baseUrl = `https://database-c6f0f-default-rtdb.asia-southeast1.firebasedatabase.app/`

let postUrl = `${baseUrl}/data.json`

const objToArray = (obj) =>{
  let arr = [];
  for (const key in obj){
      arr.push({id:key , ...obj[key]})
  }
  return arr;
}
cl(objToArray())
const makeApiCall = ( methodName , apiUrl , msgBody) => {
  return fetch(apiUrl,{
    method : methodName,
    body : msgBody,
    headers : {
      "Content-Type": "application/json",
      "auth": "Barear JWT Token",
    }
  })
  .then(res => {
    return res.json();
  })
}



makeApiCall(`GET` , postUrl )
.then(res => {
  let arr = objToArray(res);
  templating(arr)
})
.catch(err => {
  cl(err)
})
.finally();

const templating = (arr) => {
  let result ="";
  arr.forEach(element => {
   result += `
   <div class="col-md-4 ">
   <div class="card mb-4" id="${element.id}">
      <div class="card-body">
         <p><strong>firstName - </strong>${element.fname}</p>
         <p><strong>lastName - </strong>${element.lname}</p>
         <p><strong>E-mail -</strong>${element.email}</p>
         <p><strong>contact -</strong>${element.contact}</p>
         <p><strong>Street Address -</strong>${element.address}</p>
         <p><strong>Zip Code -</strong>${element.zipcode}</p>
         <p><strong>city -</strong>${element.city}</p>
         <p><strong>State -</strong>${element.state}</p>
       </div>
       <div class="card-footer text-right">
         <button class="btn btn-primary text-right" onclick="onEdit(this)" >Edit</button>
        <button class="btn btn-danger text-right" onclick="onDelete(this)" >Delete</button>
       </div>
   </div>
  </div>
  ` 
  });
  dataTemp.innerHTML= result
  }






const onFormSubmit = (eve) => {
  eve.preventDefault()
  obj = {
    fname : firstNameControler.value,
    lname : lastNameControler.value,
    email : emailNameControler.value,
    contact : contactControler.value,
    address : streetAddControler.value,
    zipcode : zipCodeControler.value,
    city : cityControler.value,
    state : stateControler.value,
  }
  makeApiCall(`POST`,postUrl,JSON.stringify(obj))
  .then(res => {
    cl(res);
    let card = document.createElement(`div`);
    card.id = res.name;
    // card.classList.add(`border: 1px solid #871d14`)
    // card.className = `.card col-md-4 mb-4`;
    card.className = 'card p-4 col-md-4 mb-4 ';
    card.style.border = '1px solid #871d14';
    card.style.color = '#871d14';
    card.style.backgroundColor = 'antiquewhite';
    card.innerHTML=`
    <div class="card-body">
    <p><strong>firstName - </strong>${obj.fname}</p>
    <p><strong>lastName - </strong>${obj.lname}</p>
    <p><strong>E-mail -</strong>${obj.email}</p>
    <p><strong>contact -</strong>${obj.contact}</p>
    <p><strong>Street Address -</strong>${obj.address}</p>
    <p><strong>Zip Code -</strong>${obj.zipcode}</p>
    <p><strong>city -</strong>${obj.city}</p>
    <p><strong>State -</strong>${obj.state}</p>
  </div>
  <div class="card-footer text-right">
    <button class="btn btn-primary text-right" onclick="onEdit(this)" >Edit</button>
   <button class="btn btn-danger text-right" onclick="onDelete(this)" >Delete</button>
  </div>
                    `
    dataTemp .prepend(card)          
  })
  .catch(err => {
    cl(err)
  })
  .finally(()=>{
    // postForm.reset()
    // eve.target.reset()
    formSubmit.reset()
    location.reload();
    
  })
}

const onEdit = (eve) => {
  cl(`clickes edit`);
  let editId = eve.closest(`.card`).id;
    cl(editId);
    localStorage.setItem(`editId`, editId )
    let editUrl = `${baseUrl}/data/${editId}.json`
    cl(editUrl);
    makeApiCall(`GET`, editUrl )
    .then(res => {
      cl(res)
    firstNameControler.value = res.fname
    lastNameControler.value = res.lname
    emailNameControler.value = res.email
    contactControler.value = res.contact
    streetAddControler.value = res.address
    zipCodeControler.value = res.zipcode
    cityControler.value = res.city
    stateControler.value = res.state
    })
    .catch(err => {
      cl(err)
    })
    .finally(()=>{
      submitBtn.classList.add(`d-none`);
      updateBtn.classList.remove(`d-none`);
      })
}

const onUpdate = (eve) => {
  cl(`update`)
  let updatedId = localStorage.getItem(`editId`);
  cl(updatedId)
  let updateUrl = `${baseUrl}/data/${updatedId}.json`
  cl(updateUrl);
  let obj = {
    fname : firstNameControler.value,
    lname : lastNameControler.value,
    email : emailNameControler.value,
    contact: contactControler.value,
    address : streetAddControler.value,
    zipcode : zipCodeControler.value,
    city : cityControler.value,
    state : stateControler.value,
  }
  makeApiCall(`PATCH`,updateUrl,JSON.stringify(obj))
  .then(res => {
    let card = [...document.getElementById(updatedId).children]
    cl(card)

card[0].innerHTML = `
<p><strong>firstName - </strong>${res.fname}</p>
<p><strong>lastName - </strong>${res.lname}</p>
<p><strong>E-mail -</strong>${res.email}</p>
<p><strong>contact -</strong>${res.contact}</p>
<p><strong>Street Address -</strong>${res.address}</p>
<p><strong>Zip Code -</strong>${res.zipcode}</p>
<p><strong>city -</strong>${res.city}</p>
<p><strong>State -</strong>${res.state}</p>
`;

cl(card);
  })
  .catch(err => {
    cl(err);
  })
  .finally(() => {
    updateBtn.classList.add(`d-none`);
    submitBtn.classList.remove(`d-none`);
    // eve.target.reset()
    formSubmit.reset()
  })

}


const onDelete = (e) => {
  let deleteid = e.closest(`.card`).id;
  cl(deleteid);
  let deleteUrl = `${baseUrl}/data/${deleteid}.json`
  makeApiCall(`DELETE`, deleteUrl)
  .then(res => {
    let deleteData = document.getElementById(deleteid).remove();
  })
  .catch(err => {
    cl(err)
  })
  .finally(() => {
    location.reload();
  })
}

formSubmit.addEventListener(`submit`,onFormSubmit);
updateBtn.addEventListener(`click`, onUpdate);

