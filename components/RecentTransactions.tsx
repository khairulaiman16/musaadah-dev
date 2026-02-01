import Link from 'next/link'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'

const RecentTransactions = ({
  transactions = [],
  appwriteItemId,
  page = 1,
}: RecentTransactionsProps) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between mb-4">
        <h2 className="recent-transactions-label">Log Transaksi Terkini</h2>
        <Link
          href="/statistik-laporan"
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      <div className="space-y-4">
        {/* Directly show the table without the Bank Tabs logic */}
        <TransactionsTable transactions={currentTransactions} />

        {totalPages > 1 && (
          <div className="my-4 w-full">
            <Pagination totalPages={totalPages} page={page} />
          </div>
        )}
      </div>
    </section>
  )
}

export default RecentTransactions