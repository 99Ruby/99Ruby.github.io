document.addEventListener('DOMContentLoaded', function() {
    const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const savedRecipesList = document.getElementById('saved-recipes-list');

    if (savedRecipes.length > 0) {
        savedRecipes.forEach((recipe, index) => {
            let recipeContainer = document.createElement('div');
            recipeContainer.className = 'recipe-container';
            
            let title = document.createElement('h3');
            title.textContent = recipe.name || `Recipe ${index + 1}`;

            let deleteButton = document.createElement('button');
            deleteButton.textContent = '×';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', function() {
                deleteRecipe(index);
            });

            title.appendChild(deleteButton);
            recipeContainer.appendChild(title);

            let table = document.createElement('table');
            table.className = 'table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Qty</th>
                        <th>Unit</th>
                        <th>Food</th>
                        <th>Calories</th>
                        <th>Fat (g)</th>
                        <th>Carbohydrates (g)</th>
                        <th>Protein (g)</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    ${recipe.tableRows}
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="3">Total</th>
                        <th>${calculateTotal(recipe.tableRows, 'calories')} kcal</th>
                        <th>${calculateTotal(recipe.tableRows, 'fat')} g</th>
                        <th>${calculateTotal(recipe.tableRows, 'carbohydrates')} g</th>
                        <th>${calculateTotal(recipe.tableRows, 'protein')} g</th>
                        <th>${calculateTotal(recipe.tableRows, 'weight')} g</th>
                    </tr>
                </tfoot>
            `;
            recipeContainer.appendChild(table);

            savedRecipesList.appendChild(recipeContainer);
        });
    } else {
        savedRecipesList.innerHTML = '<p>No recipes saved yet.</p>';
    }
});

function calculateTotal(tableRows, nutrientType) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<table>${tableRows}</table>`, 'text/html');
    const rows = doc.querySelectorAll('tr');
    let total = 0;

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        if (cells.length > 0) {
            switch(nutrientType) {
                case 'calories':
                    total += parseFloat(cells[3]?.textContent || 0);
                    break;
                case 'fat':
                    total += parseFloat(cells[4]?.textContent || 0);
                    break;
                case 'carbohydrates':
                    total += parseFloat(cells[5]?.textContent || 0);
                    break;
                case 'protein':
                    total += parseFloat(cells[6]?.textContent || 0);
                    break;
                case 'weight':
                    total += parseFloat(cells[7]?.textContent || 0);
                    break;
            }
        }
    });

    return total.toFixed(2);
}

function deleteRecipe(index) {
    let savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    savedRecipes.splice(index, 1);  // Remove the recipe at the given index
    localStorage.setItem('recipes', JSON.stringify(savedRecipes));  // Save the updated list back to local storage

    // Refresh the page to reflect the changes
    window.location.reload();
}
