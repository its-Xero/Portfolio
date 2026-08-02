import { ArrowLeft, ExternalLink, Figma, Globe, HardDrive, Instagram } from "lucide-react";

function getLinkIcon(label: string, url: string) {
  const target = (label || url || "").toLowerCase();

  if (target.includes("figma")) return Figma;
  if (target.includes("instagram")) return Instagram;
  if (target.includes("drive") || target.includes("google drive")) return HardDrive;
  if (target.includes("behance")) return ExternalLink;
  if (target.includes("linkedin")) return ExternalLink;
  if (target.includes("github")) return ExternalLink;
  if (target.includes("mailto:") || target.includes("mailto")) return ExternalLink;

  return Globe;
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: any;
  onClose: () => void;
}) {
  if (!project) return null;

  const galleryImages = project.gallery_images || [];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
    >
      <div className="absolute inset-0 bg-[#0A0A0A]/95" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] border border-[#1F1F1F] bg-[#141414] text-[#F5F5F5] shadow-2xl">
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8 sm:py-10 md:px-12">
            <div className="mb-6">
              <button
                onClick={onClose}
                className="back-btn inline-flex items-center justify-center rounded-full border border-[#1F1F1F] bg-[#141414]/80 px-5 py-3 text-[13px] text-[#878787]"
              >
                <ArrowLeft size={14} />
                Back to work
              </button>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[#1F1F1F] bg-[#0F0F0F]">
              <img
                src={project.image}
                alt={project.alt || project.title}
                loading="lazy"
                decoding="async"
                className="h-64 w-full object-cover sm:h-80 md:h-[28rem]"
              />
            </div>

            {galleryImages.length > 0 ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {galleryImages.slice(0, 4).map((src: string, index: number) => (
                  <div key={`gallery-${index}`} className="overflow-hidden rounded-[20px] border border-[#1F1F1F] bg-[#141414]">
                    <img src={src} alt={`${project.title} gallery ${index + 1}`} loading="lazy" decoding="async" className="h-52 w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-8">
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

            {project.links && project.links.length > 0 ? (
              <div className="mt-8 rounded-[20px] border border-[#1F1F1F] bg-[#0F0F0F] p-4 sm:p-5">
                <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[#878787]">
                  Links
                </div>
                <div className="flex flex-wrap gap-3 pb-5" style={{ paddingBottom: "20px" }}>
                  {project.links.map((link: any, index: number) => {
                    const Icon = getLinkIcon(link.label || link.url || "", link.url || "");

                    return (
                      <a
                        key={`${link.label}-${index}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[#1F1F1F] px-4 py-2 text-[13px] text-[#F5F5F5] transition hover:border-[#4E85BF] hover:text-[#89AACC]"
                      >
                        <Icon size={14} />
                        <span>{link.label || link.url}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
