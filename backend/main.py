from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from typing import List
from datetime import datetime
import sqlite3

# Initialize FastAPI app
app = FastAPI()

# CORS beállítások
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database path
DATABASE_PATH = "./database/app.db"


# Transaction model
class Transaction(BaseModel):
    amount: float
    type: str
    description: str
    date: datetime


# Initialize database
def init_db():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL,
            type TEXT,
            description TEXT,
            date TEXT
        )
    """
    )
    conn.commit()
    conn.close()


def reset_db():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("DROP TABLE transactions")
    conn.commit()
    conn.close()
    init_db()


# Initialize database
init_db()


# Create transaction
@app.post("/transactions/")
async def create_transaction(transaction: Transaction):
    if transaction.type not in ["income", "expense"]:
        raise HTTPException(
            status_code=400, detail="Transaction type must be 'income' or 'expense'"
        )

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO transactions (amount, type, description, date)
        VALUES (?, ?, ?, ?)
    """,
        (
            transaction.amount,
            transaction.type,
            transaction.description,
            transaction.date.isoformat(),
        ),
    )
    conn.commit()
    conn.close()

    return {"message": "Transaction added successfully"}


# Get transactions
@app.get("/transactions/")
async def get_transactions():
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM transactions")
        rows = cursor.fetchall()
        conn.close()

        transactions = []
        for row in rows:
            transaction = {
                "id": row[0],
                "amount": row[1],
                "type": row[2],
                "description": row[3],
                "date": row[4],
            }
            transactions.append(transaction)

        return transactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Reset database
@app.post("/reset/")
async def reset_database():
    reset_db()
    return {"message": "Database reset successfully"}


# Run app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
