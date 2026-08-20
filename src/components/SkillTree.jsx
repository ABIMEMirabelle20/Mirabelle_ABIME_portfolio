import { useMemo, useState } from 'react';
import { skillBranches, levelLabel } from '../data/skills';
import useReveal from '../hooks/useReveal';
import { useLanguage } from '../i18n/LanguageContext';
import './SkillTree.css';

// ⚠️ Le titre/l'intro de section sont dans src/i18n/translations.js (clé
// "skillsSection"). Les branches/compétences (nom, niveau, description)
// sont dans src/data/skills.js.

export default function SkillTree() {
  const ref = useReveal();
  const { t, lang } = useLanguage();
  const [active, setActive] = useState(null);

  const allLeaves = useMemo(
    () => skillBranches.flatMap((b) => b.leaves.map((l) => ({ ...l, branch: b.name[lang], color: b.color }))),
    [lang]
  );

  const avgLevel = Math.round(
    allLeaves.reduce((sum, l) => sum + l.level, 0) / allLeaves.length
  );

  return (
    <section id="skills" className="section skills" ref={ref}>
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">{t.skillsSection.eyebrow}</p>
          <h2>{t.skillsSection.title}</h2>
          <p>{t.skillsSection.lead}</p>
        </div>

        <div className="skills__layout reveal reveal-delay-1">
          <div className="skills__tree-wrap">
            <svg
              className="skills__svg"
              viewBox="0 0 1000 820"
              role="img"
              aria-label={t.skillsSection.svgLabel}
            >
              <ellipse className="skills__soil" cx="500" cy="770" rx="220" ry="16" />

              <path
                className="skills__trunk"
                d="M500,800 C476,706 522,606 500,468 C492,438 508,404 500,372"
              />

              {skillBranches.map((branch) => (
                <g key={branch.id}>
                  <path
                    className="skills__branch"
                    style={{ '--branch-color': branch.color }}
                    d={`M${branch.trunkPoint.x},${branch.trunkPoint.y} Q${branch.control.x},${branch.control.y} ${branch.branchEnd.x},${branch.branchEnd.y}`}
                  />
                  {branch.leaves.map((leaf) => (
                    <path
                      key={`${leaf.id}-stem`}
                      className="skills__stem"
                      style={{ '--branch-color': branch.color }}
                      d={`M${branch.branchEnd.x},${branch.branchEnd.y} Q${(branch.branchEnd.x + leaf.pos.x) / 2},${(branch.branchEnd.y + leaf.pos.y) / 2 - 18} ${leaf.pos.x},${leaf.pos.y}`}
                    />
                  ))}
                </g>
              ))}

              {allLeaves.map((leaf) => {
                const r = 12 + (leaf.level / 100) * 15;
                const isActive = active?.id === leaf.id;
                const label = levelLabel(leaf.level, lang);
                return (
                  <g
                    key={leaf.id}
                    className={`skills__leaf ${isActive ? 'is-active' : ''}`}
                    style={{ '--branch-color': leaf.color }}
                    tabIndex={0}
                    role="button"
                    aria-label={t.skillsSection.leafAriaLabel(leaf.name, leaf.level, label)}
                    onMouseEnter={() => setActive(leaf)}
                    onFocus={() => setActive(leaf)}
                    onMouseLeave={() => setActive(null)}
                    onBlur={() => setActive(null)}
                  >
                    <circle cx={leaf.pos.x} cy={leaf.pos.y} r={r + 9} className="skills__leaf-halo" />
                    <circle cx={leaf.pos.x} cy={leaf.pos.y} r={r} className="skills__leaf-core" />
                    <text
                      x={leaf.pos.x}
                      y={leaf.pos.y + r + 18}
                      className="skills__leaf-label"
                      textAnchor="middle"
                    >
                      {leaf.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <aside className="skills__panel" aria-live="polite">
            {active ? (
              <>
                <p className="eyebrow">{active.branch}</p>
                <h3>{active.name}</h3>
                <div className="skills__bar">
                  <div className="skills__bar-fill" style={{ width: `${active.level}%`, background: active.color }} />
                </div>
                <div className="skills__meta">
                  <span>{levelLabel(active.level, lang)}</span>
                  <span>{active.level}%</span>
                </div>
                <p className="skills__desc">{active.desc[lang]}</p>
              </>
            ) : (
              <>
                <p className="eyebrow">{t.skillsSection.overview}</p>
                <h3>{t.skillsSection.avgLevel} : {avgLevel}%</h3>
                <p className="skills__desc">
                  {t.skillsSection.summary(allLeaves.length, skillBranches.length)} {t.skillsSection.hint}
                </p>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
