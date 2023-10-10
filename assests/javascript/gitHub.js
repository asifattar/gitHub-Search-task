const cl = console.log;


// searchUser , templetingCard , UserName

const userSearch = document.getElementById(`searchUser`);
const UserNameControl = document.getElementById(`UserName`);
const templetingCard = document.getElementById(`templetingCard`);

const baseUrl = 'https://api.github.com/users/';

const makeApiCall = (apiurl) => {
  return fetch(apiurl)
  .then(resp => resp.json())
}

const templeting = (user,repos) => {
  let result = `      <div class="card-container">
  <img class="round" src="${user.avatar_url}" alt="user" />
  <h3>${user.name}</h3>

  <div class="buttons">
    <span>${user.following} following</span>
    <span>${user.followers} followers</span>
    <span>${repos.length} repos</span>

   
  </div>
  <div class="skills">
    <h6>gitRepos</h6>
    <ul>
      ${repos.slice(0,5).map(repo => `<li><a target="_blank" href="${repo.html_url}">${repo.name}</a></li>`).join("")}
    </ul>
  </div>
</div>`
templetingCard.innerHTML=result

}




const onSearchUser = async (eve) => {
  eve.preventDefault();
  // cl(`hello`)
  let val = UserNameControl.value;
  cl(val)
  let userUrl = `${baseUrl}${val}`
  cl(userUrl)
  let reposUrl = `${userUrl}/repos` 
  cl(reposUrl)

  let allPromise =[makeApiCall(userUrl),makeApiCall(reposUrl)];
  cl(allPromise)
  try{
   [userUrl , reposUrl] = await Promise.all(allPromise);
    cl(userUrl,reposUrl);
    // cl(reposUrl)
    templeting( userUrl , reposUrl);
  }
  catch{cl}
userSearch.reset()
}

userSearch.addEventListener(`submit`, onSearchUser);

