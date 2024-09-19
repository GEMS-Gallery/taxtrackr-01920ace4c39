import { backend } from "declarations/backend";

document.addEventListener('DOMContentLoaded', async () => {
    const addForm = document.getElementById('addTaxPayerForm');
    const searchForm = document.getElementById('searchForm');
    const taxPayerList = document.getElementById('taxPayerList');
    const searchResult = document.getElementById('searchResult');
    const updateFormContainer = document.getElementById('updateFormContainer');
    const updateForm = document.getElementById('updateTaxPayerForm');

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

    // Update TaxPayer
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taxPayer = {
            tid: document.getElementById('updateTid').value,
            firstName: document.getElementById('updateFirstName').value,
            lastName: document.getElementById('updateLastName').value,
            address: document.getElementById('updateAddress').value
        };
        const success = await backend.updateTaxPayer(taxPayer);
        if (success) {
            updateFormContainer.style.display = 'none';
            await updateTaxPayerList();
        } else {
            alert('Failed to update TaxPayer');
        }
    });

    // Delete TaxPayer
    async function deleteTaxPayer(tid) {
        const success = await backend.deleteTaxPayer(tid);
        if (success) {
            await updateTaxPayerList();
        } else {
            alert('Failed to delete TaxPayer');
        }
    }

    // Update TaxPayer list
    async function updateTaxPayerList() {
        const taxPayers = await backend.getAllTaxPayers();
        taxPayerList.innerHTML = taxPayers.map(tp => `
            <li>
                <strong>${tp.tid}</strong>: ${tp.firstName} ${tp.lastName}, ${tp.address}
                <button onclick="showUpdateForm('${tp.tid}', '${tp.firstName}', '${tp.lastName}', '${tp.address}')">Update</button>
                <button onclick="deleteTaxPayer('${tp.tid}')">Delete</button>
            </li>
        `).join('');
    }

    // Show update form
    window.showUpdateForm = (tid, firstName, lastName, address) => {
        document.getElementById('updateTid').value = tid;
        document.getElementById('updateFirstName').value = firstName;
        document.getElementById('updateLastName').value = lastName;
        document.getElementById('updateAddress').value = address;
        updateFormContainer.style.display = 'block';
    };

    // Expose deleteTaxPayer to window object
    window.deleteTaxPayer = deleteTaxPayer;

    // Initial load of TaxPayer list
    await updateTaxPayerList();
});
