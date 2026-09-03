1. Create PROJECT.md.

Created!

2. Write one paragraph explaining what Spendly is and who it is for.

Spendly is a finance tracking app for individuals. It helps users track their income and expenses, and also view statistics.

3. List 8–15 things a user can do.

Track Income: Users can record all sources of income, whether it's salary, freelance work, or other earnings.

Track Expenses: Users can log all expenses, whether it's daily purchases, bills, or other costs.

View Transactions: Users can view a list of all transactions, with details such as amount, category, date, and description.

Edit Transactions: Users can edit any transaction to correct errors or update information.

Delete Transactions: Users can delete any transaction that is no longer needed.

View Statistics: Users can view statistics such as total income, total expenses, and balance for a specific time period.

LATER ON:

Filter Transactions: Users can filter transactions by category, date, or amount.

Search Transactions: Users can search for transactions by description or category.

Sort Transactions: Users can sort transactions by date, amount, or category.

Export Transactions: Users can export transactions to a CSV file.

Set Budgets: Users can set budgets for specific categories and track their progress.

View Budget Progress: Users can view their budget progress and see how much they have spent in each category.

View Spending Habits: Users can view their spending habits and see where their money is going.

View Spending Trends: Users can view their spending trends over time and see how their spending habits are changing.

View Spending Reports: Users can generate reports on their spending habits and see how they are progressing towards their financial goals.


4. List the pages/screens you think the app needs.

Dashboard Screen: A summary of the user's financial situation, including current balance, recent transactions, and budget progress.

Income Screen: A screen for adding and viewing income transactions.

Expense Screen: A screen for adding and viewing expense transactions.

Reports Screen: Charts and graphs showing spending patterns, income trends, and budget performance.

Profile Screen: User's name, email, password, etc.


5. Identify the data you need to store.

User Data

Transaction Data

6. Sketch the relationship between a User and Transaction.

User Entity:

user_id (primary key)

name

email

password_hash

created_at

updated_at



Transaction Entity:

transaction_id (primary key)

user_id (foreign key referencing User)

type (income or expense)

amount

category

date

description

created_at

updated_at


Relationship: A user can have many transactions, but each transaction belongs to only one user. This is a one-to-many relationship.


7. List the backend responsibilities in plain English.

The backend responsibilities include:

Handling user authentication

Handling user authorization

Handling user data

Handling transaction data


8. Write a rough build order.

1. Create Database
2. Create Backend API
3. Create Frontend
4. Testing
5. Deployment