guestOnly();

const form =
document.getElementById(
"registerForm"
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
.trim()
.toLowerCase();

const name =
document
.getElementById(
"name"
)
.value
.trim();

const password =
document
.getElementById(
"password"
)
.value;

const confirmPassword =
document
.getElementById(
"confirm-password"
)
.value;

if(
password !==
confirmPassword
){

showMessage(
"Konfirmasi password tidak cocok",
"error"
);

return;

}

if(
username.length < 3
){

showMessage(
"Username minimal 3 karakter",
"error"
);

return;

}

try{

await handleRegister(
username,
name,
password
);

showMessage(
"Akun berhasil dibuat",
"success"
);

setTimeout(()=>{

location.href =
"/login.html";

},1000);

}catch(err){

showMessage(
err.message ||
"Gagal membuat akun",
"error"
);

}

});
