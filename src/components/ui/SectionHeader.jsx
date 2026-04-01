import './SectionHeader.css';

/**
 * SectionHeader — Consistent section heading with label + title
 * 
 * HOW TO USE:
 *  <SectionHeader label="Case Studies" title="Recent Projects" />
 */
const SectionHeader = ({ label, title, align = 'left' }) => {
  return (
    <div className={`section-header section-header-${align}`}>
      {label && <span className="section-label label">{label}</span>}
      <h2 className="section-title display">{title}</h2>
    </div>
  );
};

export default SectionHeader;
