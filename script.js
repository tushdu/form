const back = document.querySelectorAll(".back"),
  next = document.querySelectorAll(".next"),
  activeBtn = document.querySelectorAll(".active-btn"),
  activeBtnText = document.querySelectorAll(".active-btn span"),
  btnGroup = document.querySelectorAll(".btn-group"),
  card = document.querySelectorAll(".card"),
  errorText = document.querySelectorAll(".error-txt") /*red color error text*/,
  emailPattern =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  validation = ["Cannot leave Empty", "Invalid Email", "Invalid Phone Number"],
  monthlyPlanPricing = ["$6/mo", "$8/mo", "$12/mo"],
  yearlyPlanPricing = ["$80/yr", "$100/yr", "$150/yr"],
  monthlyAddOnPricing = ["$2/mo", "$3/mo", "$4/mo"],
  yearlyAddOnPricing = ["$10/yr", "$20/yr", "$30/yr"],
  toggler = document.querySelector("#toggler"),
  monthlyPlanPrice = document.querySelectorAll("#form2 .price"),
  monthlyAddOnPrice = document.querySelectorAll("#form3 .price"),
  monthlyTxt = document.querySelector(".mo"),
  yearlyTxt = document.querySelector(".yr"),
  form = document.querySelectorAll(".form"),
  input = document.querySelectorAll("input"),
  selectedPlan = document.querySelector(".selected__plan"),
  selectedPlanPrice = document.querySelector(".selected__plan-price"),
  selectedAddOn = document.querySelector(".selected__add-on"),
  selectedAddOnPrice = document.querySelector(".selected__add-on-price"),
  totalCost = document.querySelector(".total-cost"),
  totalDuration = document.querySelector(".total-duration"),
  changePlan = document.querySelector(".change"),
  // handles number validation by plugin
  iti = window.intlTelInput(input[2], {
    initialCountry: "in",
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
  });

let checkedOrNot = true,
  isNameValid = false,
  isEmailValid = false,
  isphoneNumberValid = false;

// Toggle handling
for (let i = 0; i < monthlyPlanPrice.length; i++) {
  toggler.addEventListener("click", () => {
    if (toggler.checked == false) {
      // togglePricePlan
      monthlyPlanPrice[i].textContent = monthlyPlanPricing[i];
      // togglePriceAddOn
      monthlyAddOnPrice[i].textContent = monthlyAddOnPricing[i];
    } else {
      // togglePricePlan
      monthlyPlanPrice[i].textContent = yearlyPlanPricing[i];
      // togglePriceAddOn
      monthlyAddOnPrice[i].textContent = yearlyAddOnPricing[i];
    }

    // Monthly Yearly Active Color
    yearlyTxt.classList.toggle("active-color");
    monthlyTxt.classList.toggle("active-color");
  });
}

// form submission handling
// form - 1
form[0].addEventListener("submit", (e) => {
  e.preventDefault();
  namevalidation();
  emailValidation();
  phoneNumberValidation();

  if (isNameValid && isEmailValid && isphoneNumberValid) {
    nextStep(0);
  }
});

// form - 2
form[1].addEventListener("submit", (e) => {
  e.preventDefault();
  nextStep(1);
});

// form - 3
form[2].addEventListener("submit", (e) => {
  e.preventDefault();
  getsecondAndThirdFormData();
  // change plan on clicking change
  changePlans();
  nextStep(2);
});

// form - 4
form[3].addEventListener("submit", (e) => {
  e.preventDefault();

  nextStep(3);
});

function nextStep(i) {
  card[i].classList.toggle("hidden");
  card[i + 1].classList.toggle("hidden");

  if (i < 3) {
    activeBtn[i + 1].classList.toggle("active");
    activeBtn[i + 1].setAttribute("aria-current", "step");
    disableAllActiveButtons(i + 1);
  }
}
function backStep(i) {
  card[i].classList.toggle("hidden");
  card[i - 1].classList.toggle("hidden");
  activeBtn[i - 1].classList.toggle("active");
  activeBtn[i - 1].setAttribute("aria-current", "step");
  btnGroup[i].classList.toggle("active");
  disableAllActiveButtons(i - 1);
}

function disableAllActiveButtons(currentIndex) {
  for (let i = 0; i < activeBtn.length; i++) {
    if (i !== currentIndex) {
      activeBtn[i].classList.remove("active");
      activeBtn[i].removeAttribute("aria-current");
    }
  }
}

function namevalidation() {
  if (input[0].value === "") {
    input[0].classList.add("error");
    errorText[0].classList.add("error");
    errorText[0].textContent = validation[0];
    isNameValid = false;
  } else {
    input[0].classList.remove("error");
    errorText[0].classList.remove("error");
    isNameValid = true;
  }
}
function emailValidation() {
  if (input[1].value === "") {
    input[1].classList.add("error");
    errorText[1].classList.add("error");
    errorText[1].textContent = validation[0];
    isEmailValid = false;
  } else if (!input[1].value.match(emailPattern)) {
    input[1].classList.add("error");
    errorText[1].classList.add("error");
    errorText[1].textContent = validation[1];
    isEmailValid = false;
  }

  // Else part
  else {
    input[1].classList.remove("error");
    errorText[1].classList.remove("error");
    isEmailValid = true;
  }
}
function phoneNumberValidation() {
  isphoneNumberValid = iti.isValidNumber() == true ? true : false;
  if (input[2].value === "") {
    input[2].classList.add("error");
    errorText[2].classList.add("error");
    errorText[2].textContent = validation[0];
    isphoneNumberValid = false;
  } else if (!isphoneNumberValid && input[2] !== "") {
    input[2].classList.add("error");
    errorText[2].classList.add("error");
    errorText[2].textContent = validation[2];
    isphoneNumberValid = false;
  } else {
    input[2].classList.remove("error");
    errorText[2].classList.remove("error");
    isphoneNumberValid = true;
  }
}
function getsecondAndThirdFormData() {
  // Checking Checked Or Unchecked /Yearly or Monthly
  const duration =
    toggler.checked == true ? ["Yearly", "Year"] : ["Monthly", "Month"];

  totalDuration.textContent = `Total (per ${duration[1]})`;
  // Extracting data
  const formData1 = new FormData(form[1]);

  for (let [key, value] of formData1.entries()) {
    var planName = `.${value} .plan__name`,
      planPrice = `.${value} .price`,
      getPlanName = document.querySelector(planName).textContent,
      getPlanPrice = document.querySelector(planPrice).textContent,
      planCost = getPlanPrice.match(/\d+/);

    // i.e; Arcade (Monthly)
    selectedPlan.textContent = getPlanName + `( ${duration[0]} )`;
    //i.e; 100$/mo
    selectedPlanPrice.textContent = getPlanPrice;
  }

  const formData2 = new FormData(form[2]);

  for (let [key, value] of formData2.entries()) {
    var addOnName = `.${value} .add-on__name`,
      addOnPrice = `.${value} .price`,
      getaddOnName = document.querySelector(addOnName).textContent,
      getaddOnPrice = document.querySelector(addOnPrice).textContent,
      addOnCost = getaddOnPrice.match(/\d+/); //extracting digits out of $digits/mo

    selectedAddOn.textContent = getaddOnName;
    selectedAddOnPrice.textContent = getaddOnPrice;

    var overallCost = parseInt(planCost) + parseInt(addOnCost),
      overallCost = getPlanPrice.replace(/\d+/, overallCost);
    totalCost.textContent = overallCost.toString() + "";
  }
}
function changePlans() {
  changePlan.addEventListener("click", () => {
    card[1].classList.toggle("hidden");
    card[3].classList.toggle("hidden");
  });
}
