import Link from "next/link";
import { ME } from "@/content";
import { ME_ES, UI_ES } from "@/content.es";
import { SHARED_CSS, NAV_SECTIONS } from "./_brutalist/shared";
import LangSwitch from "./_brutalist/LangSwitch";

/**
 * The 404, in the register of a wiki's "this article does not exist" page and
 * inside the same Monobook frame as the homepage: dark desk, grey page frame,
 * white article box, Times. Server component; Spanish rides on data-es like
 * everywhere else, LangSwitch boots the swap.
 */

const CSS = `
  .nf { padding: 28px 26px; min-height: 100vh; box-sizing: border-box; background: #232220; color: #000;
        font-family: "Times New Roman", Times, serif; font-size: var(--t-body); line-height: 1.6; }
  .nfWrap { max-width: 760px; margin: 0 auto; background: #e9ebef; border: 1px solid #7c828b;
        box-shadow: 0 8px 40px rgba(0,0,0,0.55); }
  .nfTop { text-align: center; font-size: var(--t-micro); color: #444; background: #f6f7f9;
        border-bottom: 1px solid #a7d7f9; padding: 9px 18px; letter-spacing: 0.02em; }
  .nfBox { margin: 14px 26px 44px; background: #fff; border: 1px solid #a7d7f9; padding: 26px 30px 30px; }
  .nfBox h1 { font-size: var(--t-head); margin: 0 0 14px; padding-bottom: 5px; border-bottom: 1px solid currentColor; }
  .nfBox p { margin: 0 0 14px; }
  .nfLabel { display: block; font-variant: small-caps; letter-spacing: 0.04em; font-size: var(--t-micro); color: #555; margin-top: 26px; }
  .nfIndex { list-style: none; padding: 0; margin: 4px 0 0; font-size: var(--t-small); }
  .nfIndex li { display: inline; }
  .nfIndex li + li::before { content: " · "; color: #555; }
  .nfLang { margin-top: 26px; font-size: var(--t-small); }
  @media (max-width: 620px) {
    .nf { padding: 12px 10px; }
    .nfBox { margin: 12px 12px 26px; padding: 18px 16px 22px; }
  }
`;

export default function NotFound() {
  return (
    <main className="brut nf">
      <style>{SHARED_CSS + CSS}</style>
      <div className="nfWrap">
        <div className="nfTop">
          <span data-es={ME_ES.role}>{ME.role}</span>
          {" · "}
          <span>{ME.location}</span>
        </div>
        <article className="nfBox">
          <h1 data-es={UI_ES.notFoundTitle}>This page does not exist</h1>
          <p data-es={UI_ES.notFoundBody}>
            There is no article at this address. It may have been moved, or the link may be wrong.
          </p>
          <p>
            <Link href="/" data-es={UI_ES.notFoundBack}>Return to the front page</Link>
          </p>
          <span className="nfLabel" data-es={UI_ES.footIndex}>Index</span>
          <ul className="nfIndex">
            {NAV_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`/#${s.id}`} data-es={s.labelEs}>{s.label}</a>
              </li>
            ))}
          </ul>
          <div className="nfLang">
            <LangSwitch variant="button" />
          </div>
        </article>
      </div>
    </main>
  );
}
