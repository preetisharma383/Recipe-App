const searchBox=document.querySelector('.searchBox');
const searchBtn=document.querySelector('.searchBtn');
const recipeContainer=document.querySelector('.recipe-container');
const recipeDetailContent=document.querySelector('.recipe-detail-content');
const closeBtn=document.querySelector('.recipe-closeBtn');


//function to fetch reciepe
const fetchrecipe = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching recipes..</h2>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        const response = await data.json();
        recipeContainer.innerHTML = "";

        if (!response.meals) {
            recipeContainer.innerHTML = "<h2>No recipes found for your query. Please try again.</h2>";
            return;
        }

        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belong to <span> ${meal.strCategory}</span> Category</p>
            `;
            const btn = document.createElement('button');
            btn.textContent = "View Recipe";
            recipeDiv.appendChild(btn);
            btn.addEventListener('click', () => {
                openRecipePopup(meal);
            });
            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        console.error("Error fetching or processing recipes:", error);
        recipeContainer.innerHTML = `<h2>Oops! Something went wrong while fetching the recipes. Please try again later.</h2><p style="font-size: small;">(${error.message})</p>`;
    }
}
searchBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const searchInput=searchBox.value.trim();
    if(!searchInput){
        recipeContainer.innerHTML=`<h2>Type the meal you want to search...!In the search Box</h2>`;
        return;
    }
    // console.log("button was clicked")
    fetchrecipe(searchInput);
})
// function to fetch ingredients and measurement
const fetchIngredients=(meal)=>{
    let ingredientList="";
    for(let i=1;i<=20;i++)
    {
        const ingredients=meal[`strIngredient${i}`]; // Removed backticks here
        if(ingredients)
        {
            const measurement=meal[`strMeasure${i}`];   // Removed backticks here
            ingredientList+=`<li> ${measurement} ${ingredients}</li>`
        }
        else{
            break;
        }
    }
    return ingredientList;
}
const openRecipePopup=(meal)=>{
    recipeDetailContent.innerHTML=`
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
    </div>
    `
    recipeDetailContent.parentElement.style.display="block";
}
closeBtn.addEventListener('click',()=>{
    recipeDetailContent.parentElement.style.display="none";
})