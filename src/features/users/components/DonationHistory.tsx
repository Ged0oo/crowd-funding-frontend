import { useMyDonations } from '../hooks/useMyDonations';

const DonationHistory = () => {
  const { data, isPending, isError } = useMyDonations();
  
  const donations = data?.results || data || [];

  if (isPending) {
    return (
      <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-sm border border-outline-variant/10 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-error-container/30 text-on-error-container p-6 rounded-xl border border-error/20 flex flex-col items-center justify-center min-h-[200px]">
        <span className="material-symbols-outlined text-4xl mb-2 text-error">error</span>
        <p className="font-bold">Failed to load donation history.</p>
      </div>
    );
  }

  return (
    <section className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-sm border border-outline-variant/10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-headline mb-1">My Donations</h2>
        <p className="text-secondary text-sm">A complete ledger of all your generous contributions.</p>
      </div>

      {donations.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
             <span className="material-symbols-outlined text-tertiary text-3xl">volunteer_activism</span>
          </div>
          <p className="font-bold text-on-surface mb-1">No donations found.</p>
          <p className="text-sm text-secondary">When you back a project, your contribution will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 text-secondary text-sm">
                <th className="py-4 font-bold">Project</th>
                <th className="py-4 font-bold">Date</th>
                <th className="py-4 font-bold">Amount</th>
                <th className="py-4 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation: any) => (
                <tr key={donation.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-on-surface text-sm line-clamp-1">
                      {donation.project_title || donation.project?.title || donation.project || 'Unknown Project'}
                    </div>                  </td>
                  <td className="py-4 text-sm text-secondary">
                    {new Date(donation.created_at || donation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 text-sm font-bold text-primary">
                    ${Number(donation.amount).toLocaleString()}
                  </td>
                  <td className="py-4 text-right">
                    <span className="px-2 py-1 bg-primary-container/20 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                      {donation.status || 'Completed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default DonationHistory;
