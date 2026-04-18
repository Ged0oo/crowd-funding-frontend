import { useMyProjects } from '../hooks/useMyProjects';
import { Link } from 'react-router-dom';

const UserProjectList = () => {
  const { data, isPending, isError } = useMyProjects();
  
  // DRF ListAPIView with pagination normally returns { results: [...] }
  const projects = data?.results || data || [];

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
        <p className="font-bold">Failed to load your projects.</p>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold font-headline">My Created Projects</h2>
        {projects.length > 0 && (
          <span className="text-sm font-bold text-secondary bg-surface-container-high px-3 py-1 rounded-full">
            {projects.length} Total
          </span>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 rounded-xl shadow-sm border border-outline-variant/10 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-20 h-20 bg-primary-container/20 rounded-full flex items-center justify-center mb-6">
             <span className="material-symbols-outlined text-primary text-4xl">rocket_launch</span>
          </div>
          <h3 className="text-xl font-bold font-headline mb-2 text-on-surface">No projects yet!</h3>
          <p className="text-secondary max-w-md mb-6">You haven't launched any crowdfunding campaigns. Be the change and start your first project today.</p>
          <button className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-md hover:shadow-lg transition-transform active:scale-95">
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {projects.map((project: any) => {
            const fundingPercent = project.funding_goal 
              ? Math.min(100, Math.round((Number(project.current_funding) / Number(project.funding_goal)) * 100))
              : 0;
            
            // Calculate remaining days
            const end = new Date(project.end_date);
            const now = new Date();
            const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24)));
            
            // Format picture url correctly
            const imgUrl = (project.featured_image || project.image || project.thumbnail)?.replace('/media/https%3A/', 'https://');

            return (
              <div key={project.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-outline-variant/10 flex flex-col">
                <div className="h-48 overflow-hidden relative shrink-0">
                  <img 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-surface-container" 
                    src={imgUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80'} 
                  />
                  <span className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {project.status || 'Active'}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4 flex-grow">
                    <h3 className="text-xl font-bold font-headline mb-1 line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-secondary line-clamp-2">{project.description}</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-lg font-bold text-on-surface">${Number(project.current_funding || 0).toLocaleString()}</span>
                        <span className="text-xs text-secondary ml-1">of ${Number(project.funding_goal || 0).toLocaleString()}</span>
                      </div>
                      <span className="text-xs font-bold text-secondary">{daysLeft} Days Left</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full" style={{ width: `${fundingPercent}%` }}></div>
                    </div>
                    <Link to={`/projects/${project.id || project.slug}`} className="block w-full text-center py-2.5 mt-2 bg-surface-container hover:bg-surface-container-high text-primary font-bold rounded-lg transition-colors text-sm">
                      Manage Project
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  );
};

export default UserProjectList;
