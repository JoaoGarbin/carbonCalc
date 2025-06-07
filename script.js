//Utilizando o Banco de dados PouchDB ( Banco em Cache )
const db = new PouchDB('carbon_footprint');
//Função salvar os dados do formulario (FormData)
function saveData(formData) {
    return db.put({
        //id e salvo como data atual do envio do formulario
        _id: new Date().toISOString(),
        //Dados do Formulario
        formData: formData
    });
}

//Função de mostrar os dados Salvos do banco
function displaySavedData() {
    db.allDocs({ include_docs: true, descending: true })
        //Cria Elementos de tabela do Html com as informações do banco de dados com referencia do id que é uma data
        .then(function (result) {
            const savedDataDiv = document.getElementById('savedData');
            savedDataDiv.innerHTML = '<h2 class="text-xl font-semibold text-gray-800">Dados Salvos</h2>';
            const table = document.createElement('table');
            table.classList.add('mt-4', 'w-full', 'border', 'border-gray-200', 'divide-y', 'divide-gray-200');

            // Atribui os elementos a uma constante 
            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const header1 = document.createElement('th');
            header1.textContent = 'Data';
            const header2 = document.createElement('th');
            header2.textContent = 'Combustível (litros)';
            const header3 = document.createElement('th');
            header3.textContent = 'Tipo de Combustível';
            const header4 = document.createElement('th');
            header4.textContent = 'Distância Percorrida (km)';

            headerRow.appendChild(header1);
            headerRow.appendChild(header2);
            headerRow.appendChild(header3);
            headerRow.appendChild(header4);
            tableHeader.appendChild(headerRow);
            table.appendChild(tableHeader);

            const tableBody = document.createElement('tbody');
            //Cria a tabela aonde sera mostrada os dados do banco de dados
            result.rows.forEach(function (row) {
                const doc = row.doc;
                const dataRow = document.createElement('tr');
                const dateCell = document.createElement('td');
                dateCell.textContent = new Date(doc._id).toLocaleString();
                const formData = doc.formData;
                const fuelCell = document.createElement('td');
                fuelCell.textContent = formData.fuel;
                const fuelTypeCell = document.createElement('td');
                fuelTypeCell.textContent = formData.fuelType;
                const distanceCell = document.createElement('td');
                distanceCell.textContent = formData.distance;

                dataRow.appendChild(dateCell);
                dataRow.appendChild(fuelCell);
                dataRow.appendChild(fuelTypeCell);
                dataRow.appendChild(distanceCell);
                tableBody.appendChild(dataRow);
            });
            table.appendChild(tableBody);
            savedDataDiv.appendChild(table);
        }).catch(function (err) {
            console.log(err);
        });
}
// após o evento de submit do botão atribui os dados dos input na constante de array chamado formData com props fuel, fultype e distance
document.getElementById('carbonForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = {
        fuel: parseFloat(document.getElementById('fuel').value),
        fuelType: document.getElementById('fuelType').value,
        distance: parseFloat(document.getElementById('distance').value)
    };
    //Chama a função saveData para salvar os dados 
    saveData(formData).then(function () {
        displaySavedData();
    //Tratamento de erro se ocorrer algum
    }).catch(function (err) {
        console.log(err);
    });
});
//Após a presionar o botão de Salvar dados atribui os dados dos input na constante de array chamado formData com props fuel, fultype e distance
document.getElementById('saveDataBtn').addEventListener('click', function () {
    const formData = {
        fuel: parseFloat(document.getElementById('fuel').value),
        fuelType: document.getElementById('fuelType').value,
        distance: parseFloat(document.getElementById('distance').value)
    };
     //Chama a função saveData para salvar os dados 
    saveData(formData).then(function () {
        alert('Dados salvos com sucesso!');
    //Tratamento de erro se ocorrer algum
    }).catch(function (err) {
        console.log(err);
    });
});

//Recarrega os dados do banco para uma tabela após precionar o botão Carregar Tabela
document.getElementById('loadTableBtn').addEventListener('click', function () {
    displaySavedData();
});

