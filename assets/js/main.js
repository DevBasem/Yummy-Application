/**
 * Opens the navigation menu with a smooth transition effect.
 */
function navHandlerOnOpen() {
  $("#navMenu").css({ display: "block" });
  $("#navHandler").animate({ left: "19rem" });
  $("#navContent").animate({ left: "0" });
  $("#navOpen").css({ display: "none" });
  $("#navClose").css({ display: "block" });
  $(".nav-menu .nav-content .nav-links .nav-link").each(function (index) {
    $(this)
      .delay(index * 100)
      .animate(
        {
          top: "0",
        },
        400
      );
  });
}

/**
 * Closes the navigation menu with a smooth transition effect.
 */
function navHandlerOnClose() {
  $("#navContent").animate({ left: "-100%" });
  $("#navHandler").animate({ left: "0" });
  $("#navClose").css({ display: "none" });
  $("#navOpen").css({ display: "block" });
  $(".nav-menu .nav-content .nav-links .nav-link").animate({ top: "15rem" });
  $("#navMenu")
    .delay(400)
    .queue(function (next) {
      $(this).css({ display: "none" });
      next();
    });
}

// Attach click event handler to the "Open" button
$("#navOpen").on("click", function () {
  navHandlerOnOpen();
});

// Attach click event handler to the "Close" button
$("#navClose").on("click", function () {
  navHandlerOnClose();
});

/**
 * Display detailed information about a food item based on its ID.
 * @param {string} mealId - The unique identifier of the meal.
 */
function showFoodDetails(mealId) {
  $("#onSearch").addClass("d-none");

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((data) => {
      let foodDetails = "";
      let foodRecipes = "";
      let foodTags = "";

      for (let i = 1; i <= 20; i++) {
        const measure = data.meals[0][`strMeasure${i}`];
        const ingredient = data.meals[0][`strIngredient${i}`];

        if (measure && measure.trim() !== "") {
          foodRecipes += `
          <span class="btn btn-info">${measure} ${ingredient}</span>
          `;
        }
      }

      if (data.meals[0].strTags && data.meals[0].strTags.trim() !== "") {
        const tags = data.meals[0].strTags.split(",").map((tag) => tag.trim());
        tags.forEach((tag) => {
          foodTags += `<span class="btn btn-warning">${tag}</span>`;
        });
      } else {
        foodTags = '<span class="btn btn-warning">No tags available</span>';
      }

      foodDetails = `
      <div class="sec1 col-md-4">
        <div class="wrapper">
          <div class="food-img">
            <img class="w-100 rounded" src="${data.meals[0].strMealThumb}" alt="test">
          </div>
          <div class="food-title">
            <h2>${data.meals[0].strMeal}</h2>
          </div>
        </div>
      </div>
      <div class="sec2 col-md-8">
        <div class="food-data card p-2 text-white">
          <h3>Instructions</h3>
          <p>${data.meals[0].strInstructions}</p>
        </div>

        <div class="area">
          <h3>Area : <span class="fs-4 fw-medium">${data.meals[0].strArea}</span></h3>
        </div>

        <div class="category">
          <h3>Category : <span class="fs-4 fw-medium">${data.meals[0].strCategory}</span></h3>
        </div>

        <div class="recipes card p-2 text-white">
          <h3>Recipes :</h3>
          <div class="recipe-pills d-flex flex-wrap gap-2">${foodRecipes}</div>
        </div>

        <div class="tags" id="foodTags">
          <h3>Tags :</h3>
          <div class="tags-pills d-flex flex-wrap gap-2">${foodTags}</div>
        </div>

        <div class="food-links">
          <a class="btn btn-success" href="${data.meals[0].strSource}" target="_blank">Source</a>
          <a class="btn btn-primary" href="${data.meals[0].strYoutube}" target="_blank">Youtube</a>
        </div>
      </div>
      `;

      $("#foodInfoParent").html(foodDetails);
      $("#mainContent").addClass("d-none");
      $("#foodInfo").removeClass("d-none");
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => $("#loadingScreen").css("display", "none"));
}

// Attach click event handler to toggle visibility of the food details when in main section.
$(document).on("click", "#foodInfoCloseBtn", function () {
  $("#foodInfo").toggleClass("d-none");
  $("#mainContent").toggleClass("d-none");
});

// Attach click event handler to toggle visibility of the food details when in search section.
$(document).on("click", "#foodInfoSearchCloseBtn", function () {
  $("#foodInfo").toggleClass("d-none");
  $("#onSearch").toggleClass("d-none");
});

// Attach click event handler to show the main section.
$("#homeBtn").on("click", function () {
  $("#catContent").addClass("d-none");
  $("#mainContent").removeClass("d-none");
  $("#areaContent").addClass("d-none");
  $("#ingredContent").addClass("d-none");
  $("#onSearch").addClass("d-none");
  $("#foodInfo").addClass("d-none");
  $("#contactForm").addClass("d-none");

  navHandlerOnClose();
});

/**
 * Show loading screen when the search menu is displayed
 */
function showLoadingScreenSearch() {
  $("#loadingScreen").css("display", "flex");
}

/**
 * Hide loading screen when the search menu is displayed
 */
function hideLoadingScreenSearch() {
  $("#loadingScreen").css("display", "none");
  $("#catContent").css({ display: "block" });
  $("#catContent").removeClass("d-none");
}

// Attach click event handler to show the search section.
$("#searchBtn").on("click", function () {
  $("#catContent").addClass("d-none");
  $("#mainContent").addClass("d-none");
  $("#areaContent").addClass("d-none");
  $("#ingredContent").addClass("d-none");
  $("#onSearch").removeClass("d-none");
  $("#foodInfo").addClass("d-none");
  $("#contactForm").addClass("d-none");

  navHandlerOnClose();
});

// Attach on KeyUp event handler to display content searched by word.
$(document).on("keyup", "#searchWord", function () {
  let searchKeyWord = $(this).val();

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchKeyWord}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.meals);
      let foodSearchCards = "";

      if (data.meals) {
        for (let i = 0; i < data.meals.length; i++) {
          foodSearchCards += `
        <div class="col-md-3">
          <article class="food-card" data-meal="${data.meals[i].idMeal}">
            <div class="food-img">
              <img class="w-100" src="${data.meals[i].strMealThumb}" alt="img">
            </div>
            <div class="food-title">
              <h2>${data.meals[i].strMeal}</h2>
            </div>
          </article>
        </div>
        `;
        }
        $("#foodCardSearchParent").html(foodSearchCards);
      } else {
        $("#foodCardSearchParent").html("");
      }
    })
    .catch((error) => console.error("Error:", error));
});

// Attach on KeyUp event handler to display content searched by first letter.
$(document).on("keyup", "#searchFirstLetter", function () {
  let searchKeyLetter = $(this).val();

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchKeyLetter}`)
    .then((response) => response.json())
    .then((data) => {
      let foodSearchCards = "";
      for (let i = 0; i < data.meals.length; i++) {
        foodSearchCards += `
        <div class="col-md-3">
          <article class="food-card" data-meal="${data.meals[i].idMeal}">
            <div class="food-img">
              <img class="w-100" src="${data.meals[i].strMealThumb}" alt="img">
            </div>
            <div class="food-title">
              <h2>${data.meals[i].strMeal}</h2>
            </div>
          </article>
        </div>
        `;
      }
      $("#foodCardSearchParent").html(foodSearchCards);
    })
    .catch((error) => console.error("Error:", error));
});

// Attach click event handler to food cards in the search section to display food details.
$("#foodCardSearchParent").on("click", ".food-card", function () {
  const closeBtn = `<i class="fa-solid fa-xmark" id="foodInfoSearchCloseBtn"></i>`;
  $("#closeBtnInfoParent").html(closeBtn);
  $("#onSearch").addClass("d-none");
  const mealId = $(this).attr("data-meal");
  showFoodDetails(mealId);
});

/**
 * Show loading screen when the categories menu is displayed
 */
function showLoadingScreenCat() {
  $("#loadingScreen").css("display", "flex");
}

/**
 * Hide loading screen when the categories menu is displayed
 */
function hideLoadingScreenCat() {
  $("#loadingScreen").css("display", "none");
  $("#catContent").css({ display: "block" });
  $("#catContent").removeClass("d-none");
}

/**
 * Show loading screen when the categories menu data is displayed
 */
function showLoadingScreenCatData() {
  $("#loadingScreen").css("display", "flex");
  $("#catContent").css("display", "none");
}

/**
 * Hide loading screen when the categories menu data is displayed
 */
function hideLoadingScreenCatData() {
  $("#loadingScreen").css("display", "none");
}

// Attach click event handler to show the categories section.
$("#categoriesBtn").on("click", function () {
  showLoadingScreenCat();
  $("#catContent").addClass("d-none");
  $("#mainContent").addClass("d-none");
  $("#areaContent").addClass("d-none");
  $("#ingredContent").addClass("d-none");
  $("#onSearch").addClass("d-none");
  $("#foodInfo").addClass("d-none");
  $("#contactForm").addClass("d-none");

  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then((response) => response.json())
    .then((data) => {
      let foodCatCards = "";
      for (let i = 0; i < data.categories.length; i++) {
        const categoryDescriptionData = data.categories[i].strCategoryDescription;
        const categoryDescriptionFormat = categoryDescriptionData.slice(0, 80) + (categoryDescriptionData.length > 30 ? " ..." : "");

        foodCatCards += `
        <div class="col-md-3">
          <article class="food-card" data-cat="${data.categories[i].strCategory}">
              <div class="food-img">
                  <img class="w-100" src="${data.categories[i].strCategoryThumb}" alt="img">
              </div>
              <div class="food-title">
                  <h2>${data.categories[i].strCategory}</h2>
                  <p class="text-center">${categoryDescriptionFormat}</p>
              </div>
          </article>
        </div>
        `;
      }
      $("#foodCardCatParent").html(foodCatCards);
    })
    .finally(() => {
      hideLoadingScreenCat();
      setTimeout(() => {
        navHandlerOnClose();
      }, 100);
    });
});

// Attach click event handler to food cards in the categories section to display food details.
$("#foodCardCatParent").on("click", ".food-card", function () {
  showLoadingScreenCatData();
  const catId = $(this).attr("data-cat");

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catId}`)
    .then((response) => response.json())
    .then((data) => {
      let foodCards = "";
      for (let i = 0; i < data.meals.length; i++) {
        foodCards += `
          <div class="col-md-3">
            <article class="food-card" data-meal="${data.meals[i].idMeal}">
              <div class="food-img">
                <img class="w-100" src="${data.meals[i].strMealThumb}" alt="img">
              </div>
              <div class="food-title">
                <h2>${data.meals[i].strMeal}</h2>
              </div>
            </article>
          </div>
        `;
      }
      $("#foodCardParent").html(foodCards);
      $("#catContent").addClass("d-none");
      $("#mainContent").removeClass("d-none");
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => hideLoadingScreenCatData());
});

/**
 * Show loading screen when the area menu is displayed
 */
function showLoadingScreenArea() {
  $("#loadingScreen").css("display", "flex");
}

/**
 * Hide loading screen when the area menu is displayed
 */
function hideLoadingScreenArea() {
  $("#loadingScreen").css("display", "none");
  $("#areaContent").css({ display: "block" });
  $("#areaContent").removeClass("d-none");
}

/**
 * Show loading screen when the area menu data is displayed
 */
function showLoadingScreenAreaData() {
  $("#loadingScreen").css("display", "flex");
  $("#areaContent").css("display", "none");
}

/**
 * Hide loading screen when the area menu data is displayed
 */
function hideLoadingScreenAreaData() {
  $("#loadingScreen").css("display", "none");
}

// Attach click event handler to show the area section.
$("#areaBtn").on("click", function () {
  showLoadingScreenArea();
  $("#catContent").addClass("d-none");
  $("#mainContent").addClass("d-none");
  $("#areaContent").addClass("d-none");
  $("#ingredContent").addClass("d-none");
  $("#onSearch").addClass("d-none");
  $("#foodInfo").addClass("d-none");
  $("#contactForm").addClass("d-none");

  fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then((response) => response.json())
    .then((data) => {
      let foodAreaCards = "";
      for (let i = 0; i < data.meals.length; i++) {
        foodAreaCards += `
        <div class="col-md-3">
          <article class="food-card card bg-accent-color p-3 text-center cursor-pointer" data-area="${data.meals[i].strArea}">
              <div class="food-img location-img">
                <i class="fa-solid fa-location-dot fs-1 text-white"></i>
              </div>
              <div class="food-title location-title text-white">
                  <h2 class="fs-4">${data.meals[i].strArea}</h2>
              </div>
          </article>
        </div>
        `;
      }
      $("#foodCardAreaParent").html(foodAreaCards);
      console.log(data);
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
      hideLoadingScreenArea();
      setTimeout(() => {
        navHandlerOnClose();
      }, 100);
    });
});

// Attach click event handler to food cards in the area section to display food details.
$("#foodCardAreaParent").on("click", ".food-card", function () {
  showLoadingScreenAreaData();
  const area = $(this).attr("data-area");

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    .then((response) => response.json())
    .then((data) => {
      let foodCards = "";
      for (let i = 0; i < data.meals.length; i++) {
        foodCards += `
          <div class="col-md-3">
            <article class="food-card" data-meal="${data.meals[i].idMeal}">
              <div class="food-img">
                <img class="w-100" src="${data.meals[i].strMealThumb}" alt="img">
              </div>
              <div class="food-title">
                <h2>${data.meals[i].strMeal}</h2>
              </div>
            </article>
          </div>
        `;
      }
      $("#foodCardParent").html(foodCards);
      $("#areaContent").addClass("d-none");
      $("#mainContent").removeClass("d-none");
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => hideLoadingScreenAreaData());
});

/**
 * Show loading screen when the Ingredients menu is displayed
 */
function showLoadingScreenIngred() {
  $("#loadingScreen").css("display", "flex");
}

/**
 * Hide loading screen when the Ingredients menu is displayed
 */
function hideLoadingScreenIngred() {
  $("#loadingScreen").css("display", "none");
  $("#ingredContent").css({ display: "block" });
  $("#ingredContent").removeClass("d-none");
}

/**
 * Show loading screen when the Ingredients menu data is displayed
 */
function showLoadingScreenIngredData() {
  $("#loadingScreen").css("display", "flex");
  $("#ingredContent").css("display", "none");
}

/**
 * Hide loading screen when the Ingredients menu data is displayed
 */
function hideLoadingScreenIngredData() {
  $("#loadingScreen").css("display", "none");
}

// Attach click event handler to show the ingredients section.
$("#ingredientsBtn").on("click", function () {
  showLoadingScreenIngred();
  $("#catContent").addClass("d-none");
  $("#mainContent").addClass("d-none");
  $("#areaContent").addClass("d-none");
  $("#ingredContent").addClass("d-none");
  $("#onSearch").addClass("d-none");
  $("#foodInfo").addClass("d-none");
  $("#contactForm").addClass("d-none");

  fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
    .then((response) => response.json())
    .then((data) => {
      let foodIngredCards = "";
      for (let i = 0; i < data.meals.length; i++) {
        const ingredDescriptionData = data.meals[i].strDescription;
        let ingredDescriptionFormat = "";

        if (ingredDescriptionData) {
          ingredDescriptionFormat = ingredDescriptionData.slice(0, 80);

          if (ingredDescriptionData.length > 30) {
            ingredDescriptionFormat += " ...";
          }
        } else {
          ingredDescriptionFormat = "No Description Found";
        }
        foodIngredCards += `
        <div class="col-md-3 d-flex align-items-stretch">
          <article class="food-card card w-100 bg-accent-color p-4 text-center cursor-pointer" data-ingred="${data.meals[i].strIngredient}">
              <div class="food-img ingred-img mb-2">
                <i class="fa-solid fa-utensils fs-1 text-white"></i>
              </div>
              <div class="food-title ingred-title text-white">
                  <h2 class="fs-6">${data.meals[i].strIngredient}</h2>
                  <p>${ingredDescriptionFormat}</p>
              </div>
          </article>
        </div>
        `;
      }
      $("#foodCardIngredParent").html(foodIngredCards);
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
      hideLoadingScreenIngred();
      setTimeout(() => {
        navHandlerOnClose();
      }, 400);
    });
});

// Attach click event handler to food cards in the ingredients section to display food details.
$("#foodCardIngredParent").on("click", ".food-card", function () {
  showLoadingScreenIngredData();
  const ingred = $(this).attr("data-ingred");

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingred}`)
    .then((response) => response.json())
    .then((data) => {
      let foodCards = "";
      for (let i = 0; i < data.meals.length; i++) {
        foodCards += `
          <div class="col-md-3">
            <article class="food-card" data-meal="${data.meals[i].idMeal}">
              <div class="food-img">
                <img class="w-100" src="${data.meals[i].strMealThumb}" alt="img">
              </div>
              <div class="food-title">
                <h2>${data.meals[i].strMeal}</h2>
              </div>
            </article>
          </div>
        `;
      }
      $("#foodCardParent").html(foodCards);
      $("#ingredContent").addClass("d-none");
      $("#mainContent").removeClass("d-none");
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => hideLoadingScreenIngredData());
});

// Attach click event handler to show the contact section.
$("#contactBtn").on("click", function () {
  $("#contactForm").removeClass("d-none");
  $("#catContent").addClass("d-none");
  $("#mainContent").addClass("d-none");
  $("#areaContent").addClass("d-none");
  $("#ingredContent").addClass("d-none");
  $("#onSearch").addClass("d-none");
  $("#foodInfo").addClass("d-none");

  navHandlerOnClose();
});

/**
 * Show loading screen for main content menu
 */
function showLoadingScreen() {
  $("#mainContent").addClass("d-none");
  $("#loadingScreen").css("display", "flex");
}

/**
 * Hide loading screen for main content menu
 */
function hideLoadingScreen() {
  $("#loadingScreen").css("display", "none");
  $("#mainContent").removeClass("d-none");
}

/**
 * Show loading screen for food info screen
 */
function showLoadingScreenFoodInfo() {
  $("#mainContent").toggleClass("d-none");
  $("#loadingScreen").css("display", "flex");
}

/**
 * Hide loading screen for food info screen
 */
function hideLoadingScreenFoodInfo() {
  $("#loadingScreen").addClass("d-none");
  $("#mainContent").addClass("d-none");
}

/**
 * fetch first page main data
 */
function fetchMainData() {
  showLoadingScreen();

  fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Side")
    .then((response) => response.json())
    .then((data) => {
      let foodCards = "";
      for (let i = 0; i < data.meals.length; i++) {
        foodCards += `
          <div class="col-md-3">
            <article class="food-card" data-meal="${data.meals[i].idMeal}">
              <div class="food-img">
                <img class="w-100" src="${data.meals[i].strMealThumb}" alt="img">
              </div>
              <div class="food-title">
                <h2>${data.meals[i].strMeal}</h2>
              </div>
            </article>
          </div>
        `;
      }
      $("#foodCardParent").html(foodCards);
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => hideLoadingScreen());
}

// Attach click event handler to food cards in the main section to display food details.
$("#foodCardParent").on("click", ".food-card", function () {
  const closeBtn = `<i class="fa-solid fa-xmark" id="foodInfoCloseBtn"></i>`;
  $("#closeBtnInfoParent").html(closeBtn);
  showLoadingScreenFoodInfo();
  const mealId = $(this).attr("data-meal");

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((data) => {
      let foodDetails = "";
      let foodRecipes = "";
      let foodTags = "";

      for (let i = 1; i <= 20; i++) {
        const measure = data.meals[0][`strMeasure${i}`];
        const ingredient = data.meals[0][`strIngredient${i}`];

        if (measure && measure.trim() !== "") {
          foodRecipes += `
          <span class=" btn btn-info ">${measure} ${ingredient}</span>
          `;
        }
      }

      if (data.meals[0].strTags && data.meals[0].strTags.trim() !== "") {
        const tags = data.meals[0].strTags.split(",").map((tag) => tag.trim());
        tags.forEach((tag) => {
          foodTags += `<span class="btn btn-warning">${tag}</span>`;
        });
      } else {
        foodTags = '<span class="btn btn-warning">No tags available</span>';
      }

      foodDetails = `
      <div class="sec1 col-md-4">
        <div class="wrapper">
            <div class=" food-img">
                <img class="w-100 rounded" src="${data.meals[0].strMealThumb}" alt="test">
            </div>
            <div class="food-title">
                <h2>${data.meals[0].strMeal}</h2>
            </div>
        </div>
      </div>
      <div class="sec2 col-md-8">
          <div class="food-data card p-2 text-white">
              <h3>Instructions</h3>
              <p>${data.meals[0].strInstructions}</p>
          </div>

          <div class="area">
              <h3>Area : <span class="fs-4 fw-medium">${data.meals[0].strArea}</span></h3>
          </div>

          <div class=" category">
              <h3>Category : <span class="fs-4 fw-medium">${data.meals[0].strCategory}</span></h3>
          </div>

          <div class="recipes card p-2 text-white">
              <h3>Recipes :</h3>
              <div class="recipe-pills d-flex flex-wrap gap-2">${foodRecipes}</div>

          </div>

          <div class="tags" id="foodTags">
              <h3>Tags :</h3>
              <div class="tags-pills d-flex flex-wrap gap-2">${foodTags}</div>
          </div>

          <div class="food-links">
              <a class="btn btn-success" href="${data.meals[0].strSource}" target="_blank">Source</a>
              <a class="btn btn-primary" href="${data.meals[0].strYoutube}" target="_blank">Youtube</a>
          </div>
      </div>

      `;

      $("#foodInfoParent").html(foodDetails);
      $("#mainContent").addClass("d-none");
      $("#foodInfo").removeClass("d-none");
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => hideLoadingScreenFoodInfo());
});

// Display content on first page load.
$(document).ready(function () {
  fetchMainData();
});

// Function to enable/disable the submit button based on form validity
function toggleSubmitButton() {
  const form = document.querySelector(".needs-validation");
  const submitButton = document.getElementById("submitButton");
  submitButton.disabled = !form.checkValidity();
}

// Function to handle keyup event and update validation messages and styling
function handleKeyup() {
  const form = document.querySelector(".needs-validation");

  const passwordInput = document.getElementById("passwordInput");
  const repasswordInput = document.getElementById("repasswordInput");

  repasswordInput.addEventListener("keyup", () => {
    if (repasswordInput.value !== passwordInput.value) {
      repasswordInput.setCustomValidity("Passwords do not match");
      repasswordInput.classList.add("is-invalid");
    } else {
      repasswordInput.setCustomValidity("");
      repasswordInput.classList.remove("is-invalid");
    }
  });

  // Loop through form elements and update validation messages and styling
  Array.from(form.elements).forEach((element) => {
    if (element.tagName === "INPUT" && element.type !== "submit") {
      element.addEventListener("keyup", () => {
        if (!element.checkValidity()) {
          element.classList.add("is-invalid");
        } else {
          element.classList.remove("is-invalid");
        }
      });
    }
  });
}

// BootStrap Validation Modified
(() => {
  "use strict";

  // Fetch the form
  const form = document.querySelector(".needs-validation");

  // Validate on keyup for all form elements
  form.addEventListener("keyup", () => {
    toggleSubmitButton();
    handleKeyup();
  });

  // Prevent form submission on invalid input
  form.addEventListener("submit", (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }

    form.classList.add("was-validated");
  });
})();
