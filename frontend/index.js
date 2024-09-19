import { backend } from "declarations/backend";

document.addEventListener('DOMContentLoaded', async () => {
    const addForm = document.getElementById('addTaxPayerForm');
    const searchForm = document.getElementById('searchForm');
    const taxPayerList = document.getElementById('taxPayerList');
    const searchResult = document.getElementById('searchResult');

    // Add TaxPayer
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taxPayer = {
            tid: document.getElementById('tid').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value
        };
        await backend.addTaxPayer(taxPayer);
        addForm.reset();
        await updateTaxPayerList();
    });

    // Search TaxPayer
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tid = document.getElementById('searchTid').value;
        const result = await backend.searchTaxPayer(tid);
        if (result.length > 0) {
            const taxPayer = result[0];
            searchResult.innerHTML = `
                <h3>Search Result:</h3>
                <p>TID: ${taxPayer.tid}</p>
                <p>Name: ${taxPayer.firstName} ${taxPayer.lastName}</p>
                <p>Address: ${taxPayer.address}</p>
            `;
        } else {
            searchResult.innerHTML = '<p>No TaxPayer found with that TID.</p>';
        }
    });

    // Update TaxPayer list
    async function updateTaxPayerList() {
        const taxPayers = await backend.getAllTaxPayers();
        taxPayerList.innerHTML = taxPayers.map(tp => `
            <li>
                <strong>${tp.tid}</strong>: ${tp.firstName} ${tp.lastName}, ${tp.address}
            </li>
        `).join('');
    }

    // Initial load of TaxPayer list
    await updateTaxPayerList();
});
