document.getElementById('analysis-button').addEventListener('click', function() {
    const ingredients = document.getElementById('ingredients').value.trim();

    if (ingredients === '') {
        alert('Please enter some ingredients!');
        return;
    }

    const appId = '7917d34f'; // Replace with your Edamam API ID
    const appKey = 'f70b2c8fa9fa79ad1efe725de8b4f223'; // Replace with your Edamam API Key

    // Clear previous results
    const resultsTable = document.getElementById('results-body');
    resultsTable.innerHTML = '';

    // Reset totals
    let totalCalories = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalWeight = 0;

    // Send all ingredients in one request
    fetch(`https://api.edamam.com/api/nutrition-details?app_id=${appId}&app_key=${appKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ingr: ingredients.split('\n') // Send each ingredient as an array element
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ingredients && data.ingredients.length > 0) {
            data.ingredients.forEach(ingredient => {
                const row = resultsTable.insertRow();

                const qtyCell = row.insertCell(0);
                const unitCell = row.insertCell(1);
                const foodCell = row.insertCell(2);
                const caloriesCell = row.insertCell(3);
                const fatCell = row.insertCell(4);
                const carbsCell = row.insertCell(5);
                const proteinCell = row.insertCell(6);
                const weightCell = row.insertCell(7);

                const parsedIngredient = ingredient.parsed[0];

                const calories = Math.round(parsedIngredient.nutrients.ENERC_KCAL.quantity) || 0;
                const fat = Math.round(parsedIngredient.nutrients.FAT.quantity) || 0;
                const carbs = Math.round(parsedIngredient.nutrients.CHOCDF.quantity) || 0;
                const protein = Math.round(parsedIngredient.nutrients.PROCNT.quantity) || 0;
                const weight = Math.round(parsedIngredient.weight) || 0;

                qtyCell.innerHTML = parsedIngredient.quantity || '-';
                unitCell.innerHTML = parsedIngredient.measure || '-';
                foodCell.innerHTML = parsedIngredient.food || ingredient.text;
                caloriesCell.innerHTML = `${calories} kcal`;
                fatCell.innerHTML = `${fat} g`;
                carbsCell.innerHTML = `${carbs} g`;
                proteinCell.innerHTML = `${protein} g`;
                weightCell.innerHTML = `${weight} g`;

                // Update totals
                totalCalories += calories;
                totalFat += fat;
                totalCarbs += carbs;
                totalProtein += protein;
                totalWeight += weight;
            });

            // Display totals
            document.getElementById('total-calories').innerHTML = `${totalCalories} kcal`;
            document.getElementById('total-fat').innerHTML = `${totalFat} g`;
            document.getElementById('total-carbs').innerHTML = `${totalCarbs} g`;
            document.getElementById('total-protein').innerHTML = `${totalProtein} g`;
            document.getElementById('total-weight').innerHTML = `${totalWeight} g`;
        } else {
            alert('Could not retrieve nutritional information. Please check the ingredients and try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while fetching nutritional information.');
    });
});

document.getElementById('save-recipe-button').addEventListener('click', function() {
    const ingredients = document.getElementById('ingredients').value;
    const tableRows = document.getElementById('results-body').innerHTML;
    const recipeName = document.getElementById('recipe-name').value;

    if (!recipeName) {
        alert('Please enter a recipe name.');
        return;
    }

    // Fetch existing recipes from local storage
    let savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // Create a recipe object
    let recipe = {
        name: recipeName,
        ingredients: ingredients,
        tableRows: tableRows
    };

    // Add new recipe to the savedRecipes array
    savedRecipes.push(recipe);

    // Save updated recipes array back to local storage
    localStorage.setItem('recipes', JSON.stringify(savedRecipes));

    alert('Recipe saved successfully!');
    document.getElementById('recipe-name').value = ''; // Clear the recipe name input
});
