import { ArrowLeft } from "lucide-react";

export function ProjectModal({
  project,
  onClose,
  relatedProjects = [],
}: {
  project: any;
  onClose: () => void;
  relatedProjects?: any[];
}) {
  if (!project) return null;

  const galleryItems = relatedProjects.filter((item) => item?.title !== project?.title).slice(0, 4);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
    >
      <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-2xl" onClick={onClose} />

      <div className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[32px] border border-[#1F1F1F] bg-[#141414] text-[#F5F5F5] shadow-2xl">
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-start bg-gradient-to-b from-[#141414] to-transparent p-4 sm:p-6">
          <button
            onClick={onClose}
            className="back-btn inline-flex items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]/80 px-5 py-3 text-[13px] text-[#878787] backdrop-blur-sm"
          >
            <ArrowLeft size={14} />
            Back to work
          </button>
        </div>

        <div className="max-h-[90vh] overflow-y-auto pt-20 pb-10 sm:pb-14">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-10">
            <div className="mb-8 overflow-hidden rounded-[24px] border border-[#1F1F1F] bg-[#0F0F0F]">
              <img
                src={project.image}
                alt={project.alt || project.title}
                className="h-64 w-full object-cover sm:h-80 md:h-[28rem]"
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[#878787]">
                  <span>{project.category || "Project"}</span>
                  {project.year ? <span>•</span> : null}
                  {project.year ? <span>{project.year}</span> : null}
                </div>

                <h2 className='mb-4 font-["Instrument Serif",serif] text-[32px] italic text-[#F5F5F5] sm:text-[42px] md:text-[48px]'>
                  {project.title}
                </h2>

                <p className="max-w-2xl leading-7 text-[15px] text-[#CFCFCF]">
                  {project.description || "A thoughtful piece of work blending strategy, storytelling, and visual execution."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-[20px] border border-[#1F1F1F] bg-[#0F0F0F] p-4 sm:p-5">
                  <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[#878787]">
                    Related work
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {galleryItems.length > 0 ? (
                      galleryItems.map((item, index) => (
                        <div
                          key={`${item.title}-${index}`}
                          className="overflow-hidden rounded-[16px] border border-[#1F1F1F] bg-[#141414]"
                        >
                          <img
                            src={item.image}
                            alt={item.alt || item.title}
                            className="aspect-square w-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 rounded-[16px] border border-dashed border-[#1F1F1F] p-4 text-sm text-[#878787]">
                        More project visuals will appear here as you add them.
                      </div>
                    )}
                  </div>
                </div>

                {project.links && project.links.length > 0 ? (
                  <div className="rounded-[20px] border border-[#1F1F1F] bg-[#0F0F0F] p-4 sm:p-5">
                    <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[#878787]">
                      Links
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {project.links.map((link: string) => (
                        <a
                          key={link}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-[#1F1F1F] px-4 py-2 text-[13px] text-[#F5F5F5] transition hover:border-[#4E85BF] hover:text-[#89AACC]"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
