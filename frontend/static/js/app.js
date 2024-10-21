// Initial transactions data
let transactions = [];

// Monthly data for the chart
let monthlyData = {
    labels: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('hu-HU', { month: 'short' })),
    datasets: [
        {
            label: 'Bevétel',
            data: Array(12).fill(0),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
            label: 'Kiadás',
            data: Array(12).fill(0),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }
    ]
};

// URL
const url = 'http://localhost:8000/transactions/';

// Fetch options
const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    },
    // Távolítsuk el a 'mode: "no-cors"' opciót, ha van ilyen
};

async function fetchTransactions() {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP hiba! státusz: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
            transactions = data;
            updateTransactionList();
            updateBalance();
            updateChart(); // Frissítsük a diagramot is
        } else {
            throw new Error('A válasz nem egy tömb');
        }
    } catch (error) {
        console.error('Hiba:', error);
        throw error;
    }
}

function updateMonthlyData() {
    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const month = date.getMonth();
        const amount = parseFloat(transaction.amount);

        if (transaction.type === 'income') {
            monthlyData.datasets[0].data[month] += amount;
        } else if (transaction.type === 'expense') {
            monthlyData.datasets[1].data[month] += amount;
        }
    });
}

// Frissítsük a diagramot
function updateChart() {
    updateMonthlyData();
    if (window.myChart instanceof Chart) {
        window.myChart.data = monthlyData;
        window.myChart.update();
    } else {
        initializeChart();
    }
}

// Function to update the balance
function updateBalance() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const balance = transactions.reduce((acc, transaction) => {
        const transactionDate = new Date(transaction.date);
        if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
            return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
        }
        return acc;
    }, 0);

    document.getElementById('balance').textContent = `${balance.toLocaleString('hu-HU')} Ft`;
}

// Function to add a new transaction
function addTransaction(type, amount, description) {
    const newTransaction = {
        amount: parseFloat(amount),
        type,
        description,
        date: new Date().toISOString().split('T')[0]
    }

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTransaction)
    }
    fetch(url, options)
        .then(response => response.json())
        .catch(error => console.error('Hiba a tranzakció hozzáadása során:', error));

    updateTransactionList();
    updateBalance();
}

// Function to update the transaction list
function updateTransactionList() {
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';
    transactions.reverse().slice(0, 5).forEach(transaction => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        // Formatting date
        const date = new Date(transaction.date);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        li.innerHTML = `
            <div>
                <span class="${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
                    ${transaction.type === 'income' ? '+' : '-'}
                </span>
                ${transaction.description}
            </div>
            <div>
                <span class="${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
                    ${transaction.amount.toLocaleString('hu-HU')} Ft
                </span>
                <small class="text-muted ms-2">${formattedDate}</small>
            </div>
        `;
        transactionList.appendChild(li);
    });
}

// Initialize the chart
function initializeChart() {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: monthlyData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value, index, values) {
                            return value.toLocaleString('hu-HU') + ' Ft';
                        }
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Havi bevételek és kiadások'
                }
            }
        }
    });
}

// Event listener for save transaction button
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('saveTransaction').addEventListener('click', function () {
        const type = document.querySelector('input[name="type"]:checked').value;
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        if (amount && description) {
            addTransaction(type, amount, description)
            document.getElementById('transactionForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('newTransactionModal')).hide();
            location.reload();
        }
    });

    // Fetch transactions
    fetchTransactions();

    // Initial update
    updateTransactionList();
    updateBalance();
    initializeChart();
});
