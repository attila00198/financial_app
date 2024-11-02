<!DOCTYPE html>
<html lang="hu" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pénzügyi Nyilvántartó</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="./static/css/app.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
    <div class="container my-5">
        <h1 class="mb-4">Pénzügyi Kimutatás</h1>

        <!-- Balance -->
        <div class="row mb-4">
            <div class="col-md-4 mb-3">
                <div class="card" style="min-height: 225px;">
                    <div class="card-body">
                        <h5 class="card-title">Egyenleg</h5>
                        <p><?= date('Y-m-d') ?></p>
                        <h2 id="balance" class="card-text">0 Ft</h2>
                        <button class="btn btn-danger" id="resetDatabase" onclick="resetDatabase()">Reset Database</button>
                    </div>
                </div>
            </div>

            <!-- Transaction List -->
            <div class="col-md-8">
                <div class="card" style="min-height: 225px;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="card-title mb-0">Legutóbbi tranzakciók</h5>
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                                data-bs-target="#newTransactionModal">
                                Új tranzakció
                            </button>
                        </div>
                        <ul id="transactionList" class="list-group list-group-flush">
                            <!-- Transactions will be added here dynamically -->
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chart -->
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">Havi áttekintés</h5>
                <canvas id="monthlyChart"></canvas>
            </div>
        </div>

        <!-- Table -->
        <div class="d-flex justify-content-between mb-2">
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-primary" id="prev-month"><span> <- </span></button>
                <p class="m-0 p-2" id="current-month"></p>
                <button class="btn btn-primary" id="next-month"><span> -> </span></button>
            </div>
        </div>
        <div class="table-responsive mb-2">
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">Összeg</th>
                        <th scope="col">Leírás</th>
                        <th scope="col">Dátum</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                    <!-- Ide kerülnek az adatok -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- New Transaction Modal -->
    <div class="modal fade" id="newTransactionModal" tabindex="-1" aria-labelledby="newTransactionModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="newTransactionModalLabel">Új tranzakció hozzáadása</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="transactionForm">
                        <div class="mb-3">
                            <label class="form-label">Típus</label>
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="type" id="income" value="income"
                                        checked>
                                    <label class="form-check-label" for="income">Bevétel</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="type" id="expense"
                                        value="expense">
                                    <label class="form-check-label" for="expense">Kiadás</label>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 form-floating">
                            <input type="number" class="form-control" id="amount" placeholder="Összeg" required>
                            <label for="amount" class="form-label">Összeg</label>
                        </div>
                        <div class="mb-3 form-floating">
                            <input type="text" class="form-control" id="description" placeholder="Leírás" required>
                            <label for="description" class="form-label">Leírás</label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bezárás</button>
                    <button type="button" class="btn btn-primary" id="saveTransaction">Mentés</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script defer src="./static/js/app.js"></script>
</body>

</html>