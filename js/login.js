guestOnly();

const form =
document.getElementById(
"loginForm"
);

const message =
document.getElementById(
"message"
);

function showMessage(
text,
type
){

message.style.display =
"block";

message.className =
`message ${type}`;

message.textContent =
text;

}

form.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

const username =
document
.getElementById(
"username"
)
.value
.trim();

const password =
document
.getElementById(
"password"
)
.value;

try{

const data =
await handleLogin(
username,
password
);

showMessage(
"Login berhasil",
"success"
);

setTimeout(()=>{

location.href =
"/dashboard.html";

},800);

}catch(err){

showMessage(
err.message ||
"Login gagal",
"error"
);

}

});
